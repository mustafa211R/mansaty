// 👩‍💻 الأسئلة
const questions = [
    {
        number: 1,
        question: "What was Mr. James dislike doing?",
        type: "MCQ",
        correctAnswer: "Washing-up",
        score: 2,
        options: ["Washing-up", "Writing", "Reading", "Cooking"]
    },
    {
        number: 2,
        question: "Where were the boys?",
        type: "MCQ",
        correctAnswer: "London",
        score: 2,
        options: ["Australia", "London", "Iraq", "Syria"]
    },
    {
        number: 3,
        question: "Go to the school library (advice: should) ___",
        type: "FillBlank",
        correctAnswer: "You should go to the school library",
        score: 2
    },
    {
        number: 4,
        question: "My (father) book is in the room. (Possessive 's)",
        type: "MCQ",
        correctAnswer: "1",
        score: 2,
        options: ["1","2","3","4"]
    },
    {
        number: 5,
        question: "Mr. James has been working in the cafe for ___ years.",
        type: "FillBlank",
        correctAnswer: "10",
        score: 2
    },
    {
        number: 6,
        question: "The boys ___ the competition.",
        type: "MCQ",
        correctAnswer: "Won",
        score: 2,
        options: ["Won", "Lost", "Left", "Walk"]
    },
    {
        number: 7,
        question: "Books in the library are ___",
        type: "MCQ",
        correctAnswer: "too many",
        score: 2,
        options: ["too many", "too much"]
    },
    {
        number: 8,
        question: "Watch a film ? (Suggestion)",
        type: "MCQ",
        correctAnswer: "Why don't we",
        score: 2,
        options: ["Let's", "Why don't we", "Shall you"]
    },
    {
        number: 9,
        question: "He watch the movie now (present continuous)",
        type: "MCQ",
        correctAnswer: "is watching",
        score: 2,
        options: ["is watching", "are watching", "is watched", "doesn't watch"]
    },
    {
        number: 10,
        question: "Mr. James has lived in Ashby since ___",
        type: "MCQ",
        correctAnswer: "He was born",
        score: 2,
        options: ["He was working", "He was born", "He lived", "1990"]
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





