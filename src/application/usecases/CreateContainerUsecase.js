/**
 * ⚙️ APPLICATION LAYER - Create Container Usecase
 * حالة استخدام: إنشاء حاوية
 */

const Container = require('../../domain/entities/Container');
const ContainerRules = require('../../domain/rules/ContainerRules');

class CreateContainerUsecase {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async execute(request) {
    // ✅ التحقق من الصحة
    ContainerRules.validateName(request.name);
    ContainerRules.validateKind(request.kind || 'default');

    // ✅ إنشاء الكائن
    const container = new Container(
      request.id,
      request.name,
      request.icon || '📦',
      request.kind || 'default'
    );

    // ✅ تعيين الوالد إن وجد
    if (request.parentId) {
      const parent = await this.store.getContainer(request.parentId);
      if (!parent) {
        throw new Error('Parent container not found');
      }

      ContainerRules.canAddChild(parent, container);
      container.parent = request.parentId;
      parent.addChild(container.id);
      await this.store.saveContainer(parent);
    }

    // ✅ حفظ في الـ Store
    await this.store.saveContainer(container);

    // ✅ إطلاق الحدث
    this.eventBus.emit('container:created', {
      id: container.id,
      name: container.name,
      parentId: request.parentId || null
    });

    return { success: true, container };
  }
}

module.exports = CreateContainerUsecase;