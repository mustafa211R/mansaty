// ============================================================
// دروس الرياضيات - الصف السادس العلمي
// منصة طالب - courseId: 11
// ============================================================

window.lessons_course11 = [

    // ============================================
    // الدرس 1: التكامل - الأساسيات
    // ============================================
    {
        id: 1,
        courseId: 11,
        title: "التكامل - الأساسيات والقواعد",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">∫ التكامل - العملية العكسية للتفاضل</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">التكامل هو العملية العكسية للتفاضل. يُستخدم لحساب المساحات تحت المنحنيات، الأحجام، والمسافات.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">📐 تعريف التكامل غير المحدد</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">إذا كانت <span class="math-inline">F'(x) = f(x)</span> فإن:</p>
                <div class="math-block">
                    <span class="math-formula">∫ f(x) dx = F(x) + C</span>
                </div>
                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">حيث <span class="term">C</span> هو <span class="term">ثابت التكامل</span>، و<span class="math-inline">F(x)</span> تسمى <span class="term">الدالة الأصلية</span>.</p>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔧 قواعد التكامل الأساسية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">قاعدة القوة</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">∫ xⁿ dx = xⁿ⁺¹ / (n+1) + C</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">بشرط أن يكون <span class="math-inline">n ≠ -1</span></p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">تكامل الثابت</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">∫ k dx = kx + C</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">حيث k ثابت</p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">تكامل 1/x</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">∫ (1/x) dx = ln|x| + C</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">الحالة الخاصة عند n = -1</p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">تكامل الدالة الأسية</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">∫ eˣ dx = eˣ + C</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">الدالة الأسية الطبيعية</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📐 قواعد الدوال المثلثية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">∫ sin(x) dx = -cos(x) + C</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">∫ cos(x) dx = sin(x) + C</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">∫ sec²(x) dx = tan(x) + C</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">∫ csc²(x) dx = -cot(x) + C</span>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🧮 مثال محلول:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--oxford-blue); font-weight: 700;">أوجد: <span class="math-inline">∫ (3x² + 2x + 5) dx</span></p>

                <div class="math-solution">
                    <div class="solution-step">
                        <span class="step-num">1</span>
                        <span class="step-text">نوزع التكامل على كل حد:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= ∫ 3x² dx + ∫ 2x dx + ∫ 5 dx</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">2</span>
                        <span class="step-text">نطبق قاعدة القوة على كل حد:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= 3 · (x³/3) + 2 · (x²/2) + 5x + C</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">3</span>
                        <span class="step-text">نبسط النتيجة:</span>
                        <div class="math-block-small math-final">
                            <span class="math-formula">= x³ + x² + 5x + C</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">📖 التكامل المحدد (Definite Integral)</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">يُستخدم لحساب المساحة تحت المنحنى بين قيمتين:</p>

                <div class="math-block">
                    <span class="math-formula">∫ₐᵇ f(x) dx = F(b) - F(a)</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">حيث <span class="math-inline">a</span> هو <span class="term">الحد الأدنى</span>، و<span class="math-inline">b</span> هو <span class="term">الحد الأعلى</span>.</p>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> مفهوم التكامل</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قواعد التكامل الأساسية</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> التكامل المحدد وغير المحدد</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> حل أمثلة تطبيقية</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">التكامل والمشتقة عمليتان <span class="term">عكسيتان</span>. إذا اشتققت التكامل، ستحصل على الدالة الأصلية. استخدم هذا للتحقق من صحة حلولك!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 2: التفاضل - المشتقات وقواعدها
    // ============================================
    {
        id: 2,
        courseId: 11,
        title: "التفاضل - المشتقات وقواعدها",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">d/dx التفاضل - معدل التغير</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">التفاضل (المشتقة) يقيس <span class="term">معدل التغير</span> في الدالة. يُستخدم لحساب الميل، السرعة، والتسارع.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">📐 تعريف المشتقة</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">مشتقة الدالة <span class="math-inline">f(x)</span> تُعرَّف بالنهاية:</p>

                <div class="math-block">
                    <span class="math-formula">f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">تُكتب المشتقة أيضاً بصيغة: <span class="math-inline">dy/dx</span> أو <span class="math-inline">f'(x)</span></p>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔧 قواعد التفاضل الأساسية:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">قاعدة القوة</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (xⁿ) = n · xⁿ⁻¹</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">مشتقة الثابت</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (k) = 0</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">مشتقة الجمع</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (f + g) = f' + g'</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">قاعدة الضرب</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">(f · g)' = f'·g + f·g'</span>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📐 مشتقات الدوال المشهورة:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (sin x) = cos x</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (cos x) = -sin x</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (eˣ) = eˣ</span>
                    </div>
                </div>
                <div class="math-card p-5 rounded-xl">
                    <div class="math-block-small">
                        <span class="math-formula">d/dx (ln x) = 1/x</span>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔗 قاعدة السلسلة (Chain Rule):</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">إذا كانت <span class="math-inline">y = f(g(x))</span> فإن:</p>

                <div class="math-block">
                    <span class="math-formula">dy/dx = f'(g(x)) · g'(x)</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">مثال: <span class="math-inline">d/dx [sin(3x²)] = cos(3x²) · 6x</span></p>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🧮 مثال محلول:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--oxford-blue); font-weight: 700;">أوجد مشتقة: <span class="math-inline">f(x) = 2x³ - 5x² + 7x - 3</span></p>

                <div class="math-solution">
                    <div class="solution-step">
                        <span class="step-num">1</span>
                        <span class="step-text">نشتق كل حد على حدة:</span>
                        <div class="math-block-small">
                            <span class="math-formula">f'(x) = d/dx(2x³) - d/dx(5x²) + d/dx(7x) - d/dx(3)</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">2</span>
                        <span class="step-text">نطبق قاعدة القوة:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= 2·3x² - 5·2x + 7·1 - 0</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">3</span>
                        <span class="step-text">النتيجة النهائية:</span>
                        <div class="math-block-small math-final">
                            <span class="math-formula">f'(x) = 6x² - 10x + 7</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> مفهوم المشتقة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قواعد التفاضل</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قاعدة السلسلة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> حل أمثلة تطبيقية</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">المشتقة عند نقطة معينة تمثل <span class="term">ميل المماس</span> للمنحنى عند تلك النقطة. إذا كانت المشتقة موجبة، فالدالة تتزايد. إذا كانت سالبة، فالدالة تتناقص!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 3: الهندسة والأشكال الهندسية
    // ============================================
    {
        id: 3,
        courseId: 11,
        title: "الهندسة والتحليل الهندسي",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">📐 الهندسة التحليلية</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">الهندسة التحليلية تدمج الجبر مع الهندسة لدراسة الأشكال باستخدام الإحداثيات والمعادلات.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">📍 نظام الإحداثيات الديكارتية</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">يتكون من محورين متعامدين: <span class="term">المحور السيني (x)</span> و<span class="term">المحور الصادي (y)</span>، يتقاطعان في <span class="term">نقطة الأصل (0, 0)</span>.</p>

                <div class="math-block">
                    <span class="math-formula">النقطة: P(x, y)</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📏 المسافة بين نقطتين:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">المسافة بين <span class="math-inline">A(x₁, y₁)</span> و <span class="math-inline">B(x₂, y₂)</span>:</p>

                <div class="math-block">
                    <span class="math-formula">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📐 ميل الخط المستقيم:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">ميل الخط المار بالنقطتين:</p>

                <div class="math-block">
                    <span class="math-formula">m = (y₂ - y₁) / (x₂ - x₁)</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">معادلة الخط المستقيم:</p>

                <div class="math-block">
                    <span class="math-formula">y - y₁ = m(x - x₁)</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">⭕ معادلة الدائرة:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الصيغة القياسية</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">(x - h)² + (y - k)² = r²</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">المركز: <span class="math-inline">(h, k)</span> — نصف القطر: <span class="math-inline">r</span></p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الصيغة العامة</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">x² + y² + Dx + Ey + F = 0</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">يتم تحويلها للإكمال المربع</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔺 المساحات والمحيطات:</h3>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <div class="overflow-x-auto">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>الشكل</th>
                                <th>المساحة</th>
                                <th>المحيط</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>المربع (ضلع a)</td>
                                <td><span class="math-inline">A = a²</span></td>
                                <td><span class="math-inline">P = 4a</span></td>
                            </tr>
                            <tr>
                                <td>المستطيل (a × b)</td>
                                <td><span class="math-inline">A = a·b</span></td>
                                <td><span class="math-inline">P = 2(a + b)</span></td>
                            </tr>
                            <tr>
                                <td>المثلث (قاعدة b, ارتفاع h)</td>
                                <td><span class="math-inline">A = ½ · b · h</span></td>
                                <td><span class="math-inline">P = a + b + c</span></td>
                            </tr>
                            <tr>
                                <td>الدائرة (نصف قطر r)</td>
                                <td><span class="math-inline">A = π·r²</span></td>
                                <td><span class="math-inline">C = 2π·r</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🧮 مثال محلول:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--oxford-blue); font-weight: 700;">أوجد معادلة الدائرة التي مركزها <span class="math-inline">(2, -3)</span> وتمر بالنقطة <span class="math-inline">(5, 1)</span></p>

                <div class="math-solution">
                    <div class="solution-step">
                        <span class="step-num">1</span>
                        <span class="step-text">نحسب نصف القطر باستخدام قانون المسافة:</span>
                        <div class="math-block-small">
                            <span class="math-formula">r = √[(5-2)² + (1-(-3))²] = √[9 + 16] = √25 = 5</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">2</span>
                        <span class="step-text">نطبق الصيغة القياسية:</span>
                        <div class="math-block-small math-final">
                            <span class="math-formula">(x - 2)² + (y + 3)² = 25</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> نظام الإحداثيات</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> المسافة والميل</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> معادلة الدائرة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> المساحات والمحيطات</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">إذا كان حاصل ضرب ميلي خطين متعامدين = <span class="term">-1</span>، فإن الخطين متعامدان. وإذا تساوى الميلان، فإن الخطين متوازيان. <span class="math-inline">m₁ · m₂ = -1</span></p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 4: الأعداد المركبة
    // ============================================
    {
        id: 4,
        courseId: 11,
        title: "الأعداد المركبة - العمليات والتطبيقات",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">𝑖 الأعداد المركبة</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">الأعداد المركبة توسع نظام الأعداد الحقيقية بإضافة <span class="term">الوحدة التخيلية i</span>، حيث <span class="math-inline">i² = -1</span>.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">📐 الشكل العام للعدد المركب</h3>

                <div class="math-block">
                    <span class="math-formula">z = a + bi</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">حيث:</p>
                <ul class="list-disc pr-6 space-y-2 text-lg" style="color: var(--sf-text-secondary);">
                    <li><span class="term">a</span> = الجزء الحقيقي (Real part)</li>
                    <li><span class="term">b</span> = الجزء التخيلي (Imaginary part)</li>
                    <li><span class="term">i</span> = الوحدة التخيلية، حيث <span class="math-inline">i² = -1</span></li>
                </ul>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔢 قوى الوحدة التخيلية i:</h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div class="math-card p-4 rounded-xl text-center">
                    <div class="math-formula">i¹ = i</div>
                </div>
                <div class="math-card p-4 rounded-xl text-center">
                    <div class="math-formula">i² = -1</div>
                </div>
                <div class="math-card p-4 rounded-xl text-center">
                    <div class="math-formula">i³ = -i</div>
                </div>
                <div class="math-card p-4 rounded-xl text-center">
                    <div class="math-formula">i⁴ = 1</div>
                </div>
            </div>

            <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">القوى تتكرر كل 4 قوى: <span class="math-inline">i⁵ = i</span>, <span class="math-inline">i⁶ = -1</span>, وهكذا.</p>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">➕ العمليات على الأعداد المركبة:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الجمع والطرح</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">(a+bi) + (c+di) = (a+c) + (b+d)i</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">نجمع الأجزاء الحقيقية والتخيلية كل على حدة</p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الضرب</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">(a+bi)(c+di) = (ac-bd) + (ad+bc)i</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">نستخدم خاصية التوزيع و i² = -1</p>
                </div>

                <div class="math-card p-5 rounded-xl md:col-span-2">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">القسمة</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">(a+bi)/(c+di) = [(a+bi)(c-di)] / (c²+d²)</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">نضرب البسط والمقام في <span class="term">المرافق</span> للمقام</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔁 المرافق (Conjugate):</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">مرافق العدد <span class="math-inline">z = a + bi</span> هو:</p>

                <div class="math-block">
                    <span class="math-formula">z̄ = a - bi</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">حاصل ضرب العدد في مرافقه:</p>

                <div class="math-block">
                    <span class="math-formula">z · z̄ = a² + b²</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📏 المقياس (Modulus):</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">مقياس العدد المركب <span class="math-inline">z = a + bi</span> هو:</p>

                <div class="math-block">
                    <span class="math-formula">|z| = √(a² + b²)</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🧮 مثال محلول:</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--oxford-blue); font-weight: 700;">احسب: <span class="math-inline">(3 + 2i) · (1 - 4i)</span></p>

                <div class="math-solution">
                    <div class="solution-step">
                        <span class="step-num">1</span>
                        <span class="step-text">نستخدم التوزيع:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= 3·1 + 3·(-4i) + 2i·1 + 2i·(-4i)</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">2</span>
                        <span class="step-text">نبسط الحدود:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= 3 - 12i + 2i - 8i²</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">3</span>
                        <span class="step-text">نعوض i² = -1:</span>
                        <div class="math-block-small">
                            <span class="math-formula">= 3 - 10i - 8(-1) = 3 - 10i + 8</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">4</span>
                        <span class="step-text">النتيجة النهائية:</span>
                        <div class="math-block-small math-final">
                            <span class="math-formula">= 11 - 10i</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> تعريف الأعداد المركبة</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> العمليات الحسابية</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> المرافق والمقياس</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> قوى i</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">الأعداد المركبة أساسية في <span class="term">الهندسة الكهربائية</span>، <span class="term">ميكانيكا الكم</span>، ومعالجة الإشارات. حتى أن معادلة شرودنغر الشهيرة تستخدم العدد التخيلي i!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    },

    // ============================================
    // الدرس 5: القطع الناقص والقطع الزائد
    // ============================================
    {
        id: 5,
        courseId: 11,
        title: "القطع الناقص والقطع الزائد",
        content: `
        <div class="lesson-content" dir="rtl">
            <h2 class="text-3xl font-bold mb-6" style="color: var(--oxford-blue);">🔵 القطوع المخروطية</h2>
            <p class="text-xl mb-6" style="color: var(--sf-text-secondary);">القطوع المخروطية هي منحنيات تنتج من تقاطع مستوٍ مع مخروط. أهمها: <span class="term">القطع الناقص (Ellipse)</span> و<span class="term">القطع الزائد (Hyperbola)</span>.</p>

            <div class="lesson-box p-6 rounded-2xl shadow-sm my-6">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-gold-dark);">⚪ القطع الناقص (Ellipse)</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">مجموعة النقاط التي مجموع بعديها عن بؤرتين ثابت.</p>

                <div class="math-block">
                    <span class="math-formula">x²/a² + y²/b² = 1</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔑 عناصر القطع الناقص:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">المحور الأكبر</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">طول المحور الأكبر = 2a</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">المحور الأصغر</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">طول المحور الأصغر = 2b</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">البعد البؤري</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">c² = a² - b²</span>
                    </div>
                    <p class="text-sm mt-2" style="color: var(--sf-text-tertiary);">حيث البؤرتان عند <span class="math-inline">(±c, 0)</span></p>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الاختلاف المركزي</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">e = c/a  حيث 0 < e < 1</span>
                    </div>
                </div>
            </div>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">🔴 القطع الزائد (Hyperbola)</h3>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">مجموعة النقاط التي الفرق المطلق لبعديها عن بؤرتين ثابت.</p>

                <div class="math-block">
                    <span class="math-formula">x²/a² - y²/b² = 1</span>
                </div>

                <p class="text-lg mt-4" style="color: var(--sf-text-secondary);">أو بالصيغة الرأسية:</p>

                <div class="math-block">
                    <span class="math-formula">y²/a² - x²/b² = 1</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🔑 عناصر القطع الزائد:</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">المحور الحقيقي</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">طول المحور الحقيقي = 2a</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">المحور المرافق</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">طول المحور المرافق = 2b</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">العلاقة البؤرية</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">c² = a² + b²</span>
                    </div>
                </div>

                <div class="math-card p-5 rounded-xl">
                    <h4 class="font-bold text-lg mb-2" style="color: var(--oxford-blue);">🔹 <span class="term-title">الاختلاف المركزي</span></h4>
                    <div class="math-block-small">
                        <span class="math-formula">e = c/a  حيث e > 1</span>
                    </div>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📐 خطوط التقارب (Asymptotes):</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">للقطع الزائد <span class="math-inline">x²/a² - y²/b² = 1</span>، خطوط التقارب هي:</p>

                <div class="math-block">
                    <span class="math-formula">y = ±(b/a) · x</span>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">📊 مقارنة شاملة:</h3>

            <div class="lesson-highlight p-6 rounded-2xl my-8">
                <div class="overflow-x-auto">
                    <table class="lesson-table">
                        <thead>
                            <tr>
                                <th>الوجه</th>
                                <th>القطع الناقص</th>
                                <th>القطع الزائد</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>المعادلة</td>
                                <td><span class="math-inline">x²/a² + y²/b² = 1</span></td>
                                <td><span class="math-inline">x²/a² - y²/b² = 1</span></td>
                            </tr>
                            <tr>
                                <td>العلاقة البؤرية</td>
                                <td><span class="math-inline">c² = a² - b²</span></td>
                                <td><span class="math-inline">c² = a² + b²</span></td>
                            </tr>
                            <tr>
                                <td>الاختلاف المركزي</td>
                                <td><span class="math-inline">e < 1</span></td>
                                <td><span class="math-inline">e > 1</span></td>
                            </tr>
                            <tr>
                                <td>خطوط التقارب</td>
                                <td>لا يوجد</td>
                                <td><span class="math-inline">y = ±(b/a)x</span></td>
                            </tr>
                            <tr>
                                <td>الشكل</td>
                                <td>مغلق (بيضاوي)</td>
                                <td>مفتوح (فرعان)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3 class="text-2xl font-bold mt-8 mb-4" style="color: var(--oxford-blue);">🧮 مثال محلول (القطع الناقص):</h3>

            <div class="lesson-card-inner p-6 rounded-2xl my-6">
                <p class="text-lg mb-4" style="color: var(--oxford-blue); font-weight: 700;">القطع الناقص: <span class="math-inline">x²/25 + y²/9 = 1</span></p>
                <p class="text-lg mb-4" style="color: var(--sf-text-secondary);">أوجد: المحاور، البؤر، الاختلاف المركزي</p>

                <div class="math-solution">
                    <div class="solution-step">
                        <span class="step-num">1</span>
                        <span class="step-text">نحدد القيم:</span>
                        <div class="math-block-small">
                            <span class="math-formula">a² = 25 ⇒ a = 5،  b² = 9 ⇒ b = 3</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">2</span>
                        <span class="step-text">المحوران:</span>
                        <div class="math-block-small">
                            <span class="math-formula">المحور الأكبر = 2a = 10،  المحور الأصغر = 2b = 6</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">3</span>
                        <span class="step-text">البعد البؤري:</span>
                        <div class="math-block-small">
                            <span class="math-formula">c² = a² - b² = 25 - 9 = 16 ⇒ c = 4</span>
                        </div>
                    </div>

                    <div class="solution-step">
                        <span class="step-num">4</span>
                        <span class="step-text">الاختلاف المركزي والبؤر:</span>
                        <div class="math-block-small math-final">
                            <span class="math-formula">e = c/a = 4/5 = 0.8،  البؤر: (±4, 0)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lesson-goals p-6 rounded-2xl my-8">
                <h3 class="font-bold text-2xl mb-4" style="color: var(--oxford-blue);">📚 أهداف الدرس</h3>
                <div class="grid grid-cols-2 gap-4" style="color: var(--sf-text-secondary);">
                    <div class="flex items-center"><span class="check-mark">✅</span> القطع الناقص ومعادلته</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> القطع الزائد ومعادلته</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> عناصر كل منهما</div>
                    <div class="flex items-center"><span class="check-mark">✅</span> المقارنة بينهما</div>
                </div>
            </div>

            <div class="lesson-tip p-6 rounded-2xl my-6">
                <h3 class="font-bold text-2xl mb-3" style="color: var(--oxford-gold-dark);">💡 معلومة للامتحان:</h3>
                <p class="text-lg" style="color: var(--sf-text-secondary);">القطوع المخروطية تُستخدم في <span class="term">مدارات الكواكب</span> (بيضاوية)، <span class="term">الأقمار الصناعية</span>، وأطباق <span class="term">الاستقبال اللاسلكي</span> (قطع مكافئ). القطع الزائد يُستخدم في نظام تحديد المواقع <span class="term">GPS</span>!</p>
            </div>
        </div>
        `,
        hasQuiz: true
    }

];