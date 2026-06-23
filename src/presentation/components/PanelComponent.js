/**
 * 🎨 PRESENTATION LAYER - Panel Component
 * مكون اللوحة الجانبية
 */

class PanelComponent {
  constructor(container, containerService, eventBus) {
    this.container = container;
    this.containerService = containerService;
    this.eventBus = eventBus;
    this.panelElement = null;

    this.init();
  }

  init() {
    this.panelElement = document.createElement('div');
    this.panelElement.id = 'panel';
    this.panelElement.style.cssText = `
      width: 380px;
      background: #050508;
      border-right: 1px solid #2a2a3a;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    this.container.appendChild(this.panelElement);

    // الاستماع للأحداث
    this.eventBus.on('container:created', () => this.render());
    this.eventBus.on('container:deleted', () => this.render());
    this.eventBus.on('container:updated', () => this.render());
  }

  /**
   * رسم اللوحة
   */
  async render() {
    this.panelElement.innerHTML = '';
    const containers = await this.containerService.getRootContainers();

    containers.forEach(container => {
      const div = this.createContainerElement(container);
      this.panelElement.appendChild(div);
    });
  }

  /**
   * إنشاء عنصر حاوية
   */
  createContainerElement(container) {
    const div = document.createElement('div');
    div.className = 'container-panel-item';
    div.style.cssText = `
      background: #1a1a30;
      border: 1px solid #2a2a3a;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
    `;

    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <span>${container.icon}</span>
        <strong>${container.name}</strong>
      </div>
    `;

    div.addEventListener('click', async () => {
      await this.containerService.select(container.id);
    });

    return div;
  }
}

module.exports = PanelComponent;