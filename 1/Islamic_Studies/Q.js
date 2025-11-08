// 🧠 ملف الأسئلة والمنطق البرمجي

const questions = [
  {
    id: 1,
    type: "mcq",
    question: "ما عاصمة العراق؟",
    options: ["البصرة", "بغداد", "الموصل", "أربيل"],
    correct: "بغداد"
  },
  {
    id: 2,
    type: "fill",
    question: "سورة الفاتحة تحتوي على ____ آيات.",
    answer: "7"
  },
  {
    id: 3,
    type: "mcq",
    question: "عدد الكواكب في المجموعة الشمسية هو:",
    options: ["8", "9", "7", "6"],
    correct: "8"
  },
  {
    id: 4,
    type: "fill",
    question: "العاصمة الفرنسية هي ____.",
    answer: "باريس"
  }
];

// ----------------------
// إنشاء عناصر الأسئلة
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("questionsContainer");

  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "bg-white backdrop-blur-md rounded-2xl shadow-lg p-5 space-y-3 border border-transparent transition";

    // السؤال
    const qTitle = document.createElement("h2");
    qTitle.className = "font-semibold text-gray-800 text-lg";
    qTitle.textContent = `${q.id}. ${q.question}`;
    card.appendChild(qTitle);

    // نوع السؤال
    if (q.type === "mcq") {
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "space-y-2";

      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 text-gray-700 cursor-pointer";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q${q.id}`;
        input.value = opt;
        input.className = "accent-blue-600";

        label.appendChild(input);
        label.append(opt);
        optionsDiv.appendChild(label);
      });
      card.appendChild(optionsDiv);
    }

    if (q.type === "fill") {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `fill_${q.id}`;
      input.placeholder = "أدخل الإجابة هنا";
      input.className = "w-full border border-gray-300 rounded-xl p-2 focus:ring focus:ring-blue-300 outline-none";
      card.appendChild(input);
    }

    // زر الفحص الفردي
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "فحص الإجابة";
    checkBtn.className = "mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition";
    checkBtn.addEventListener("click", () => checkAnswer(q, card));
    card.appendChild(checkBtn);

    // مكان النتيجة
    const result = document.createElement("div");
    result.className = "mt-2 text-sm font-semibold";
    card.appendChild(result);

    container.appendChild(card);
  });

  document.getElementById("finishBtn").addEventListener("click", checkAll);
});

// ----------------------
// فحص إجابة فردية
// ----------------------
function checkAnswer(q, card) {
  const resultDiv = card.querySelector("div.mt-2");
  let isCorrect = false;

  if (q.type === "mcq") {
    const selected = card.querySelector(`input[name="q${q.id}"]:checked`);
    if (!selected) {
      resultDiv.textContent = "❗ الرجاء اختيار إجابة.";
      resultDiv.className = "mt-2 text-red-600 font-semibold";
      return;
    }
    isCorrect = normalize(selected.value) === normalize(q.correct);
  } else if (q.type === "fill") {
    const input = card.querySelector(`#fill_${q.id}`);
    isCorrect = normalize(input.value) === normalize(q.answer);
  }

  if (isCorrect) {
    resultDiv.textContent = "✅ إجابة صحيحة";
    resultDiv.className = "mt-2 text-green-600 font-semibold";
    card.classList.remove("border-red-500");
    card.classList.add("border-green-500");
  } else {
    resultDiv.textContent = "❌ إجابة خاطئة";
    resultDiv.className = "mt-2 text-red-600 font-semibold";
    card.classList.remove("border-green-500");
    card.classList.add("border-red-500");
  }

  return isCorrect;
}

// ----------------------
// فحص كل الإجابات
// ----------------------
function checkAll() {
  let allCorrect = true;
  document.querySelectorAll("#questionsContainer > div").forEach((card, i) => {
    const q = questions[i];
    const correct = checkAnswer(q, card);
    if (!correct) allCorrect = false;
  });

  if (allCorrect) {
    // تحديد أن الاختبار اكتمل بنجاح
    localStorage.setItem("examCompleted", "true");
    window.location.href = "certificate.html";
  } else {
    alert("❌ هناك إجابات خاطئة، تم تمييزها باللون الأحمر!");
  }
}


// ----------------------
// إزالة الفراغات لتدقيق النصي
// ----------------------
function normalize(text) {
  return text.toString().replace(/\s+/g, '').trim();
}

