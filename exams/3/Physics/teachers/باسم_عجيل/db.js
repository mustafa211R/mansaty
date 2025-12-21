// 👩‍🔬 أسئلة كيمياء بصيغة UTF-8 سليمة
const questions = [
    {
        number: 1,
        question: "أيّ مما يأتي يُعبّر عن السرعة المتوسطة؟",
        type: "MCQ",
        correctAnswer: "المسافة الكلية ÷ الزمن الكلي",
        score: 2,
        options: [
            "المسافة الكلية ÷ الزمن الكلي",
            "التغير في الإزاحة ÷ الزمن",
            "القوة × الزمن",
            "الكتلة ÷ الزمن"
        ]
    },
    {
        number: 2,
        question: "وحدة قياس القوة في النظام الدولي هي:",
        type: "MCQ",
        correctAnswer: "النيوتن",
        score: 2,
        options: [
            "الكيلوغرام",
            "المتر",
            "النيوتن",
            "الجول"
        ]
    },
    {
        number: 3,
        question: "يُعرّف الشغل بأنه حاصل ضرب القوة في _________.",
        type: "FillBlank",
        correctAnswer: "الإزاحة",
        score: 3
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
