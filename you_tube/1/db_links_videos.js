// ============================================================
// قاعدة بيانات فيديوهات منصة طالب
// ============================================================
// الحقول:
//   id      : رقم الفيديو (فريد)
//   name    : اسم الفيديو
//   teacher : اسم الأستاذ
//   subject : المادة الدراسية
//   link    : رابط الفيديو على يوتيوب
//   date    : تاريخ الإضافة (YYYY-MM-DD)
//   grade   : الصف الدراسي (اختياري للفلترة)
// ============================================================

const lessons = [
  {
    id: 1,
    name: "مقدمة في الحاسوب",
    teacher: "الأستاذ أحمد علي",
    subject: "الحاسوب",
    link: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    date: "2025-11-10",
   
  },
  {
    id: 2,
    name: "أساسيات البرمجة",
    teacher: "الأستاذ مصطفى رحيم فندي",
    subject: "الحاسوب",
    link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    date: "2025-11-09",
    
  },
  {
    id: 3,
    name: "مدخل إلى الذكاء الاصطناعي",
    teacher: "الأستاذة سارة علي",
    subject: "الحاسوب",
    link: "https://www.youtube.com/watch?v=abc123xyz",
    date: "2025-11-08",
   
  },
  {
    id: 4,
    name: "قواعد اللغة العربية - المرفوعات",
    teacher: "الأستاذ محمد كريم",
    subject: "اللغة العربية",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    date: "2025-11-07",
   
  },
  {
    id: 5,
    name: "الرياضيات - التفاضل",
    teacher: "الأستاذ علي حسين",
    subject: "الرياضيات",
    link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    date: "2025-11-06",
    
  },
  {
    id: 6,
    name: "الفيزياء - الحركة",
    teacher: "الأستاذة زينب حسن",
    subject: "الفيزياء",
    link: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    date: "2025-11-05",
   
  },
  {
    id: 7,
    name: "الأحياء - الخلية",
    teacher: "الأستاذة فاطمة جاسم",
    subject: "الأحياء",
    link: "https://www.youtube.com/watch?v=L_jWHffIx5E",
    date: "2025-11-04",
    
  },
  {
    id: 8,
    name: "الكيمياء - الجدول الدوري",
    teacher: "الأستاذ حيدر عبد الله",
    subject: "الكيمياء",
    link: "https://youtu.be/xORl2A0jUZI",
    date: "2025-11-03",
   
  }
];