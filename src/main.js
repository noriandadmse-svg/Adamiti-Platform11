/**
 * 🚀 Adamiti Platform V36.0 - Clean Architecture
 * نقطة الدخول الرئيسية
 */

class AdamitiApp {
  constructor() {
    this.store = null;
    this.eventBus = null;
    this.containerService = null;
    this.historyService = null;
    this.ui = {};
    this.historyLog = [];
  }

  async boot() {
    console.log('🚀 بدء تحميل Adamiti Platform V36.0...');

    try {
      // تهيئة البنية التحتية
      this.store = new Store();
      this.eventBus = new EventBus();

      // تهيئة الخدمات
      this.containerService = new ContainerService(this.store, this.eventBus);
      this.historyService = new HistoryService(this.store, this.eventBus);

      // تهيئة الواجهة
      this.initializeUI();

      // ربط الأحداث
      this.bindEvents();

      // إنشاء حاويات افتراضية
      await this.createDefaultContainers();

      console.log('✅ تم التحميل بنجاح!');
      console.log('💡 استخدم window.adamiti للوصول للخدمات');

      return this;
    } catch (error) {
      console.error('❌ خطأ في التحميل:', error);
      throw error;
    }
  }

  initializeUI() {
    this.ui = {
      mirror: document.getElementById('mirror'),
      panel: document.getElementById('panel'),
      editor: document.getElementById('editor'),
      containersList: document.getElementById('containers-list'),
      editorInfo: document.getElementById('editor-info'),
      editorMessages: document.getElementById('editor-messages'),
      historyLog: document.getElementById('history-log'),
      selectedInfo: document.getElementById('selected-info'),
      statsInfo: document.getElementById('stats-info'),
      connectionInfo: document.getElementById('connection-info'),
      statusIndicator: document.getElementById('status'),
      
      buttons: {
        createContainer: document.getElementById('create-container-btn'),
        apply: document.getElementById('apply-btn'),
        undo: document.getElementById('undo-btn'),
        redo: document.getElementById('redo-btn'),
        delete: document.getElementById('delete-btn'),
        load: document.getElementById('load-btn'),
        save: document.getElementById('save-btn'),
        reset: document.getElementById('reset-btn')
      }
    };
  }

  bindEvents() {
    // Event Bus Listeners
    this.eventBus.on('container:created', (data) => this.onContainerCreated(data));
    this.eventBus.on('container:updated', (data) => this.onContainerUpdated(data));
    this.eventBus.on('container:deleted', (data) => this.onContainerDeleted(data));
    this.eventBus.on('selection:changed', (data) => this.onSelectionChanged(data));
    this.eventBus.on('history:saved', (data) => this.addHistoryLog(`💾 تم الحفظ`));
    this.eventBus.on('history:undone', (data) => this.addHistoryLog(`↩️ تراجع`));
    this.eventBus.on('history:redone', (data) => this.addHistoryLog(`↪️ إعادة`));

    // UI Event Listeners
    this.ui.buttons.createContainer?.addEventListener('click', () => this.createNewContainer());
    this.ui.buttons.apply?.addEventListener('click', () => this.applyChanges());
    this.ui.buttons.undo?.addEventListener('click', () => this.undo());
    this.ui.buttons.redo?.addEventListener('click', () => this.redo());
    this.ui.buttons.delete?.addEventListener('click', () => this.deleteSelected());
    this.ui.buttons.load?.addEventListener('click', () => this.loadData());
    this.ui.buttons.save?.addEventListener('click', () => this.saveData());
    this.ui.buttons.reset?.addEventListener('click', () => this.resetApp());

    this.ui.editor?.addEventListener('change', () => this.updateStats());

    // Set online status
    if (this.ui.statusIndicator) {
      this.ui.statusIndicator.classList.add('online');
    }
    if (this.ui.connectionInfo) {
      this.ui.connectionInfo.textContent = '✅ متصل';
    }
  }

  async createDefaultContainers() {
    const defaults = [
      { name: '🗄️ تهيئة', icon: '🗄️', kind: 'default' },
      { name: '🔧 توليد', icon: '🔧', kind: 'default' },
      { name: '⚙️ خلق', icon: '⚙️', kind: 'default' },
      { name: '🔄 معالجة', icon: '🔄', kind: 'default' },
      { name: '✏️ تعديل', icon: '✏️', kind: 'default' },
      { name: '📥 تثبيت', icon: '📥', kind: 'default' }
    ];

    for (const def of defaults) {
      await this.containerService.create(def.name, def.icon, def.kind);
    }

    this.renderContainers();
  }

  async createNewContainer() {
    const name = prompt('اسم الحاوية الجديدة:', '📦 حاوية جديدة');
    if (!name) return;

    await this.containerService.create(name, '📦', 'default');
    this.renderContainers();
  }

  async renderContainers() {
    const containers = await this.containerService.getRootContainers();
    if (this.ui.containersList) {
      this.ui.containersList.innerHTML = '';

      containers.forEach(container => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span class="item-icon">${container.icon}</span><span class="item-name">${container.name}</span><span class="item-status"></span>`;
        div.addEventListener('click', () => this.selectContainer(container.id));
        this.ui.containersList.appendChild(div);
      });
    }

    this.updateStats();
  }

  async selectContainer(id) {
    await this.containerService.select(id);
    this.renderContainers();
  }

  async applyChanges() {
    const code = this.ui.editor?.value;
    if (!code || !code.trim()) {
      this.showMessage('⚠️ الكود فارغ', 'error');
      return;
    }

    try {
      const selection = await this.store.getSelection();
      if (!selection) {
        this.showMessage('⚠️ اختر حاوية أولاً', 'error');
        return;
      }

      if (selection.type === 'container') {
        const container = await this.store.getContainer(selection.containerId);
        if (container) {
          await this.containerService.update(container.id, { name: code.split('\n')[0] });
          this.showMessage('✅ تم التطبيق', 'success');
          await this.historyService.save();
        }
      }
    } catch (error) {
      this.showMessage(`❌ خطأ: ${error.message}`, 'error');
    }
  }

  async undo() {
    await this.historyService.undo();
  }

  async redo() {
    await this.historyService.redo();
  }

  async deleteSelected() {
    const selection = await this.store.getSelection();
    if (!selection) {
      this.showMessage('⚠️ اختر شيئاً لحذفه', 'error');
      return;
    }

    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    if (selection.type === 'container') {
      await this.containerService.delete(selection.containerId);
      this.renderContainers();
      this.showMessage('✅ تم الحذف', 'success');
    }
  }

  async loadData() {
    const data = localStorage.getItem('adamiti-data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.showMessage('✅ تم التحميل', 'success');
      } catch (error) {
        this.showMessage('❌ خطأ في التحميل', 'error');
      }
    }
  }

  async saveData() {
    const state = this.store.getState();
    localStorage.setItem('adamiti-data', JSON.stringify(state));
    this.showMessage('✅ تم الحفظ في localStorage', 'success');
  }

  async resetApp() {
    if (!confirm('هل أنت متأكد؟ سيتم حذف جميع البيانات!')) return;
    await this.store.clear();
    this.renderContainers();
    if (this.ui.editor) this.ui.editor.value = '';
    this.showMessage('✅ تم التصفير', 'success');
  }

  onContainerCreated(data) {
    this.addHistoryLog(`✨ تم إنشاء: ${data.name}`);
    this.renderContainers();
  }

  onContainerUpdated(data) {
    this.addHistoryLog(`🔄 تم تحديث: ${data.id}`);
    this.renderContainers();
  }

  onContainerDeleted(data) {
    this.addHistoryLog(`🗑️ تم الحذف: ${data.name}`);
  }

  onSelectionChanged(data) {
    if (this.ui.selectedInfo) {
      this.ui.selectedInfo.textContent = `${data.type}: ${data.container.name || data.container.id}`;
    }
  }

  addHistoryLog(msg) {
    const time = new Date().toLocaleTimeString('ar-SA');
    this.historyLog.push(`[${time}] ${msg}`);
    if (this.historyLog.length > 20) this.historyLog.shift();
    if (this.ui.historyLog) {
      this.ui.historyLog.innerHTML = this.historyLog.join('<br>');
    }
  }

  showMessage(msg, type = 'success') {
    const div = document.createElement('div');
    div.className = type === 'error' ? 'error-message' : 'success-message';
    div.textContent = msg;
    if (this.ui.editorMessages) {
      this.ui.editorMessages.innerHTML = '';
      this.ui.editorMessages.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }
  }

  updateStats() {
    const stats = `الحاويات: ${this.store.containers.size} | العناصر: ${this.store.elements.size}`;
    if (this.ui.statsInfo) {
      this.ui.statsInfo.textContent = stats;
    }
  }
}

// تشغيل التطبيق
window.adamiti = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    window.adamiti = new AdamitiApp();
    await window.adamiti.boot();
  });
} else {
  window.adamiti = new AdamitiApp();
  window.adamiti.boot();
}
