// ============================================================
// اختبارات مادة الرياضيات - الصف السادس العلمي
// منصة طالب - courseId: 11
// ============================================================

window.quizzes_course11 = {

    // ============================================
    // الدرس 1: التكامل
    // ============================================

    "11_1": {
        lessonId: 1,
        courseId: 11,
        type: "multiple-choice",
        question: "ما ناتج التكامل: ∫ x³ dx ؟",
        options: [
            "3x² + C",
            "x⁴/4 + C",
            "x⁴ + C",
            "4x³ + C"
        ],
        correctAnswer: 1,
        explanation: "نطبق قاعدة القوة: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C. إذن ∫ x³ dx = x⁴/4 + C."
    },

    "11_1_b": {
        lessonId: 1,
        courseId: 11,
        type: "fill-blank",
        question: "ما ناتج: ∫ 5 dx ؟ (اكتب النتيجة بدون C)",
        correctAnswer: "5x",
        explanation: "تكامل الثابت: ∫ k dx = kx + C. إذن ∫ 5 dx = 5x + C."
    },

    "11_1_c": {
        lessonId: 1,
        courseId: 11,
        type: "scenario",
        question: "سيناريو حساب المساحة",
        scenario: "تريد حساب المساحة تحت المنحنى y = x² من x = 0 إلى x = 3. أي صيغة تكامل تستخدم؟",
        options: [
            "∫ x² dx بدون حدود",
            "∫₀³ x² dx",
            "d/dx (x²)",
            "∫ x² + 3 dx"
        ],
        correctAnswer: 1,
        explanation: "لحساب المساحة بين قيمتين، نستخدم التكامل المحدد: ∫ₐᵇ f(x) dx. إذن الإجابة ∫₀³ x² dx."
    },

    // ============================================
    // الدرس 2: التفاضل
    // ============================================

    "11_2": {
        lessonId: 2,
        courseId: 11,
        type: "multiple-choice",
        question: "ما مشتقة الدالة f(x) = 4x⁵ ؟",
        options: [
            "20x⁴",
            "5x⁴",
            "4x⁴",
            "20x⁵"
        ],
        correctAnswer: 0,
        explanation: "نطبق قاعدة القوة: d/dx(xⁿ) = n·xⁿ⁻¹. إذن مشتقة 4x⁵ = 4 · 5x⁴ = 20x⁴."
    },

    "11_2_b": {
        lessonId: 2,
        courseId: 11,
        type: "fill-blank",
        question: "ما مشتقة sin(x) ؟",
        correctAnswer: "cos",
        explanation: "d/dx(sin x) = cos x. هذه من المشتقات الأساسية المهمة."
    },

    "11_2_c": {
        lessonId: 2,
        courseId: 11,
        type: "scenario",
        question: "سيناريو السرعة والتسارع",
        scenario: "إذا كانت دالة الموقع s(t) = t³ + 2t، فماذا تمثل المشتقة الأولى s'(t)؟",
        options: [
            "الموقع",
            "السرعة",
            "التسارع",
            "المسافة"
        ],
        correctAnswer: 1,
        explanation: "المشتقة الأولى لدالة الموقع تمثل السرعة، والمشتقة الثانية تمثل التسارع."
    },

    // ============================================
    // الدرس 3: الهندسة
    // ============================================

    "11_3": {
        lessonId: 3,
        courseId: 11,
        type: "multiple-choice",
        question: "ما قانون المسافة بين نقطتين A(x₁,y₁) و B(x₂,y₂)؟",
        options: [
            "d = (x₂-x₁) + (y₂-y₁)",
            "d = √[(x₂-x₁)² + (y₂-y₁)²]",
            "d = |x₂ - x₁| فقط",
            "d = (x₂-x₁)² + (y₂-y₁)²"
        ],
        correctAnswer: 1,
        explanation: "قانون المسافة بين نقطتين هو: d = √[(x₂-x₁)² + (y₂-y₁)²]، وهو تطبيق مباشر لنظرية فيثاغورس."
    },

    "11_3_b": {
        lessonId: 3,
        courseId: 11,
        type: "fill-blank",
        question: "معادلة الدائرة التي مركزها (0, 0) ونصف قطرها r هي: x² + y² = ______",
        correctAnswer: "r²",
        explanation: "الصيغة القياسية للدائرة: (x-h)² + (y-k)² = r². عندما يكون المركز (0,0)، تصبح: x² + y² = r²."
    },

    "11_3_c": {
        lessonId: 3,
        courseId: 11,
        type: "scenario",
        question: "سيناريو ميل الخط",
        scenario: "خط يمر بالنقطتين A(1, 2) و B(4, 8). ما ميله؟",
        options: [
            "m = 1",
            "m = 2",
            "m = 3",
            "m = 6"
        ],
        correctAnswer: 1,
        explanation: "m = (y₂-y₁)/(x₂-x₁) = (8-2)/(4-1) = 6/3 = 2."
    },

    // ============================================
    // الدرس 4: الأعداد المركبة
    // ============================================

    "11_4": {
        lessonId: 4,
        courseId: 11,
        type: "multiple-choice",
        question: "ما قيمة i² ؟",
        options: [
            "1",
            "-1",
            "i",
            "0"
        ],
        correctAnswer: 1,
        explanation: "الوحدة التخيلية i تُعرَّف بأن i² = -1. هذا هو أساس الأعداد المركبة."
    },

    "11_4_b": {
        lessonId: 4,
        courseId: 11,
        type: "fill-blank",
        question: "ما مرافق العدد المركب z = 3 + 5i ؟",
        correctAnswer: "3 - 5i",
        explanation: "المرافق z̄ للعدد a+bi هو a-bi. إذن مرافق 3+5i هو 3-5i."
    },

    "11_4_c": {
        lessonId: 4,
        courseId: 11,
        type: "scenario",
        question: "سيناريو حساب",
        scenario: "أوجد ناتج: (2 + 3i) + (4 - i)",
        options: [
            "6 + 2i",
            "6 + 4i",
            "8 + 2i",
            "2 + 2i"
        ],
        correctAnswer: 0,
        explanation: "نجمع الأجزاء الحقيقية والتخيلية: (2+4) + (3i - i) = 6 + 2i."
    },

    // ============================================
    // الدرس 5: القطع الناقص والزائد
    // ============================================

    "11_5": {
        lessonId: 5,
        courseId: 11,
        type: "multiple-choice",
        question: "في القطع الناقص، العلاقة بين a و b و c هي:",
        options: [
            "c² = a² + b²",
            "c² = a² - b²",
            "c² = b² - a²",
            "c = a + b"
        ],
        correctAnswer: 1,
        explanation: "في القطع الناقص: c² = a² - b² (حيث a > b). أما في القطع الزائد: c² = a² + b²."
    },

    "11_5_b": {
        lessonId: 5,
        courseId: 11,
        type: "fill-blank",
        question: "في القطع الزائد x²/a² - y²/b² = 1، معادلة خطوط التقارب هي y = ±(_____)x",
        correctAnswer: "b/a",
        explanation: "خطوط التقارب للقطع الزائد الأفقي هي y = ±(b/a)·x."
    },

    "11_5_c": {
        lessonId: 5,
        courseId: 11,
        type: "scenario",
        question: "سيناريو تحليل معادلة",
        scenario: "معادلة x²/16 + y²/9 = 1. أي نوع من القطوع المخروطية هي؟",
        options: [
            "قطع زائد",
            "قطع مكافئ",
            "قطع ناقص",
            "دائرة"
        ],
        correctAnswer: 2,
        explanation: "العلامة بين الحدين موجبة (+)، مما يعني أنها قطع ناقص. في القطع الزائد تكون العلامة سالبة (-)."
    }

};