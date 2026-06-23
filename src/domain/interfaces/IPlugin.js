/**
 * 📝 DOMAIN LAYER - Plugin Interface (Contract)
 * عقد الإضافات
 */

class IPlugin {
  constructor(name, version = '1.0.0') {
    this.name = name;
    this.version = version;
    this.isEnabled = false;
  }

  /**
   * تهيئة الإضافة
   * @param {Object} context - السياق (store, eventBus, etc)
   */
  async init(context) {
    throw new Error('Plugin.init() not implemented');
  }

  /**
   * تفعيل الإضافة
   */
  async enable() {
    throw new Error('Plugin.enable() not implemented');
  }

  /**
   * تعطيل الإضافة
   */
  async disable() {
    throw new Error('Plugin.disable() not implemented');
  }

  /**
   * التنظيف
   */
  async cleanup() {
    throw new Error('Plugin.cleanup() not implemented');
  }

  /**
   * الحصول على الميزات
   */
  getFeatures() {
    throw new Error('Plugin.getFeatures() not implemented');
  }
}

module.exports = IPlugin;