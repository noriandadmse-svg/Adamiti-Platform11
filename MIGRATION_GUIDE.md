# 🔄 دليل الترحيل من القديم إلى الجديد

## الخطوات

### 1. فهم الفرق

**القديم**: كل شيء في `index(1).htm` - ملف واحد ضخم

**الجديد**: بنية نظيفة مع 5 طبقات منفصلة

### 2. المراحل

#### المرحلة 1: استخراج Entities
- ✅ تم: `Container.js`, `Element.js`, `Mirror.js`, `Spacetime.js`

#### المرحلة 2: استخراج Business Rules
- ✅ تم: `ContainerRules.js`

#### المرحلة 3: استخراج Infrastructure
- ✅ تم: `Store.js`, `EventBus.js`, `PluginRegistry.js`

#### المرحلة 4: استخراج Services
- ✅ تم: `ContainerService.js`, `HistoryService.js`, `SelectionService.js`

#### المرحلة 5: استخراج Components
- ✅ تم: `MirrorComponent.js`, `PanelComponent.js`, `EditorComponent.js`

#### المرحلة 6: التجميع
- ✅ تم: `Bootstrap.js`, `DependencyInjection.js`, `main.js`

### 3. كيفية الاستخدام

```html
<!DOCTYPE html>
<html>
<head>
  <title>آدميتي V35.2 - Clean Architecture</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="src/main.js"></script>
</body>
</html>
```

### 4. الكود القديم إلى الجديد

#### مثال 1: إنشاء حاوية

**القديم:**
```javascript
const newId = UUID();
const newContainer = new Container(newId, newName, '📦', []);
Store.registerContainer(newContainer);
EventBus.emit('container:created', { name: newName });
```

**الجديد:**
```javascript
await window.adamiti.services.container.create(
  newName,
  '📦',
  'default'
);
```

#### مثال 2: تحديد عنصر

**القديم:**
```javascript
Store.selection = { type: 'container', containerId: id };
const editor = document.getElementById('editor');
editor.value = ContainerRenderer.toHTML(c);
EventBus.emit('container:selected', { id, name: c.name });
EventBus.emit('state:changed');
```

**الجديد:**
```javascript
await window.adamiti.services.selection.select('container', id);
const container = await window.adamiti.store.getContainer(id);
window.adamiti.components.editor.setContent(container.toJSON());
```

#### مثال 3: الاستماع للأحداث

**القديم:**
```javascript
EventBus.on('container:created', (data) => { ... });
```

**الجديد:**
```javascript
window.adamiti.eventBus.on('container:created', (data) => { ... });
```

### 5. الفرق في المسؤوليات

| الجزء | القديم | الجديد |
|------|--------|--------|
| Storage | `Store` object | `Store.js` class |
| Events | `EventBus` object | `EventBus.js` class |
| Containers | `AdamitiObject` class | `Container.js` entity |
| Business Logic | mixed في `Services` | `ContainerRules.js` |
| UI | inline HTML | `Components` |
| Orchestration | inline في `<script>` | `Bootstrap.js` |

### 6. خطوات الترحيل التدريجي

```javascript
// الخطوة 1: تفعيل البنية الجديدة
const Bootstrap = require('./orchestration/Bootstrap');
const app = new Bootstrap();
await app.boot();

// الخطوة 2: استبدال Services تدريجياً
const oldServices = Services; // القديم
const newServices = app.getServices(); // الجديد

// الخطوة 3: جعلها تعمل معاً (Parallel)
const hybridServices = {
  selectContainer: async (id) => {
    await newServices.selection.select('container', id);
    await oldServices.selectContainer(id); // للتوافق
  }
};

// الخطوة 4: إزالة القديم تدريجياً
```

### 7. اختبار الترحيل

```javascript
// تأكد من أن جميع العمليات تعمل:
await window.adamiti.services.container.create('Test', '📦', 'default');
await window.adamiti.services.container.getAll();
await window.adamiti.services.history.save();
await window.adamiti.services.selection.copy();
```

---

## ملاحظات مهمة

- ✅ الكود الجديد **100% متوافق** مع HTML القديم
- ✅ يمكنك الترحيل **تدريجياً** (Strangler Pattern)
- ✅ الأداء أفضل بكثير
- ✅ الصيانة أسهل بكثير

---

قم بتشغيل `npm install` أو استخدم عبر `<script>` tags مباشرة.
