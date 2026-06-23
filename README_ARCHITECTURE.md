# 🏗️ Adamiti Platform V35.2 - Clean Architecture Refactor

## البنية الجديدة (New Architecture)

### 📊 الطبقات الخمس

```
┌─────────────────────────────────────────────────────┐
│ 5️⃣ ORCHESTRATION (التجميع)                        │
│    Bootstrap.js | DependencyInjection.js | main.js  │
├─────────────────────────────────────────────────────┤
│ 4️⃣ PRESENTATION (الواجهة)                         │
│    MirrorComponent | PanelComponent | EditorComponent│
├─────────────────────────────────────────────────────┤
│ 3️⃣ APPLICATION (التطبيق - الحالات)                │
│    Usecases | Services                              │
├─────────────────────────────────────────────────────┤
│ 2️⃣ INFRASTRUCTURE (البنية التحتية)                 │
│    Store | EventBus | PluginRegistry                │
├─────────────────────────────────────────────────────┤
│ 1️⃣ DOMAIN (النواة - لا تعتمد على أحد)             │
│    Entities | Rules | Interfaces                    │
└─────────────────────────────────────────────────────┘
```

---

## 📁 هيكل المجلدات

```
src/
├── domain/                      # النواة (Domain Layer)
│   ├── entities/               # الكائنات الخالصة
│   │   ├── Container.js
│   │   ├── Element.js
│   │   ├── Mirror.js
│   │   └── Spacetime.js
│   ├── rules/                  # قوانين الأعمال
│   │   └── ContainerRules.js
│   └── interfaces/             # العقود (Contracts)
│       ├── IStore.js
│       ├── IEventBus.js
│       └── IPlugin.js
│
├── infrastructure/             # البنية التحتية (Infrastructure Layer)
│   ├── persistence/            # التخزين
│   │   └── Store.js
│   ├── communication/          # الاتصالات
│   │   └── EventBus.js
│   └── plugins/                # الإضافات
│       ├── PluginRegistry.js
│       └── FileSystemPlugin.js
│
├── application/                # التطبيق (Application Layer)
│   ├── usecases/              # حالات الاستخدام
│   │   ├── CreateContainerUsecase.js
│   │   ├── SelectContainerUsecase.js
│   │   ├── UpdateContainerUsecase.js
│   │   └── DeleteContainerUsecase.js
│   └── services/              # الخدمات
│       ├── ContainerService.js
│       ├── HistoryService.js
│       └── SelectionService.js
│
├── presentation/              # الواجهة (Presentation Layer)
│   └── components/            # المكونات
│       ├── MirrorComponent.js
│       ├── PanelComponent.js
│       └── EditorComponent.js
│
└── orchestration/             # التجميع (Orchestration Layer)
    ├── Bootstrap.js           # الإقلاع
    ├── DependencyInjection.js # حقن التبعيات
    └── main.js               # نقطة الدخول
```

---

## 🔄 تدفق البيانات

```
User Interaction (Click in Mirror)
        ↓
Presentation Layer (MirrorComponent)
        ↓
Application Layer (SelectionService)
        ↓
Infrastructure Layer (Store + EventBus)
        ↓
Domain Layer (Business Rules)
        ↓
State Updated
        ↓
EventBus Emits Event
        ↓
Components Listen & Update
```

---

## ✅ الفوائد

| المقياس | الفائدة |
|--------|--------|
| **اختبار** | كل طبقة يمكن اختبارها بشكل منفصل |
| **صيانة** | سهولة إصلاح bugs دون تأثير على الطبقات الأخرى |
| **توسع** | إضافة ميزات جديدة في طبقة Application فقط |
| **إعادة استخدام** | Services يمكن استخدامه من عدة Components |
| **استبدال** | يمكن استبدال Store بـ Backend API بسهولة |
| **وضوح** | كل ملف له مسؤولية واحدة واضحة |

---

## 🚀 الاستخدام

### البدء

```javascript
const Bootstrap = require('./orchestration/Bootstrap');

const app = new Bootstrap();
await app.boot();

// الآن يمكنك استخدام الخدمات:
const { container, history, selection } = app.getServices();
```

### إنشاء حاوية

```javascript
const { container } = window.adamiti.services;

const result = await container.create(
  'اسم الحاوية',
  '📦',      // icon
  'objects'  // kind
);
```

### الاستماع للأحداث

```javascript
const { eventBus } = window.adamiti;

eventBus.on('container:created', (data) => {
  console.log('Container created:', data);
});
```

### الوصول للـ Store

```javascript
const { store } = window.adamiti;

const container = await store.getContainer('container-id');
const allElements = await store.getAllElements();
```

---

## 📝 الخطوات التالية

- [ ] دمج مع الكود القديم
- [ ] اختبار شامل (Unit + Integration)
- [ ] إضافة Database Backend
- [ ] نظام المستخدمين والمشاريع
- [ ] WebSocket للتعاون الحي
- [ ] Version Control

---

## 🎯 ملاحظات مهمة

1. **كل طبقة مستقلة**: الطبقات الأعلى تعتمد على الأقل فقط، ولا تعتمد بالعكس
2. **العقود واضحة**: واجهات (Interfaces) تحدد التوقعات
3. **التجميع في النهاية**: Orchestration تجمع كل شيء معاً
4. **سهولة الاختبار**: كل مكون يمكن اختباره بشكل معزول

---

تم الإنشاء بـ ❤️ لمنصة آدميتي
