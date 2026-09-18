// 👩‍🔬 أسئلة كيمياء بصيغة UTF-8 سليمة
const questions = [

];


// 🧮 حساب الدرجة الكاملة لجميع الأسئلة
const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

// 💾 تخزين الدرجة الكاملة في localStorage
localStorage.setItem('totalScore', totalScore);

// ✅ إنشاء score_num لتخزين رقم السؤال ودرجته
const score_num = {};
questions.forEach(q => {
    score_num[q.number] = q.score;
});

// 💾 تخزينه في localStorage
localStorage.setItem('score_num', JSON.stringify(score_num));

console.log("✅ تم حفظ totalScore و score_num في localStorage");
console.log("score_num:", score_num);
