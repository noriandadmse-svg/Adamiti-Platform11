#!/bin/bash
# ============================================================
#  Adamiti Platform11 — هيكل المجلدات الكامل
#  شغّل هذا السكريبت داخل مجلد المستودع المحلي
#  git clone https://github.com/YOUR/Adamiti-Platform11
#  cd Adamiti-Platform11
#  bash setup-structure.sh
# ============================================================

echo "🏗️  بدء إنشاء هيكل آدميتي Platform11..."

# دالة لإنشاء مجلد مع .gitkeep لحفظه في git
mk() {
  mkdir -p "$1"
  touch "$1/.gitkeep"
}

# ============================================================
#  core/
# ============================================================
mk core/reality/entities
mk core/reality/signals
mk core/reality/observers
mk core/reality/constraints
mk core/reality/states
mk core/virtual
mk core/impact
mk core/spacetime
mk core/source
mk core/memory
mk core/identity
mk core/semantics
mk core/truth
mk core/constitution/axioms
mk core/constitution/contracts
mk core/constitution/schemas
mk core/constitution/rules
mk core/constitution/invariants
mk core/constitution/verification
mk core/constitution/authority/execution

# ============================================================
#  runtime/
# ============================================================
mk runtime/reflection
mk runtime/execution
mk runtime/synchronization
mk runtime/growth
mk runtime/orchestration
mk runtime/scheduling
mk runtime/eventbus
mk runtime/genesis
mk runtime/emergence
mk runtime/kinetics
mk runtime/resource
mk runtime/safeguard
mk runtime/verification/health_checks
mk runtime/legal_checks/consent
mk runtime/legal_checks/compliance_checks

# ============================================================
#  governance/
# ============================================================
mk governance/legal/disclaimers
mk governance/legal/liabilities
mk governance/legal/policies
mk governance/legal/compliance
mk governance/trust/external
mk governance/trust/internal
mk governance/accountability/audit
mk governance/accountability/attribution
mk governance/accountability/traceability
mk governance/accountability/justification
mk governance/accountability/decision_log
mk governance/scope
mk governance/behavior
mk governance/safety
mk governance/ethics
mk governance/privacy
mk governance/usage
mk governance/escalation
mk governance/decision_flow
mk governance/contracts/for_core
mk governance/contracts/for_runtime
mk governance/contracts/for_platform
mk governance/contracts/for_bridge

# ============================================================
#  bridge/  ← V35.2 يعيش هنا مؤقتاً
# ============================================================
mk bridge/v11/legacy          # ← index(1).htm يُنقل هنا
mk bridge/v11/mappings
mk bridge/v11/normalization
mk bridge/v11/schema_alignment
mk bridge/v30/adapters
mk bridge/v30/translators
mk bridge/v30/compatibility
mk bridge/v30/migration
mk bridge/v30/fallback
mk bridge/transition/shadow_mode
mk bridge/transition/partial_cutover
mk bridge/transition/canary_cells
mk bridge/transition/rollback_points
mk bridge/transition/stabilization
mk bridge/synchronization/state_sync
mk bridge/synchronization/event_sync
mk bridge/synchronization/memory_sync
mk bridge/synchronization/identity_sync
mk bridge/trust/conflict_resolution
mk bridge/trust/consistency_checks

# ============================================================
#  worlds/
# ============================================================
mk worlds/root
mk worlds/templates
mk worlds/cells/cell/state
mk worlds/cells/cell/logic
mk worlds/cells/cell/governance_context/active_rules
mk worlds/cells/cell/governance_context/cached_decisions
mk worlds/sandboxes
mk worlds/laboratories
mk worlds/archives
mk worlds/registries
mk worlds/exchanges

# ============================================================
#  tools/
# ============================================================
mk tools/legacy
mk tools/observe
mk tools/transform
mk tools/compose
mk tools/inspect
mk tools/render
mk tools/synthesize
mk tools/simulate
mk tools/verify
mk tools/govern/apply
mk tools/govern/execute
mk tools/govern/enforce

# ============================================================
#  modules/
# ============================================================
mk modules/services
mk modules/devices
mk modules/scripts
mk modules/validators
mk modules/commands
mk modules/receipts
mk modules/policies

# ============================================================
#  platform/
# ============================================================
mk platform/gateway
mk platform/workspace
mk platform/api
mk platform/ui
mk platform/auth
mk platform/telemetry

# ============================================================
#  docs/
# ============================================================
mk docs/architecture
mk docs/constitution
mk docs/operations
mk docs/legal
mk docs/examples

# ============================================================
#  tests/
# ============================================================
mk tests/unit
mk tests/integration
mk tests/emergence
mk tests/semantics
mk tests/truth
mk tests/governance
mk tests/safety
mk tests/chaos
mk tests/regression

# ============================================================
#  ملفات الجذر
# ============================================================
[ -f LICENSE ]         || touch LICENSE
[ -f SECURITY.md ]     || touch SECURITY.md
[ -f CODE_OF_CONDUCT.md ] || touch CODE_OF_CONDUCT.md
[ -f CONTRIBUTING.md ] || touch CONTRIBUTING.md
[ -f CHANGELOG.md ]    || touch CHANGELOG.md
[ -f MANIFEST.md ]     || touch MANIFEST.md
[ -f ROADMAP.md ]      || touch ROADMAP.md

# ============================================================
#  firebase.json — يشير لـ bridge/v11/legacy مؤقتاً
#  سيتغير لاحقاً إلى platform/ui عند الاكتمال
# ============================================================
cat > firebase.json << 'FIREBASE'
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/.gitkeep",
      "setup-structure.sh"
    ],
    "rewrites": [
      {
        "source": "/app/**",
        "destination": "/bridge/v11/legacy/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
FIREBASE

echo ""
echo "✅ تم إنشاء الهيكل بنجاح!"
echo ""
echo "📋 الخطوات التالية:"
echo "   1. انسخ index(1).htm إلى bridge/v11/legacy/index.html"
echo "   2. ضع صفحة الإطلاق (index.html) في جذر المستودع"
echo "   3. git add ."
echo '   4. git commit -m "feat: initialize Platform11 structure + launch page"'
echo "   5. git push"
echo "   6. firebase deploy"
echo ""
echo "🌐 بعد النشر:"
echo "   yourdomain.web.app        ← صفحة الإطلاق"
echo "   yourdomain.web.app/app/   ← V35.2 شغّال"
