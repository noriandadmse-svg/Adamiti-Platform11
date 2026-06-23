/**
 * 🔌 INFRASTRUCTURE LAYER - File System Plugin
 * إضافة نظام الملفات
 */

const IPlugin = require('../../domain/interfaces/IPlugin');

class FileSystemPlugin extends IPlugin {
  constructor() {
    super('FileSystem', '1.0.0');
    this.basePath = '.';
  }

  async init(context) {
    this.store = context.store;
    this.eventBus = context.eventBus;

    // الاستماع لأحداث الحفظ
    this.eventBus.on('container:updated', (data) => {
      this.onContainerUpdated(data);
    });

    console.log('✅ FileSystemPlugin initialized');
  }

  async enable() {
    console.log('✅ FileSystemPlugin enabled');
  }

  async disable() {
    console.log('✅ FileSystemPlugin disabled');
  }

  async cleanup() {
    console.log('✅ FileSystemPlugin cleaned up');
  }

  getFeatures() {
    return {
      readFile: 'Read file from disk',
      writeFile: 'Write file to disk',
      listFiles: 'List files in directory'
    };
  }

  // ✅ Event handlers
  async onContainerUpdated(data) {
    // منطق الحفظ
  }
}

module.exports = FileSystemPlugin;