// ============================================================
//  core/identity/index.js
//  تعريف هيكل هوية المستخدم — المصدر الوحيد للحقيقة
//  لا ينفّذ شيئاً — فقط يعرّف ويتحقق
// ============================================================

/**
 * الشكل الكامل لهوية المستخدم في Firestore
 * المسار: users/{uid}
 *
 * ids/        ← من هو
 * lineage/    ← من أين جاء
 * ownership/  ← ما يملكه
 * permissions/← ما يُسمح له
 */
export const IdentitySchema = {

  // ── ids/ ── من هو المستخدم
  uid:       null,   // string  — المعرف الفريد من Firebase Auth
  name:      null,   // string  — الاسم الكامل
  email:     null,   // string  — البريد الإلكتروني
  photo:     null,   // string  — رابط الصورة

  // ── lineage/ ── من أين جاء
  provider:  null,   // string  — "google" | "github" | ...

  // ── ownership/ ── ما يملكه
  cells:     [],     // array   — قائمة IDs للخلايا التي يملكها

  // ── permissions/ ── ما يُسمح له
  role:      null,   // string  — "mufeed" | "mustafeed"

  // ── توقيت ──
  createdAt: null,   // timestamp — تاريخ الانضمام
  updatedAt: null,   // timestamp — آخر تحديث
};

// ============================================================
//  بناء هوية جديدة من بيانات Firebase Auth
//  يُستدعى عند أول تسجيل دخول
// ============================================================
export function buildIdentity(firebaseUser, role) {
  return {
    // ids/
    uid:       firebaseUser.uid,
    name:      firebaseUser.displayName || '',
    email:     firebaseUser.email       || '',
    photo:     firebaseUser.photoURL    || '',

    // lineage/
    provider:  firebaseUser.providerData?.[0]?.providerId || 'google',

    // ownership/
    cells:     [],

    // permissions/
    role:      role || 'mustafeed',

    // توقيت
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================
//  التحقق من صحة الهوية قبل الحفظ
// ============================================================
export function validateIdentity(identity) {
  const errors = [];

  if (!identity.uid)   errors.push('uid مطلوب');
  if (!identity.name)  errors.push('name مطلوب');
  if (!identity.email) errors.push('email مطلوب');
  if (!['mufeed', 'mustafeed'].includes(identity.role)) {
    errors.push('role يجب أن يكون mufeed أو mustafeed');
  }

  return {
    valid:  errors.length === 0,
    errors,
  };
}

// ============================================================
//  الأدوار المتاحة — مرجع ثابت
//  أضف أدواراً جديدة هنا مستقبلاً
// ============================================================
export const Roles = {
  MUFEED:    'mufeed',
  MUSTAFEED: 'mustafeed',
  // ADMIN:  'admin',    ← مستقبلاً
  // PARTNER:'partner',  ← مستقبلاً
};

// ============================================================
//  أسماء الأدوار بالعربية — للعرض في الواجهة
// ============================================================
export const RoleLabels = {
  mufeed:    'مفيد',
  mustafeed: 'مستفيد',
};
