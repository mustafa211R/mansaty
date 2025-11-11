// 👩‍💻 الأسئلة
const questions = [
    {
        number: 1,
        question: "ما هي لغة البرمجة المستخدمة في تطوير الويب؟",
        type: "MCQ",
        correctAnswer: "JavaScript",
        score: 2,
        options: ["Python", "JavaScript", "C++", "Java"]
    },
    {
        number: 2,
        question: "الشمس هي نجم. صح أم خطأ؟",
        type: "TrueFalse",
        correctAnswer: "صح",
        score: 3
    },
    {
        number: 3,
        question: "اكمل الفراغ: عاصمة فرنسا هي ____. ",
        type: "FillBlank",
        correctAnswer: "باريس",
        score: 5
    }
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
