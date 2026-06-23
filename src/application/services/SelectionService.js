/**
 * 🔧 APPLICATION LAYER - Selection Service
 * خدمة إدارة التحديد
 */

class SelectionService {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  /**
   * تحديد عنصر
   */
  async select(type, id, metadata = {}) {
    const selection = {
      type, // 'container' | 'element' | 'mirror' | 'tool'
      id,
      metadata,
      timestamp: Date.now()
    };

    await this.store.setSelection(selection);

    this.eventBus.emit('selection:changed', {
      selection,
      previous: await this.store.getSelection()
    });

    return selection;
  }

  /**
   * إلغاء التحديد
   */
  async deselect() {
    await this.store.setSelection(null);
    this.eventBus.emit('selection:cleared');
  }

  /**
   * الحصول على التحديد الحالي
   */
  async getCurrent() {
    return this.store.getSelection();
  }

  /**
   * نسخ العنصر المحدد
   */
  async copy() {
    const selection = await this.store.getSelection();
    if (!selection) {
      throw new Error('Nothing selected to copy');
    }

    let clipboardData = null;

    if (selection.type === 'container') {
      const container = await this.store.getContainer(selection.id);
      clipboardData = { type: 'container', data: container.toJSON() };
    } else if (selection.type === 'element') {
      const element = await this.store.getElement(selection.id);
      clipboardData = { type: 'element', data: element.toJSON() };
    }

    await this.store.setClipboard(clipboardData);
    this.eventBus.emit('clipboard:copied', { clipboardData });

    return clipboardData;
  }

  /**
   * لصق من الحافظة
   */
  async paste(targetContainerId) {
    const clipboard = await this.store.getClipboard();
    if (!clipboard) {
      throw new Error('Clipboard is empty');
    }

    this.eventBus.emit('clipboard:pasted', {
      clipboard,
      targetContainerId
    });

    await this.store.setClipboard(null);
    return clipboard;
  }
}

module.exports = SelectionService;