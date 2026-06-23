/**
 * 🎨 PRESENTATION LAYER - Mirror Component
 * مكون المرآة (الواجهة)
 */

class MirrorComponent {
  constructor(container, selectionService, eventBus) {
    this.container = container;
    this.selectionService = selectionService;
    this.eventBus = eventBus;
    this.iframeElement = null;
    this.contentDocument = null;

    this.init();
  }

  init() {
    // الاستماع للأحداث
    this.eventBus.on('selection:changed', (data) => this.onSelectionChanged(data));
    this.eventBus.on('container:updated', (data) => this.onContainerUpdated(data));
  }

  /**
   * إنشاء iframe
   */
  createIframe() {
    this.iframeElement = document.createElement('iframe');
    this.iframeElement.id = 'mirror';
    this.iframeElement.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #0d0d1a;
    `;
    this.container.appendChild(this.iframeElement);

    return this.iframeElement;
  }

  /**
   * تحديث محتوى المرآة
   */
  render(html) {
    if (!this.iframeElement) {
      this.createIframe();
    }

    this.iframeElement.srcdoc = html;

    // الانتظار لتحميل الـ iframe
    setTimeout(() => {
      this.contentDocument = this.iframeElement.contentDocument || this.iframeElement.contentWindow.document;
      this.bindEvents();
    }, 150);
  }

  /**
   * ربط الأحداث داخل الـ iframe
   */
  bindEvents() {
    if (!this.contentDocument) return;

    this.contentDocument.addEventListener('click', (e) => {
      const containerId = e.target.closest('[data-container-id]')?.dataset.containerId;
      if (containerId) {
        this.eventBus.emit('mirror:containerClicked', { containerId });
      }

      const elementId = e.target.closest('[data-element-id]')?.dataset.elementId;
      if (elementId) {
        this.eventBus.emit('mirror:elementClicked', { elementId });
      }
    });
  }

  /**
   * معالجات الأحداث
   */
  onSelectionChanged(data) {
    // تحديث الـ UI بناءً على التحديد الجديد
  }

  onContainerUpdated(data) {
    // تحديث المرآة عند تحديث الحاوية
  }
}

module.exports = MirrorComponent;