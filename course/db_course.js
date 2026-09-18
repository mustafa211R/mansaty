// db_course.js - معلومات الكورسات الرئيسية ومسارات الملفات
window.coursesDB = {
    // مصفوفة الكورسات مع إضافة مسارات الملفات
    courses: [
       
{
    id: 10,
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