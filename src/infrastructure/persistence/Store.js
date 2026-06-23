/**
 * 💾 INFRASTRUCTURE LAYER - Store Implementation
 * نظام التخزين
 */

class Store {
  constructor() {
    this.containers = new Map();
    this.elements = new Map();
    this.mirror = null;
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
    this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    this.history.push(snapshot);
    this.currentHistoryIndex++;
    if (this.history.length > 50) {
      this.history.shift();
      this.currentHistoryIndex--;
    }
  }

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

  async clear() {
    this.containers.clear();
    this.elements.clear();
    this.mirror = null;
    this.selection = null;
    this.clipboard = null;
    this.history = [];
    this.currentHistoryIndex = -1;
  }

  // ✅ Export state
  getState() {
    return {
      containers: Array.from(this.containers.entries()).map(([id, c]) => [id, c.toJSON ? c.toJSON() : c]),
      elements: Array.from(this.elements.entries()).map(([id, e]) => [id, e.toJSON ? e.toJSON() : e]),
      mirror: this.mirror?.toJSON ? this.mirror.toJSON() : this.mirror,
      selection: this.selection,
      clipboard: this.clipboard
    };
  }
}
