const crypto = require('crypto');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const MAX_DEPTH = 5;
const MAX_CHILDREN_PER_PARENT = 50;
const TTL_DAYS = 7;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

const FORBIDDEN_PERMISSIONS = ['superuser', 'root_override', 'unlimited'];

// الخيار أ: مفتاح التوقيع من متغير بيئة محلي (صفر اتصالات خارجية)
const SIGNING_KEY = process.env.SIGNING_KEY;
if (!SIGNING_KEY) {
  console.error('FATAL: SIGNING_KEY not set in environment variables');
}

exports.branchQueueProcessor = functions.firestore
  .document('branches_queue/{tempId}')
  .onCreate(async (snap, context) => {
    const queueRef = snap.ref;
    const data = snap.data();

    try {
      await queueRef.update({ status: 'processing' });

      const req = data.request;

      // ── 1. جلب بيانات الأب ──
      let parentData = null;
      if (req.parentId) {
        const parentSnap = await admin.firestore().doc(`branches/${req.parentId}`).get();
        if (!parentSnap.exists) {
          throw new Error('PARENT_NOT_FOUND');
        }
        parentData = parentSnap.data();

        if (parentData.lifecycle !== 'active') {
          throw new Error('PARENT_NOT_ACTIVE');
        }
      }

      const parentPerms = parentData ? parentData.effectivePermissions.values : req.permissions;
      const depth = parentData ? parentData.depth + 1 : 0;

      // ── 2. فحص F-3: حد العرض ──
      if (req.parentId) {
        const siblingsCount = await admin.firestore()
          .collection('branches')
          .where('parentId', '==', req.parentId)
          .count()
          .get();
        if (siblingsCount.data().count >= MAX_CHILDREN_PER_PARENT) {
          throw new Error('MAX_CHILDREN_EXCEEDED');
        }
      }

      // ── 3. Validator ──
      const validation = validatePermissions({
        perms: req.permissions,
        parentPerms,
        branchType: req.visibility,
        members: req.members,
        depth,
        parentVisibility: parentData ? parentData.visibility : null,
      });

      if (!validation.passed) {
        throw new Error(`VALIDATION_FAILED: ${validation.errors.join(',')}`);
      }

      // ── 4. HMAC + nonce + timestamp ──
      const nonce = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const signaturePayload = JSON.stringify({
        permissions: req.permissions,
        nonce,
        timestamp,
      });

      const signature = crypto
        .createHmac('sha256', SIGNING_KEY)
        .update(signaturePayload)
        .digest('hex');

      // ── 5. بناء المسار والأسلاف ──
      const branchRef = admin.firestore().collection('branches').doc();
      const path = parentData ? `${parentData.path}/${branchRef.id}` : `/${branchRef.id}`;
      const ancestors = parentData ? [...parentData.ancestors, req.parentId] : [];
      const now = admin.firestore.Timestamp.now();

      // ── 6. تحضير membersIds للـ Rules (O(1) lookup) ──
      const membersIds = {};
      if (req.members && Array.isArray(req.members)) {
        for (const m of req.members) {
          if (m && m.uid) {
            membersIds[m.uid] = true;
          }
        }
      }

      // ── 7. كتابة الفرع ──
      await branchRef.set({
        id: branchRef.id,
        parentId: req.parentId || null,
        path,
        ancestors,
        depth,

        title: req.name || '',
        description: req.description || null,
        metadata: req.metadata || null,

        visibility: req.visibility,
        mode: req.mode || 'auto',

        members: req.members || null,
        memberPermissions: req.memberPermissions || null,
        membersIds,                    // ✅ مشتق للـ Rules — فحص O(1)

        effectivePermissions: {
          values: req.permissions,
          computedAt: now,
          expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + TTL_MS),
          signature,
          nonce,
          timestamp,
        },

        lifecycle: 'active',

        emergencyOverride: {
          active: false,
          activatedBy: null,
          activatedAt: null,
          expiresAt: null,
          reason: null,
          renewalCount: 0,
        },

        intersectionLog: [],

        creatorId: req.requestedBy,
        managerId: req.requestedBy,

        createdAt: now,
        updatedAt: now,
        archivedAt: null,
        deletedAt: null,
      });

      await queueRef.update({
        status: 'completed',
        processedAt: now,
        resultBranchId: branchRef.id,
      });

    } catch (err) {
      const retryCount = (data.retryCount || 0) + 1;
      if (retryCount >= 3) {
        await queueRef.update({
          status: 'dead',
          lastError: err.message,
          retryCount,
        });
      } else {
        await queueRef.update({
          status: 'pending',
          lastError: err.message,
          retryCount,
        });
      }
    }
  });

// ── تنظيف دوري ──
exports.cleanupDeadQueueItems = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const expired = await admin.firestore()
      .collection('branches_queue')
      .where('expiresAt', '<=', now)
      .where('status', 'in', ['pending', 'processing'])
      .get();

    const batch = admin.firestore().batch();
    expired.forEach((doc) => {
      batch.update(doc.ref, { status: 'dead', lastError: 'EXPIRED' });
    });
    await batch.commit();
    return null;
  });

// ── Validator ──
function validatePermissions({ perms, parentPerms, branchType, members, depth, parentVisibility }) {
  const errors = [];

  if (!perms || perms.length === 0) {
    errors.push('EMPTY_PERMISSIONS');
  }

  if (perms && new Set(perms).size !== perms.length) {
    errors.push('DUPLICATE_PERMISSIONS');
  }

  const excess = (perms || []).filter((p) => !parentPerms.includes(p));
  if (excess.length > 0) {
    errors.push(`EXCEEDS_PARENT:${excess.join('|')}`);
  }

  if (branchType === 'private_group' && (!members || members.length === 0)) {
    errors.push('PRIVATE_GROUP_WITHOUT_MEMBERS');
  }

  const forbidden = (perms || []).filter((p) => FORBIDDEN_PERMISSIONS.includes(p));
  if (forbidden.length > 0) {
    errors.push(`FORBIDDEN:${forbidden.join('|')}`);
  }

  if (depth > MAX_DEPTH) {
    errors.push('MAX_DEPTH_EXCEEDED');
  }

  const RESTRICTION_ORDER = { private: 0, private_group: 1, public: 2 };
  if (parentVisibility && RESTRICTION_ORDER[branchType] > RESTRICTION_ORDER[parentVisibility]) {
    errors.push(`CHILD_LESS_RESTRICTIVE_THAN_PARENT:${parentVisibility}->${branchType}`);
  }

  return { passed: errors.length === 0, errors };
}