/**
 * ⚙️ APPLICATION LAYER - Select Container Usecase
 * حالة استخدام: تحديد حاوية
 */

class SelectContainerUsecase {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async execute(containerId) {
    // ✅ التحقق من الوجود
    const container = await this.store.getContainer(containerId);
    if (!container) {
      throw new Error(`Container "${containerId}" not found`);
    }

    // ✅ تحديث الـ Selection
    await this.store.setSelection({
      type: 'container',
      containerId: container.id,
      timestamp: Date.now()
    });

    // ✅ إطلاق الحدث
    this.eventBus.emit('selection:changed', {
      type: 'container',
      container: container.toJSON()
    });

    return { success: true, container };
  }
}

module.exports = SelectContainerUsecase;