// إعدادات الاختبار
const rules = {
    passingScore: 6,        // الحد الأدنى للحصول على الشهادة
    totalTime: 15,          // الوقت بالدقائق
    helpThreshold: 4,       // الدرجة التي يظهر بعدها زر المساعدة
    name_teacher: 'احمد حسن ياسين',   // اسم الأستاذ
    subject: 'رياضيات',                // اسم المادة
    signature_image: "uploads/tec.jpg" // رابط صورة التوقيع
};

// ✅ دالة لحفظ القواعد في localStorage
function saveRules() {
    localStorage.setItem("rules", JSON.stringify(rules));
}

// ✅ تحقق عند تحميل الصفحة: احفظ القواعد فقط إذا لم تكن موجودة
(function initializeRules() {
    if (!localStorage.getItem("rules")) {
        saveRules();
        console.log("✅ Rules saved in localStorage for the first time.");
    } else {
        console.log("ℹ️ Rules already exist in localStorage.");
    }
})();

