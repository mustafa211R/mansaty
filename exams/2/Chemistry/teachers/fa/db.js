// 👩‍🔬 أسئلة كيمياء بصيغة UTF-8 سليمة
const questions = [
    {
        number: 1,
        question: "ما نوع الرابطة بين ذرة الصوديوم والكلور علماً أن العدد الذري للصوديوم 11 والكلور 17؟",
        type: "FillBlank",
        correctAnswer: "ايونية",
        score: 3
    },
    {
        number: 2,
        question: "سبب ارتفاع درجة غليان الماء هو وجود:",
        type: "MCQ",
        correctAnswer: "رابطة هيدروجينية",
        score: 2,
        options: ["رابطة هيدروجينية", "رابطة أيونية", "رابطة تساهمية", "قوى فاندر فالز"]
    },
    {
        number: 3,
        question: "قوى فاندر فالز هي قوى فيزيائية وليست كيميائية.",
        type: "TrueFalse",
        correctAnswer: "صح",
        score: 1
    },
    {
        number: 4,
        question: "نوع الرابطة في جزيئة الماء هو:",
        type: "MCQ",
        correctAnswer: "تساهمية",
        score: 2,
        options: ["تساهمية", "أيونية", "هيدروجينية", "ليست ذلك"]
    },
    {
        number: 5,
        question: "أعطِ شحنة الأيون المتكون للعنصر ألمنيوم  ______.",
        type: "FillBlank",
        correctAnswer: "Al+3",
        score: 3
    },
    {
        number: 6,
        question: "عدد التأكسد هو عدد موجب أو سالب.",
        type: "TrueFalse",
        correctAnswer: "صح",
        score: 1
    },
    {
        number: 7,
        question: "العناصر النبيلة هي العناصر التي تكون أغلفتها الخارجية مشبعة.",
        type: "TrueFalse",
        correctAnswer: "صح",
        score: 1
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
