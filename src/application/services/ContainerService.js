/**
 * 🔧 APPLICATION LAYER - Container Service
 * خدمة إدارة الحاويات
 */

class ContainerService {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async create(name, icon, kind, parentId = null) {
    const id = `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const container = new Container(id, name, icon, kind);

    if (parentId) {
      const parent = await this.store.getContainer(parentId);
      if (!parent) throw new Error('Parent container not found');
      container.parent = parentId;
      parent.addChild(id);
      await this.store.saveContainer(parent);
    }

    await this.store.saveContainer(container);

    this.eventBus.emit('container:created', {
      id: container.id,
      name: container.name,
      parentId: parentId || null
    });

    return { success: true, container };
  }

  async select(containerId) {
    const container = await this.store.getContainer(containerId);
    if (!container) throw new Error(`Container "${containerId}" not found`);

    await this.store.setSelection({
      type: 'container',
      containerId: container.id,
      timestamp: Date.now()
    });

    this.eventBus.emit('selection:changed', {
      type: 'container',
      container: container.toJSON()
    });

    return { success: true, container };
  }

  async update(containerId, updates) {
    const container = await this.store.getContainer(containerId);
    if (!container) throw new Error(`Container "${containerId}" not found`);

    if (updates.name) container.name = updates.name;
    if (updates.state) container.setState(updates.state);
    if (updates.icon) container.icon = updates.icon;

    await this.store.saveContainer(container);

    this.eventBus.emit('container:updated', {
      id: container.id,
      updates: updates
    });

    return { success: true, container };
  }

  async delete(containerId) {
    const container = await this.store.getContainer(containerId);
    if (!container) throw new Error(`Container "${containerId}" not found`);

    for (const childId of container.children) {
      await this.delete(childId);
    }

    if (container.parent) {
      const parent = await this.store.getContainer(container.parent);
      if (parent) {
        parent.removeChild(containerId);
        await this.store.saveContainer(parent);
      }
    }

    for (const elementId of container.elements) {
      await this.store.deleteElement(elementId);
    }

    await this.store.deleteContainer(containerId);

    this.eventBus.emit('container:deleted', {
      id: containerId,
      name: container.name
    });

    return { success: true };
  }

  async getAll() {
    return this.store.getAllContainers();
  }

  async get(containerId) {
    return this.store.getContainer(containerId);
  }

  async getRootContainers() {
    const all = await this.store.getAllContainers();
    return all.filter(c => !c.parent);
  }

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
