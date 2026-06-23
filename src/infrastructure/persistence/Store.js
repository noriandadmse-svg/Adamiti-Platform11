/**
 * 💾 INFRASTRUCTURE LAYER - Store Implementation
 * تنفيذ واجهة الـ Store
 */

const IStore = require('../../domain/interfaces/IStore');

class Store extends IStore {
  constructor() {
    super();
    this.containers = new Map();
    this.elements = new Map();
    this.mirror = null;
    this.spacetime = null;
    this.selection = null;
    this.clipboard = null;
    this.history = [];
    this.currentHistoryIndex = -1;
  }

  // ✅ Containers
  async getContainer(id) {
    return this.containers.get(id) || null;
  }

  async getAllContainers() {
    return Array.from(this.containers.values());
  }

  async saveContainer(container) {
    if (!container.id) throw new Error('Container must have an ID');
    this.containers.set(container.id, container);
    return container;
  }

  async deleteContainer(id) {
    return this.containers.delete(id);
  }

  // ✅ Elements
  async getElement(id) {
    return this.elements.get(id) || null;
  }

  async getAllElements() {
    return Array.from(this.elements.values());
  }

  async saveElement(element) {
    if (!element.id) throw new Error('Element must have an ID');
    this.elements.set(element.id, element);
    return element;
  }

  async deleteElement(id) {
    return this.elements.delete(id);
  }

  // ✅ Mirror
  async getMirror(id) {
    if (this.mirror && this.mirror.id === id) {
      return this.mirror;
    }
    return null;
  }

  async saveMirror(mirror) {
    this.mirror = mirror;
    return mirror;
  }

  // ✅ Spacetime
  async getSpacetime(id) {
    if (this.spacetime && this.spacetime.id === id) {
      return this.spacetime;
    }
    return null;
  }

  async saveSpacetime(spacetime) {
    this.spacetime = spacetime;
    return spacetime;
  }

  // ✅ Selection & Clipboard
  async getSelection() {
    return this.selection;
  }

  async setSelection(selection) {
    this.selection = selection;
  }

  async getClipboard() {
    return this.clipboard;
  }

  async setClipboard(clipboard) {
    this.clipboard = clipboard;
  }

  // ✅ History
  async getHistory() {
    return this.history.slice(0, this.currentHistoryIndex + 1);
  }

  async saveSnapshot(snapshot) {
    // Remove any redo history
    this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    // Add new snapshot
    this.history.push(snapshot);
    this.currentHistoryIndex++;
    // Limit history to 50 items
    if (this.history.length > 50) {
      this.history.shift();
      this.currentHistoryIndex--;
    }
  }

  // ✅ Undo/Redo
  async undo() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      return this.history[this.currentHistoryIndex];
    }
    return null;
  }

  async redo() {
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.currentHistoryIndex++;
      return this.history[this.currentHistoryIndex];
    }
    return null;
  }

  // ✅ Cleanup
  async clear() {
    this.containers.clear();
    this.elements.clear();
    this.mirror = null;
    this.spacetime = null;
    this.selection = null;
    this.clipboard = null;
    this.history = [];
    this.currentHistoryIndex = -1;
  }

  // ✅ Export state
  getState() {
    return {
      containers: Array.from(this.containers.entries()).map(([id, c]) => [id, c.toJSON()]),
      elements: Array.from(this.elements.entries()).map(([id, e]) => [id, e.toJSON()]),
      mirror: this.mirror?.toJSON(),
      spacetime: this.spacetime?.toJSON(),
      selection: this.selection,
      clipboard: this.clipboard
    };
  }

  // ✅ Import state
  async restoreState(state) {
    this.containers.clear();
    this.elements.clear();
    // Restore logic would go here
  }
}

module.exports = Store;