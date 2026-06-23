/**
 * 🔌 INFRASTRUCTURE LAYER - Plugin Registry
 * نظام تسجيل الإضافات
 */

const IPlugin = require('../../domain/interfaces/IPlugin');

class PluginRegistry {
  constructor() {
    this.plugins = new Map();
    this.context = null;
  }

  /**
   * تسجيل إضافة
   */
  register(plugin) {
    if (!(plugin instanceof IPlugin)) {
      throw new Error('Plugin must extend IPlugin');
    }

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }

    this.plugins.set(plugin.name, plugin);
    return this;
  }

  /**
   * إلغاء تسجيل إضافة
   */
  unregister(name) {
    return this.plugins.delete(name);
  }

  /**
   * الحصول على إضافة
   */
  get(name) {
    return this.plugins.get(name);
  }

  /**
   * الحصول على جميع الإضافات
   */
  getAll() {
    return Array.from(this.plugins.values());
  }

  /**
   * تهيئة جميع الإضافات
   */
  async initializeAll(context) {
    this.context = context;

    for (const plugin of this.plugins.values()) {
      try {
        await plugin.init(context);
      } catch (error) {
        console.error(`Failed to initialize plugin "${plugin.name}":`, error);
      }
    }
  }

  /**
   * تفعيل جميع الإضافات
   */
  async enableAll() {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.enable();
        plugin.isEnabled = true;
      } catch (error) {
        console.error(`Failed to enable plugin "${plugin.name}":`, error);
      }
    }
  }

  /**
   * تعطيل جميع الإضافات
   */
  async disableAll() {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.disable();
        plugin.isEnabled = false;
      } catch (error) {
        console.error(`Failed to disable plugin "${plugin.name}":`, error);
      }
    }
  }

  /**
   * تنظيف جميع الإضافات
   */
  async cleanupAll() {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.cleanup();
      } catch (error) {
        console.error(`Failed to cleanup plugin "${plugin.name}":`, error);
      }
    }
  }

  /**
   * الحصول على جميع الميزات
   */
  getAllFeatures() {
    const features = {};
    for (const plugin of this.plugins.values()) {
      const pluginFeatures = plugin.getFeatures();
      features[plugin.name] = pluginFeatures;
    }
    return features;
  }
}

module.exports = PluginRegistry;