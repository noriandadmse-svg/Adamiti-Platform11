/**
 * 🧠 DOMAIN LAYER - Element Entity
 * العنصر الرقمي البسيط
 */

class Element {
  constructor(id, tag, html = '') {
    this.id = id;
    this.tag = tag; // div, span, button, etc
    this.html = html;
    this.isSelected = false;
    this.depth = 0;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.metadata = {};
  }

  // ✅ تحديث المحتوى
  updateHTML(newHTML) {
    if (typeof newHTML !== 'string') {
      throw new Error('HTML must be a string');
    }
    this.html = newHTML;
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
      tag: this.tag,
      html: this.html,
      isSelected: this.isSelected,
      depth: this.depth,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: { ...this.metadata }
    };
  }

  static fromJSON(data) {
    const element = new Element(data.id, data.tag, data.html);
    element.isSelected = data.isSelected;
    element.depth = data.depth;
    element.createdAt = data.createdAt;
    element.updatedAt = data.updatedAt;
    element.metadata = { ...data.metadata };
    return element;
  }
}
