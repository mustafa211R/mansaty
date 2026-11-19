// ============================================================
// دروس الأحياء - الصف السادس العلمي
// منصة طالب - courseId: 10
// ============================================================

window.lessons_course10 = [

    // ============================================
    // الدرس 1: الخلية - الوحدة الأساسية للحياة
    // ============================================
    {
        id: 1,
        courseId: 10,
        title: "الخلية - الوحدة الأساسية للحياة",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">🔬 الخلية - وحدة بناء الكائن الحي</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">الخلية هي أصغر وحدة قادرة على الحياة. جميع الكائنات الحية تتكون من خلايا، وهي أساس دراسة علم الأحياء.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">🧬 نظرية الخلية</h3>
                <ul class="list-disc pr-6 space-y-3 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term">جميع الكائنات الحية</span>: تتكون من خلية واحدة أو أكثر</li>
                    <li><span class="term">الخلية هي وحدة البناء والوظيفة</span>: في جميع الكائنات الحية</li>
                    <li><span class="term">الخلايا تنشأ من خلايا سابقة</span>: عن طريق الانقسام</li>
                    <li><span class="term">تحتوي على المادة الوراثية</span>: DNA المسؤول عن نقل الصفات</li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔧 أجزاء الخلية الرئيسية:</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الغشاء البلازمي</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">غشاء رقيق يحيط بالخلية، ينظم دخول وخروج المواد (<span class="term">نفاذية اختيارية</span>).</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">النواة</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">مركز التحكم في الخلية، تحتوي على <span class="term">DNA</span> (المادة الوراثية) و<span class="term">الكروموسومات</span>.</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">السايتوبلازم</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">مادة هلامية شفافة تملأ الخلية، تحدث فيها معظم <span class="term">التفاعلات الكيميائية</span>.</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">المايتوكوندريا</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">"<span class="term">بيت الطاقة</span>"، تحدث فيها عملية <span class="term">التنفس الخلوي</span> لإنتاج <span class="term">ATP</span>.</p>
                </div>

                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الرايبوسومات</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">مسؤولة عن بناء البروتينات (<span class="term">تخليق البروتين</span>).</p>
                </div>

                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الشبكة الإندوبلازمية</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">نقل المواد داخل الخلية، نوعان: <span class="term">خشنة</span> (بها رايبوسومات) و<span class="term">ملساء</span>.</p>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 مقارنة: خلية نباتية vs خلية حيوانية</h3>
                <div class="grid grid-cols-2 gap-6 mt-4">
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: #06762f;">🌱 الخلية النباتية</h4>
                        <ul class="list-disc pr-6 space-y-2" style="color: var(--sf-text-secondary);">
                            <li>تحتوي على <span class="term">جدار خلوي</span> (سليلوز)</li>
                            <li><span class="term">بلاستيدات خضراء</span> (للبناء الضوئي)</li>
                            <li><span class="term">فجوة عصارية</span> كبيرة</li>
                            <li>شكل هندسي منتظم</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: #d33333;">🐾 الخلية الحيوانية</h4>
                        <ul class="list-disc pr-6 space-y-2" style="color: var(--sf-text-secondary);">
                            <li>لا تحتوي على <span class="term">جدار خلوي</span></li>
                            <li>لا تحتوي على <span class="term">بلاستيدات</span></li>
                            <li>فجوات صغيرة أو معدومة</li>
                            <li>شكل غير منتظم</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> تعريف الخلية</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> أجزاء الخلية ووظائفها</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> الفرق بين الخلية النباتية والحيوانية</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> نظرية الخلية</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">يبلغ عدد خلايا جسم الإنسان البالغ حوالي <span class="term">37 تريليون خلية</span>! بينما تتكون البكتيريا من خلية واحدة فقط. الخلية العصبية قد يصل طولها إلى متر كامل!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 2: الانقسام الخلوي
    // ============================================
    {
        id: 2,
        courseId: 10,
        title: "الانقسام الخلوي - الميتوزي والمايوزي",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">🔄 الانقسام الخلوي</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">الانقسام الخلوي عملية أساسية للنمو، تعويض الخلايا التالفة، والتكاثر. هناك نوعان رئيسيان: <span class="term">الميتوزي</span> و<span class="term">المايوزي</span>.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">⚡ لماذا تنقسم الخلايا؟</h3>
                <ul class="list-disc pr-6 space-y-3 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term">النمو</span>: زيادة عدد الخلايا في الكائن الحي</li>
                    <li><span class="term">التعويض</span>: استبدال الخلايا التالفة أو الميتة</li>
                    <li><span class="term">التكاثر</span>: إنتاج أفراد جديدة (في الكائنات وحيدة الخلية)</li>
                    <li><span class="term">التجديد</span>: مثل تجديد خلايا الجلد والدم</li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">1️⃣ الانقسام الميتوزي (Mitosis):</h3>
            
            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">انقسام <span class="term">غير مباشر</span> ينتج عنه خليتين <span class="term">متماثلتين</span> بالعدد الكروموسومي (<span class="term">2n</span>).</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">📍 <span class="term-title">الطور التمهيدي</span> (Prophase)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">تكثف الكروموسومات، اختفاء الغشاء النووي، ظهور المغزل</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">📍 <span class="term-title">الطور الاستوائي</span> (Metaphase)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">اصطفاف الكروموسومات في وسط الخلية</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">📍 <span class="term-title">الطور الانفصالي</span> (Anaphase)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">انفصال الكروماتيدات وتحركها للأقطاب</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">📍 <span class="term-title">الطور النهائي</span> (Telophase)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">تكوين نواتين جديدتين، انقسام السايتوبلازم</p>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">2️⃣ الانقسام المايوزي (Meiosis):</h3>
            
            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">انقسام <span class="term-danger">اختزالي</span> يحدث في الخلايا التناسلية، ينتج <span class="term">4 خلايا</span> بنصف العدد الكروموسومي (<span class="term">n</span>).</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الانقسام الأول</span> (Meiosis I)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">انقسام اختزالي، ينتج خليتين بنصف العدد (n)</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الانقسام الثاني</span> (Meiosis II)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">مشابه للميتوزي، ينتج 4 خلايا (n)</p>
                    </div>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 مقارنة شاملة:</h3>
                <div class="overflow-x-auto">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>الوجه</th>
                                <th>الميتوزي</th>
                                <th>المايوزي</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>مكان الحدوث</td>
                                <td>جميع خلايا الجسم</td>
                                <td>الخلايا التناسلية</td>
                            </tr>
                            <tr>
                                <td>عدد الانقسامات</td>
                                <td>انقسام واحد</td>
                                <td>انقسامان متتاليان</td>
                            </tr>
                            <tr>
                                <td>عدد الخلايا الناتجة</td>
                                <td>2</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>العدد الكروموسومي</td>
                                <td>2n (كامل)</td>
                                <td>n (نصف)</td>
                            </tr>
                            <tr>
                                <td>الهدف</td>
                                <td>النمو والتعويض</td>
                                <td>إنتاج الأمشاج</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> أهمية الانقسام الخلوي</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> أطوار الميتوزي</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> أطوار المايوزي</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> المقارنة بينهما</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">الخلايا السرطانية تتميز بـ <span class="term-danger">انقسام ميتوزي غير منظم</span>! تفقد السيطرة على دورة الخلية، فتتكاثر بلا توقف. هذا هو أساس فهم السرطان. عدد الخلايا في جسمك يتجدد بمعدل <span class="term">مليون خلية في الثانية</span>!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 3: الوراثة - قوانين مندل
    // ============================================
    {
        id: 3,
        courseId: 10,
        title: "الوراثة - قوانين مندل",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">🧬 علم الوراثة - قوانين مندل</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">علم الوراثة يدرس انتقال الصفات من الآباء إلى الأبناء. الأب الروحي لهذا العلم هو الراهب النمساوي <span class="term">جريجور مندل</span>.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">👨‍🔬 من هو جريجور مندل؟</h3>
                <p class="text-lg mb-3" style="color: var(--sf-text-secondary);">راهب نمساوي (1822-1884) أجرى تجاربه على نبات البازلاء لمدة 8 سنوات. اكتشف قوانين الوراثة الأساسية التي لا تزال تُدرس حتى اليوم.</p>
                <ul class="list-disc pr-6 space-y-2 text-lg" style="color: var(--sf-text-secondary);">
                    <li>اختار نبات البازلاء لسرعة نموه وسهولة تلقيحه</li>
                    <li>درس 7 صفات مختلفة (الطول، اللون، الشكل...)</li>
                    <li>استخدم الإحصاء والرياضيات لتحليل النتائج</li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔑 مصطلحات أساسية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الجين</span> (Gene)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">قطعة من <span class="term">DNA</span> تحمل صفة وراثية معينة.</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الأليل</span> (Allele)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">صور بديلة للجين (مثل: <span class="term">أليل الطول</span> و<span class="term">أليل القصر</span>).</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الطراز الجيني</span> (Genotype)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">التركيب الجيني للفرد (مثل: <span class="term">TT</span>, <span class="term">Tt</span>, <span class="term">tt</span>).</p>
                </div>
                
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الطراز الظاهري</span> (Phenotype)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">الصفة الظاهرة (مثل: <span class="term">طويل</span>، <span class="term">قصير</span>).</p>
                </div>

                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">متماثل الجينات</span> (Homozygous)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">أليلان متماثلان (<span class="term">TT</span> أو <span class="term">tt</span>).</p>
                </div>

                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">مختلف الجينات</span> (Heterozygous)</h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">أليلان مختلفان (<span class="term">Tt</span>).</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📜 قانون مندل الأول: <span class="term-title">قانون انفصال العوامل</span></h3>
            
            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">ينفصل أليلا الصفة عند تكوين الأمشاج، فيحمل كل مشيج أليلاً واحداً فقط.</p>
                
                <div class="code-block p-5 rounded-xl overflow-x-auto" dir="ltr">
                    <pre class="text-green-300 font-mono text-sm">
الآباء:    TT  ×  tt
           ↓
الأمشاج:    T      t
           ↓
الجيل الأول: Tt (كل الأفراد طويلة ظاهرياً)</pre>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📜 قانون مندل الثاني: <span class="term-title">قانون التوزيع الحر</span></h3>
            
            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">تتوزع الصفات المختلفة بشكل مستقل عن بعضها عند تكوين الأمشاج.</p>
                
                <div class="code-block p-5 rounded-xl overflow-x-auto" dir="ltr">
                    <pre class="text-green-300 font-mono text-sm">
الآباء: TtYy × TtYy
النتيجة: 9 : 3 : 3 : 1
(9 طويلة صفراء : 3 طويلة خضراء : 3 قصيرة صفراء : 1 قصيرة خضراء)</pre>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 مربع بانيت (Punnett Square):</h3>
                <p class="text-lg mb-3" style="color: var(--sf-text-secondary);">أداة لحساب احتمالات الصفات في الجيل الناتج.</p>
                
                <div class="overflow-x-auto">
                    <table class="punnett-table mx-auto">
                        <tr>
                            <td class="empty"></td>
                            <td class="header-cell">T</td>
                            <td class="header-cell">t</td>
                        </tr>
                        <tr>
                            <td class="header-cell">T</td>
                            <td class="cell-tt">TT</td>
                            <td class="cell-tt">Tt</td>
                        </tr>
                        <tr>
                            <td class="header-cell">t</td>
                            <td class="cell-tt">Tt</td>
                            <td class="cell-tt-lower">tt</td>
                        </tr>
                    </table>
                </div>
                <p class="text-center mt-3 text-lg" style="color: var(--sf-text-secondary);">النتيجة: <span class="term">3 طويلة : 1 قصيرة</span> (النسبة 3:1)</p>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> مصطلحات الوراثة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قانون انفصال العوامل</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قانون التوزيع الحر</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> استخدام مربع بانيت</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">الإنسان يحمل <span class="term">23 زوجاً من الكروموسومات</span> (46 كروموسوم). لكن هناك ما يقارب <span class="term">20,000-25,000 جين</span> في الجينوم البشري. اكتشاف بنية DNA عام 1953 بواسطة واطسون وكريك كان أعظم اكتشاف في القرن العشرين!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 4: الجهاز الدوري
    // ============================================
    {
        id: 4,
        courseId: 10,
        title: "الجهاز الدوري - القلب والدورة الدموية",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">❤️ الجهاز الدوري</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">الجهاز الدوري مسؤول عن نقل الدم المحمل بالأوكسجين والغذاء إلى جميع خلايا الجسم، وإزالة الفضلات مثل <span class="term">CO₂</span>.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">⚡ مكونات الجهاز الدوري:</h3>
                <ul class="list-disc pr-6 space-y-3 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term">القلب</span>: المضخة الرئيسية للدم</li>
                    <li><span class="term">الأوعية الدموية</span>: الشرايين، الأوردة، والشعيرات</li>
                    <li><span class="term">الدم</span>: السائل الناقل للمواد</li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🫀 القلب - المضخة العجيبة:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">القلب عضو عضلي بحجم قبضة اليد، ينبض حوالي <span class="term-danger">100,000 مرة يومياً</span>.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الأذينان</span> (Atria)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">الغرفتان العلويتان، تستقبلان الدم العائد للقلب.</p>
                        <p class="text-xs mt-2" style="color: var(--oxford-gold-dark);">الأذين الأيمن: يستقبل الدم غير المؤكسج<br>الأذين الأيسر: يستقبل الدم المؤكسج</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">البطينان</span> (Ventricles)</h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">الغرفتان السفليتان، تضخان الدم خارج القلب.</p>
                        <p class="text-xs mt-2" style="color: var(--oxford-gold-dark);">البطين الأيمن: يضخ للرئتين<br>البطين الأيسر: يضخ للجسم كله</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الصمامات</span></h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">4 صمامات تمنع رجوع الدم للخلف.</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الحاجز</span></h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">يفصل بين جانبي القلب (أيمن وأيسر).</p>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔴 مكونات الدم:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="blood-card-red p-5 rounded-xl text-center">
                        <h4 class="font-bold text-xl mb-2">🔴 <span class="term-title-light">كريات الدم الحمراء</span></h4>
                        <p class="text-sm">تحمل الأوكسجين بواسطة <span class="term-light">الهيموغلوبين</span>. تعيش 120 يوماً.</p>
                    </div>
                    <div class="blood-card-blue p-5 rounded-xl text-center">
                        <h4 class="font-bold text-xl mb-2">⚪ <span class="term-title-light">كريات الدم البيضاء</span></h4>
                        <p class="text-sm">تدافع عن الجسم ضد الجراثيم والأمراض.</p>
                    </div>
                    <div class="blood-card-gold p-5 rounded-xl text-center">
                        <h4 class="font-bold text-xl mb-2">🟡 <span class="term-title-light">الصفائح الدموية</span></h4>
                        <p class="text-sm">تساعد في <span class="term-light">تخثر الدم</span> وإيقاف النزيف.</p>
                    </div>
                </div>
                <p class="text-center mt-4 text-lg" style="color: var(--sf-text-secondary);">+ <span class="term">البلازما</span> (السائل الأصفر الناقل)</p>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔀 الدورة الدموية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="lesson-card-inner p-6 rounded-2xl">
                    <h4 class="font-bold text-xl mb-3" style="color: var(--oxford-blue);">🔹 <span class="term-title">الدورة الصغرى</span> (الرئوية)</h4>
                    <p class="text-sm mb-2" style="color: var(--sf-text-secondary);">من القلب إلى الرئتين والعكس.</p>
                    <p class="text-sm" style="color: var(--sf-text-primary);">القلب ← الرئتان ← القلب</p>
                    <p class="text-xs mt-2" style="color: var(--oxford-gold-dark);">الهدف: تأكسج الدم وطرد CO₂</p>
                </div>
                <div class="lesson-card-inner p-6 rounded-2xl">
                    <h4 class="font-bold text-xl mb-3" style="color: var(--oxford-blue);">🔹 <span class="term-title">الدورة الكبرى</span> (الجهازية)</h4>
                    <p class="text-sm mb-2" style="color: var(--sf-text-secondary);">من القلب إلى الجسم كله والعكس.</p>
                    <p class="text-sm" style="color: var(--sf-text-primary);">القلب ← الجسم ← القلب</p>
                    <p class="text-xs mt-2" style="color: var(--oxford-gold-dark);">الهدف: تغذية الخلايا وإزالة الفضلات</p>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 أنواع الأوعية الدموية:</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: #d33333;">🩸 <span class="term-title">الشرايين</span></h4>
                        <ul class="list-disc pr-6 space-y-1 text-sm" style="color: var(--sf-text-secondary);">
                            <li>تحمل الدم من القلب</li>
                            <li>جدرانها سميكة ومرنة</li>
                            <li>الدم فيها مؤكسج (ما عدا الرئوي)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: var(--oxford-blue);">💙 <span class="term-title">الأوردة</span></h4>
                        <ul class="list-disc pr-6 space-y-1 text-sm" style="color: var(--sf-text-secondary);">
                            <li>تحمل الدم إلى القلب</li>
                            <li>جدرانها أرق</li>
                            <li>تحتوي على صمامات</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: #4a3a7a;">🕸️ <span class="term-title">الشعيرات</span></h4>
                        <ul class="list-disc pr-6 space-y-1 text-sm" style="color: var(--sf-text-secondary);">
                            <li>أوعية دقيقة جداً</li>
                            <li>جدارها بسمك خلية واحدة</li>
                            <li>مكان تبادل المواد</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> مكونات الجهاز الدوري</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> أجزاء القلب ووظائفها</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> مكونات الدم</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> الدورتين الصغرى والكبرى</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">القلب يضخ حوالي <span class="term">7,500 لتر من الدم يومياً</span>! أي ما يعادل 2.6 مليون لتر سنوياً. إجمالي طول الأوعية الدموية في جسم الإنسان حوالي <span class="term-danger">100,000 كيلومتر</span> - تكفي للف الأرض مرتين ونصف!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 5: المناعة
    // ============================================
    {
        id: 5,
        courseId: 10,
        title: "المناعة - جهاز المناعة والأمراض",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">🛡️ جهاز المناعة</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">جهاز المناعة هو خط الدفاع عن الجسم ضد الكائنات الممرضة (بكتيريا، فيروسات، فطريات، طفيليات) والمواد الغريبة.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">⚡ خطوط الدفاع الثلاثة:</h3>
                <ul class="list-disc pr-6 space-y-3 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term" style="background: rgba(6,118,47,0.12); color: #06762f; border-color: rgba(6,118,47,0.3);">الخط الأول</span>: الحواجز الخارجية (الجلد، الأغشية المخاطية)</li>
                    <li><span class="term" style="background: rgba(201,162,39,0.15); color: var(--oxford-gold-dark); border-color: rgba(201,162,39,0.4);">الخط الثاني</span>: المناعة الفطرية (خلايا البلعمة، الالتهاب، الحمى)</li>
                    <li><span class="term" style="background: rgba(211,51,51,0.1); color: #d33333; border-color: rgba(211,51,51,0.3);">الخط الثالث</span>: المناعة التكيفية (الأجسام المضادة، الخلايا الليمفاوية)</li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🚧 الخط الأول: الحواجز الخارجية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الجلد</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">حاجز ميكانيكي قوي يمنع دخول الميكروبات. يفرز مواد مضادة للبكتيريا.</p>
                </div>
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الأغشية المخاطية</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">تبطن الفتحات الطبيعية (الأنف، الفم، الجهاز التنفسي) وتفرز المخاط لاحتجاز الجراثيم.</p>
                </div>
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الدموع واللعاب</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2">تحتوي على إنزيم <span class="term">اللايسوزايم</span> الذي يكسر جدران البكتيريا.</p>
                </div>
                <div class="lesson-card-inner p-5 rounded-xl">
                    <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">حمض المعدة</span></h4>
                    <p style="color: var(--sf-text-secondary);" class="mt-2"><span class="term">HCl</span> القوي يقتل معظم الميكروبات الداخلة مع الطعام.</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">⚔️ الخط الثاني: المناعة الفطرية:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">استجابة سريعة وغير متخصصة، تحدث خلال دقائق من دخول الميكروب.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-blue);">🦠 <span class="term-title">البلعمة</span></h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">خلايا متخصصة (<span class="term">Macrophages</span>) تبلع وتقتل الميكروبات.</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: #d33333;">🔥 <span class="term-title">الالتهاب</span></h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">احمرار، سخونة، تورم، ألم - تجمع الدفاعات في مكان الإصابة.</p>
                    </div>
                    <div class="phase-card p-4 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: var(--oxford-gold-dark);">🌡️ <span class="term-title">الحمى</span></h4>
                        <p class="text-sm" style="color: var(--sf-text-secondary);">ارتفاع الحرارة يثبط نمو الميكروبات ويسرّع التفاعلات المناعية.</p>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🎯 الخط الثالث: المناعة التكيفية:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">استجابة بطيئة (أيام) لكنها متخصصة وتتذكر الميكروب لمواجهة أسرع في المستقبل.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="phase-card p-5 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: #4a3a7a;">🅰️ <span class="term-title">المناعة الخلوية</span></h4>
                        <p class="text-sm mb-2" style="color: var(--sf-text-secondary);">بوساطة الخلايا الليمفاوية التائية (<span class="term">T-Cells</span>).</p>
                        <p class="text-xs" style="color: var(--oxford-gold-dark);">تهاجم الخلايا المصابة بالفيروسات والخلايا السرطانية.</p>
                    </div>
                    <div class="phase-card p-5 rounded-xl">
                        <h4 class="font-bold text-xl mb-2" style="color: #4a3a7a;">🅱️ <span class="term-title">المناعة الخلطية</span></h4>
                        <p class="text-sm mb-2" style="color: var(--sf-text-secondary);">بوساطة الخلايا الليمفاوية البائية (<span class="term">B-Cells</span>).</p>
                        <p class="text-xs" style="color: var(--oxford-gold-dark);">تنتج الأجسام المضادة (<span class="term">Antibodies</span>) التي ترتبط بالميكروبات وتحيّدها.</p>
                    </div>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 أنواع المناعة المكتسبة:</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: #06762f;">🌟 <span class="term-title">المناعة الطبيعية</span></h4>
                        <ul class="list-disc pr-6 space-y-1 text-sm" style="color: var(--sf-text-secondary);">
                            <li><span class="term">فعالة</span>: بعد الإصابة بالمرض</li>
                            <li><span class="term">سلبية</span>: من الأم للجنين عبر المشيمة</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-2" style="color: var(--oxford-gold-dark);">💉 <span class="term-title">المناعة الصناعية</span></h4>
                        <ul class="list-disc pr-6 space-y-1 text-sm" style="color: var(--sf-text-secondary);">
                            <li><span class="term">فعالة</span>: بواسطة التطعيم (<span class="term">Vaccine</span>)</li>
                            <li><span class="term">سلبية</span>: بإعطاء الأجسام المضادة جاهزة</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="lesson-tip-danger p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: #d33333;">⚠️ اضطرابات المناعة:</h3>
                <ul class="list-disc pr-6 space-y-3 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term-danger">الحساسية (Allergy)</span>: رد فعل مبالغ فيه تجاه مواد غير ضارة (غبار، حبوب لقاح)</li>
                    <li><span class="term-danger">أمراض المناعة الذاتية</span>: مهاجمة الجسم لخلاياه (مثل: السكري النوع الأول، الروماتويد)</li>
                    <li><span class="term-danger">نقص المناعة</span>: ضعف الجهاز المناعي (مثل: الإيدز)</li>
                </ul>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> خطوط الدفاع الثلاثة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> أنواع المناعة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> الخلايا المناعية</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> اضطرابات المناعة</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">جسم الإنسان ينتج حوالي <span class="term">مليار خلية مناعية يومياً</span>! الخلايا الليمفاوية قادرة على تمييز <span class="term-danger">ملايين الميكروبات المختلفة</span>. التطعيمات أنقذت أكثر من <span class="term">154 مليون حياة</span> خلال الخمسين عاماً الماضية، وفقاً لمنظمة الصحة العالمية.</p>
            </div>
        </div>
        `,
        hasQuiz: true
    }

];