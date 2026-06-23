/**
 * 🧠 DOMAIN LAYER - Mirror Entity
 * المرآة - العرض الرقمي للحالة
 */

class Mirror {
  constructor(id = 'mirror-default') {
    this.id = id;
    this.isActive = false;
    this.selectedElement = null;
    this.displayContent = '';
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.metadata = {};
  }

  // ✅ تفعيل/تعطيل
  activate() {
    this.isActive = true;
    this.updatedAt = Date.now();
  }

  deactivate() {
    this.isActive = false;
    this.selectedElement = null;
    this.updatedAt = Date.now();
  }

  // ✅ تحديث المحتوى
  setDisplayContent(content) {
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }
    this.displayContent = content;
    this.updatedAt = Date.now();
  }

  // ✅ تحديد عنصر
  selectElement(elementId) {
    this.selectedElement = elementId;
    this.updatedAt = Date.now();
  }

  deselectElement() {
    this.selectedElement = null;
    this.updatedAt = Date.now();
  }

  // ✅ الخصائص
  setMetadata(key, value) {
    this.metadata[key] = value;
    this.updatedAt = Date.now();
  }

  getMetadata(key) {
    return this.metadata[key];
  }

  // ✅ التحويل إلى JSON
  toJSON() {
    return {
      id: this.id,
      isActive: this.isActive,
      selectedElement: this.selectedElement,
      displayContent: this.displayContent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: { ...this.metadata }
    };
  }

  static fromJSON(data) {
    const mirror = new Mirror(data.id);
    mirror.isActive = data.isActive;
    mirror.selectedElement = data.selectedElement;
    mirror.displayContent = data.displayContent;
    mirror.createdAt = data.createdAt;
    mirror.updatedAt = data.updatedAt;
    mirror.metadata = { ...data.metadata };
    return mirror;
  }
}
