/**
 * 📝 DOMAIN LAYER - EventBus Interface (Contract)
 */

class IEventBus {
  /**
   * الاستماع لحدث
   * @param {string} event - اسم الحدث
   * @param {Function} callback - الدالة المراد تنفيذها
   */
  on(event, callback) {
    throw new Error('Not implemented');
  }

  /**
   * استدعاء حدث مرة واحدة فقط
   * @param {string} event - اسم الحدث
   * @param {Function} callback - الدالة المراد تنفيذها
   */
  once(event, callback) {
    throw new Error('Not implemented');
  }

  /**
   * إطلاق حدث
   * @param {string} event - اسم الحدث
   * @param {any} data - البيانات المراد إرسالها
   */
  emit(event, data) {
    throw new Error('Not implemented');
  }

  /**
   * التوقف عن الاستماع
   * @param {string} event - اسم الحدث
   * @param {Function} callback - الدالة المراد إزالتها
   */
  off(event, callback) {
    throw new Error('Not implemented');
  }

  /**
   * إزالة جميع المستمعين لحدث معين
   * @param {string} event - اسم الحدث
   */
  removeAllListeners(event) {
    throw new Error('Not implemented');
  }

  /**
   * الحصول على عدد المستمعين
   * @param {string} event - اسم الحدث
   */
  listenerCount(event) {
    throw new Error('Not implemented');
  }
}

module.exports = IEventBus;