/**
 * ⚙️ APPLICATION LAYER - Update Container Usecase
 * حالة استخدام: تحديث حاوية
 */

const ContainerRules = require('../../domain/rules/ContainerRules');

class UpdateContainerUsecase {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async execute(containerId, updates) {
    // ✅ جلب الحاوية
    const container = await this.store.getContainer(containerId);
    if (!container) {
      throw new Error(`Container "${containerId}" not found`);
    }

    // ✅ التحقق من التحديثات
    if (updates.name) {
      ContainerRules.validateName(updates.name);
      container.name = updates.name;
    }

    if (updates.state) {
      ContainerRules.canChangeState(container.state, updates.state);
      container.setState(updates.state);
    }

    if (updates.icon) {
      container.icon = updates.icon;
    }

    // ✅ حفظ
    await this.store.saveContainer(container);

    // ✅ إطلاق الحدث
    this.eventBus.emit('container:updated', {
      id: container.id,
      updates: updates
    });

    return { success: true, container };
  }
}

module.exports = UpdateContainerUsecase;