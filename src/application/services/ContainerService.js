/**
 * 🔧 APPLICATION LAYER - Container Service
 * خدمة إدارة الحاويات (يجمع الـ Usecases)
 */

const CreateContainerUsecase = require('../usecases/CreateContainerUsecase');
const SelectContainerUsecase = require('../usecases/SelectContainerUsecase');
const UpdateContainerUsecase = require('../usecases/UpdateContainerUsecase');
const DeleteContainerUsecase = require('../usecases/DeleteContainerUsecase');

class ContainerService {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;

    // Initialize usecases
    this.createUsecase = new CreateContainerUsecase(store, eventBus);
    this.selectUsecase = new SelectContainerUsecase(store, eventBus);
    this.updateUsecase = new UpdateContainerUsecase(store, eventBus);
    this.deleteUsecase = new DeleteContainerUsecase(store, eventBus);
  }

  /**
   * إنشاء حاوية جديدة
   */
  async create(name, icon, kind, parentId = null) {
    const id = `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return this.createUsecase.execute({ id, name, icon, kind, parentId });
  }

  /**
   * تحديد حاوية
   */
  async select(containerId) {
    return this.selectUsecase.execute(containerId);
  }

  /**
   * تحديث حاوية
   */
  async update(containerId, updates) {
    return this.updateUsecase.execute(containerId, updates);
  }

  /**
   * حذف حاوية
   */
  async delete(containerId) {
    return this.deleteUsecase.execute(containerId);
  }

  /**
   * جلب جميع الحاويات
   */
  async getAll() {
    return this.store.getAllContainers();
  }

  /**
   * جلب حاوية محددة
   */
  async get(containerId) {
    return this.store.getContainer(containerId);
  }

  /**
   * جلب الحاويات الجذرية (بدون والد)
   */
  async getRootContainers() {
    const all = await this.store.getAllContainers();
    return all.filter(c => !c.parent);
  }

  /**
   * جلب أطفال حاوية
   */
  async getChildren(parentId) {
    const parent = await this.store.getContainer(parentId);
    if (!parent) return [];
    const children = [];
    for (const childId of parent.children) {
      const child = await this.store.getContainer(childId);
      if (child) children.push(child);
    }
    return children;
  }
}

module.exports = ContainerService;