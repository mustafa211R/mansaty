// 🧠 ملف الأسئلة والمنطق البرمجي
const questions = [

  {
    id: 1,
    type: "mcq",
    question: "منصة الحاسوب هي:",
    options: [
      "تطبيق لتشغيل الألعاب",
      "بيئة تحتوي على مكونات مادية وبرمجية لتشغيل البرامج",
      "وحدة من وحدات الإدخال",
      "نوع من أنواع الذاكرة"
    ],
    correct: "بيئة تحتوي على مكونات مادية وبرمجية لتشغيل البرامج"
  },
  {
    id: 2,
    type: "mcq",
    question: "من أمثلة المنصات المادية:",
    options: ["Windows", "Facebook", "الكيبورد", "Instagram"],
    correct: "الكيبورد"
  },
  {
    id: 3,
    type: "mcq",
    question: "المنصات البرمجية تشمل:",
    options: ["الأجهزة فقط", "نظم التشغيل", "المنافذ", "الذاكرة"],
    correct: "نظم التشغيل"
  },
  {
    id: 4,
    type: "mcq",
    question: "اللوحة الأم هي:",
    options: [
      "برنامج إداري",
      "لوحة إلكترونية تربط أجزاء الحاسوب",
      "ذاكرة مؤقتة",
      "منفذ إدخال"
    ],
    correct: "لوحة إلكترونية تربط أجزاء الحاسوب"
  },
  {
    id: 5,
    type: "mcq",
    question: "من أنواع منافذ الإدخال والإخراج:",
    options: ["CPU", "ALU", "USB", "RAM"],
    correct: "USB"
  },
  {
    id: 6,
    type: "mcq",
    question: "المنفذ الذي يستخدم لوحدات الإدخال الصورة :",
    options: ["USB", "HDMI", "PS/2", "Ethernet"],
    correct: "HDMI"
  },
  {
    id: 7,
    type: "mcq",
    question: "المنفذ المستخدم لنقل الشبكة هو:",
    options: ["VGA", "Audio Port", "Ethernet", "USB"],
    correct: "Ethernet"
  },
  {
    id: 8,
    type: "mcq",
    question: "الأجهزة الطرفية هي:",
    options: [
      "أجزاء برمجية",
      "أجهزة داخل اللوحة الأم",
      "أجهزة مادية خارج النظام",
      "وحدات من المعالج"
    ],
    correct: "أجهزة مادية خارج النظام"
  },
  {
    id: 9,
    type: "mcq",
    question: "المعالج الدقيق هو:",
    options: [
      "وحدة تخزين",
      "دائرة إلكترونية تعالج البيانات",
      "نوع من المنصات",
      "وحدة إدخال"
    ],
    correct: "دائرة إلكترونية تعالج البيانات"
  },
  {
    id: 10,
    type: "mcq",
    question: "وحدة ALU وظيفتها:",
    options: [
      "التحكم في البيانات",
      "تنفيذ العمليات الحسابية والمنطقية",
      "تخزين البيانات",
      "نقل البيانات"
    ],
    correct: "تنفيذ العمليات الحسابية والمنطقية"
  },
  {
    id: 11,
    type: "mcq",
    question: "وحدة التحكم (Control Unit) مسؤولة عن:",
    options: [
      "تنفيذ العمليات الحسابية",
      "إدارة عمل الحاسوب",
      "تخزين الملفات",
      "قراءة البيانات فقط"
    ],
    correct: "إدارة عمل الحاسوب"
  },
  {
    id: 12,
    type: "mcq",
    question: "وحدة إدارة الذاكرة (MMU) تقوم بـ:",
    options: [
      "زيادة سرعة الحاسوب",
      "إدارة حركة البيانات بين الذاكرة والمعالج",
      "إجراء العمليات الحسابية",
      "حفظ البيانات فقط"
    ],
    correct: "إدارة حركة البيانات بين الذاكرة والمعالج"
  },
  {
    id: 13,
    type: "mcq",
    question: "من شركات إنتاج المعالجات:",
    options: [
      "Samsung و Dell",
      "Intel و AMD",
      "Microsoft و HP",
      "Apple و Lenovo"
    ],
    correct: "Intel و AMD"
  },
  {
    id: 14,
    type: "mcq",
    question: "يقاس أداء المعالج بـ:",
    options: [
      "لون اللوحة الأم",
      "سرعة المعالجة وعدد الأنوية",
      "سعة التخزين",
      "نوع الذاكرة"
    ],
    correct: "سرعة المعالجة وعدد الأنوية"
  },
  {
    id: 15,
    type: "mcq",
    question: "الذاكرة التي تُفقد بياناتها عند انطفاء الجهاز هي:",
    options: ["ROM", "SSD", "RAM", "HDD"],
    correct: "RAM"
  },
  {
    id: 16,
    type: "mcq",
    question: "ROM هي اختصار لـ:",
    options: [
      "Random Online Memory",
      "Read Only Memory",
      "Run On Memory",
      "Ready Operation Module"
    ],
    correct: "Read Only Memory"
  },
  {
    id: 17,
    type: "mcq",
    question: "من وحدات التخزين الدائمية:",
    options: [
      "الذاكرة العشوائية",
      "القرص الصلب",
      "ذاكرة الكاش",
      "وحدة التحكم"
    ],
    correct: "القرص الصلب"
  },
  {
    id: 18,
    type: "mcq",
    question: "من مميزات SSD:",
    options: [
      "بطيء ورخيص",
      "سريع ومكلف",
      "يستخدم أقراص معدنية",
      "لا يمكن حمله"
    ],
    correct: "سريع ومكلف"
  },
  {
    id: 19,
    type: "mcq",
    question: "الحاسوب المركزي يُستخدم في:",
    options: ["المنزل", "المدارس فقط", "المؤسسات الكبيرة", "الألعاب"],
    correct: "المؤسسات الكبيرة"
  },
  {
    id: 20,
    type: "mcq",
    question: "اللوح الإلكتروني (Tablet) يمتاز بـ:",
    options: [
      "عدم قابلية اللمس",
      "شاشة لمس وحجم صغير",
      "وحدة معالجة مركزية ضخمة",
      "لا يمكن نقله"
    ],
    correct: "شاشة لمس وحجم صغير"
  },

  // ✏️ ثانياً: أسئلة الإكمال (10 أسئلة)
  {
    id: 21,
    type: "fill",
    question: "منصة الحاسوب تتكون من مكونات ________ و________.",
    answer: "مادية وبرمجية"
  },
  {
    id: 22,
    type: "fill",
    question: "اللوحة الأم تربط بين ________ المختلفة في الحاسوب.",
    answer: "المكونات"
  },
  {
    id: 23,
    type: "fill",
    question: "المنفذ المستخدم لشبكة الإنترنت السلكية هو ________.",
    answer: "Ethernet"
  },
  {
    id: 24,
    type: "fill",
    question: "وحدة الحساب والمنطق تختصر بـ ________.",
    answer: "ALU"
  },
  {
    id: 25,
    type: "fill",
    question: "الشركة التي تصنع معالجات Core i7 هي ________.",
    answer: "Intel"
  },
  {
    id: 26,
    type: "fill",
    question: "الذاكرة التي تحتفظ بالبيانات بعد إيقاف التشغيل هي ________.",
    answer: "ROM"
  },
  {
    id: 27,
    type: "fill",
    question: "وحدة قياس سعة التخزين هي ________.",
    answer: "بايت أو غيغابايت"
  },
  {
    id: 28,
    type: "fill",
    question: "القرص المدمج DVD يمكن أن يخزن حتى ________ غيغابايت من البيانات.",
    answer: "7"
  },
  {
    id: 29,
    type: "fill",
    question: "الحاسوب المحمول يمتاز بـ ________ و________.",
    answer: "صغر الحجم وسهولة النقل"
  },
  {
    id: 30,
    type: "fill",
    question: "الحاسوب اللوحي يتفاعل مع المستخدم من خلال ________.",
    answer: "شاشة اللمس"
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

