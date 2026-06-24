const DEV_SECRET_CODE = "1234";

function checkGate() {
    const inputField = document.getElementById('dev-code');
    const userCode = inputField ? inputField.value : "";

    if (userCode === DEV_SECRET_CODE) {
        sessionStorage.setItem('gate_authenticated', 'true');
        
        // إظهار المنصة وإخفاء البوابة
        document.getElementById('public-gate').style.display = 'none';
        document.getElementById('app').style.display = 'grid';
        
        console.log("تم فك الترميز المؤقت بنجاح.");
    } else {
        alert("الرمز الخارجي غير صحيح. الوصول مرفوض!");
    }
}

// دالة "إعادة القفل" فقط دون محاولة إغلاق النافذة
function lockAndResetPlatform() {
    // مسح ترميز الجلسة المؤقتة
    sessionStorage.removeItem('gate_authenticated');
    
    // إظهار البوابة وإخفاء التطبيق مباشرة دون إعادة تحميل
    const publicGate = document.getElementById('public-gate');
    const appContainer = document.getElementById('app');
    if (publicGate) publicGate.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    
    console.log("تم قفل المنصة. مطلوب ترميز جديد.");
}

// فحص حالة الترميز تلقائياً عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    const isAuthenticated = sessionStorage.getItem('gate_authenticated');
    const publicGate = document.getElementById('public-gate');
    const appContainer = document.getElementById('app');

    if (isAuthenticated === 'true') {
        // تم التصحيح هنا: style.style -> style
        if (publicGate) publicGate.style.display = 'none';
        if (appContainer) appContainer.style.display = 'grid';
    } else {
        if (publicGate) publicGate.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }

    // ربط زر القفل بوظيفة "إعادة القفل" الجديدة
    const lockBtn = document.getElementById("reset-btn");
    if (lockBtn) {
        lockBtn.addEventListener("click", () => {
            if (confirm("هل تريد قفل المنصة وإعادة طلب الترميز؟")) {
                lockAndResetPlatform();
            }
        });
    }
});
