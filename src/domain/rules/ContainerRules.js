/**
 * 📋 DOMAIN LAYER - Container Business Rules
 * قوانين الأعمال للحاويات
 */

class ContainerRules {
  // ✅ التحقق من صحة الاسم
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Container name must be a non-empty string');
    }
    if (name.length > 255) {
      throw new Error('Container name is too long (max 255 characters)');
    }
    return true;
  }

  // ✅ التحقق من صحة الـ ID
  static validateId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Container ID must be a non-empty string');
    }
    return true;
  }

  // ✅ التحقق من صحة النوع
  static validateKind(kind) {
    const validKinds = ['objects', 'reactor', 'data', 'default'];
    if (!validKinds.includes(kind)) {
      throw new Error(`Invalid kind. Must be one of: ${validKinds.join(', ')}`);
    }
    return true;
  }

  // ✅ يمكن إضافة طفل؟
  static canAddChild(parent, child) {
    if (parent.children.includes(child.id)) {
      throw new Error('Child already exists in this container');
    }
    if (child.id === parent.id) {
      throw new Error('Cannot add container to itself');
    }
    if (child.parent === parent.id) {
      throw new Error('Child already has this parent');
    }
    return true;
  }

  // ✅ يمكن حذف الطفل؟
  static canRemoveChild(parent, childId) {
    if (!parent.children.includes(childId)) {
      throw new Error('Child does not exist in this container');
    }
    return true;
  }

  // ✅ يمكن إضافة عنصر؟
  static canAddElement(container, elementId) {
    if (container.elements.includes(elementId)) {
      throw new Error('Element already exists in this container');
    }
    return true;
  }

  // ✅ يمكن إضافة أداة؟
  static canAddTool(container, tool) {
    if (!tool.name || typeof tool.name !== 'string') {
      throw new Error('Tool must have a valid name');
    }
    const exists = container.tools.some(t => t.name === tool.name);
    if (exists) {
      throw new Error(`Tool "${tool.name}" already exists`);
    }
    return true;
  }

  // ✅ يمكن الاتصال؟
  static canConnect(container1, container2) {
    if (container1.id === container2.id) {
      throw new Error('Cannot connect container to itself');
    }
    return true;
  }

  // ✅ يمكن تغيير الحالة؟
  static canChangeState(currentState, newState) {
    const validTransitions = {
      idle: ['active', 'working', 'destroyed'],
      active: ['working', 'ready', 'idle', 'destroyed'],
      working: ['ready', 'active', 'idle', 'destroyed'],
      ready: ['active', 'idle', 'destroyed'],
      destroyed: [] // لا يمكن الخروج من destroyed
    };

    const allowed = validTransitions[currentState] || [];
    if (!allowed.includes(newState)) {
      throw new Error(
        `Cannot transition from "${currentState}" to "${newState}"`
      );
    }
    return true;
  }

  // ✅ حساب العمق (للتداخل)
  static calculateDepth(container, allContainers) {
    let depth = 0;
    let current = container;

    while (current.parent) {
      const parent = allContainers.get(current.parent);
      if (!parent) break;
      depth++;
      current = parent;
    }

    return depth;
  }

  // ✅ اكتشاف الدورات (Cycle Detection)
  static hasCycle(container, targetParentId, allContainers) {
    if (container.id === targetParentId) {
      return true; // محاولة جعل الحاوية والدها لنفسها
    }

    let current = allContainers.get(targetParentId);
    while (current && current.parent) {
      if (current.parent === container.id) {
        return true; // وجدنا دورة
      }
      current = allContainers.get(current.parent);
    }

    return false;
  }
}

module.exports = ContainerRules;