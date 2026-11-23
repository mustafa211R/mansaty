// db.js — قاعدة بيانات المدرسين والطلاب + بيانات المشروع

const PROJECT = {
  name: "مختبر الدوائر الكهربائية",
  nameEn: "Virtual Electrical Circuits Lab",
  url: "https://example.com/",
  logo: "logo.jpg",
  school: "مدرسة ذو النفس الزكية",
  schoolEn: "Thul-Nafsi-Zakiyya School",
  country: "العراق",
  year: "2026",
  description: "مختبر افتراضي تفاعلي للتدريب العملي لطلاب الفيزياء: بناء الدوائر، توصيل الأسلاك، قياس الجهد والتيار والقدرة، ومشاهدة سلوك العناصر (مقاومة، مصباح، LED، مكثف، ملف، مغناطيس كهربائي) مع رسوم بيانية حية وتقارير قابلة للتحميل بصيغة PDF وصور.",
  summary: [
    "بناء دوائر كهربائية كاملة بالسحب والإفلات دون الحاجة لمعدات حقيقية.",
    "محاكاة فيزيائية دقيقة (MNA) تحسب الجهد والتيار والقدرة لحظياً.",
    "أكثر من 30 مشروعاً ودرساً جاهزاً من المستوى المبتدئ إلى المتقدم.",
    "عناصر مغناطيسية وحساسات: مغناطيس، بوصلة، مفتاح قصبي، LDR، NTC، خلية شمسية.",
    "تقارير مشاريع جاهزة للتصدير: PDF، صورة PNG، وملف HTML مستقل.",
    "يوفر بيئة آمنة للطلاب لاختبار القصر الدائرة والاحتراق دون خطر."
  ]
};

const TEACHERS = [
  {
    name: "مصطفى رحيم فندي",
    role: "المبرمج",
    photo: "images/teachers/mustafa.jpg",
    info: "مطوّر البرمجيات التعليمية، صمّم وبرمج مختبر الدوائر الكهربائية التفاعلي ومحرك المحاكاة الفيزيائية.",
    jobTitle: "Developer",
    url: ""
  },
  {
    name: "د. باسم عجيل",
    role: "أستاذ الفيزياء",
    photo: "images/teachers/basim.jpg",
    info: "أستاذ الفيزياء المشرف على المحتوى العلمي، راجع القوانين والتجارب وضمن دقة المحاكاة.",
    jobTitle: "Physics Teacher",
    url: ""
  }
];

// كل طالب: الرقم، الاسم، اسم التجربة، الشرح، صورة الطالب، صورة التجربة، ملف PDF الجاهز
const STUDENTS = [
  {
    id: "101",
    name: "علي حسن محمد",
    expName: "مصباح + مفتاح",
    expDesc: "بناء دائرة بسيطة تحتوي بطارية ومفتاح ومصباح، ودراسة إضاءة المصباح عند فتح وغلق المفتاح، وقياس الجهد والتيار والقدرة.",
    studentPhoto: "images/students/ali.jpg",
    expPhoto: "images/exp/lamp.jpg",
    expPdf: "pdfs/ali_lamp.pdf"
  },
  {
    id: "102",
    name: "زينب كريم جواد",
    expName: "قصر دائرة واحتراق مقاومة",
    expDesc: "توصيل مقاومة صغيرة على التوالي مع بطارية 12V لملاحظة ارتفاع التيار واحتراق المقاومة عند تجاوز قدرتها المقننة.",
    studentPhoto: "images/students/zainab.jpg",
    expPhoto: "images/exp/short.jpg",
    expPdf: "pdfs/zainab_short.pdf"
  },
  {
    id: "103",
    name: "محمد صادق عباس",
    expName: "تيار متناوب RL",
    expDesc: "دائرة تيار متناوب 50Hz تحتوي مقاومة وملف، ودراسة تأثير المحاثة على التيار والجهد مع تغيّر التردد.",
    studentPhoto: "images/students/mohammed.jpg",
    expPhoto: "images/exp/rl.jpg",
    expPdf: "pdfs/mohammed_rl.pdf"
  },
  {
    id: "104",
    name: "فاطمة عبد الله",
    expName: "دايود LED",
    expDesc: "توصيل LED مع مقاومة حماية 330Ω على بطارية 9V، وقياس التيار المار والتأكد من عدم تجاوز أقصى تيار للدايود.",
    studentPhoto: "images/students/fatima.jpg",
    expPhoto: "images/exp/led.jpg",
    expPdf: "pdfs/fatima_led.pdf"
  },
  {
    id: "105",
    name: "حسين علي كاظم",
    expName: "شحن مكثف RC",
    expDesc: "شحن مكثف 1000µF عبر مقاومة 1000Ω ومتابعة منحنى الجهد والتيار مع الزمن لحساب ثابت الزمن τ=R·C.",
    studentPhoto: "images/students/hussein.jpg",
    expPhoto: "images/exp/rc.jpg",
    expPdf: "pdfs/hussein_rc.pdf"
  }
];