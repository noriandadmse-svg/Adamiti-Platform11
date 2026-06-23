/**
 * ⚙️ APPLICATION LAYER - Delete Container Usecase
 * حالة استخدام: حذف حاوية
 */

class DeleteContainerUsecase {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async execute(containerId) {
    // ✅ جلب الحاوية
    const container = await this.store.getContainer(containerId);
    if (!container) {
      throw new Error(`Container "${containerId}" not found`);
    }

    // ✅ حذف الأطفال بشكل متكرر
    for (const childId of container.children) {
      await this.execute(childId);
    }

    // ✅ إزالة الوالد
    if (container.parent) {
      const parent = await this.store.getContainer(container.parent);
      if (parent) {
        parent.removeChild(containerId);
        await this.store.saveContainer(parent);
      }
    }

    // ✅ حذف العناصر
    for (const elementId of container.elements) {
      await this.store.deleteElement(elementId);
    }

    // ✅ حذف الحاوية
    await this.store.deleteContainer(containerId);

    // ✅ إطلاق الحدث
    this.eventBus.emit('container:deleted', {
      id: containerId,
      name: container.name
    });

    return { success: true };
  }
}

module.exports = DeleteContainerUsecase;