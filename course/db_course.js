// db_course.js - معلومات الكورسات الرئيسية ومسارات الملفات
window.coursesDB = {
    // مصفوفة الكورسات مع إضافة مسارات الملفات
    courses: [


{
    id: 1,
    subject: "حاسوب", grade: "الرابع الإعدادي", topics: [{"title": "مدخل إلى صيانة الحاسوب وأنواعها", "items": []}, {"title": "الصيانة الوقائية لوحدات الإدخال (المفتاح، الفأرة، الماسح)", "items": []}, {"title": "الصيانة الوقائية لسواقة الأقراص المدمجة (CD Drive)", "items": []}, {"title": "الصيانة الوقائية للوحة الأم (Motherboard)", "items": []}, {"title": "الصيانة الوقائية لمراوح التبريد (Cooling Fans)", "items": []}, {"title": "الصيانة الوقائية لوحدات الإخراج والحاسوب المحمول", "items": []}, {"title": "الصيانة التصحيحية لوحدات الإدخال (معالجة الأعطال)", "items": []}, {"title": "الصيانة التصحيحية لسواقة الأقراص المدمجة (CD Drive)", "items": []}, {"title": "الصيانة التصحيحية للوحة الأم والمعالج (CPU)", "items": []}, {"title": "الصيانة التصحيحية لوحدات الإخراج (الشاشة والطابعة)", "items": []}],
    title:  "الحاسوب - الصف الرابع الإعدادي - ا.مصطفى رحيم",
    description: "كورس شامل في مادة الحاسوب للصف الرابع الإعدادي - الوحدة الأولى: صيانة الحاسوب (الوقائية والتصحيحية) لجميع المكونات المادية",
    category: "حاسوب",
    difficulty: "beginner",
    creaters: "الأستاذ مصطفى رحيم فندي",
    completionTime: "10-15 ساعة",
    image: "images/1.jfif",
    totalLessons: 10,
    totalQuestions: 10,
    enrolled: 0,
    rating: 0,

    learn: [
        "مفهوم صيانة الحاسوب وأنواعها (الوقائية، التصحيحية، التكيفية)",
        "الصيانة الوقائية والتصحيحية للمكونات المادية للحاسوب (لوحة المفاتيح، الفأرة، اللوحة الأم، المعالج)",
        "الصيانة الوقائية والتصحيحية لبرمجيات الحاسوب وتحديث نظام Windows",
        "إدارة القرص الصلب وتجزئته (Partitioning) وتهيئته ونظامي الملفات (FAT32 و NTFS)",
        "إنشاء العروض التقديمية وتصميم الشرائح باستخدام برنامج MS PowerPoint",
        "إضافة النصوص، الصور، الجداول، المخططات البيانية، والأشكال الذكية SmartArt",
        "تطبيق الانتقالات (Transitions) بين الشرائح والحركات (Animations) الكائنية",
        "تصميم المنشورات، البطاقات، والملصقات الإعلانية باستخدام برنامج MS Publisher",
        "مفهوم خوارزميات التكرار وحلقات التكرار (Looping) وأهميتها في البرمجة",
        "تطبيق التكرار عملياً باستخدام اللبنات البرمجية في لغة Scratch",
        "طريقة تصميم وتطوير مواقع الويب بلغة HTML وشوم الأساسيات",
        "مفهوم أمن المعلومات، التهديدات الإلكترونية، وطرق الحماية والتشفير",
        "فهم المصطلحات التقنية والإنجليزية الخاصة بالحاسوب والصيانة",
        "الاستعداد الكامل للامتحانات الوزارية والمدرسية بثقة"
    ],

    about: "كورس تعليمي شامل ومبسط في مادة الحاسوب للصف الرابع الإعدادي وفق المنهاج العراقي، يغطي وحدات الكتاب الأربع كاملة: (صيانة الحاسوب المادية والبرمجية، برمجيات العروض التقديمية والنشر المكتبي MS PowerPoint & MS Publisher، تراكيب التحكم التكرارية ولغة Scratch، ومواقع الويب HTML وأمن المعلومات). يشرح الكورس المفاهيم بأسلوب سهل وقريب لأذهان الطلاب، مع أمثلة عملية، خطوات تطبيقية، ومصطلحات إنجليزية أساسية.",
    lessonsPath: "Lessons/course1.js",
    quizzesPath: "quizzes/course1.js"
},


{
    id: 2,
    subject: "حاسوب", grade: "الخامس الإعدادي", topics: [{"title": "ما هو الجهاز الذكي؟ (مفهوم الأجهزة الذكية)", "items": []}, {"title": "الذكاء الاصطناعي في حياتنا اليومية", "items": []}, {"title": "التفاعل وشاشات اللمس (خاصية التفاعل)", "items": []}, {"title": "كيف تتصل الأجهزة ببعضها؟ (قابلية الارتباط)", "items": []}, {"title": "تحول الأجهزة التقليدية إلى ذكية (تعدد الوظائف)", "items": []}, {"title": "قدرة المعالجة الخارقة (الاستقلالية في إدارة المهام)", "items": []}, {"title": "حماية الخصوصية وتأمين البيانات", "items": []}, {"title": "الوصول الفوري للمعلومات تزامناً مع الجميع", "items": []}, {"title": "التطبيقات الذكية وتسهيل الحياة (المهام الإضافية)", "items": []}, {"title": "كيف تميز بين الجهاز العادي والجهاز الذكي؟ (مراجعة وتقييم)", "items": []}],
    title: " حاسوب - الصف الخامس الإعدادي - أ.مصطفى رحيم",
    description: "كورس شامل في مادة الحاسوب للصف الخامس الإعدادي - الوحدة الأولى: الأجهزة الذكية Smart Devices ومفاهيمها الأساسية",
    category: "حاسوب",
    difficulty: "beginner",
    creaters: "الأستاذ مصطفى رحيم فندي",
    completionTime: "10-15 ساعة",
    image: "images/2.jfif",
    totalLessons: 10,
    totalQuestions: 10,
    enrolled: 0,
    rating: 0,
    learn: [

    // الوحدة الأولى: الأجهزة الذكية (Smart Devices)
    "مفهوم الأجهزة الذكية والخصائص الأساسية (التفاعل، الارتباط، تعدد الوظائف، الاستقلالية)",
    "فوائد الأجهزة الذكية (تأمين البيانات والخصوصية، الحصول على المعلومات، إنجاز المهام الإضافية)",
    "أنظمة تشغيل الأجهزة الذكية (iOS، Android، BlackBerry OS) ومفهومها ومهامها الأساسية",
    "مقارنة شاملة بين نظامي التشغيل iOS و Android من حيث المميزات والعيوب وسعة السحابة المجانية",
    "أنواع تطبيقات الهواتف الذكية (التطبيق الأصلي Native App، تطبيق الويب Web App، التطبيق الهجين Hybrid App)",
    "متاجر التطبيقات الإلكترونية (Apple Store و Google Play) ومجالات استخدام التطبيقات (تواصل، طبية، علمية)",
    "مفهوم إنترنت الأشياء (IoT) والطرفية (Node) وعنوان الإنترنت (IP Address)",
    "تطبيقات وحلول إنترنت الأشياء في مجالات الصحة، الأمن، العسكرية، البيئة وإدارة المدن، والحكومة الإلكترونية",
    "معايير اختيار الحاسوب أو الهاتف الذكي والمقارنة بينهما (نظام التشغيل، وحدات الإدخال، المعالج، الذاكرة، الحجم، الوزن، الشاشة، البطارية)",

    // الوحدة الثانية: برمجيات الحاسوب - برنامج الجداول الإلكترونية (Microsoft Excel)
    "مفهوم برنامج MS Excel ومميزاته وطرائق تشغيله وإغلاقه وإنشاء ورقة عمل فارغة أو من قالب جاهز",
    "مكونات الواجهة الرئيسة لبرنامج Excel (شريط العنوان، التبويبات، الصيغة، منطقة العمل، أشرطة العناوين، أشرطة أوراق العمل، شريط الحالة)",
    "أوامر قائمة ملف (File Menu) وتتضمن: معلومات (Info)، جديد (New)، فتح (Open)، حفظ (Save)، حفظ باسم (Save As)، طباعة (Print)، إغلاق (Close)",
    "صيغ وأنواع حفظ أوراق العمل في Excel (xlsx.*، xls.*، pdf.*)",
    "تنسيق البيانات في تبويب الصفحة الرئيسة (Home) باستخدام مجموعات: الحافظة (Clipboard)، خط (Font)، محاذاة (Alignment)",
    "أنواع البيانات في Excel (عام General، رقم Number، عملة Currency، حسابات Accounting، تاريخ Date، وقت Time، نسبة مئوية Percentage، نص Text)",
    "تنسيق الخلايا (التنسيق الشرطي Conditional Formatting، التنسيق كجدول Format As Table، أنماط الخلايا Cell Styles)",
    "إدارة الخلايا والأعمدة والصفوف (إدراج Insert، حذف Delete، تعديل الارتفاع والعرض، إخفاء وإظهار Hide/Unhide)",
    "تحرير الخلايا (مسح Clear بأواكره المتعددة، الفرز والتصفية Sort & Filter، البحث والاستبدال Find & Replace)",
    "إدراج الكائنات (Insert Objects) وتشمل: الصور (Pictures)، الأشكال (Shapes)، الأشكال الذكية (SmartArt)، المخططات البيانية (Charts)",
    "تخطيط الصفحة (Page Layout) وإعداداتها (الهوامش Margins، الاتجاه Orientation، الحجم Size، ناحية الطباعة Print Area، خيارات ورقة العمل Sheet Options)",
    "الاستعداد الكامل والجاهزية للامتحانات المدرسية والوزارية بثقة"
],
   
about: "كورس تعليمي مبسّط وشامل لمادة الحاسوب للصف الخامس الإعدادي، يغطي المنهج بالكامل (الوحدة الأولى: الأجهزة الذكية Smart Devices، والوحدة الثانية: برنامج الجداول الإلكترونية MS Excel). يشرح الكورس المفاهيم الأساسية، أنظمة التشغيل، وتطبيقات إنترنت الأشياء، بالإضافة إلى الشرح العلمي والعملي لبرنامج Excel بأسلوب سهل وقريب لأذهان الطلاب، معززاً بالأمثلة والتمارين والمصطلحات الإنجليزية المهمة."    
,lessonsPath: "Lessons/course2.js",
    quizzesPath: "quizzes/course2.js"
},



        
       
{
    id: 10,
    subject: "أحياء", grade: "السادس العلمي", topics: [{"title": "الخلية - الوحدة الأساسية للحياة", "items": []}, {"title": "الانقسام الخلوي - الميتوزي والمايوزي", "items": []}, {"title": "الوراثة - قوانين مندل", "items": []}, {"title": "الجهاز الدوري - القلب والدورة الدموية", "items": []}, {"title": "المناعة - جهاز المناعة والأمراض", "items": []}],
    title: "الاحياء - الصف السادس علمي - زيد مسافر",
    description: "دورة شاملة في مادة الأحياء للصف السادس العلمي، تغطي الخلية والانقسام الخلوي والوراثة والجهاز الدوري والمناعة وفق المنهج العراقي",
    category: "أحياء",
    difficulty: "intermediate",
    creaters: "الأستاذ مصطفى رحيم",
    completionTime: "20-25 ساعة",
    image: "images/10.jpg",
    totalLessons: 5,
    totalQuestions: 15,
    enrolled: 0,
    rating: 0,
    learn: [
        "الخلية: تركيبها، عضياتها، ومقارنة بين الخلية النباتية والحيوانية",
        "الانقسام الخلوي: الميتوزي والمايوزي وأطوارهما",
        "الوراثة: قوانين مندل، مربع بانيت، والطرز الجينية",
        "الجهاز الدوري: القلب، الأوعية الدموية، ومكونات الدم",
        "المناعة: خطوط الدفاع، المناعة الخلطية والخلوية، والتطعيمات",
        "حل أسئلة وزارية وتحضير للامتحان الوزاري",
        "ربط المفاهيم النظرية بأمثلة عملية وحيوية",
        "فهم شامل لأسئلة الاختبارات التنافسية"
    ],
    about: "دورة تعليمية شاملة في مادة الأحياء مخصصة لطلاب الصف السادس العلمي في العراق. تغطي الدورة المنهج الدراسي بأسلوب مبسّط ومنظم، مع تركيز على النقاط المهمة في الامتحان الوزاري. تتضمن الدورة شرحاً وافياً للمفاهيم الأساسية، مع اختبارات تفاعلية بعد كل درس لقياس مستوى الفهم.",
    lessonsPath: "Lessons/course10.js",
    quizzesPath: "quizzes/course10.js"
},

{
    id: 11,
    subject: "رياضيات", grade: "السادس العلمي", topics: [{"title": "التكامل - الأساسيات والقواعد", "items": []}, {"title": "التفاضل - المشتقات وقواعدها", "items": []}, {"title": "الهندسة والتحليل الهندسي", "items": []}, {"title": "الأعداد المركبة - العمليات والتطبيقات", "items": []}, {"title": "القطع الناقص والقطع الزائد", "items": []}],
    title: "الرياضيات - الصف السادس العلمي- عباس الزيدي",
    description: "دورة شاملة في مادة الرياضيات للصف السادس العلمي، تغطي التكامل والتفاضل والهندسة التحليلية والأعداد المركبة والقطوع المخروطية وفق المنهج العراقي",
    category: "رياضيات",
    difficulty: "advanced",
    creaters: "الأستاذ مصطفى رحيم",
    completionTime: "25-30 ساعة",
    image: "images/11.jpg",
    totalLessons: 5,
    totalQuestions: 15,
    enrolled: 0,
    rating: 0,
    learn: [
        "التكامل: قواعده الأساسية، التكامل المحدد وغير المحدد، وتطبيقاته",
        "التفاضل: المشتقات، قواعد الاشتقاق، وقاعدة السلسلة",
        "الهندسة التحليلية: الإحداثيات، المسافة، الميل، ومعادلة الدائرة",
        "الأعداد المركبة: العمليات، المرافق، المقياس، وقوى i",
        "القطع الناقص والقطع الزائد: معادلاتهما وعناصرهما",
        "حل مسائل وزارية وأسئلة امتحانية شاملة",
        "الربط بين المفاهيم الرياضية وحل المشكلات",
        "إتقان الرموز والصيغ الرياضية الأساسية"
    ],
    about: "دورة تعليمية شاملة في مادة الرياضيات للصف السادس العلمي. تغطي الدورة المنهج الوزاري بأسلوب مبسّط ومنظم، مع عرض رياضي واضح للمعادلات والرموز. تتضمن شرحاً وافياً للمفاهيم الأساسية، أمثلة محلولة خطوة بخطوة، واختبارات تفاعلية بعد كل درس.",
    lessonsPath: "Lessons/course11.js",
    quizzesPath: "quizzes/course11.js"
},

// ===== كورسات الحاسوب – الثاني المتوسط (كورس لكل فصل) =====
{
  "id": 12,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 1 / الفصل 1: أهمية منصة الحاسوب",
  "description": "ما منصة الحاسوب؟ اللوحة الأم، المنافذ، الأجهزة الطرفية، والمعالج الدقيق وكيف تقرأ اسمه وتقارن أداءه.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "4-6 ساعات",
  "image": "images/c12.svg",
  "totalLessons": 4,
  "totalQuestions": 32,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 1,
  "unitTitle": "منصة الحاسوب",
  "chapterNo": 1,
  "chapterTitle": "أهمية منصة الحاسوب",
  "pages": "ص 6–18",
  "learn": [
    "أعرّف منصة الحاسوب وأذكر أنواعها",
    "أبيّن دور اللوحة الأم",
    "أميّز المنفذ المتوازي من المتسلسل",
    "أعدّد أنواع المنافذ وأذكر وظيفة كل منها",
    "أفرّق بين HDMI و VGA",
    "أعرّف الجهاز الطرفي وأعطي أمثلة",
    "أعرّف المعالج الدقيق ووحدة المعالجة المركزية",
    "أعدّد مكوناته الأربعة وأشرح وظيفة كل منها",
    "أذكر أشهر شركات المعالجات وفئات Intel",
    "أقرأ اسم المعالج وأفسّر أجزاءه",
    "أفهم لماذا تتعدد الأنوية"
  ],
  "about": "كورس مبسّط يغطي الفصل 1 من الوحدة 1 (منصة الحاسوب) في كتاب الحاسوب للصف الثاني المتوسط (ص 6–18): أهمية منصة الحاسوب. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "منصة الحاسوب واللوحة الأم",
      "items": [
        "منصة الحاسوب",
        "اللوحة الأم",
        "واجهة المنافذ",
        "المنفذ المتوازي",
        "المنفذ المتسلسل"
      ]
    },
    {
      "title": "منافذ الإدخال والإخراج والأجهزة الطرفية",
      "items": [
        "USB",
        "PS/2",
        "VGA / HDMI",
        "منفذ الصوت",
        "منفذ Ethernet",
        "الجهاز الطرفي"
      ]
    },
    {
      "title": "المعالج الدقيق ومكوناته",
      "items": [
        "المعالج الدقيق",
        "وحدة المعالجة المركزية",
        "وحدة الحساب والمنطق",
        "المسجلات",
        "وحدة التحكم",
        "وحدة إدارة الذاكرة"
      ]
    },
    {
      "title": "أجيال المعالج وكيف يُقاس أداؤه",
      "items": [
        "الأنوية",
        "الجيل",
        "Intel / AMD"
      ]
    }
  ],
  "lessonsPath": "Lessons/course12.js",
  "quizzesPath": "quizzes/course12.js"
},
{
  "id": 13,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 1 / الفصل 2: الذاكرة ووحدات التخزين",
  "description": "أنواع الذاكرة RAM و ROM و Cache، وحدات الخزن HDD و SSD و CD و Flash، وأنواع الحواسيب ومقارنتها.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c13.svg",
  "totalLessons": 3,
  "totalQuestions": 24,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 1,
  "unitTitle": "منصة الحاسوب",
  "chapterNo": 2,
  "chapterTitle": "الذاكرة ووحدات التخزين في الحواسيب",
  "pages": "ص 19–29",
  "learn": [
    "أعرّف الذاكرة وأشرح وظيفتها",
    "أميّز RAM من ROM",
    "أفرّق بين الذاكرة الرئيسة وذاكرة Cache",
    "أعدّد أنواع وحدات الخزن",
    "أقارن HDD و SSD",
    "أذكر سعات CD/DVD/Blu-ray",
    "أتعرّف أنواع الحواسيب",
    "أقارن بينها",
    "أوضح استخدام كل نوع"
  ],
  "about": "كورس مبسّط يغطي الفصل 2 من الوحدة 1 (منصة الحاسوب) في كتاب الحاسوب للصف الثاني المتوسط (ص 19–29): الذاكرة ووحدات التخزين في الحواسيب. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "الذاكرة وأنواعها (RAM و ROM)",
      "items": [
        "الذاكرة",
        "ذاكرة الوصول العشوائي",
        "الذاكرة الرئيسة",
        "ذاكرة التخزين المؤقت",
        "ذاكرة القراءة فقط"
      ]
    },
    {
      "title": "وحدات التخزين (HDD, SSD, CD, Flash)",
      "items": [
        "القرص الصلب",
        "SSD",
        "القرص المدمج",
        "DVD",
        "Blu-Ray",
        "الذاكرة المتنقلة"
      ]
    },
    {
      "title": "أنواع الحواسيب",
      "items": [
        "الحاسوب المكتبي",
        "الحاسوب المحمول",
        "الحاسوب المركزي",
        "الحاسوب اللوحي"
      ]
    }
  ],
  "lessonsPath": "Lessons/course13.js",
  "quizzesPath": "quizzes/course13.js"
},
{
  "id": 14,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 2 / الفصل 1: مقدمة عن معالج النصوص Word",
  "description": "تشغيل Word وإغلاقه، مميزاته، مكونات واجهته الستة، وقائمة File وأوامرها وصيغ حفظ المستندات.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c14.svg",
  "totalLessons": 3,
  "totalQuestions": 24,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 2,
  "unitTitle": "برمجيات الحاسوب",
  "chapterNo": 1,
  "chapterTitle": "مقدمة عن برنامج معالج النصوص Microsoft Word",
  "pages": "ص 31–44",
  "learn": [
    "أذكر مميزات Word",
    "أشغّل Word بثلاث طرائق",
    "أغلق المستند أو البرنامج بثلاث طرائق",
    "أعدّد الأجزاء الستة للواجهة",
    "أشرح وظيفة كل جزء",
    "أشرح أوامر File",
    "أفرّق Save من Save As",
    "أذكر صيغ الحفظ"
  ],
  "about": "كورس مبسّط يغطي الفصل 1 من الوحدة 2 (برمجيات الحاسوب) في كتاب الحاسوب للصف الثاني المتوسط (ص 31–44): مقدمة عن برنامج معالج النصوص Microsoft Word. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "فتح برنامج Word وإغلاقه ومميزاته",
      "items": [
        "معالج النصوص",
        "Microsoft Office",
        "OneDrive",
        "Blank Document"
      ]
    },
    {
      "title": "الواجهة الرئيسة لبرنامج Word",
      "items": [
        "شريط العنوان",
        "شريط التبويبات",
        "منطقة الطباعة",
        "شريط الحالة",
        "المسطرة الأفقية",
        "المسطرة العمودية"
      ]
    },
    {
      "title": "قائمة ملف File وأنواع حفظ المستندات",
      "items": [
        "Info",
        "New",
        "Open",
        "Save",
        "Save As",
        "Print"
      ]
    }
  ],
  "lessonsPath": "Lessons/course14.js",
  "quizzesPath": "quizzes/course14.js"
},
{
  "id": 15,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 2 / الفصل 2: تبويبات Word",
  "description": "تبويبات Home وInsert وDesign وLayout: تنسيق النص، الجداول، الصور والأشكال، الرأس والتذييل، العلامة المائية، الهوامش والالتفاف.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "6-8 ساعات",
  "image": "images/c15.svg",
  "totalLessons": 6,
  "totalQuestions": 56,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 2,
  "unitTitle": "برمجيات الحاسوب",
  "chapterNo": 2,
  "chapterTitle": "التبويبات Tabs",
  "pages": "ص 45–75",
  "learn": [
    "أعدّد المجموعات الخمس لتبويب Home",
    "أنفّذ القص والنسخ واللصق ونسخ التنسيق",
    "أنسّق الخط والفقرة وأطبق الأنماط",
    "أستخدم البحث والاستبدال والتحديد",
    "أدرج جدولًا",
    "أدرج صورة وأشكالًا وSmartArt",
    "أعرف التبويبات الجديدة التي تظهر",
    "أستخدم Header وFooter",
    "أدرج أرقام الصفحات وأنسقها",
    "أدرج صندوق نص ومعادلة ورموزًا",
    "أدرج علامة مائية جاهزة ومخصصة",
    "أغيّر لون الصفحة",
    "أدرج إطارًا للصفحات",
    "أضبط الهوامش والاتجاه والحجم",
    "أقسّم الصفحة إلى أعمدة وأرقّم الأسطر",
    "أتحكم بالمسافة البادئة والتباعد",
    "أحدد موقع الصورة والتفاف النص",
    "أقدّم وأؤخّر الكائنات وأحاذيها",
    "أجمّع الكائنات وأدوّرها"
  ],
  "about": "كورس مبسّط يغطي الفصل 2 من الوحدة 2 (برمجيات الحاسوب) في كتاب الحاسوب للصف الثاني المتوسط (ص 45–75): التبويبات Tabs. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "تبويب الصفحة الرئيسة Home",
      "items": [
        "الحافظة",
        "الخط",
        "الفقرة",
        "الأنماط",
        "التحرير"
      ]
    },
    {
      "title": "تبويب Insert (1): الجداول والصور والأشكال",
      "items": [
        "Insert Table",
        "Table Design / Layout",
        "Picture",
        "Shapes",
        "SmartArt"
      ]
    },
    {
      "title": "تبويب Insert (2): الرأس والتذييل والنص والرموز",
      "items": [
        "رأس الصفحة",
        "تذييل الصفحة",
        "أرقام الصفحات",
        "صندوق نص حر",
        "معادلة",
        "رمز"
      ]
    },
    {
      "title": "تبويب التصميم Design",
      "items": [
        "تنسيق المستند",
        "العلامة المائية",
        "لون الصفحة",
        "حدود الصفحة"
      ]
    },
    {
      "title": "تبويب Layout (1): إعدادات الصفحة والفقرة",
      "items": [
        "الهوامش",
        "اتجاه الصفحة",
        "حجم الصفحة",
        "الأعمدة",
        "أرقام السطور",
        "المسافة البادئة"
      ]
    },
    {
      "title": "تبويب Layout (2): ترتيب الكائنات Arrange",
      "items": [
        "الموقع",
        "التفاف النص",
        "إحضار للأمام",
        "إرسال للخلف",
        "محاذاة",
        "تجميع"
      ]
    }
  ],
  "lessonsPath": "Lessons/course15.js",
  "quizzesPath": "quizzes/course15.js"
},
{
  "id": 16,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 3 / الفصل 1: جملة الاختيار والعمليات",
  "description": "لماذا نحتاج جمل الاختيار؟ الشرط صحيح/خطأ، العمليات الرياضية والعلائقية، والتعابير والجداول المنطقية AND/OR/XOR/NOT.",
  "category": "حاسوب",
  "difficulty": "intermediate",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c16.svg",
  "totalLessons": 3,
  "totalQuestions": 26,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 3,
  "unitTitle": "تراكيب التحكم الاختيارية",
  "chapterNo": 1,
  "chapterTitle": "جملة الاختيار والعمليات العلائقية والمنطقية",
  "pages": "ص 77–90",
  "learn": [
    "أعرّف جمل الاختيار والشرط",
    "أميّز التراكيب الثلاثة",
    "أكتب خوارزمية بسيطة بشرط",
    "أعدّد العمليات الرياضية والعلائقية",
    "أفرّق = عن ==",
    "أعرّف التعابير المنطقية (البولينية)",
    "أكتب جدول الحقيقة للأدوات AND و OR و XOR و NOT",
    "أحسب نتيجة تعبير منطقي بقيم محددة"
  ],
  "about": "كورس مبسّط يغطي الفصل 1 من الوحدة 3 (تراكيب التحكم الاختيارية) في كتاب الحاسوب للصف الثاني المتوسط (ص 77–90): جملة الاختيار والعمليات العلائقية والمنطقية. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "لماذا نحتاج إلى جمل الاختيار؟",
      "items": [
        "جمل الاختيار",
        "الشرط",
        "if",
        "true / false"
      ]
    },
    {
      "title": "العمليات الرياضية والعلائقية",
      "items": [
        "عمليات رياضية",
        "عمليات علائقية",
        "==",
        "="
      ]
    },
    {
      "title": "التعابير والجداول المنطقية",
      "items": [
        "التعبير المنطقي",
        "AND",
        "OR",
        "XOR",
        "NOT",
        "جدول الحقيقة"
      ]
    }
  ],
  "lessonsPath": "Lessons/course16.js",
  "quizzesPath": "quizzes/course16.js"
},
{
  "id": 17,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 3 / الفصل 2: جمل التحكم الشرطية",
  "description": "if...then و if...then...else والتحكم المتداخل ElseIf وSelect Case مع أمثلة محلولة بلغة Scratch.",
  "category": "حاسوب",
  "difficulty": "intermediate",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c17.svg",
  "totalLessons": 3,
  "totalQuestions": 28,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 3,
  "unitTitle": "تراكيب التحكم الاختيارية",
  "chapterNo": 2,
  "chapterTitle": "جمل التحكم الشرطية",
  "pages": "ص 91–111",
  "learn": [
    "أميّز if...then من if...then...else",
    "أكتب أمثلة",
    "أتعرف إلى If..ElseIf المتداخلة",
    "أتتبّع تنفيذها خطوة بخطوة",
    "أستخدم Select Case للاحتمالات المتعددة",
    "أستخدم لبنتَي if و if/else",
    "أستخدم لبنات المقارنة والمنطق",
    "أكتب خوارزميات الأكبر والمعدل والجنس"
  ],
  "about": "كورس مبسّط يغطي الفصل 2 من الوحدة 3 (تراكيب التحكم الاختيارية) في كتاب الحاسوب للصف الثاني المتوسط (ص 91–111): جمل التحكم الشرطية. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "جملتا if...then و if...then...else",
      "items": [
        "if...then",
        "if...then...else",
        "End if"
      ]
    },
    {
      "title": "جمل التحكم المتداخلة و Select Case",
      "items": [
        "الاختيار المتداخل",
        "ElseIf",
        "Select Case",
        "Case Else"
      ]
    },
    {
      "title": "أمثلة محلولة بلغة Scratch",
      "items": [
        "لبنة إذا",
        "لبنة إذا...وإلا",
        "لبنات العمليات",
        "and",
        "or",
        "not"
      ]
    }
  ],
  "lessonsPath": "Lessons/course17.js",
  "quizzesPath": "quizzes/course17.js"
},
{
  "id": 18,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 4 / الفصل 1: الاتصالات والإنترنت",
  "description": "اتصالات البيانات ومكونات نظام الاتصال، شبكات WiFi و3G، أهمية الإنترنت وطرائق توصيله وخدماته.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c18.svg",
  "totalLessons": 3,
  "totalQuestions": 24,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 4,
  "unitTitle": "الاتصالات والشبكة العنكبوتية",
  "chapterNo": 1,
  "chapterTitle": "الاتصالات والإنترنت",
  "pages": "ص 113–126",
  "learn": [
    "أعرّف اتصالات البيانات",
    "أعدّد مكونات نظام الاتصال الخمسة",
    "أحلل نظام WiFi و3G",
    "أحدد أهمية الإنترنت",
    "أميز طرائق التوصيل",
    "أشرح وظائف الخادم الوكيل",
    "أشرح البريد الإلكتروني وFTP وWWW",
    "أذكر مراحل الوصول لموقع ويب الأربع"
  ],
  "about": "كورس مبسّط يغطي الفصل 1 من الوحدة 4 (الاتصالات والشبكة العنكبوتية) في كتاب الحاسوب للصف الثاني المتوسط (ص 113–126): الاتصالات والإنترنت. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "الاتصالات في حياتنا اليومية",
      "items": [
        "الرسالة",
        "المُرسل",
        "المُستلم",
        "الوسط الناقل",
        "البروتوكول"
      ]
    },
    {
      "title": "الإنترنت وطرائق توصيله",
      "items": [
        "DSL",
        "Modem",
        "ISP",
        "Proxy Server"
      ]
    },
    {
      "title": "خدمات الإنترنت والشبكة العنكبوتية",
      "items": [
        "البريد الإلكتروني",
        "نقل الملفات",
        "الشبكة العنكبوتية",
        "المتصفح"
      ]
    }
  ],
  "lessonsPath": "Lessons/course18.js",
  "quizzesPath": "quizzes/course18.js"
},
{
  "id": 19,
  "title": "الحاسوب - الثاني المتوسط - الوحدة 4 / الفصل 2: البحث عن المعلومات",
  "description": "استخدام محركات البحث وخدماتها، تقييم المصادر بخمسة معايير، حفظ صفحة ويب، وإعداد التقرير المدرسي بـ Word.",
  "category": "حاسوب",
  "difficulty": "beginner",
  "creaters": "الأستاذ مصطفى رحيم فندي",
  "completionTime": "3-5 ساعات",
  "image": "images/c19.svg",
  "totalLessons": 3,
  "totalQuestions": 28,
  "enrolled": 0,
  "rating": 0,
  "subject": "حاسوب",
  "grade": "الثاني المتوسط",
  "unitNo": 4,
  "unitTitle": "الاتصالات والشبكة العنكبوتية",
  "chapterNo": 2,
  "chapterTitle": "البحث عن المعلومات في الشبكة العنكبوتية",
  "pages": "ص 127–144",
  "learn": [
    "أعرّف محرك البحث",
    "أبحث عن نص وصورة وفيديو",
    "أستخدم البحث الصوتي",
    "أذكر المعايير الخمسة لتقييم المصادر",
    "أطبقها على موقع ويب",
    "أحفظ صفحة ويب بثلاث صيغ",
    "أعرّف التقرير والتقرير المدرسي",
    "أفهم هيكلية التقرير",
    "أدرج نصًا وصورة ورابطًا تشعبيًا بـ Word"
  ],
  "about": "كورس مبسّط يغطي الفصل 2 من الوحدة 4 (الاتصالات والشبكة العنكبوتية) في كتاب الحاسوب للصف الثاني المتوسط (ص 127–144): البحث عن المعلومات في الشبكة العنكبوتية. شرح مبسّط بأمثلة وصور ومصطلحات إنكليزية وأسئلة دقيقة بعد كل درس مرتبطة بصفحات الكتاب.",
  "topics": [
    {
      "title": "البحث باستخدام المتصفحات ومحركات البحث",
      "items": [
        "محرك البحث",
        "الكلمة المفتاحية",
        "البحث بالصورة"
      ]
    },
    {
      "title": "تقييم مصادر المعلومات وحفظ صفحة الويب",
      "items": [
        "المسؤولية",
        "الدقة",
        "الموضوعية",
        "المحتوى",
        "الحداثة"
      ]
    },
    {
      "title": "إعداد التقارير المدرسية",
      "items": [
        "التقرير",
        "التقرير المدرسي",
        "المصادر",
        "الارتباط التشعبي"
      ]
    }
  ],
  "lessonsPath": "Lessons/course19.js",
  "quizzesPath": "quizzes/course19.js"
}



],

















































    
    // متغيرات لتخزين البيانات المحملة
    loadedLessons: {},
    loadedQuizzes: {},

    // وظائف مساعدة
    getCourseById: function(courseId) {
        return this.courses.find(course => course.id == courseId);
    },

    // دالة محسنة لتحميل الدروس
    loadLessons: async function(courseId) {
        try {
            const course = this.getCourseById(courseId);
            if (!course || !course.lessonsPath) {
                console.error("Course or lessons path not found:", courseId);
                return [];
            }

            // إذا كانت الدروس محملة مسبقاً، إرجاعها
            if (this.loadedLessons[courseId]) {
                return this.loadedLessons[courseId];
            }

            // تحميل ملف الدروس ديناميكياً
            const response = await fetch(course.lessonsPath);
            if (!response.ok) {
                throw new Error(`Failed to load lessons: ${response.status}`);
            }

            // تنفيذ الملف كمجلد JavaScript
            const scriptContent = await response.text();
            
            // إنشاء عنصر script ديناميكي
            const script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);
            
            // الانتظار قليلاً لضمان تحميل المتغيرات
            await new Promise(resolve => setTimeout(resolve, 100));

            // البحث عن متغير الدروس
            const variableName = `lessons_course${courseId}`;
            if (window[variableName]) {
                this.loadedLessons[courseId] = window[variableName];
                return window[variableName];
            }

            return [];
        } catch (error) {
            console.error("Error loading lessons:", error);
            return [];
        }
    },

    // دالة محسنة لتحميل الاختبارات
    loadQuizzes: async function(courseId) {
        try {
            const course = this.getCourseById(courseId);
            if (!course || !course.quizzesPath) {
                console.error("Course or quizzes path not found:", courseId);
                return {};
            }

            // إذا كانت الاختبارات محملة مسبقاً، إرجاعها
            if (this.loadedQuizzes[courseId]) {
                return this.loadedQuizzes[courseId];
            }

            // تحميل ملف الاختبارات ديناميكياً
            const response = await fetch(course.quizzesPath);
            if (!response.ok) {
                throw new Error(`Failed to load quizzes: ${response.status}`);
            }

            // تنفيذ الملف كمجلد JavaScript
            const scriptContent = await response.text();
            
            // إنشاء عنصر script ديناميكي
            const script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);
            
            // الانتظار قليلاً لضمان تحميل المتغيرات
            await new Promise(resolve => setTimeout(resolve, 100));

            // البحث عن متغير الاختبارات
            const variableName = `quizzes_course${courseId}`;
            if (window[variableName]) {
                this.loadedQuizzes[courseId] = window[variableName];
                return window[variableName];
            }

            return {};
        } catch (error) {
            console.error("Error loading quizzes:", error);
            return {};
        }
    },

    // دالة محسنة للحصول على الدروس (مع التحميل التلقائي)
    getLessonsByCourseId: async function(courseId) {
        return await this.loadLessons(courseId);
    },

    // دالة محسنة للحصول على سؤال (مع التحميل التلقائي)
   // دالة جديدة: الحصول على جميع أسئلة الدرس (بما فيها الأسئلة الفرعية)
getAllQuestionsByLessonId: async function(courseId, lessonId) {
    try {
        // تأكد من أن courseId و lessonId أرقام
        courseId = parseInt(courseId);
        lessonId = parseInt(lessonId);
        
        console.log(`🔍 db_course: البحث عن أسئلة للكورس ${courseId}، الدرس ${lessonId}`);
        
        const quizzes = await this.loadQuizzes(courseId);
        
        if (!quizzes || Object.keys(quizzes).length === 0) {
            console.log(`❌ db_course: لا توجد اختبارات للكورس ${courseId}`);
            return [];
        }
        
        console.log(`📋 db_course: جميع مفاتيح الاختبارات:`, Object.keys(quizzes));
        
        // بناء البادئة بالصيغة الصحيحة: "8_16"
        const prefix = `${courseId}_${lessonId}`;
        console.log(`🔍 db_course: البحث عن مفاتيح تبدأ بـ: "${prefix}"`);
        
        const questions = [];
        
        // البحث عن جميع المفاتيح التي تطابق البادئة بالضبط
        for (const key in quizzes) {
            // تحقق من أن المفتاح يبدأ بالبادئة
            if (key.startsWith(prefix)) {
                console.log(`✅ db_course: تم العثور على مفتاح مطابق: ${key}`);
                
                // نسخ السؤال وإضافة الخاصية id
                const question = JSON.parse(JSON.stringify(quizzes[key])); // نسخ عميق
                question.id = key;
                
                // التأكد من أن السؤال ينتمي لنفس الدرس (تحقق إضافي)
                if (question.lessonId === lessonId || !question.lessonId) {
                    questions.push(question);
                } else {
                    console.log(`⚠️ db_course: المفتاح ${key} يطابق البادئة لكن lessonId مختلف: ${question.lessonId} != ${lessonId}`);
                }
            }
        }
        
        console.log(`📊 db_course: تم العثور على ${questions.length} سؤال للدرس ${lessonId}`);
        
        if (questions.length > 0) {
            console.log(`📝 db_course: الأسئلة التي تم العثور عليها:`, questions.map(q => q.id));
        }
        
        // ترتيب الأسئلة: الأساسي أولاً ثم _a, _b, _c...
        questions.sort((a, b) => {
            const aId = a.id;
            const bId = b.id;
            
            // الأساسي (بدون لاحقة) يأتي أولاً
            if (aId === prefix) return -1;
            if (bId === prefix) return 1;
            
            // ثم ترتيب أبجدي للأسئلة الفرعية
            return aId.localeCompare(bId);
        });
        
        return questions;
        
    } catch (error) {
        console.error("Error getting all questions:", error);
        return [];
    }
},

    // باقي الدوال تبقى كما هي
    getProgress: function(courseId) {
        try {
            const saved = localStorage.getItem(`course_progress_${courseId}`);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Error loading progress:", e);
        }

        return {
            currentLesson: 1,
            completedLessons: [],
            completedQuestions: [],
            examTaken: false
        };
    },

    saveProgress: function(courseId, progress) {
        try {
            localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(progress));
        } catch (e) {
            console.error("Error saving progress:", e);
        }
    },

    calculateProgress: function(courseId) {
        const course = this.getCourseById(courseId);
        if (!course) return 0;

        const progress = this.getProgress(courseId);
        const totalItems = course.totalLessons + course.totalQuestions;
        const completedItems = progress.completedLessons.length + progress.completedQuestions.length;

        if (totalItems === 0) return 0;

        let progressPercent = Math.round((completedItems / totalItems) * 100);
        return Math.min(progressPercent, 100);
    },

    getLevelName: function(level) {
        const levels = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'mixed': 'هجين',
            'expert': 'خبير'
        };
        return levels[level] || level;
    },

    // دالة لتحميل جميع بيانات الكورس
    loadCourseData: async function(courseId) {
        const course = this.getCourseById(courseId);
        if (!course) {
            throw new Error(`Course ${courseId} not found`);
        }

        // تحميل الدروس والاختبارات بالتوازي
        const [lessons, quizzes] = await Promise.all([
            this.loadLessons(courseId),
            this.loadQuizzes(courseId)
        ]);

        return {
            course,
            lessons,
            quizzes
        };
    }
};