/**
 * 💉 ORCHESTRATION LAYER - Dependency Injection
 * حقن التبعيات
 */

class DependencyInjection {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * تسجيل خدمة
   */
  register(name, factory) {
    this.services.set(name, { factory, type: 'transient' });
    return this;
  }

  /**
   * تسجيل singleton
   */
  singleton(name, factory) {
    this.services.set(name, { factory, type: 'singleton' });
    return this;
  }

  /**
   * الحصول على خدمة
   */
  resolve(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service "${name}" not registered`);
    }

    const { factory, type } = this.services.get(name);

    if (type === 'singleton') {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, factory());
      }
      return this.singletons.get(name);
    }

    return factory();
  }

  /**
   * مسح جميع الخدمات
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

module.exports = DependencyInjection;