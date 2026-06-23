/**
 * 🔧 APPLICATION LAYER - History Service
 * خدمة إدارة السجل (Undo/Redo)
 */

class HistoryService {
  constructor(store, eventBus) {
    this.store = store;
    this.eventBus = eventBus;
  }

  async save() {
    const snapshot = {
      timestamp: Date.now(),
      state: this.store.getState()
    };

    await this.store.saveSnapshot(snapshot);
    this.eventBus.emit('history:saved', { snapshot });
    return snapshot;
  }

  async undo() {
    const snapshot = await this.store.undo();
    if (!snapshot) {
      this.eventBus.emit('history:undo-failed', { reason: 'No undo history' });
      return null;
    }

    this.eventBus.emit('history:undone', { snapshot });
    return snapshot;
  }

  async redo() {
    const snapshot = await this.store.redo();
    if (!snapshot) {
      this.eventBus.emit('history:redo-failed', { reason: 'No redo history' });
      return null;
    }

    this.eventBus.emit('history:redone', { snapshot });
    return snapshot;
  }

  async getHistory() {
    return this.store.getHistory();
  }

  async clearHistory() {
    this.store.history = [];
    this.store.currentHistoryIndex = -1;
    this.eventBus.emit('history:cleared');
  }
}
