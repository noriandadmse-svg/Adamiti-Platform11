# 🏗️ آدميتي Adamiti Platform V36.0

## Clean Architecture Edition

منصة تطوير رقمية متقدمة بنية معمارية نظيفة وقابلة للتوسع.

### ✨ الميزات

- ✅ **بنية معمارية نظيفة** - 5 طبقات منفصلة
- ✅ **قابلة للاختبار** - كل مكون منفصل
- ✅ **قابلة للصيانة** - سهلة الفهم والتطوير
- ✅ **قابلة للتوسع** - إضافة ميزات جديدة بسهولة
- ✅ **دعم كامل للعربية** - واجهة عربية كاملة

### 🏗️ البنية

```
src/
├── domain/              # النواة (Domain Layer)
│   └── entities/        # الكائنات الخالصة
├── infrastructure/      # البنية التحتية
│   ├── persistence/     # التخزين
│   └── communication/   # الاتصالات
├── application/         # التطبيق
│   └── services/        # الخدمات
└── main.js             # نقطة الدخول
```

### 🚀 الاستخدام

```javascript
// الوصول من Console
window.adamiti.containerService.create('اسم', '🎯', 'default');
window.adamiti.store.getAllContainers();
window.adamiti.eventBus.on('container:created', (data) => console.log(data));
```

### 📚 التوثيق

- [README_ARCHITECTURE.md](README_ARCHITECTURE.md) - شرح البنية
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - دليل التهجير

### 👨‍💻 التطوير

تم بناء المشروع بـ:
- JavaScript (Vanilla)
- Clean Architecture
- Event-Driven Architecture

### 📝 الترخيص

مفتوح المصدر - يمكن الاستخدام الحر
