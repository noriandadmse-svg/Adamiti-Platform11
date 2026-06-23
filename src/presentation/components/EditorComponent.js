/**
 * 🎨 PRESENTATION LAYER - Editor Component
 * مكون المحرر
 */

class EditorComponent {
  constructor(container, eventBus) {
    this.container = container;
    this.eventBus = eventBus;
    this.editorElement = null;

    this.init();
  }

  init() {
    this.editorElement = document.createElement('textarea');
    this.editorElement.id = 'editor';
    this.editorElement.style.cssText = `
      width: 100%;
      height: 100px;
      background: #0d0d1a;
      color: #a9b7c6;
      border: 1px solid #2a2a3a;
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 11px;
      resize: vertical;
    `;
    this.editorElement.placeholder = '// اكتب هنا...';

    this.container.appendChild(this.editorElement);

    // الاستماع للتغييرات
    this.editorElement.addEventListener('change', () => {
      this.eventBus.emit('editor:changed', { content: this.editorElement.value });
    });
  }

  /**
   * تعيين المحتوى
   */
  setContent(content) {
    this.editorElement.value = content;
  }

  /**
   * الحصول على المحتوى
   */
  getContent() {
    return this.editorElement.value;
  }

  /**
   * مسح المحتوى
   */
  clear() {
    this.editorElement.value = '';
  }
}

module.exports = EditorComponent;