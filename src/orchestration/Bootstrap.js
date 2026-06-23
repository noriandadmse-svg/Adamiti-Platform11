/**
 * 🚀 ORCHESTRATION LAYER - Bootstrap
 * الإقلاع والتهيئة الرئيسية
 */

const Store = require('../infrastructure/persistence/Store');
const EventBus = require('../infrastructure/communication/EventBus');
const PluginRegistry = require('../infrastructure/plugins/PluginRegistry');

const ContainerService = require('../application/services/ContainerService');
const HistoryService = require('../application/services/HistoryService');
const SelectionService = require('../application/services/SelectionService');

const MirrorComponent = require('../presentation/components/MirrorComponent');
const PanelComponent = require('../presentation/components/PanelComponent');
const EditorComponent = require('../presentation/components/EditorComponent');

class Bootstrap {
  constructor() {
    this.store = null;
    this.eventBus = null;
    this.pluginRegistry = null;
    this.services = {};
    this.components = {};
  }

  /**
   * إطلاق التطبيق
   */
  async boot() {
    try {
      console.log('🚀 Bootstrapping Adamiti Platform...');

      // 1️⃣ Infrastructure
      await this.initializeInfrastructure();

      // 2️⃣ Services
      await this.initializeServices();

      // 3️⃣ Components
      await this.initializeComponents();

      // 4️⃣ Plugins
      await this.initializePlugins();

      console.log('✅ Bootstrap complete!');
      return this;
    } catch (error) {
      console.error('❌ Bootstrap failed:', error);
      throw error;
    }
  }

  /**
   * تهيئة البنية التحتية
   */
  async initializeInfrastructure() {
    console.log('🔧 Initializing infrastructure...');

    this.store = new Store();
    this.eventBus = new EventBus();
    this.pluginRegistry = new PluginRegistry();

    console.log('✅ Infrastructure initialized');
  }

  /**
   * تهيئة الخدمات
   */
  async initializeServices() {
    console.log('⚙️ Initializing services...');

    this.services.container = new ContainerService(this.store, this.eventBus);
    this.services.history = new HistoryService(this.store, this.eventBus);
    this.services.selection = new SelectionService(this.store, this.eventBus);

    console.log('✅ Services initialized');
  }

  /**
   * تهيئة المكونات
   */
  async initializeComponents() {
    console.log('🎨 Initializing components...');

    const app = document.getElementById('app');
    if (!app) {
      throw new Error('Element #app not found');
    }

    // Get or create containers
    let mirrorContainer = document.getElementById('mirror');
    if (!mirrorContainer) {
      mirrorContainer = document.createElement('div');
      mirrorContainer.id = 'mirror';
      app.appendChild(mirrorContainer);
    }

    let panelContainer = document.getElementById('panel');
    if (!panelContainer) {
      panelContainer = document.createElement('div');
      panelContainer.id = 'panel';
      app.appendChild(panelContainer);
    }

    let editorContainer = document.getElementById('editor');
    if (!editorContainer) {
      editorContainer = document.createElement('div');
      editorContainer.id = 'editor';
      app.appendChild(editorContainer);
    }

    // Create components
    this.components.mirror = new MirrorComponent(
      mirrorContainer,
      this.services.selection,
      this.eventBus
    );

    this.components.panel = new PanelComponent(
      panelContainer,
      this.services.container,
      this.eventBus
    );

    this.components.editor = new EditorComponent(
      editorContainer,
      this.eventBus
    );

    console.log('✅ Components initialized');
  }

  /**
   * تهيئة الإضافات
   */
  async initializePlugins() {
    console.log('🔌 Initializing plugins...');

    const context = {
      store: this.store,
      eventBus: this.eventBus,
      services: this.services,
      components: this.components
    };

    await this.pluginRegistry.initializeAll(context);
    await this.pluginRegistry.enableAll();

    console.log('✅ Plugins initialized');
  }

  /**
   * إيقاف التطبيق
   */
  async shutdown() {
    console.log('🛑 Shutting down...');

    await this.pluginRegistry.disableAll();
    await this.pluginRegistry.cleanupAll();
    await this.store.clear();

    console.log('✅ Shutdown complete');
  }

  /**
   * الحصول على الخدمات
   */
  getServices() {
    return this.services;
  }

  /**
   * الحصول على المكونات
   */
  getComponents() {
    return this.components;
  }

  /**
   * الحصول على الـ Store
   */
  getStore() {
    return this.store;
  }

  /**
   * الحصول على EventBus
   */
  getEventBus() {
    return this.eventBus;
  }
}

module.exports = Bootstrap;