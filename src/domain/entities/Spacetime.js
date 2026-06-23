/**
 * 🧬 DOMAIN LAYER - Spacetime Entity
 * الزمكان - المكان والزمان
 */

class Spacetime {
  constructor(id, location = {}, time = {}) {
    this.id = id;
    this.location = {
      x: location.x || 0,
      y: location.y || 0,
      z: location.z || 0,
      ...location
    };
    this.time = {
      created: time.created || Date.now(),
      modified: time.modified || Date.now(),
      accessed: time.accessed || Date.now(),
      ...time
    };
    this.metadata = {};
  }

  // ✅ تحديث الموقع
  updateLocation(x, y, z = 0) {
    this.location = { x, y, z };
    this.time.modified = Date.now();
  }

  // ✅ تسجيل الوصول
  recordAccess() {
    this.time.accessed = Date.now();
  }

  // ✅ الخصائص
  setMetadata(key, value) {
    this.metadata[key] = value;
    this.time.modified = Date.now();
  }

  getMetadata(key) {
    return this.metadata[key];
  }

  // ✅ حساب المسافة
  distanceTo(other) {
    const dx = this.location.x - other.location.x;
    const dy = this.location.y - other.location.y;
    const dz = this.location.z - other.location.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // ✅ التحويل إلى JSON
  toJSON() {
    return {
      id: this.id,
      location: { ...this.location },
      time: { ...this.time },
      metadata: { ...this.metadata }
    };
  }

  static fromJSON(data) {
    const spacetime = new Spacetime(data.id, data.location, data.time);
    spacetime.metadata = { ...data.metadata };
    return spacetime;
  }
}

module.exports = Spacetime;