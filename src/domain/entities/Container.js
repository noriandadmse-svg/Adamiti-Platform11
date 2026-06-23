/**
 * 🧬 DOMAIN LAYER - Container Entity
 * النواة الخالصة - بدون أي تبعيات خارجية
 */

class Container {
  constructor(id, name, icon, kind = 'default') {
    // الهوية
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.kind = kind; // 'objects' | 'reactor' | 'data'

    // الحالة
    this.state = 'idle'; // 'idle' | 'active' | 'working' | 'ready' | 'destroyed'
    this.isSelected = false;

    // الهيكل
    this.parent = null;
    this.children = [];
    this.elements = [];
    this.tools = [];

    // الاتصالات
    this.inlet = null;
    this.outlet = null;

    // التتبع الزمني
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.metadata = {};
  }

  // ✅ الحالة المسموحة
  isInValidState() {
    return ['idle', 'active', 'working', 'ready', 'destroyed'].includes(this.state);
  }

  // ✅ تغيير الحالة
  setState(newState) {
    if (!['idle', 'active', 'working', 'ready', 'destroyed'].includes(newState)) {
      throw new Error(`Invalid state: ${newState}`);
    }
    this.state = newState;
    this.updatedAt = Date.now();
  }

  // ✅ إدارة الأطفال
  addChild(childId) {
    if (!this.children.includes(childId)) {
      this.children.push(childId);
      this.updatedAt = Date.now();
    }
  }

  removeChild(childId) {
    this.children = this.children.filter(c => c !== childId);
    this.updatedAt = Date.now();
  }

  hasChild(childId) {
    return this.children.includes(childId);
  }

  // ✅ إدارة العناصر
  addElement(elementId) {
    if (!this.elements.includes(elementId)) {
      this.elements.push(elementId);
      this.updatedAt = Date.now();
    }
  }

  removeElement(elementId) {
    this.elements = this.elements.filter(e => e !== elementId);
    this.updatedAt = Date.now();
  }

  hasElement(elementId) {
    return this.elements.includes(elementId);
  }

  // ✅ إدارة الأدوات
  addTool(tool) {
    if (!tool.name) throw new Error('Tool must have a name');
    this.tools.push({ name: tool.name, state: 'idle', ...tool });
    this.updatedAt = Date.now();
  }

  removeTool(toolName) {
    this.tools = this.tools.filter(t => t.name !== toolName);
    this.updatedAt = Date.now();
  }

  // ✅ الاتصالات
  connect(inlet, outlet) {
    this.inlet = inlet;
    this.outlet = outlet;
    this.updatedAt = Date.now();
  }

  // ✅ الخصائص العامة
  setMetadata(key, value) {
    this.metadata[key] = value;
    this.updatedAt = Date.now();
  }

  getMetadata(key) {
    return this.metadata[key];
  }

  // ✅ النسخ الآمن
  clone(newId, newName) {
    const cloned = new Container(newId, newName || this.name, this.icon, this.kind);
    cloned.elements = [...this.elements];
    cloned.tools = this.tools.map(t => ({ ...t }));
    cloned.inlet = this.inlet;
    cloned.outlet = this.outlet;
    return cloned;
  }

  // ✅ التحويل إلى JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      kind: this.kind,
      state: this.state,
      isSelected: this.isSelected,
      parent: this.parent,
      children: [...this.children],
      elements: [...this.elements],
      tools: this.tools.map(t => ({ ...t })),
      inlet: this.inlet,
      outlet: this.outlet,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: { ...this.metadata }
    };
  }

  // ✅ استعادة من JSON
  static fromJSON(data) {
    const container = new Container(data.id, data.name, data.icon, data.kind);
    container.state = data.state;
    container.isSelected = data.isSelected;
    container.parent = data.parent;
    container.children = [...data.children];
    container.elements = [...data.elements];
    container.tools = data.tools.map(t => ({ ...t }));
    container.inlet = data.inlet;
    container.outlet = data.outlet;
    container.createdAt = data.createdAt;
    container.updatedAt = data.updatedAt;
    container.metadata = { ...data.metadata };
    return container;
  }
}

module.exports = Container;