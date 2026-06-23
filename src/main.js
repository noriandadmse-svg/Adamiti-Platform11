/**
 * 🎯 MAIN ENTRY POINT
 * نقطة الدخول الرئيسية
 */

const Bootstrap = require('./orchestration/Bootstrap');

/**
 * نقطة البداية
 */
async function main() {
  try {
    // إنشاء وإطلاق التطبيق
    const app = new Bootstrap();
    await app.boot();

    // تصدير للنوافذ العام للتصحيح
    window.adamiti = {
      app,
      store: app.getStore(),
      eventBus: app.getEventBus(),
      services: app.getServices(),
      components: app.getComponents()
    };

    console.log('🎉 آدميتي جاهزة!');
    console.log('💡 استخدم window.adamiti للوصول للخدمات والمكونات');
  } catch (error) {
    console.error('❌ فشل في بدء التطبيق:', error);
  }
}

// تشغيل عند تحميل الـ DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

module.exports = main;