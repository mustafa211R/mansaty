// loading.js - إعادة كتابة كاملة مع تصميم جديد

class ChallengeLoader {
    
    constructor() {
        this.challenges = [];
        this.currentType = '';
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.userScores = [];
        this.totalQuestions = 0;
        this.timerInterval = null;
        this.timeLeft = 0;
        this.allChallenges = [];
        this.usedQuestionIds = new Set();
        this.totalPoints = 0;
        this.earnedPoints = 0;
        this.isAnswerLocked = false;

        // بيانات المستخدم
        this.userData = null;
        this.challengeStartTime = null;
        this.challengeInfo = null;

        // إعدادات التحديات
        this.challengeConfigs = {
            'Challenger': {
                time: 900,
                questions: 2000,
                name: 'المبتدئ',
                pointsPerQuestion: 5
            },
            'Adventurer': {
                time: 1500,
                questions: 2000,
                name: 'المغامر',
                pointsPerQuestion: 8
            },
            'Hacker': {
                time: 2400,
                questions: 2000,
                name: 'الهاكر',
                pointsPerQuestion: 12
            }
        };

        // مفتاح الأسئلة المستخدمة
        this.USED_QUESTIONS_KEY = 'used_questions';
    }






    
    /**
     * بدء تحميل التحديات
     */
    async loadChallenges(type) {
        try {
            console.log('🎯 بدء تحميل التحديات:', type);

            // التحقق من userManager
            if (!window.userManager) {
                throw new Error('نظام إدارة المستخدمين غير جاهز');
            }

            if (!userManager.isInitialized) {
                userManager.init();
            }

            // طلب معلومات المستخدم
            let userInfo;
            try {
                userInfo = await userManager.showUserInfoModal();
                console.log('✅ معلومات المستخدم:', userInfo);
            } catch (error) {
                if (error.message === 'تم إلغاء العملية') {
                    throw error;
                }
                userInfo = {
                    fullName: 'زائر',
                    grade: 'الصف 10',
                    subject: 'رياضيات',
                    timestamp: new Date().toISOString()
                };
            }

            // إعداد البيانات
            this.currentType = type;
            this.challengeStartTime = Date.now();
            this.challengeInfo = userInfo;

            const config = this.challengeConfigs[type];
            this.timeLeft = config.time;
            this.totalQuestions = config.questions;

            // تحميل الأسئلة
            await this.loadAllChallenges();

            // فلترة الأسئلة حسب المرحلة والمادة والمستوى
            this.challenges = this.filterQuestions(type, config.questions, userInfo);

            if (this.challenges.length === 0) {
                throw new Error('لا توجد أسئلة متاحة لهذه المرحلة والمادة');
            }

            // تهيئة البيانات
            this.userAnswers = new Array(this.challenges.length).fill('');
            this.userScores = new Array(this.challenges.length).fill(0);

            // حساب النقاط
            this.totalPoints = this.challenges.reduce((sum, challenge) =>
                sum + (challenge.points || config.pointsPerQuestion), 0);

            // بدء التحدي
            this.startTimer();
            this.displayQuestion(0);
            this.updateProgressBar();
            this.updateScoreBox();

            console.log(`✅ تم تحميل ${this.challenges.length} سؤال`);

        } catch (error) {
            console.error('❌ خطأ في تحميل التحديات:', error);

            if (error.message !== 'تم إلغاء العملية') {
                this.showError('تعذر تحميل التحديات. يرجى المحاولة مرة أخرى.');
            }
        }
    }

    /**
     * تحميل جميع الأسئلة
     */
    async loadAllChallenges() {
        try {
            if (window.defaultChallenges && Array.isArray(window.defaultChallenges)) {
                this.allChallenges = window.defaultChallenges;
                console.log(`✅ تم تحميل ${this.allChallenges.length} سؤال من challenges.js`);
            } else {
                throw new Error('لا توجد أسئلة محملة');
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل الأسئلة:', error);
            this.allChallenges = this.getDefaultChallenges();
        }
    }

    /**
     * فلترة الأسئلة (لا تظهر الأسئلة العامة)
     */
    filterQuestions(type, count, userInfo) {
        console.log(`🔍 فلترة الأسئلة: ${userInfo.grade} - ${userInfo.subject} - ${type}`);

        // فلترة حسب النوع والمرحلة والمادة فقط (لا تظهر أسئلة عامة)
        let filtered = this.allChallenges.filter(challenge => {
            const typeMatch = challenge.type === type;
            const gradeMatch = challenge.grade === userInfo.grade; // لا تظهر أسئلة عامة
            const subjectMatch = challenge.subject === userInfo.subject; // لا تظهر أسئلة عامة

            return typeMatch && gradeMatch && subjectMatch;
        });

        console.log(`✅ تم العثور على ${filtered.length} سؤال مطابق`);

        // إذا لم توجد أسئلة، نبحث عن أسئلة من نفس المرحلة
        if (filtered.length === 0) {
            filtered = this.allChallenges.filter(challenge =>
                challenge.type === type &&
                challenge.grade === userInfo.grade
            );
            console.log(`🔍 البحث في نفس المرحلة: ${filtered.length} سؤال`);
        }

        // إذا لم توجد أسئلة بعد، نستخدم الأسئلة الافتراضية
        if (filtered.length === 0) {
            console.warn('⚠️ لا توجد أسئلة مطابقة، استخدام الأسئلة الافتراضية');
            return this.getDefaultChallenges()
                .filter(challenge => challenge.type === type)
                .slice(0, count);
        }

        // استبعاد الأسئلة المستخدمة سابقاً
        const usedQuestions = JSON.parse(localStorage.getItem(this.USED_QUESTIONS_KEY) || '[]');
        const availableQuestions = filtered.filter(challenge =>
            !usedQuestions.includes(challenge.id)
        );

        // إذا لم توجد أسئلة متاحة، نستخدم أي أسئلة
        const questionsToUse = availableQuestions.length > 0 ? availableQuestions : filtered;

        // خلط واختيار الأسئلة
        const shuffled = this.shuffleArray([...questionsToUse]);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        // حفظ الأسئلة المستخدمة
        const newUsedQuestions = [...usedQuestions, ...selected.map(q => q.id)];
        localStorage.setItem(this.USED_QUESTIONS_KEY, JSON.stringify(newUsedQuestions));

        console.log(`🎯 تم اختيار ${selected.length} سؤال`);
        return selected;
    }

    /**
     * عرض السؤال مع التصميم الجديد
     */
    displayQuestion(index) {
        if (index < 0 || index >= this.challenges.length) return;

        this.currentQuestionIndex = index;
        this.isAnswerLocked = false;

        const challenge = this.challenges[index];
        const questionContainer = document.getElementById('question-container');

        // إضافة الأنماط
        this.addStyles();

        // بناء السؤال
        const questionHTML = `
            <!-- بطاقة السؤال -->
            <div class="question-card">
                <!-- رأس البطاقة -->
                <div class="question-header">
                    <div class="header-top">
                        <div class="question-counter">
                            <span class="counter-number">${index + 1}</span>
                            <span class="counter-text">من ${this.challenges.length}</span>
                        </div>
                        <div class="timer-box">
                            <i class="fas fa-clock"></i>
                            <span id="timer-display">${this.formatTime(this.timeLeft)}</span>
                        </div>
                    </div>
                    
                    <div class="question-meta">
                        <span class="meta-badge points">
                            <i class="fas fa-star"></i>
                            ${challenge.points || this.challengeConfigs[this.currentType].pointsPerQuestion} نقاط
                        </span>
                        <span class="meta-badge type">
                            <i class="fas fa-layer-group"></i>
                            ${challenge.format || 'خيار من متعدد'}
                        </span>
                    </div>
                </div>
                
                <!-- نص السؤال -->
                <div class="question-body">
                    <div class="question-text">
                        ${challenge.question}
                    </div>
                    
                    ${challenge.image ? `
                        <div class="question-image">
                            <img src="${challenge.image}" alt="صورة السؤال">
                        </div>
                    ` : ''}
                </div>
                
                <!-- الإجابة -->
                <div class="question-answer">
                    ${challenge.format === 'خيار من متعدد' ?
                this.buildMultipleChoice(challenge, index) :
                this.buildFillInBlank(challenge, index)}
                </div>
                
                <!-- زر التالي -->
                <div class="question-footer">
                    <button id="next-question-btn" class="next-btn" disabled>
                        <span>${index === this.challenges.length - 1 ? 'إنهاء التحدي' : 'التالي'}</span>
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <p id="answer-required" class="required-message hidden">
                        <i class="fas fa-exclamation-circle"></i>
                        يجب الإجابة قبل الانتقال
                    </p>
                </div>
            </div>
            
            <style>
/* ===== Score Box – App Style ===== */

.score-box-container {
    width: 100%;
    padding: 0.75rem;
    box-sizing: border-box;
}

/* البطاقة */
.score-box {
    width: 100%;
    background: #ffffff;
    border-radius: 14px;
    padding: 0.65rem 0.9rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.score-box:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

/* المحتوى العلوي */
.score-content {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

/* أيقونة */
.score-icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1rem;
}

/* معلومات */
.score-info {
    flex: 1;
    min-width: 0;
}

.score-title {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    line-height: 1.2;
}

.score-values {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
}

.score-percentage {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4f46e5;
}

/* شريط التقدم */
.score-progress {
    width: 100%;
    height: 5px;
    margin-top: 0.45rem;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #6366f1, #4f46e5);
    border-radius: 999px;
    transition: width 0.4s ease;
}

/* ===== تحسين الموبايل ===== */
@media (max-width: 640px) {
    .score-box-container {
        padding: 0.5rem;
    }

    .score-box {
        padding: 0.55rem 0.7rem;
        border-radius: 12px;
    }

    .score-icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        font-size: 0.9rem;
    }

    .score-values {
        font-size: 0.85rem;
    }

    .score-percentage {
        font-size: 0.7rem;
    }

    .score-progress {
        height: 4px;
    }
}

            </style>


            <!-- مربع النتيجة في الأسفل -->
            <div class="score-box-container">
                <div class="score-box">
                    <div class="score-content">
                        <div class="score-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="score-info">
                            <div class="score-title">النتيجة الحالية</div>
                            <div class="score-values">
                                <span id="current-score">${this.earnedPoints}</span>
                                <span class="score-separator">/</span>
                                <span>${this.totalPoints}</span>
                                <span class="score-percentage" id="current-percentage">(${this.calculatePercentage()}%)</span>
                            </div>
                        </div>
                    </div>
                    <div class="score-progress">
                        <div class="progress-bar" id="score-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;

        questionContainer.innerHTML = questionHTML;

        // إضافة المستمعات
        this.attachEventListeners(index);

        // استعادة الإجابة السابقة
        this.restorePreviousAnswer(index);

        // تحديث التقدم والنتيجة
        this.updateProgressBar();
        this.updateScoreBox();
    }

    /**
     * إضافة الأنماط
     */
    addStyles() {
        const styleId = 'challenge-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `



            /* تصميم السؤال */
            .question-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                padding: 24px;
                margin-bottom: 90px; /* مساحة لمربع النتيجة */
            }
            
            .question-header {
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 16px;
                margin-bottom: 24px;
            }
            
            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .question-counter {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .counter-number {
                background: #3b82f6;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
            }
            
            .counter-text {
                color: #6b7280;
                font-size: 14px;
            }
            
            .timer-box {
                background: #f3f4f6;
                padding: 8px 16px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #374151;
            }
            
            .timer-box i {
                color: #6b7280;
            }
            
            .question-meta {
                display: flex;
                gap: 8px;
            }
            
            .meta-badge {
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .meta-badge.points {
                background: #fef3c7;
                color: #92400e;
            }
            
            .meta-badge.type {
                background: #dbeafe;
                color: #1e40af;
            }
            
            /* نص السؤال */
            .question-body {
                margin-bottom: 32px;
            }
            
            .question-text {
                font-size: 20px;
                font-weight: 600;
                color: #1f2937;
                line-height: 1.6;
                margin-bottom: 20px;
                text-align: right;
            }
            
            .question-image {
                margin: 20px 0;
                text-align: center;
            }
            
            .question-image img {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            /* الخيارات */
            .options-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
            }
            
            .option-item {
                width: 100%;
            }
            
            .option-input {
                display: none;
            }
            
            .option-label {
                display: flex;
                align-items: center;
                padding: 18px 20px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .option-label:hover {
                border-color: #93c5fd;
                background: #f8fafc;
            }
            
            .option-input:checked + .option-label {
                border-color: #3b82f6;
                background: #eff6ff;
            }
            
            .option-letter {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f3f4f6;
                border-radius: 50%;
                font-weight: 700;
                font-size: 16px;
                color: #374151;
                margin-left: 12px;
                flex-shrink: 0;
            }
            
            .option-input:checked + .option-label .option-letter {
                background: #3b82f6;
                color: white;
            }
            
            .option-text {
                font-size: 17px;
                color: #1f2937;
                flex-grow: 1;
                text-align: right;
            }
            
            /* حقل الإدخال */
            .fill-blank-container {
                margin-bottom: 24px;
            }
            
            .question-parts {
                font-size: 18px;
                line-height: 1.6;
                color: #374151;
                margin-bottom: 20px;
                text-align: right;
            }
            
            .answer-input-wrapper {
                margin: 20px 0;
            }
            
            .answer-input {
                width: 100%;
                padding: 18px;
                font-size: 18px;
                border: 2px solid #d1d5db;
                border-radius: 12px;
                text-align: center;
                background: white;
                transition: all 0.3s;
            }
            
            .answer-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .answer-input.answered {
                background: #f0f9ff;
                border-color: #3b82f6;
            }
            
            .input-hint {
                font-size: 14px;
                color: #6b7280;
                text-align: center;
                margin-top: 12px;
            }
            
            /* زر التالي */
            .question-footer {
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            
            .next-btn {
                width: 100%;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                padding: 18px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                transition: all 0.3s;
            }
            
            .next-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            
            .next-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
            }
            
            .next-btn:active:not(:disabled) {
                transform: translateY(0);
            }
            
            .required-message {
                text-align: center;
                color: #dc2626;
                margin-top: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            
            .required-message.hidden {
                display: none;
            }
            
            /* مربع النتيجة في الأسفل */
            .score-box-container {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 16px;
                background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
                backdrop-filter: blur(10px);
                border-top: 1px solid #e5e7eb;
                z-index: 1000;
            }
            
            .score-box {
                background: #fef3c7;
                border: 2px solid #fbbf24;
                border-radius: 16px;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
                box-shadow: 0 4px 20px rgba(251, 191, 36, 0.2);
            }
            
            .score-content {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 16px;
            }
            
            .score-icon {
                width: 48px;
                height: 48px;
                background: #fbbf24;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }
            
            .score-info {
                flex-grow: 1;
            }
            
            .score-title {
                font-size: 14px;
                color: #92400e;
                margin-bottom: 4px;
                font-weight: 600;
            }
            
            .score-values {
                display: flex;
                align-items: baseline;
                gap: 8px;
                font-weight: 700;
            }
            
            #current-score {
                font-size: 32px;
                color: #92400e;
            }
            
            .score-separator {
                font-size: 24px;
                color: #d97706;
            }
            
            .score-percentage {
                font-size: 16px;
                color: #d97706;
                margin-right: auto;
            }
            
            .score-progress {
                height: 8px;
                background: #fde68a;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #f59e0b, #d97706);
                border-radius: 4px;
                transition: width 0.5s ease;
            }
            
            /* شريط التقدم */
            .progress-section {
                margin-bottom: 24px;
                padding: 0 16px;
            }
            
            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .progress-bar-bg {
                height: 12px;
                background: #e5e7eb;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #10b981);
                border-radius: 6px;
                transition: width 0.5s ease;
            }
            
            /* تحسينات للجوال */
            @media (max-width: 640px) {
                .question-card {
                    padding: 16px;
                    margin-bottom: 120px;
                }
                
                .question-text {
                    font-size: 18px;
                }
                
                .option-label {
                    padding: 16px;
                }
                
                .option-text {
                    font-size: 16px;
                }
                
                .next-btn {
                    padding: 16px;
                    font-size: 16px;
                }
                
                .score-box {
                    padding: 16px;
                }
                
                #current-score {
                    font-size: 28px;
                }
                
                .score-icon {
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                }
                
                .progress-section {
                    padding: 0 8px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * تحديث مربع النتيجة
     */
    updateScoreBox() {
        const percentage = this.calculatePercentage();

        // تحديث النص
        const scoreElement = document.getElementById('current-score');
        const percentageElement = document.getElementById('current-percentage');
        const progressBar = document.getElementById('score-progress-bar');

        if (scoreElement) {
            scoreElement.textContent = this.earnedPoints;
        }

        if (percentageElement) {
            percentageElement.textContent = `(${percentage}%)`;
        }

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * حساب النسبة المئوية
     */
    calculatePercentage() {
        return this.totalPoints > 0 ? Math.round((this.earnedPoints / this.totalPoints) * 100) : 0;
    }

    /**
     * تحديث شريط التقدم
     */
    updateProgressBar() {
        const answered = this.userAnswers.filter(answer => answer && answer.trim() !== '').length;
        const total = this.challenges.length;
        const percentage = Math.round((answered / total) * 100);

        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${answered}/${total}`;
        }
    }

    /**
     * إضافة المستمعات
     */
    attachEventListeners(index) {
        const nextBtn = document.getElementById('next-question-btn');
        if (nextBtn) {
            nextBtn.onclick = null;
            nextBtn.addEventListener('click', () => this.nextQuestion(), { once: true });
        }

        // خيارات متعددة
        document.querySelectorAll(`input[name="answer-${index}"]`).forEach(input => {
            input.onchange = null;
            input.addEventListener('change', (e) => {
                this.handleOptionSelection(index, e.target.value, e.target.id);
            });
        });

        // حقل إدخال
        const inputField = document.getElementById(`answer-input-${index}`);
        if (inputField) {
            inputField.oninput = null;
            inputField.addEventListener('input', (e) => {
                this.handleFillInInput(index, e.target.value);
            });

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && inputField.value.trim() !== '') {
                    this.nextQuestion();
                }
            });
        }
    }

    /**
     * معالجة اختيار الخيار
     */
    handleOptionSelection(index, answer, optionId) {
        this.userAnswers[index] = answer;
        this.isAnswerLocked = true;

        // تمييز الخيار المختار
        const label = document.querySelector(`label[for="${optionId}"]`);
        if (label) {
            label.classList.add('selected-answer');
        }

        // تعطيل الخيارات الأخرى
        document.querySelectorAll(`input[name="answer-${index}"]`).forEach(input => {
            if (input.id !== optionId) {
                input.disabled = true;
            }
        });

        this.enableNextButton();
        this.updateProgressBar();
        this.calculateCurrentQuestionScore();
        this.updateScoreBox();
    }

    /**
     * معالجة إدخال الفراغ
     */
    handleFillInInput(index, value) {
        this.userAnswers[index] = value.trim();

        if (value.trim() !== '') {
            this.enableNextButton();
            const input = document.getElementById(`answer-input-${index}`);
            if (input) {
                input.classList.add('answered');
            }
        } else {
            this.disableNextButton();
            const input = document.getElementById(`answer-input-${index}`);
            if (input) {
                input.classList.remove('answered');
            }
        }

        this.updateProgressBar();
    }

    /**
     * تفعيل زر التالي
     */
    enableNextButton() {
        const nextBtn = document.getElementById('next-question-btn');
        const answerRequired = document.getElementById('answer-required');

        if (nextBtn) {
            nextBtn.disabled = false;
        }

        if (answerRequired) {
            answerRequired.classList.add('hidden');
        }
    }

    /**
     * تعطيل زر التالي
     */
    disableNextButton() {
        const nextBtn = document.getElementById('next-question-btn');
        const answerRequired = document.getElementById('answer-required');

        if (nextBtn) {
            nextBtn.disabled = true;
        }

        if (answerRequired) {
            answerRequired.classList.remove('hidden');
        }
    }

    /**
     * الانتقال للسؤال التالي
     */
    nextQuestion() {
        const currentAnswer = this.userAnswers[this.currentQuestionIndex];
        if (!currentAnswer || currentAnswer.trim() === '') {
            this.showAnswerRequired();
            return;
        }

        this.calculateCurrentQuestionScore();

        if (this.currentQuestionIndex < this.challenges.length - 1) {
            this.displayQuestion(this.currentQuestionIndex + 1);
        } else {
            this.submitChallenge();
        }
    }

    /**
     * تقديم التحدي
     */
    async submitChallenge() {
        console.log('📤 تقديم التحدي...');
        clearInterval(this.timerInterval);

        // حساب السؤال الأخير
        if (this.userAnswers[this.currentQuestionIndex]) {
            this.calculateCurrentQuestionScore();
        }

        // عرض التحميل
        this.showLoading('جاري حساب النتائج...');

        // حساب النتيجة النهائية
        const score = this.calculateFinalScore();
        const timeSpent = Math.floor((Date.now() - this.challengeStartTime) / 1000);
        // الحصول على تفاصيل الإجابات
        const detailedResults = this.getDetailedResults();
        // تجهيز البيانات
        const challengeData = {
            ...score,
            challengeType: this.currentType,
            grade: this.challengeInfo?.grade || 'غير محدد',
            subject: this.challengeInfo?.subject || 'رياضيات',
            fullName: this.challengeInfo?.fullName || 'زائر',
            totalTime: this.challengeConfigs[this.currentType].time,
            timeLeft: this.timeLeft,
            timeSpent: timeSpent,
            passed: score.percentage >= 80,
            date: new Date().toISOString(),
            detailedResults: detailedResults  // تأكد من إرسال التفاصيل
        };

        try {
            // حفظ محلياً
            const localSave = this.saveResultsLocally(challengeData);
            console.log('💾 النتيجة المحفوظة محلياً:', localSave);

            // حفظ وإرسال عبر info_temp.js
            let sheetsSave = { success: false };
            if (window.infoTemp) {
                try {
                    // حفظ مؤقتاً
                    const tempSave = infoTemp.saveTempData(challengeData);
                    console.log('💾 النتيجة المحفوظة في info_temp.js:', tempSave.id);

                    // محاولة الإرسال
                    sheetsSave = await infoTemp.sendData(challengeData);
                    console.log('📤 نتيجة الإرسال:', sheetsSave);

                } catch (error) {
                    console.error('❌ خطأ في إرسال البيانات:', error);
                    sheetsSave = {
                        success: false,
                        error: error.message
                    };
                }
            }

            // عرض النتيجة
            this.showDetailedResult(score, challengeData, {
                localSave: localSave,
                sheetsSave: sheetsSave
            });

        } catch (error) {
            console.error('❌ خطأ في حفظ النتائج:', error);
            this.showError('حدث خطأ في حفظ النتائج');
        }
    }

    /**
     * حساب درجة السؤال الحالي
     */
    calculateCurrentQuestionScore() {
        const challenge = this.challenges[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        const correctAnswer = challenge.correctAnswer;

        const isCorrect = this.checkAnswer(userAnswer, correctAnswer);
        const points = challenge.points || this.challengeConfigs[this.currentType].pointsPerQuestion;

        this.userScores[this.currentQuestionIndex] = isCorrect ? points : 0;
        this.earnedPoints = this.userScores.reduce((sum, score) => sum + score, 0);

        console.log(`📊 السؤال ${this.currentQuestionIndex + 1}: ${isCorrect ? '✅' : '❌'} - ${points} نقطة`);
    }

    /**
     * فحص الإجابة
     */
    checkAnswer(userAnswer, correctAnswer) {
        if (!userAnswer || !correctAnswer) return false;

        const normalize = (text) => {
            return text
                .trim()
                .toLowerCase()
                .replace(/\s+/g, ' ')
                .replace(/[.,،;؛]/g, '')
                .normalize('NFKD')
                .replace(/[\u064B-\u065F]/g, '');
        };

        const normalizedUser = normalize(userAnswer);
        const normalizedCorrect = normalize(correctAnswer);

        return normalizedUser === normalizedCorrect;
    }

    /**
     * حساب النتيجة النهائية
     */
    calculateFinalScore() {
        // إعادة حساب جميع الدرجات
        this.challenges.forEach((challenge, index) => {
            if (this.userAnswers[index]) {
                const isCorrect = this.checkAnswer(this.userAnswers[index], challenge.correctAnswer);
                const points = challenge.points || this.challengeConfigs[this.currentType].pointsPerQuestion;
                this.userScores[index] = isCorrect ? points : 0;
            } else {
                this.userScores[index] = 0;
            }
        });

        this.earnedPoints = this.userScores.reduce((sum, score) => sum + score, 0);

        return {
            earnedPoints: this.earnedPoints,
            totalPoints: this.totalPoints,
            percentage: this.totalPoints > 0 ? Math.round((this.earnedPoints / this.totalPoints) * 100) : 0,
            correctAnswers: this.userScores.filter(score => score > 0).length,
            totalQuestions: this.challenges.length,
            wrongAnswers: this.userScores.filter(score => score === 0).length
        };
    }

    /**
     * الحصول على تفاصيل النتائج
     */
    getDetailedResults() {
        return this.challenges.map((challenge, index) => ({
            questionNumber: index + 1,
            question: challenge.question,
            userAnswer: this.userAnswers[index] || 'لم يتم الإجابة',
            correctAnswer: challenge.correctAnswer,
            isCorrect: this.checkAnswer(this.userAnswers[index] || '', challenge.correctAnswer),
            points: this.userScores[index] || 0,
            maxPoints: challenge.points || this.challengeConfigs[this.currentType].pointsPerQuestion,
            format: challenge.format || 'خيار من متعدد'
        }));
    }

    /**
     * حفظ النتائج محلياً
     */
    saveResultsLocally(challengeData) {
        try {
            let history = JSON.parse(localStorage.getItem('challenge_history') || '[]');

            const entry = {
                id: Date.now().toString(),
                ...challengeData,
                savedAt: new Date().toISOString()
            };

            history.unshift(entry);

            if (history.length > 50) {
                history = history.slice(0, 50);
            }

            localStorage.setItem('challenge_history', JSON.stringify(history));

            return { success: true, id: entry.id };

        } catch (error) {
            console.error('❌ خطأ في الحفظ المحلي:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * تشغيل المؤقت
     */
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            const timerElement = document.getElementById('timer-display');
            if (timerElement) {
                timerElement.textContent = this.formatTime(this.timeLeft);

                if (this.timeLeft <= 60) {
                    timerElement.style.color = '#dc2626';
                    timerElement.classList.add('animate-pulse');
                }
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.submitChallenge();
            }
        }, 1000);
    }

    // ===== الدوال المساعدة =====

    buildMultipleChoice(challenge, index) {
        const shuffledOptions = this.shuffleArray([...challenge.options]);
        const letters = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي'];

        let html = '<div class="options-container">';

        shuffledOptions.forEach((option, i) => {
            const optionId = `option-${index}-${i}`;
            const letter = letters[i] || String.fromCharCode(1570 + i);

            html += `
                <div class="option-item">
                    <input type="radio" 
                           id="${optionId}" 
                           name="answer-${index}" 
                           value="${option}" 
                           class="option-input"
                           ${this.isAnswerLocked ? 'disabled' : ''}>
                    <label for="${optionId}" class="option-label">
                        <span class="option-letter">${letter}</span>
                        <span class="option-text">${option}</span>
                    </label>
                </div>
            `;
        });

        html += '</div>';

        return html;
    }

    buildFillInBlank(challenge, index) {
        const questionParts = challenge.question.split('____');

        return `
            <div class="fill-blank-container">
                ${questionParts[0] ? `
                    <div class="question-parts">
                        ${questionParts[0]}
                    </div>
                ` : ''}
                
                <div class="answer-input-wrapper">
                    <input type="text" 
                           id="answer-input-${index}" 
                           class="answer-input"
                           placeholder="اكتب إجابتك هنا..."
                           autocomplete="off"
                           ${this.isAnswerLocked ? 'readonly' : ''}>
                </div>
                
                ${questionParts[1] ? `
                    <div class="question-parts">
                        ${questionParts[1]}
                    </div>
                ` : ''}
                
                <p class="input-hint">
                    <i class="fas fa-info-circle"></i>
                    اكتب إجابتك واضغط Enter للمتابعة
                </p>
            </div>
        `;
    }

    restorePreviousAnswer(index) {
        const challenge = this.challenges[index];

        if (this.userAnswers[index]) {
            if (challenge.format === 'خيار من متعدد') {
                const radio = document.querySelector(`input[name="answer-${index}"][value="${this.userAnswers[index]}"]`);
                if (radio) {
                    radio.checked = true;
                    this.handleOptionSelection(index, this.userAnswers[index], radio.id);
                }
            } else {
                const input = document.getElementById(`answer-input-${index}`);
                if (input) {
                    input.value = this.userAnswers[index];
                    input.classList.add('answered');
                    this.enableNextButton();
                }
            }
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    showAnswerRequired() {
        const answerRequired = document.getElementById('answer-required');
        if (answerRequired) {
            answerRequired.classList.remove('hidden');
            setTimeout(() => answerRequired.classList.remove('animate-pulse'), 2000);
        }
    }

    showLoading(message) {
        const container = document.getElementById('question-container');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
            <style>
                .loading-container {
                    text-align: center;
                    padding: 60px 20px;
                }
                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    showError(message) {
        const container = document.getElementById('question-container');
        container.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ</h3>
                <p>${message}</p>
                <button onclick="location.reload()">إعادة التحميل</button>
            </div>
            <style>
                .error-container {
                    text-align: center;
                    padding: 60px 20px;
                }
                .error-container i {
                    font-size: 48px;
                    color: #dc2626;
                    margin-bottom: 20px;
                }
                .error-container h3 {
                    font-size: 24px;
                    color: #7f1d1d;
                    margin-bottom: 10px;
                }
                .error-container p {
                    font-size: 16px;
                    color: #991b1b;
                    margin-bottom: 30px;
                }
                .error-container button {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>
        `;
    }

    showDetailedResult(score, challengeData, saveResult) {
        const container = document.getElementById('question-container');
        const isPassed = score.percentage >= 80;

        // بناء HTML لتفاصيل الإجابات
        let answersDetailsHTML = '';

        if (challengeData.detailedResults && Array.isArray(challengeData.detailedResults)) {
            answersDetailsHTML = `
            <div class="answers-summary">
                <h3><i class="fas fa-list-check"></i> تفاصيل الإجابات</h3>
                
                <div class="summary-stats">
                    <div class="summary-stat correct">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <span class="stat-value">${score.correctAnswers}</span>
                            <span class="stat-label">إجابة صحيحة</span>
                        </div>
                    </div>
                    <div class="summary-stat wrong">
                        <i class="fas fa-times-circle"></i>
                        <div>
                            <span class="stat-value">${score.wrongAnswers}</span>
                            <span class="stat-label">إجابة خاطئة</span>
                        </div>
                    </div>
                    <div class="summary-stat skipped">
                        <i class="fas fa-minus-circle"></i>
                        <div>
                            <span class="stat-value">${score.totalQuestions - (score.correctAnswers + score.wrongAnswers)}</span>
                            <span class="stat-label">لم يتم الإجابة</span>
                        </div>
                    </div>
                </div>
                
                <div class="answers-list">
                    ${challengeData.detailedResults.map((result, index) => `
                        <div class="answer-item ${result.isCorrect ? 'correct' : 'wrong'}">
                            <div class="answer-header">
                                <div class="answer-number">
                                    <span>السؤال ${result.questionNumber}</span>
                                    <span class="answer-points">${result.points}/${result.maxPoints} نقطة</span>
                                </div>
                                <div class="answer-status">
                                    ${result.isCorrect ?
                    '<span class="status-badge correct"><i class="fas fa-check"></i> صحيح</span>' :
                    '<span class="status-badge wrong"><i class="fas fa-times"></i> خطأ</span>'
                }
                                </div>
                            </div>
                            
                            <div class="answer-question">
                                <p><strong>السؤال:</strong> ${result.question}</p>
                            </div>
                            
                            <div class="answer-details">
                                <div class="user-answer">
                                    <span class="detail-label"><i class="fas fa-user"></i> إجابتك:</span>
                                    <span class="detail-value ${result.isCorrect ? 'text-green-600' : 'text-red-600'}">${result.userAnswer || 'لم يتم الإجابة'}</span>
                                </div>
                                
                                ${!result.isCorrect ? `
                                    <div class="correct-answer">
                                        <span class="detail-label"><i class="fas fa-check-double"></i> الإجابة الصحيحة:</span>
                                        <span class="detail-value text-green-600">${result.correctAnswer}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        }

        container.innerHTML = `
        <div class="result-container">
            <!-- رأس النتيجة -->
            <div class="result-header">
                <i class="fas ${isPassed ? 'fa-trophy' : 'fa-times-circle'}"></i>
                <h2>${isPassed ? '🎉 مبروك! لقد نجحت' : '💪 تحتاج لمزيد من التحسين'}</h2>
                <p class="result-subtitle">${isPassed ?
                'أحسنت! استمر في التميز وتعلم المزيد' :
                'لا تستسلم! كل محاولة جديدة تساعدك على التحسن'}</p>
            </div>
            
            <!-- الإحصائيات الرئيسية -->
            <div class="result-stats">
                <div class="stat-card percentage">
                    <div class="stat-value">${score.percentage}%</div>
                    <div style="color: aliceblue;"   class="stat-label">النسبة المئوية</div>
                </div>
                <div class="stat-card score">
                    <div class="stat-value">${score.earnedPoints}/${score.totalPoints}</div>
                    <div  style="color: aliceblue;"  class="stat-label">النقاط</div>
                </div>
                <div class="stat-card correct">
                    <div class="stat-value">${score.correctAnswers}/${score.totalQuestions}</div>
                    <div style="color: aliceblue;"  class="stat-label">الإجابات الصحيحة</div>
                </div>
            </div>
            
            <!-- تفاصيل النتيجة -->
            <div class="result-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="detail-label">الوقت المستغرق</span>
                        <span class="detail-value">${this.formatTime(challengeData.timeSpent)}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-layer-group"></i>
                    <div>
                        <span class="detail-label">مستوى التحدي</span>
                        <span class="detail-value">${this.challengeConfigs[this.currentType]?.name || this.currentType}</span>
                    </div>
                </div>
                ${this.challengeInfo ? `
                    <div class="detail-item">
                        <i class="fas fa-user-graduate"></i>
                        <div>
                            <span class="detail-label">الطالب</span>
                            <span class="detail-value">${this.challengeInfo.fullName}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <div>
                            <span class="detail-label">المرحلة</span>
                            <span class="detail-value">${this.challengeInfo.grade}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-book"></i>
                        <div>
                            <span class="detail-label">المادة</span>
                            <span class="detail-value">${this.challengeInfo.subject}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- تفاصيل الإجابات -->
            ${answersDetailsHTML}
            
            <!-- حالة الحفظ -->
            ${window.infoTemp ? `
                <div class="save-status ${saveResult.sheetsSave?.success ? 'success' : 'pending'}">
                    <i class="fas ${saveResult.sheetsSave?.success ? 'fa-check-circle' : 'fa-database'}"></i>
                    <div>
                        <span class="status-title">${saveResult.sheetsSave?.success ? 'تم حفظ النتائج' : 'تم حفظ النتائج مؤقتاً'}</span>
                        <span class="status-subtitle">
                            ${saveResult.sheetsSave?.success ?
                    '✓ تم إرسال النتائج إلى Google Sheets' :
                    '✓ سيتم إعادة المحاولة تلقائياً'}
                        </span>
                    </div>
                </div>
            ` : ''}
            
            <!-- أزرار الإجراء -->
            <div class="result-actions">
                <button onclick="challengeLoader.loadChallenges('${this.currentType}')" class="btn-retry">
                    <i class="fas fa-redo"></i>
                    <span>محاولة أخرى</span>
                </button>
                <button onclick="location.reload()" class="btn-home">
                    <i class="fas fa-home"></i>
                    <span>العودة للرئيسية</span>
                </button>
            </div>
        </div>
        
        <!-- الأنماط الإضافية -->
        <style>
            /* إضافات لأنماط تفاصيل الإجابات */
            .answers-summary {
                background: #f9fafb;
                border-radius: 16px;
                padding: 24px;
                margin: 24px 0;
                border: 1px solid #e5e7eb;
            }
            
            .answers-summary h3 {
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .answers-summary h3 i {
                color: #3b82f6;
            }
            
            .summary-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-bottom: 24px;
            }
            
            .summary-stat {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                border-radius: 12px;
                background: white;
            }
            
            .summary-stat.correct {
                border-right: 4px solid #10b981;
            }
            
            .summary-stat.wrong {
                border-right: 4px solid #ef4444;
            }
            
            .summary-stat.skipped {
                border-right: 4px solid #6b7280;
            }
            
            .summary-stat i {
                font-size: 24px;
            }
            
            .summary-stat.correct i {
                color: #10b981;
            }
            
            .summary-stat.wrong i {
                color: #ef4444;
            }
            
            .summary-stat.skipped i {
                color: #6b7280;
            }
            
            .stat-value {
                display: block;
                font-size: 24px;
                font-weight: 700;
            }
            
            .stat-label {
                display: block;
                font-size: 14px;
                color: #6b7280;
            }
            
            .answers-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .answer-item {
                background: white;
                border-radius: 12px;
                padding: 20px;
                border: 1px solid #e5e7eb;
                transition: all 0.3s;
            }
            
            .answer-item.correct {
                border-right: 4px solid #10b981;
                background: #f0fdf4;
            }
            
            .answer-item.wrong {
                border-right: 4px solid #ef4444;
                background: #fef2f2;
            }
            
            .answer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .answer-number {
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .answer-points {
                background: #f3f4f6;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                color: #6b7280;
            }
            
            .answer-item.correct .answer-points {
                background: #d1fae5;
                color: #065f46;
            }
            
            .answer-item.wrong .answer-points {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .status-badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .status-badge.correct {
                background: #d1fae5;
                color: #065f46;
            }
            
            .status-badge.wrong {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .answer-question {
                margin-bottom: 16px;
            }
            
            .answer-question p {
                margin: 0;
                color: #4b5563;
                line-height: 1.6;
            }
            
            .answer-question strong {
                color: #1f2937;
                font-weight: 600;
            }
            
            .answer-details {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding-top: 16px;
                border-top: 1px solid #e5e7eb;
            }
            
            .user-answer, .correct-answer {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .detail-label {
                font-weight: 600;
                color: #6b7280;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 120px;
            }
            
            .detail-value {
                font-weight: 500;
                font-size: 15px;
                flex-grow: 1;
            }
            
            .text-green-600 {
                color: #059669;
            }
            
            .text-red-600 {
                color: #dc2626;
            }
            
            /* تحسينات الإحصائيات */
            .result-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .stat-card {
                padding: 24px;
                border-radius: 16px;
                text-align: center;
                color: white;
            }
            
            .stat-card.percentage {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            }
            
            .stat-card.score {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .stat-card.correct {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            }
            
            /* تحسينات تفاصيل النتيجة */
            .result-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                background: #f9fafb;
                border-radius: 16px;
                padding: 24px;
                margin: 24px 0;
                border: 1px solid #e5e7eb;
            }
            
            .detail-item {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .detail-item i {
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #3b82f6;
                font-size: 18px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            
            .detail-label {
                display: block;
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 4px;
            }
            
            .detail-value {
                display: block;
                font-weight: 600;
                color: #1f2937;
                font-size: 16px;
            }
            
            /* تحسينات حالة الحفظ */
            .save-status {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                border-radius: 16px;
                margin: 24px 0;
            }
            
            .save-status.success {
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                color: #059669;
            }
            
            .save-status.pending {
                background: #eff6ff;
                border: 1px solid #dbeafe;
                color: #3b82f6;
            }
            
            .save-status i {
                font-size: 32px;
            }
            
            .status-title {
                display: block;
                font-weight: 700;
                font-size: 18px;
                margin-bottom: 4px;
            }
            
            .status-subtitle {
                display: block;
                font-size: 14px;
                opacity: 0.8;
            }
            
            /* تحسينات الأزرار */
            .result-actions {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-top: 32px;
            }
            
            .result-actions button {
                padding: 18px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s;
            }
            
            .btn-retry {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
            }
            
            .btn-home {
                background: linear-gradient(135deg, #6b7280, #4b5563);
                color: white;
            }
            
            .result-actions button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .result-actions button:active {
                transform: translateY(0);
            }
            
            /* تحسينات للجوال */
            @media (max-width: 768px) {
                .result-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .summary-stats {
                    grid-template-columns: 1fr;
                }
                
                .result-details {
                    grid-template-columns: 1fr;
                }
                
                .answer-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .user-answer, .correct-answer {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 6px;
                }
                
                .detail-label {
                    min-width: auto;
                }
                
                .result-actions {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 480px) {
                .result-stats {
                    grid-template-columns: 1fr;
                }
                
                .stat-card {
                    padding: 20px;
                }
                
                .answers-summary,
                .result-details {
                    padding: 20px;
                }
                
                .answer-item {
                    padding: 16px;
                }
            }
        </style>
    `;
    }

    getDefaultChallenges() {
        return [
            {
                id: 'default-1',
                type: 'Challenger',
                grade: 'الصف 10',
                subject: 'الرياضيات',
                question: 'ما هو ناتج ٢ + ٢؟',
                format: 'خيار من متعدد',
                options: ['٣', '٤', '٥', '٦'],
                correctAnswer: '٤',
                points: 5
            },
            {
                id: 'default-2',
                type: 'Challenger',
                grade: 'الصف 10',
                subject: 'العربي',
                question: 'ما هو جمع كلمة "كتاب"؟',
                format: 'خيار من متعدد',
                options: ['كتب', 'كتابات', 'كتابان', 'مكتبات'],
                correctAnswer: 'كتب',
                points: 5
            }
        ];
    }

    async safeStart(type) {
        try {
            await this.loadChallenges(type);
        } catch (error) {
            this.showError('تعذر بدء التحدي');
        }
    }


    
}

// إنشاء الكائن العام
const challengeLoader = new ChallengeLoader();

if (typeof window !== 'undefined') {
    window.challengeLoader = challengeLoader;
    console.log('🚀 Challenge Loader loaded successfully');
}


// ===== Hacker Terminal Design ULTIMATE - Performance Optimized =====

const hackerTerminalUltimateStyles = `
/* ===== Hacker Terminal ULTIMATE Theme ===== */

/* إضافة خط Terminus فقط (أخف للأداء) */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/* متغيرات الألوان الأساسية (الأبيض والأخضر فقط) */
:root {
    --hacker-green: #00ff41;
    --hacker-light: #00ff88;
    --terminal-bg: #0a0a0a;
    --terminal-text: #ffffff;
    --terminal-gray: #333333;
}

/* إزالة جميع الأنيميشن الثقيلة والاحتفاظ بالضروري فقط */

/* نافذة السؤال - خفيف وسريع */
.challenge-level-hacker .question-card {
    background: var(--terminal-bg) !important;
    border: 2px solid var(--hacker-green) !important;
    border-radius: 10px !important;
    padding: 20px !important;
    margin-bottom: 100px !important;
    position: relative;
    overflow: hidden;
    font-family: 'JetBrains Mono', 'Courier New', monospace !important;
    transition: transform 0.2s ease !important;
}

.challenge-level-hacker .question-card:hover {
    transform: translateY(-2px) !important;
}

/* هيدر السؤال - بسيط */
.challenge-level-hacker .question-header {
    background: rgba(20, 20, 20, 0.9) !important;
    border-bottom: 2px solid var(--hacker-green) !important;
    padding: 15px !important;
    margin: -20px -20px 20px -20px !important;
}

/* عداد الأسئلة */
.challenge-level-hacker .question-counter {
    background: rgba(0, 30, 0, 0.8) !important;
    border: 1px solid var(--hacker-green) !important;
    border-radius: 20px !important;
    padding: 8px 16px !important;
    display: flex;
    align-items: center;
    gap: 10px;
}

.challenge-level-hacker .counter-number {
    background: var(--hacker-green) !important;
    color: #000000 !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    width: 35px !important;
    height: 35px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50% !important;
}

.challenge-level-hacker .counter-text {
    color: var(--hacker-light) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 500 !important;
}

/* التايمر */
.challenge-level-hacker .timer-box {
    background: rgba(0, 20, 0, 0.8) !important;
    border: 1px solid var(--hacker-green) !important;
    border-radius: 20px !important;
    padding: 8px 16px !important;
    color: var(--hacker-green) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    display: flex;
    align-items: center;
    gap: 8px;
}

.challenge-level-hacker .timer-box i {
    color: var(--hacker-green) !important;
}

/* نص السؤال - أبيض مع تأثير بسيط */
.challenge-level-hacker .question-text {
    color: var(--terminal-text) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 400 !important;
    font-size: 18px !important;
    line-height: 1.6 !important;
    padding: 15px !important;
    background: rgba(0, 20, 0, 0.2) !important;
    border-radius: 8px !important;
    border-left: 3px solid var(--hacker-green) !important;
    margin: 20px 0 !important;
}

/* مؤشر الكتابة البسيط */
.challenge-level-hacker .question-text::after {
    content: '▋';
    color: var(--hacker-green);
    animation: cursorBlink 1s infinite;
}

@keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

/* الخيارات - تحسين الأداء */
.challenge-level-hacker .options-container {
    display: flex;
    flex-direction: column;
    gap: 10px !important;
}

.challenge-level-hacker .option-item {
    background: rgba(30, 30, 30, 0.9) !important;
    border: 1px solid rgba(0, 255, 65, 0.2) !important;
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
}

.challenge-level-hacker .option-item:hover {
    background: rgba(0, 40, 0, 0.9) !important;
    border-color: var(--hacker-green) !important;
    transform: translateX(-5px) !important;
}

.challenge-level-hacker .option-label {
    background: transparent !important;
    border: none !important;
    color: var(--terminal-text) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    padding: 18px 20px !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
}

/* الحروف */
.challenge-level-hacker .option-letter {
    background: rgba(0, 40, 0, 0.8) !important;
    border: 2px solid var(--hacker-green) !important;
    color: var(--hacker-green) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    font-size: 18px !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50% !important;
    transition: all 0.2s ease;
}

.challenge-level-hacker .option-item:hover .option-letter {
    background: rgba(0, 60, 0, 0.9) !important;
    transform: scale(1.1);
}

/* الخيار المحدد */
.challenge-level-hacker .option-input:checked + .option-label {
    background: rgba(0, 40, 0, 0.3) !important;
    border: 1px solid var(--hacker-green) !important;
}

.challenge-level-hacker .option-input:checked + .option-label .option-letter {
    background: var(--hacker-green) !important;
    color: #000000 !important;
}

.challenge-level-hacker .option-input:checked + .option-label .option-text {
    color: var(--hacker-green) !important;
    font-weight: 600;
}

/* زر التالي - بسيط وفعال */
.challenge-level-hacker .next-btn {
    background: rgba(0, 40, 0, 0.9) !important;
    border: 2px solid var(--hacker-green) !important;
    color: var(--hacker-green) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    font-size: 18px !important;
    padding: 18px !important;
    border-radius: 10px !important;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-transform: uppercase;
}

.challenge-level-hacker .next-btn:hover:not(:disabled) {
    background: rgba(0, 60, 0, 0.9) !important;
    transform: translateY(-2px) !important;
}

.challenge-level-hacker .next-btn:disabled {
    background: var(--terminal-gray) !important;
    border-color: #666666 !important;
    color: #888888 !important;
    cursor: not-allowed;
    opacity: 0.7;
}

/* مربع النتيجة */
.challenge-level-hacker .score-box-container {
    background: rgba(10, 10, 10, 0.95) !important;
    border-top: 2px solid var(--hacker-green) !important;
    padding: 15px !important;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.challenge-level-hacker .score-box {
    background: rgba(0, 30, 0, 0.9) !important;
    border: 2px solid var(--hacker-green) !important;
    border-radius: 10px !important;
    padding: 20px !important;
    max-width: 600px;
    margin: 0 auto;
    font-family: 'JetBrains Mono', monospace !important;
}

.challenge-level-hacker #current-score {
    color: var(--hacker-green) !important;
    font-size: 32px !important;
    font-weight: 800 !important;
}

.challenge-level-hacker .score-percentage {
    color: var(--terminal-text) !important;
    font-weight: 600;
}

.challenge-level-hacker .progress-bar {
    background: var(--hacker-green) !important;
}

/* نافذة النتيجة */
.challenge-level-hacker .result-container {
    background: var(--terminal-bg) !important;
    border: 2px solid var(--hacker-green) !important;
    border-radius: 10px !important;
    padding: 25px !important;
    font-family: 'JetBrains Mono', monospace !important;
}

.challenge-level-hacker .result-header h2 {
    color: var(--hacker-green) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 800 !important;
    font-size: 28px !important;
    margin-bottom: 15px;
}

/* البطاقات الإحصائية */
.challenge-level-hacker .stat-card {
    background: rgba(0, 40, 0, 0.8) !important;
    border: 1px solid var(--hacker-green) !important;
    border-radius: 10px !important;
    color: var(--terminal-text) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    padding: 20px !important;
    transition: transform 0.2s ease;
}

.challenge-level-hacker .stat-card:hover {
    transform: translateY(-3px);
}

.challenge-level-hacker .stat-value {
    color: var(--hacker-green) !important;
    font-size: 24px !important;
}

/* تفاصيل النتيجة */
.challenge-level-hacker .result-details {
    background: rgba(25, 25, 25, 0.9) !important;
    border: 1px solid rgba(0, 255, 65, 0.3) !important;
    border-radius: 10px !important;
    padding: 20px !important;
}

.challenge-level-hacker .detail-label {
    color: var(--terminal-text) !important;
    font-weight: 500;
}

.challenge-level-hacker .detail-value {
    color: var(--hacker-green) !important;
    font-weight: 600;
}

/* أزرار الإجراء */
.challenge-level-hacker .result-actions button {
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    padding: 15px 25px !important;
    border-radius: 10px !important;
    transition: all 0.2s ease;
    text-transform: uppercase;
}

.challenge-level-hacker .btn-retry {
    background: var(--hacker-green) !important;
    color: #000000 !important;
    border: none !important;
}

.challenge-level-hacker .btn-retry:hover {
    transform: translateY(-2px);
}

/* تحسينات الجوال مع التركيز على الأداء */
@media (max-width: 768px) {
    .challenge-level-hacker .question-card {
        padding: 15px !important;
        margin: 10px !important;
        margin-bottom: 120px !important;
    }
    
    .challenge-level-hacker .question-text {
        font-size: 16px !important;
        padding: 12px !important;
    }
    
    .challenge-level-hacker .option-label {
        padding: 15px !important;
        font-size: 15px !important;
    }
    
    .challenge-level-hacker .option-letter {
        width: 35px !important;
        height: 35px !important;
        min-width: 35px !important;
        font-size: 16px !important;
    }
    
    .challenge-level-hacker .next-btn {
        padding: 15px !important;
        font-size: 16px !important;
    }
    
    .challenge-level-hacker .score-box {
        padding: 15px !important;
    }
    
    .challenge-level-hacker #current-score {
        font-size: 28px !important;
    }
    
    .challenge-level-hacker .result-container {
        padding: 20px !important;
    }
    
    .challenge-level-hacker .stat-card {
        padding: 15px !important;
    }
}
    
`

;

// ===== نظام الأصوات الخفيف =====
class HackerSoundSystemLite {
    constructor() {
        this.isSoundEnabled = false; // تعطيل الصوت لتحسين الأداء
        this.beepCache = {};
    }
    
    playSound(type) {
        if (!this.isSoundEnabled) return;
        
        // تشغيل صوت بسيط جداً إذا كان الصوت مفعلاً
        try {
            if (!this.beepCache[type]) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = type === 'select' ? 800 : 1200;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                
                this.beepCache[type] = true;
            }
        } catch (e) {
            // تجاهل أخطاء الصوت تماماً
        }
    }
}

// ===== إضافة CSS مرة واحدة فقط (محسن للأداء) =====
function addHackerUltimateStyles() {
    if (document.getElementById('hacker-terminal-ultimate-css')) return;
    
    // تأخير تحميل الـ CSS لتجنب حظر التصيير
    requestAnimationFrame(() => {
        const style = document.createElement('style');
        style.id = 'hacker-terminal-ultimate-css';
        style.textContent = hackerTerminalUltimateStyles;
        document.head.appendChild(style);
        
        console.log('⚡ تم تحميل أنماط Hacker Terminal ULTIMATE (محسنة للأداء)');
    });
}

// ===== تهيئة النظام الخفيف =====
let hackerSoundSystemLite = null;

function initHackerSoundsLite() {
    // تأخير تهيئة الصوت حتى لا يؤثر على الأداء
    setTimeout(() => {
        if (window.AudioContext && !hackerSoundSystemLite) {
            hackerSoundSystemLite = new HackerSoundSystemLite();
        }
    }, 2000); // تأخير 2 ثانية
}

// ===== تعديل loadChallenges مع تحسينات الأداء =====
const originalLoadChallenges = challengeLoader.loadChallenges;
challengeLoader.loadChallenges = async function(type) {
    try {
        // 1. إزالة أي class قديم (بدون regex ثقيل)
        const classes = document.body.className.split(' ');
        const filteredClasses = classes.filter(cls => !cls.startsWith('challenge-level-'));
        document.body.className = filteredClasses.join(' ').trim();
        
        // 2. استدعاء الدالة الأصلية
        const result = await originalLoadChallenges.call(this, type);
        
        // 3. إضافة الأنماط باستخدام requestIdleCallback إذا متاح
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                addHackerUltimateStyles();
            }, { timeout: 1000 });
        } else {
            // Fallback لـ setTimeout
            setTimeout(addHackerUltimateStyles, 100);
        }
        
        // 4. إضافة class فقط إذا كان المستوى Hacker
        if (type && type.toLowerCase() === 'hacker') {
            document.body.classList.add('challenge-level-hacker');
            
            // 5. تهيئة الصوت متأخراً
            initHackerSoundsLite();
            
            // 6. إضافة مستمعات الأحداث البسيطة
            addHackerEventListeners();
            
            console.log('⚡ HACKER TERMINAL ULTIMATE - Performance Mode Activated');
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ خطأ في loadChallenges:', error);
        throw error;
    }
};

// ===== إضافة مستمعات الأحداث البسيطة =====
function addHackerEventListeners() {
    // استخدام event delegation لتحسين الأداء
    document.addEventListener('click', function(e) {
        if (!document.body.classList.contains('challenge-level-hacker')) return;
        
        const target = e.target;
        
        // اكتشاف النقر على العناصر المهمة فقط
        if (target.classList.contains('option-label') || 
            target.closest('.option-label')) {
            if (hackerSoundSystemLite) {
                hackerSoundSystemLite.playSound('select');
            }
        }
        
        if (target.classList.contains('next-btn') && !target.disabled) {
            if (hackerSoundSystemLite) {
                hackerSoundSystemLite.playSound('success');
            }
        }
    }, true); // استخدام capture phase لتحسين الأداء
    
    // إزالة مستمعات mouseover الثقيلة
}

// ===== تنظيف وتحسين الأداء العام =====
if (typeof PerformanceObserver !== 'undefined') {
    // مراقبة أداء الصفحة
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn('⚠️ عملية بطيئة:', entry.name, entry.duration.toFixed(2), 'ms');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'longtask'] });
}

console.log('🚀 Hacker Terminal ULTIMATE - Performance Optimized Ready');

// ===== نصائح تحسين الأداء الإضافية =====
window.addEventListener('load', function() {
    // تأجيل تحميل الموارد غير الضرورية
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            // يمكن إضافة تحميل لاحق للموارد هنا
        });
    }
});

// ===== إضافة خاصية Performance Budget =====
const performanceBudget = {
    maxFPS: 60,
    maxMemory: 50, // MB
    maxTasks: 100
};

// مراقبة استخدام الذاكرة
if ('memory' in performance) {
    setInterval(() => {
        const usedMB = performance.memory.usedJSHeapSize / 1048576;
        if (usedMB > performanceBudget.maxMemory) {
            console.warn(`⚠️ استخدام ذاكرة مرتفع: ${usedMB.toFixed(2)}MB`);
        }
    }, 10000);
}

// في نهاية الكود، قبل console.log الأخير
setTimeout(() => {
    // تغيير ألوان النصوص مباشرة
    const styleFix = document.createElement('style');
    styleFix.textContent = `
        .challenge-level-hacker .question-text { color: #ffffff !important; }
        .challenge-level-hacker .option-label { color: #ffffff !important; }
        .challenge-level-hacker .option-text { color: #ffffff !important; }
        /* إضافة نص النتيجة الحالية */
        .challenge-level-hacker .score-title,
        .challenge-level-hacker .score-percentage,
        .challenge-level-hacker .score-values span:not(#current-score) {
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(styleFix);
    console.log('✅ تم تغيير ألوان النصوص إلى الأبيض');
}, 1000);


// ===== إضافة صوت الكيبورد =====
class KeyboardSoundSystem {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.keySounds = [];
        this.lastPlayTime = 0;
        this.minPlayInterval = 50; // منع التكرار السريع
        this.init();
    }
    
    init() {
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createKeySounds();
            } else {
                this.isEnabled = false;
            }
        } catch (e) {
            this.isEnabled = false;
            console.log('🔇 نظام الصوت غير مدعوم');
        }
    }
    
    createKeySounds() {
        // أصوات كيبورد مختلفة للتنوع
        this.keySounds = [
            { freq: 261.63, type: 'sine', duration: 0.08 },   // C4
            { freq: 293.66, type: 'sine', duration: 0.08 },   // D4
            { freq: 329.63, type: 'sine', duration: 0.08 },   // E4
            { freq: 349.23, type: 'sine', duration: 0.08 },   // F4
            { freq: 392.00, type: 'sine', duration: 0.08 },   // G4
            { freq: 440.00, type: 'sine', duration: 0.08 },   // A4
            { freq: 493.88, type: 'sine', duration: 0.08 },   // B4
        ];
    }
    
    playRandomKeySound() {
        if (!this.isEnabled || !this.audioContext) return;
        
        const now = Date.now();
        if (now - this.lastPlayTime < this.minPlayInterval) return;
        
        this.lastPlayTime = now;
        
        try {
            const sound = this.keySounds[Math.floor(Math.random() * this.keySounds.length)];
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = sound.freq;
            oscillator.type = sound.type;
            
            // جعل الصوت يشبه الكيبورد الحقيقي
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + sound.duration);
            
        } catch (e) {
            // تجاهل أخطاء الصوت
        }
    }
    
    playEnterSound() {
        if (!this.isEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // صوت Enter (نغمتين)
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.05); // E5
            
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
            
        } catch (e) {
            // تجاهل أخطاء الصوت
        }
    }
    
    playSpaceSound() {
        if (!this.isEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // صوت Space (نغمة منخفضة)
            oscillator.frequency.value = 196.00; // G3
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
        } catch (e) {
            // تجاهل أخطاء الصوت
        }
    }
}

// ===== تهيئة نظام صوت الكيبورد =====
let keyboardSoundSystem = null;

function initKeyboardSounds() {
    if (!keyboardSoundSystem && (window.AudioContext || window.webkitAudioContext)) {
        keyboardSoundSystem = new KeyboardSoundSystem();
        console.log('⌨️ نظام صوت الكيبورد جاهز');
    }
}

// ===== إضافة مستمعات أحداث الكيبورد والكتابة =====
function addKeyboardSoundListeners() {
    if (!document.body.classList.contains('challenge-level-hacker')) return;
    
    // 1. الكتابة في حقل الإدخال
    const inputFields = document.querySelectorAll('.challenge-level-hacker input[type="text"]');
    inputFields.forEach(input => {
        input.addEventListener('input', function() {
            if (keyboardSoundSystem && this.value.length > 0) {
                keyboardSoundSystem.playRandomKeySound();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (!keyboardSoundSystem) return;
            
            if (e.key === 'Enter') {
                keyboardSoundSystem.playEnterSound();
            } else if (e.key === ' ') {
                keyboardSoundSystem.playSpaceSound();
            } else if (e.key.length === 1) { // حرف عادي
                keyboardSoundSystem.playRandomKeySound();
            }
        });
    });
    
    // 2. اختيار الخيارات (Radio buttons)
    const radioButtons = document.querySelectorAll('.challenge-level-hacker input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (keyboardSoundSystem && this.checked) {
                keyboardSoundSystem.playRandomKeySound();
            }
        });
    });
    
    // 3. النقر على الخيارات (Labels)
    const optionLabels = document.querySelectorAll('.challenge-level-hacker .option-label');
    optionLabels.forEach(label => {
        label.addEventListener('click', function() {
            if (keyboardSoundSystem) {
                setTimeout(() => {
                    keyboardSoundSystem.playRandomKeySound();
                }, 50);
            }
        });
    });
    
    // 4. الكتابة في أي حقل نصي
    document.addEventListener('keydown', function(e) {
        if (!document.body.classList.contains('challenge-level-hacker')) return;
        if (!keyboardSoundSystem) return;
        
        // تجاهل مفاتيح التحكم
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        
        // تشغيل صوت للوحة المفاتيح عند الضغط على المفاتيح
        if (e.key.length === 1 && !e.repeat) { // حرف عادي وليس تكرار
            keyboardSoundSystem.playRandomKeySound();
        }
    }, true);
    
    console.log('🎹 تم تفعيل أصوات الكيبورد');
}

// ===== دالة مراقبة العناصر الجديدة =====
function observeNewElements() {
    // مراقبة ظهور عناصر جديدة (للخيارات التي تُحمّل ديناميكياً)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                setTimeout(addKeyboardSoundListeners, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ===== تعديل loadChallenges لتفعيل الأصوات =====
const originalLoadChallengesKeyboard = challengeLoader.loadChallenges;
challengeLoader.loadChallenges = async function(type) {
    const result = await originalLoadChallengesKeyboard.call(this, type);
    
    if (type && type.toLowerCase() === 'hacker') {
        // تهيئة أصوات الكيبورد بعد تحميل التحدي
        setTimeout(() => {
            initKeyboardSounds();
            addKeyboardSoundListeners();
            observeNewElements();
        }, 1000);
    }
    
    return result;
};

// ===== تشغيل النظام عند التحميل =====
setTimeout(() => {
    if (document.body.classList.contains('challenge-level-hacker')) {
        initKeyboardSounds();
        addKeyboardSoundListeners();
        observeNewElements();
    }
}, 2000);

console.log('🎮 نظام أصوات الكيبورد جاهز للتشغيل');
