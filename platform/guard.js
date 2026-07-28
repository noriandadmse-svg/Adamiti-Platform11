// يعتمد كلياً على Firebase Auth الحالي — بدون إعادة بناء، بدون localStorage claims.
// ملاحظة: هذا الملف يفترض أن Firebase SDK (app + auth) وملف تهيئة المشروع
// الحالي (المستخدم أصلاً في auth.html) محمّلان قبل هذا السكربت في الصفحة.
// لا نخترع مسار ملف التهيئة هنا — على الصفحة المستدعية تضمينه قبل guard.js.
(function () {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error('[guard.js] Firebase SDK غير محمّل. تأكد من تضمين firebase-app و firebase-auth وملف تهيئة Firebase الحالي قبل guard.js');
    return;
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      const next = encodeURIComponent(location.pathname);
      location.href = `/auth.html?redirect=${next}`;
      return;
    }
    try {
      // إجبار تحديث التوكن للتأكد من صلاحيته وعدم انتهائه
      await user.getIdToken(true);
    } catch (e) {
      await firebase.auth().signOut();
      location.href = '/auth.html';
    }
  });
})();
