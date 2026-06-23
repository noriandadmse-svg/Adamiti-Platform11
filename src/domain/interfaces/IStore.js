/**
 * 📝 DOMAIN LAYER - Store Interface (Contract)
 * الاتفاقية بين الطبقات
 */

class IStore {
  // ✅ Containers
  async getContainer(id) {
    throw new Error('Not implemented');
  }

  async getAllContainers() {
    throw new Error('Not implemented');
  }

  async saveContainer(container) {
    throw new Error('Not implemented');
  }

  async deleteContainer(id) {
    throw new Error('Not implemented');
  }

  // ✅ Elements
  async getElement(id) {
    throw new Error('Not implemented');
  }

  async getAllElements() {
    throw new Error('Not implemented');
  }

  async saveElement(element) {
    throw new Error('Not implemented');
  }

  async deleteElement(id) {
    throw new Error('Not implemented');
  }

  // ✅ Mirror
  async getMirror(id) {
    throw new Error('Not implemented');
  }

  async saveMirror(mirror) {
    throw new Error('Not implemented');
  }

  // ✅ Spacetime
  async getSpacetime(id) {
    throw new Error('Not implemented');
  }

  async saveSpacetime(spacetime) {
    throw new Error('Not implemented');
  }

  // ✅ Selection & Clipboard
  async getSelection() {
    throw new Error('Not implemented');
  }

  async setSelection(selection) {
    throw new Error('Not implemented');
  }

  async getClipboard() {
    throw new Error('Not implemented');
  }

  async setClipboard(clipboard) {
    throw new Error('Not implemented');
  }

  // ✅ History
  async getHistory() {
    throw new Error('Not implemented');
  }

  async saveSnapshot(snapshot) {
    throw new Error('Not implemented');
  }

  // ✅ Cleanup
  async clear() {
    throw new Error('Not implemented');
  }
}

module.exports = IStore;