// ============================================================
// دروس الحاسوب - الصف الرابع الإعدادي
// الوحدة الأولى: صيانة الحاسوب
// منصة طالب - courseId: 1
// ============================================================

window.lessons_course1 = [

    // ============================================
    // الدرس 1: مدخل إلى صيانة الحاسوب
    // ============================================
    {
        id: 1,
        courseId: 1,
        title: "مدخل إلى صيانة الحاسوب وأنواعها",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">💻 مدخل إلى صيانة الحاسوب</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا يحتاج جهاز الحاسوب أو الهاتف إلى عناية مستمرة واهتمام حتى لا يتعطل فجأة وأنت بأشد الحاجة إليه؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>صيانة الحاسوب مثل الفحص الدوري للسيارة؛ هي مجموعة إجراءات نتبعها لتشخيص أي مشكلة وإزالتها سواء كانت في الأجزاء التي نلمسها <span class="term">(المكونات المادية)</span> أو البرامج، حتى يعمل الجهاز بأفضل شكل.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson1.jpg" alt="صيانة الحاسوب" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">صيانة الحاسوب — الفحص الدوري للجهاز</p>
            </div>

            <h3 class="lesson-h3">🔑 المفاهيم والمصطلحات الأساسية</h3>

            <div class="terms-grid">

                <div class="term-card">
                    <div class="term-num">1</div>
                    <h4 class="term-name">صيانة الحاسوب</h4>
                    <span class="term-english">Computer Maintenance</span>
                    <p class="term-desc">إجراءات تشخيص وإزالة المشكلات المادية والبرمجية لضمان العمل الأفضل.</p>
                </div>

                <div class="term-card">
                    <div class="term-num">2</div>
                    <h4 class="term-name">الصيانة الوقائية</h4>
                    <span class="term-english">Preventive Maintenance</span>
                    <p class="term-desc">إجراءات دورية لمنع حدوث المشاكل مستقبلاً.</p>
                </div>

                <div class="term-card">
                    <div class="term-num">3</div>
                    <h4 class="term-name">الصيانة التصحيحية</h4>
                    <span class="term-english">Corrective Maintenance</span>
                    <p class="term-desc">إجراءات تركز على إزالة الأعطال بعد حدوثها لإعادة الجهاز للعمل.</p>
                </div>

                <div class="term-card">
                    <div class="term-num">4</div>
                    <h4 class="term-name">الصيانة التكيفية</h4>
                    <span class="term-english">Adaptive Maintenance</span>
                    <p class="term-desc">إجراءات لتكييف المكونات مع أي تغيير بالبيئة المحيطة (مثل ترقية تطبيق ليتوافق مع نظام تشغيل جديد).</p>
                </div>

            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> تعريف صيانة الحاسوب</div>
                    <div class="goal-item"><span class="check-mark">✅</span> التمييز بين أنواع الصيانة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> فهم أهمية الصيانة الدورية</div>
                    <div class="goal-item"><span class="check-mark">✅</span> معرفة المصطلحات الإنجليزية</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p><span class="term">الصيانة الوقائية</span> تمنع المشكلة قبل حدوثها، أما <span class="term">الصيانة التصحيحية</span> فتصلح ما حدث. <span class="term">الصيانة التكيفية</span> تُكيّف المكونات مع التغييرات الجديدة.</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 2: الصيانة الوقائية لوحدات الإدخال
    // ============================================
    {
        id: 2,
        courseId: 1,
        title: "الصيانة الوقائية لوحدات الإدخال (المفتاح، الفأرة، الماسح)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">⌨️ الصيانة الوقائية لوحدات الإدخال</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا تتوقف أزرار لوحة المفاتيح عن الاستجابة أحياناً أو تصبح حركة الفأرة بطيئة وثقيلة؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>الأتربة والغبار تتسلل إلى الفراغات الضيقة في وحدات الإدخال وتعيق حركتها؛ ولذلك نحتاج لتنظيفها باستمرار تماماً كما ننظف نظاراتنا لنرى بوضوح.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson2.jpg" alt="وحدات الإدخال" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">وحدات الإدخال: لوحة المفاتيح، الفأرة، الماسح الضوئي</p>
            </div>

            <h3 class="lesson-h3">🔧 خطوات الصيانة والأساليب</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">لوحة المفاتيح (Keyboard) والفأرة (Mouse)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>تنظيف السطح بقطعة قماش مبللة بـ <span class="term">الكحول الطبي</span>.</li>
                        <li>استخدام <span class="term">الهواء المضغوط</span> بعلبة ذات فوهة طويلة للوصول للمساحات الضيقة.</li>
                    </ul>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">الماسح الضوئي (Scanner)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>تنظيف السطح الزجاجي بـ <span class="term">منظف الزجاج</span> وقطعة قماش قطنية.</li>
                        <li>تنظيف الأجزاء الداخلية بـ <span class="term">الهواء المضغوط</span>.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> طرق تنظيف لوحة المفاتيح والفأرة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> استخدام الهواء المضغوط بأمان</div>
                    <div class="goal-item"><span class="check-mark">✅</span> صيانة الماسح الضوئي</div>
                    <div class="goal-item"><span class="check-mark">✅</span> أهمية الصيانة الدورية</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>لا تستخدم الماء العادي لتنظيف لوحة المفاتيح! الماء يسبب <span class="term">قصر كهربائي</span>. استخدم دائماً <span class="term">الكحول الطبي</span> لأنه يتبخر بسرعة.</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 3: الصيانة الوقائية لسواقة الأقراص
    // ============================================
    {
        id: 3,
        courseId: 1,
        title: "الصيانة الوقائية لسواقة الأقراص المدمجة (CD Drive)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">💿 الصيانة الوقائية لسواقة الأقراص المدمجة</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا يخرج صوت عالي من مشغل الأقراص أو يفشل في قراءة القرص المدمج فجأة؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>عندما تتراكم الأتربة على الدرج أو عدسة القراءة داخل سواقة الأقراص، يحجب الغبار الضوء الخاص بالقراءة، فيحتاج منا إلى تنظيف رقيق.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson3.jpg" alt="سواقة الأقراص المدمجة" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">سواقة الأقراص المدمجة CD/DVD Drive</p>
            </div>

            <h3 class="lesson-h3">🔧 خطوات الصيانة والأساليب</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">✓</span>
                    <h4 class="step-title">تنظيف الدرج</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>استخدام قطعة قماش رطبة لإزالة الأوساخ المترسبة.</li>
                        <li>أو استخدام علبة <span class="term">الهواء المضغوط</span>.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> فهم آلية عمل سواقة الأقراص</div>
                    <div class="goal-item"><span class="check-mark">✅</span> تنظيف الدرج بأمان</div>
                    <div class="goal-item"><span class="check-mark">✅</span> الحفاظ على عدسة القراءة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> إطالة عمر السواقة</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>الغبار على <span class="term">عدسة القراءة</span> هو السبب الأول لفشل قراءة الأقراص. التنظيف الدوري بالهواء المضغوط يطيل عمر السواقة سنوات!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 4: الصيانة الوقائية للوحة الأم
    // ============================================
    {
        id: 4,
        courseId: 1,
        title: "الصيانة الوقائية للوحة الأم (Motherboard)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🔲 الصيانة الوقائية للوحة الأم</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً ماذا يحدث للوحة الإلكترونية الكبيرة داخل صندوق الحاسوب عندما يغطيها الغبار كثيفاً؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>الغبار يعمل كغطاء يحبس الحرارة وقد يسبب تأكلاً بالدوائر الكهربائية للوحة الأم <span class="term">(قلب الحاسوب)</span>، لذا يجب إزالتها بحذر كيد جراح ماهر.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson4.jpg" alt="اللوحة الأم" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">اللوحة الأم Motherboard — قلب الحاسوب</p>
            </div>

            <h3 class="lesson-h3">🔧 خطوات الصيانة والأساليب</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">الهواء المضغوط أو المكنسة الكهربائية</h4>
                </div>
                <div class="step-body">
                    <p>استخدام <span class="term">علبة الهواء المضغوط</span> أو مكنسة كهربائية خاصة مع ترك مسافة مناسبة تجنباً لتلف المكونات الصغيرة.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">فرشاة تنظيف ناعمة</h4>
                </div>
                <div class="step-body">
                    <p>استخدام <span class="term">فرشاة تنظيف</span> برفق فوق الغبار المتكتل.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">3</span>
                    <h4 class="step-title">قطعة قطن + كحول طبي</h4>
                </div>
                <div class="step-body">
                    <p>مسح الأتربة الملتصقة بقطعة قطن مرطبة بـ <span class="term">الكحول الطبي</span>.</p>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> أهمية اللوحة الأم</div>
                    <div class="goal-item"><span class="check-mark">✅</span> تنظيفها بالهواء المضغوط</div>
                    <div class="goal-item"><span class="check-mark">✅</span> استخدام الفرشاة بأمان</div>
                    <div class="goal-item"><span class="check-mark">✅</span> الحذر من التلف</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>اللوحة الأم هي <span class="term">قلب الحاسوب</span> — تربط جميع المكونات معاً. أي تلف فيها يعني توقف الجهاز بالكامل!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 5: الصيانة الوقائية لمراوح التبريد
    // ============================================
    {
        id: 5,
        courseId: 1,
        title: "الصيانة الوقائية لمراوح التبريد (Cooling Fans)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🌀 الصيانة الوقائية لمراوح التبريد</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا يعلو صوت الحاسوب جداً وتصبح حرارته مرتفعة بعد فترة من الاستخدام؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>المراوح هي بمثابة التكييف الداخلي للحاسوب؛ إذا تراكم الغبار على شفراتها تباطأت حركتها وقلّ التبريد، فيتوقف الجهاز حمايةً لنفسه.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson5.jpg" alt="مراوح التبريد" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">مراوح التبريد — التكييف الداخلي للحاسوب</p>
            </div>

            <h3 class="lesson-h3">🔧 خطوات الصيانة والأساليب</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">✓</span>
                    <h4 class="step-title">التنظيف الدوري للمراوح</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li><span class="term">مروحة المعالج</span></li>
                        <li><span class="term">مروحة صندوق الحاسوب</span></li>
                        <li><span class="term">مروحة وحدة الطاقة</span></li>
                    </ul>
                    <p class="step-note">بواسطة <span class="term">علبة الهواء المضغوط</span>.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">✓</span>
                    <h4 class="step-title">وضعية الحاسوب الصحيحة</h4>
                </div>
                <div class="step-body">
                    <p>وضع الحاسوب بوضعية تضمن خروج الأتربة للخارج وعدم انتقالها لمكان آخر داخل الجهاز.</p>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> أنواع المراوح في الحاسوب</div>
                    <div class="goal-item"><span class="check-mark">✅</span> أهمية التبريد</div>
                    <div class="goal-item"><span class="check-mark">✅</span> طريقة التنظيف الصحيحة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> الوقاية من ارتفاع الحرارة</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>الحاسوب الحديث يتوقف تلقائياً إذا ارتفعت حرارة <span class="term">المعالج</span> عن حد معين حمايةً له من الاحتراق. لذلك نظّف المراوح دورياً!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 6: الصيانة الوقائية لوحدات الإخراج والحاسوب المحمول
    // ============================================
    {
        id: 6,
        courseId: 1,
        title: "الصيانة الوقائية لوحدات الإخراج والحاسوب المحمول",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🖥️ الصيانة الوقائية لوحدات الإخراج</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا يمنع رش منظف زجاج مباشرة على الشاشة أو الطابعة؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>الشاشات والطابعات بها أسلاك وقطع حساسة للرطوبة، والسوائل المباشرة قد تتسرب للداخل وتسبب <span class="term">قصر كهربائي</span> (شورت).</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson6.jpg" alt="وحدات الإخراج" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">الشاشة، الطابعة، الحاسوب المحمول</p>
            </div>

            <h3 class="lesson-h3">🔧 خطوات الصيانة والأساليب</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">الشاشة (Screen)</h4>
                </div>
                <div class="step-body">
                    <p>تنظيفها بـ <span class="term">منظف النوافذ</span> مع قطعة قماش قطنية، دون ترك المنظف لفترة طويلة.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">الطابعة (Printer)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>إطفاء الجهاز.</li>
                        <li>إزالة <span class="term">خزان الحبر</span>.</li>
                        <li>تنظيفها بقطعة قماش جافة و<span class="term">منفاخ هواء</span>.</li>
                        <li>عدم رش أي سائل عليها مباشرة.</li>
                        <li>ثم طباعة ورقة اختبار.</li>
                    </ul>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">3</span>
                    <h4 class="step-title">الحاسوب المحمول (Laptop)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>إطفاؤه وفصل الكهرباء.</li>
                        <li>إزالة <span class="term">البطارية</span>.</li>
                        <li>مسح السطح الخارجي بقماش.</li>
                        <li>استخدام <span class="term">الهواء المضغوط</span> مع تثبيت شفرات المروحة لمنع دورانها أثناء التنظيف.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> تنظيف الشاشة بأمان</div>
                    <div class="goal-item"><span class="check-mark">✅</span> صيانة الطابعة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> العناية بالحاسوب المحمول</div>
                    <div class="goal-item"><span class="check-mark">✅</span> تجنب القصر الكهربائي</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>عند تنظيف مروحة الحاسوب المحمول، <span class="term">ثبّت الشفرات</span> بفرشاة أو عود أسنان — دورانها أثناء التنظيف يولّد كهرباء قد تسبب تلفاً!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 7: الصيانة التصحيحية لوحدات الإدخال
    // ============================================
    {
        id: 7,
        courseId: 1,
        title: "الصيانة التصحيحية لوحدات الإدخال (معالجة الأعطال)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🔧 الصيانة التصحيحية لوحدات الإدخال</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً ماذا تفعل إذا توقفت الفأرة عن الحركة أو أصبحت أزرار لوحة المفاتيح لا تكتب؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>الصيانة التصحيحية تبدأ أولاً بالبحث عن <span class="term">السبب البسيط</span> (مثل سلك مفصول أو غبار) قبل التفكير في شراء قطعة جديدة!</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson7.jpg" alt="أعطال وحدات الإدخال" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">تشخيص أعطال وحدات الإدخال</p>
            </div>

            <h3 class="lesson-h3">🩺 الأعطال والتشخيص</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">لوحة المفاتيح (Keyboard)</h4>
                </div>
                <div class="step-body">
                    <p>توقف المفاتيح يعني إما <span class="term">موصل كهربائي مفصول</span> أو قطع بالتوصيلات الإلكترونية فتستبدل.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">الفأرة (Mouse)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li><span class="term">عدم التحكم بالمؤشر</span>: تجمع الأتربة على المتحسس الأسفلي فتُنظف.</li>
                        <li><span class="term">عدم الاستجابة</span>: بسبب الموصل أو استبدالها.</li>
                    </ul>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">3</span>
                    <h4 class="step-title">الماسح الضوئي (Scanner)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li>التأكد من توصيل <span class="term">مزود الطاقة</span>.</li>
                        <li>التأكد من <span class="term">نقل البيانات</span>.</li>
                        <li>إعادة تثبيت <span class="term">التعريف</span>.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> تشخيص أعطال لوحة المفاتيح</div>
                    <div class="goal-item"><span class="check-mark">✅</span> حل مشاكل الفأرة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> صيانة الماسح الضوئي</div>
                    <div class="goal-item"><span class="check-mark">✅</span> ترتيب خطوات التشخيص</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>قبل شراء فأرة جديدة، <span class="term">نظّف المتحسس الأسفلي</span> أولاً — في 80% من الحالات هذه هي المشكلة!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 8: الصيانة التصحيحية لسواقة الأقراص
    // ============================================
    {
        id: 8,
        courseId: 1,
        title: "الصيانة التصحيحية لسواقة الأقراص المدمجة (CD Drive)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">💿 الصيانة التصحيحية لسواقة الأقراص</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا يفشل الحاسوب في نسخ الصور والأغاني على CD ويظهر خطأ في منتصف العملية؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>فشل النسخ يحدث غالباً إما لأن <span class="term">الأقراص رديئة</span>، أو أن الحاسوب <span class="term">مشغول ببرامج كثيرة</span> تؤخر وصول البيانات للمُشغّل في الوقت المناسب.</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson8.jpg" alt="أعطال سواقة الأقراص" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">تشخيص أعطال سواقة الأقراص</p>
            </div>

            <h3 class="lesson-h3">🩺 الأعطال والتشخيص</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">عدم القراءة</h4>
                </div>
                <div class="step-body">
                    <p>نظّف <span class="term">عدسة القراءة</span> بقطعة قماش وكحول طبي أو منظف خاص.</p>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">توقف النسخ/التسجيل</h4>
                </div>
                <div class="step-body">
                    <p>بسبب تأخر وصول البيانات من <span class="term">القرص الصلب</span>؛ يجب إغلاق البرامج المفتوحة عبر:</p>
                    <div class="keyboard-shortcut">
                        <span class="kbd">Ctrl</span> + <span class="kbd">Alt</span> + <span class="kbd">Delete</span>
                    </div>
                    <p>ثم اختيار <span class="kbd">End Task</span> وإعادة المحاولة.</p>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> تنظيف عدسة القراءة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> حل مشاكل النسخ</div>
                    <div class="goal-item"><span class="check-mark">✅</span> استخدام مدير المهام</div>
                    <div class="goal-item"><span class="check-mark">✅</span> فهم نقل البيانات</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>اختصار <span class="kbd">Ctrl+Alt+Delete</span> يفتح <span class="term">مدير المهام</span> في ويندوز، ومنه يمكن إنهاء البرامج المتجمدة.</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 9: الصيانة التصحيحية للوحة الأم والمعالج
    // ============================================
    {
        id: 9,
        courseId: 1,
        title: "الصيانة التصحيحية للوحة الأم والمعالج (CPU)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🔥 الصيانة التصحيحية للوحة الأم والمعالج</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا ينطفئ الحاسوب فجأة وبشكل تلقائي أثناء عملك عليه؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>المعالج هو <span class="term">عقل الحاسوب</span>، وعندما يسخن جداً ينطفئ الجهاز تلقائياً حتى لا يحترق هذا العقل!</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson9.jpg" alt="المعالج واللوحة الأم" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">المعالج CPU واللوحة الأم Motherboard</p>
            </div>

            <h3 class="lesson-h3">🩺 الأعطال والتشخيص</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">اللوحة الأم (Motherboard)</h4>
                </div>
                <div class="step-body">
                    <p>إن لم تعمل، فبسبب:</p>
                    <ul class="step-list">
                        <li>عدم ربط <span class="term">توصيلات مجهز القدرة</span>.</li>
                        <li>عطل في دوائرها (يفحصها <span class="term">متخصص</span>).</li>
                    </ul>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">المعالج (CPU)</h4>
                </div>
                <div class="step-body">
                    <p>ارتفاع الحرارة والتوقف المفاجئ يرجع إلى:</p>
                    <ul class="step-list">
                        <li>جفاف <span class="term">معجون التبريد</span> (بين المبرد والمعالج) فيتوجب وضع جديد.</li>
                        <li>توقف <span class="term">مروحة التبريد</span>.</li>
                        <li>ارتفاع <span class="term">حرارة الجو المحيط</span>.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> فهم وظيفة اللوحة الأم</div>
                    <div class="goal-item"><span class="check-mark">✅</span> أهمية المعالج</div>
                    <div class="goal-item"><span class="check-mark">✅</span> دور معجون التبريد</div>
                    <div class="goal-item"><span class="check-mark">✅</span> أسباب التوقف المفاجئ</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p><span class="term">معجون التبريد</span> مادة توضع بين المعالج والمبرد لنقل الحرارة. يجف بعد 2-3 سنوات ويجب استبداله!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 10: الصيانة التصحيحية لوحدات الإخراج
    // ============================================
    {
        id: 10,
        courseId: 1,
        title: "الصيانة التصحيحية لوحدات الإخراج (الشاشة والطابعة)",
        content: `
        <div class="lesson-content" dir="rtl">

            <h2 class="lesson-h2">🖨️ الصيانة التصحيحية لوحدات الإخراج</h2>

            <div class="lesson-question">
                <span class="question-icon">🤔</span>
                <p class="question-text">هل تساءلت يوماً لماذا تطبع الطابعة أحياناً رموزاً غريبة وغير مفهومة كأنها لغة فضائية؟</p>
            </div>

            <div class="lesson-intro">
                <span class="intro-icon">📖</span>
                <div>
                    <h4 class="intro-title">الشرح المبسّط</h4>
                    <p>عندما لا يفهم الحاسوب الطابعة جيداً (<span class="term">تعريف خاطئ</span>) أو يكون السلك غير موصول بثبات، يرسل إشارات مشوشة فتخرج نصوص غير مفهومة!</p>
                </div>
            </div>

            <div class="lesson-image">
                <img src="images/course12/lesson10.jpg" alt="أعطال وحدات الإخراج" onerror="this.parentElement.style.display='none'">
                <p class="image-caption">الشاشة والطابعة — وحدات الإخراج</p>
            </div>

            <h3 class="lesson-h3">🩺 الأعطال والتشخيص</h3>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">1</span>
                    <h4 class="step-title">الشاشة (Screen)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li><span class="term">عدم عرض الصورة / خلل الإضاءة</span>: إعادة تركيب موصل البيانات.</li>
                        <li><span class="term">ظهور خطوط وتموج</span>: عطل بالشاشة أو بطاقة الشاشة أو ناقل البيانات.</li>
                        <li><span class="term">اختفاء الألوان الأساسية</span> (في شاشات CRT): وجود مجال مغناطيسي محيط فيجب إبعاد الشاشة عنه.</li>
                    </ul>
                </div>
            </div>

            <div class="step-card">
                <div class="step-header">
                    <span class="step-num">2</span>
                    <h4 class="step-title">الطابعة (Printer)</h4>
                </div>
                <div class="step-body">
                    <ul class="step-list">
                        <li><span class="term">الضوء البرتقالي وتوقف العمل</span>: تعليق الورق بالداخل (بسبب رداءته أو ثني أطرافه) فتُزال بحذر.</li>
                        <li><span class="term">طباعة رموز غريبة</span>: موصل كهربائي مركب بشكل سيئ أو تعريف الطابعة غير صحيح فيعاد تثبيته.</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-goals">
                <h3 class="goals-title">📚 أهداف الدرس</h3>
                <div class="goals-grid">
                    <div class="goal-item"><span class="check-mark">✅</span> تشخيص أعطال الشاشة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> حل مشاكل الطابعة</div>
                    <div class="goal-item"><span class="check-mark">✅</span> إعادة تثبيت التعريفات</div>
                    <div class="goal-item"><span class="check-mark">✅</span> تأثير المجال المغناطيسي</div>
                </div>
            </div>

            <div class="lesson-tip">
                <h3 class="tip-title">💡 معلومة للامتحان</h3>
                <p>شاشات <span class="term">CRT</span> القديمة تتأثر بالمجال المغناطيسي (مثل مكبرات الصوت). أبعدها عنها لتعود الألوان طبيعية!</p>
            </div>

        </div>
        `,
        hasQuiz: true
    }

];