/**
 * 📢 INFRASTRUCTURE LAYER - EventBus Implementation
 * نظام الأحداث
 */

class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return () => this.off(event, callback);
  }

  once(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const wrappedCallback = (data) => {
      callback(data);
      this.off(event, wrappedCallback);
    };

    this.on(event, wrappedCallback);
  }

  emit(event, data) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  off(event, callback) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(
      cb => cb !== callback
    );

    if (this.listeners[event].length === 0) {
      delete this.listeners[event];
    }
  }

  removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  listenerCount(event) {
    return this.listeners[event]?.length || 0;
  }

  getAllEvents() {
    return Object.keys(this.listeners);
  }
}
