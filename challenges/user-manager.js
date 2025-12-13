// user-manager.js - نظام متكامل لإدارة المستخدمين والنتائج مع دعم المرحلة والمادة

class UserManager {
    constructor() {
        this.currentUser = null;
        this.googleSheetsUrl = '';
        this.isInitialized = false;
        this.sessionId = null;
        
        // تعريف المواد الدراسية
        this.subjects = [
            'الإسلامية', 'العربي', 'الانجليزي', 'الرياضيات',
            'الاجتماعيات', 'الكيمياء', 'الفيزياء', 'الأحياء',
            'الحاسوب', 'الفنية', 'الرياضة'
        ];
        
        // تعريف المراحل الدراسية
        this.gradeLevels = [
     
  'الأول ابتدائي',
  'الثاني ابتدائي',
  'الثالث ابتدائي',
  'الرابع ابتدائي',
  'الخامس ابتدائي',
  'السادس ابتدائي',
  'الأول متوسط',
  'الثاني متوسط',
  'الثالث متوسط',
  'الرابع إعدادي',
  'الخامس إعدادي',
  'السادس إعدادي'


        ];
        
        // إحصائيات المستخدم
        this.userStats = {
            totalAttempts: 0,
            passedAttempts: 0,
            totalPoints: 0,
            earnedPoints: 0,
            averageScore: 0,
            bestScore: 0
        };
    }

    /**
     * تهيئة النظام
     */
    init() {
        try {
            console.log('🔄 تهيئة User Manager...');
            
            // تحميل بيانات المستخدم
            this.loadUserData();
            
            // إنشاء جلسة جديدة
            this.sessionId = this.generateSessionId();
            sessionStorage.setItem('current_session', this.sessionId);
            
            // تحميل الإحصائيات
            this.loadUserStats();
            
            this.isInitialized = true;
            
            console.log('✅ User Manager initialized successfully');
            console.log('👤 Current user:', this.currentUser);
            console.log('📈 User stats:', this.userStats);
            
            return this;
            
        } catch (error) {
            console.error('❌ Error initializing User Manager:', error);
            throw error;
        }
    }

    /**
     * عرض نافذة إدخال معلومات المستخدم - نسخة مصغرة للجوال
     */
    async showUserInfoModal() {
        console.log('📝 عرض نافذة معلومات المستخدم...');
        return new Promise((resolve, reject) => {
            try {
                // التحقق من وجود بيانات سابقة
                if (this.currentUser?.fullName && this.currentUser?.grade && this.currentUser?.subject) {
                    console.log('✅ استخدام بيانات المستخدم الحالية');
                    resolve(this.currentUser);
                    return;
                }

                // إضافة الأنماط أولاً
                this.addMobileStyles();
                
                // إنشاء النافذة المنبثقة
                const modal = document.createElement('div');
                modal.className = 'user-modal-overlay';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 16px;
                    animation: modalFadeIn 0.2s ease;
                `;
                
                modal.innerHTML = `
                    <div class="user-modal-container">
                        <!-- رأس النافذة -->
                        <div class="user-modal-header">
                            <div class="header-content">
                                <i class="fas fa-user-graduate"></i>
                                <div>
                                    <h2>مرحباً بك</h2>
                                    <p>أدخل معلوماتك للبدء</p>
                                </div>
                            </div>
                            <button type="button" id="close-modal" class="close-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- محتوى النافذة -->
                        <div class="user-modal-content">
                            <!-- اختيار المرحلة -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-graduation-cap"></i>
                                    المرحلة الدراسية
                                </label>
                                <div class="select-wrapper">
                                    <select id="user-grade" class="form-select">
                                        <option value="" selected disabled>اختر المرحلة</option>
                                        ${this.gradeLevels.map(grade => 
                                            `<option value="${this.escapeHtml(grade)}" ${this.currentUser?.grade === grade ? 'selected' : ''}>${grade}</option>`
                                        ).join('')}
                                    </select>
                                    <i class="fas fa-chevron-down select-icon"></i>
                                </div>
                            </div>
                            
                            <!-- اختيار المادة -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-book"></i>
                                    المادة الدراسية
                                </label>
                                <div class="select-wrapper">
                                    <select id="user-subject" class="form-select">
                                        <option value="" selected disabled>اختر المادة</option>
                                        ${this.subjects.map(subject => 
                                            `<option value="${this.escapeHtml(subject)}" ${this.currentUser?.subject === subject ? 'selected' : ''}>${subject}</option>`
                                        ).join('')}
                                    </select>
                                    <i class="fas fa-chevron-down select-icon"></i>
                                </div>
                            </div>
                            
                            <!-- حقل الاسم -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-user"></i>
                                    الاسم الكامل (اختياري)
                                </label>
                                <input type="text" 
                                       id="user-fullname" 
                                       class="form-input"
                                       placeholder="ادخل اسمك أو تخطي"
                                       maxlength="30"
                                       autocomplete="name"
                                       value="${this.currentUser?.fullName ? this.escapeHtml(this.currentUser.fullName) : ''}">
                                <p class="form-hint">
                                    <i class="fas fa-info-circle"></i>
                                    يمكنك التخطي والبدء كزائر
                                </p>
                            </div>
                            
                            <!-- أزرار الإجراء -->
                            <div class="form-actions">
                                <button type="button" id="start-challenge-btn" class="btn btn-primary" disabled>
                                    <i class="fas fa-play-circle"></i>
                                    <span>بدء التحدي</span>
                                </button>
                                
                                <button type="button" id="skip-btn" class="btn btn-secondary">
                                    <i class="fas fa-forward"></i>
                                    <span>التخطي كزائر</span>
                                </button>
                            </div>
                            
                            <!-- ملاحظة -->
                            <div class="form-footer">
                                <div class="security-note">
                                    <i class="fas fa-shield-alt"></i>
                                    <div>
                                        <p class="note-title">خصوصية وأمان</p>
                                        <p class="note-text">بياناتك محمية ولا تشارك مع أي طرف خارجي</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                console.log('✅ تم إنشاء النافذة المنبثقة');

                // عناصر DOM
                const gradeSelect = document.getElementById('user-grade');
                const subjectSelect = document.getElementById('user-subject');
                const nameInput = document.getElementById('user-fullname');
                const startBtn = document.getElementById('start-challenge-btn');
                const skipBtn = document.getElementById('skip-btn');
                const closeBtn = document.getElementById('close-modal');

                // التحقق من اكتمال المعلومات
                const validateForm = () => {
                    const gradeValid = gradeSelect.value && gradeSelect.value !== '';
                    const subjectValid = subjectSelect.value && subjectSelect.value !== '';
                    const isValid = gradeValid && subjectValid;
                    
                    startBtn.disabled = !isValid;
                    console.log(`🔍 التحقق من النموذج: ${isValid ? 'صالح' : 'غير صالح'}`);
                    return isValid;
                };

                // معالجة بدء التحدي
                const handleStartChallenge = () => {
                    console.log('🎯 معالجة بدء التحدي...');
                    if (!validateForm()) {
                        console.log('❌ النموذج غير صالح');
                        return;
                    }
                    
                    const userInfo = {
                        fullName: nameInput.value.trim() || 'زائر',
                        grade: gradeSelect.value,
                        subject: subjectSelect.value,
                        timestamp: new Date().toISOString()
                    };
                    
                    console.log('✅ معلومات المستخدم:', userInfo);
                    
                    this.saveUserInfo(userInfo);
                    this.closeModal(modal);
                    resolve(userInfo);
                };

                // معالجة التخطي كزائر
                const handleSkipAsGuest = () => {
                    console.log('🚶 معالجة التخطي كزائر...');
                    const userInfo = {
                        fullName: 'زائر',
                        grade: gradeSelect.value || 'الصف 10',
                        subject: subjectSelect.value || 'عام',
                        timestamp: new Date().toISOString()
                    };
                    
                    console.log('✅ معلومات الزائر:', userInfo);
                    
                    this.saveUserInfo(userInfo);
                    this.closeModal(modal);
                    resolve(userInfo);
                };

                // معالجة إغلاق النافذة
                const handleCloseModal = () => {
                    console.log('❌ إغلاق النافذة...');
                    this.closeModal(modal);
                    reject(new Error('تم إلغاء العملية'));
                };

                // مستمعات الأحداث
                startBtn.addEventListener('click', handleStartChallenge);
                skipBtn.addEventListener('click', handleSkipAsGuest);
                closeBtn.addEventListener('click', handleCloseModal);
                
                // إغلاق عند النقر خارج النافذة
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        handleCloseModal();
                    }
                });
                
                // إغلاق بمفتاح ESC
                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        handleCloseModal();
                    }
                };
                document.addEventListener('keydown', handleEscKey);
                
                // حفظ المرجع لإزالته لاحقاً
                modal._escHandler = handleEscKey;

                // مستمعات لتغيير القيم
                gradeSelect.addEventListener('change', validateForm);
                subjectSelect.addEventListener('change', validateForm);
                
                nameInput.addEventListener('input', () => {
                    // تطهير الإدخال
                    nameInput.value = nameInput.value.replace(/[<>]/g, '');
                });

                // التركيز على أول حقل
                setTimeout(() => {
                    if (!gradeSelect.value) {
                        gradeSelect.focus();
                    } else if (!subjectSelect.value) {
                        subjectSelect.focus();
                    } else {
                        nameInput.focus();
                    }
                }, 100);

                // التحقق الأولي
                validateForm();
                
                console.log('✅ تم إعداد جميع مستمعات الأحداث');

            } catch (error) {
                console.error('❌ Error showing user info modal:', error);
                reject(error);
            }
        });
    }

    /**
     * الهروب من HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * إضافة أنماط CSS المخصصة للجوال
     */
    addMobileStyles() {
        const styleId = 'user-manager-mobile-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* أنيميشن النافذة */
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* الحاوية الرئيسية */
            .user-modal-container {
                background: white;
                border-radius: 16px;
                width: 100%;
                max-width: 400px;
                animation: modalSlideUp 0.3s ease;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }
            
            /* رأس النافذة */
            .user-modal-header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 20px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .header-content i {
                font-size: 24px;
            }
            
            .header-content h2 {
                font-size: 18px;
                font-weight: 700;
                margin: 0;
            }
            
            .header-content p {
                font-size: 13px;
                opacity: 0.9;
                margin: 2px 0 0;
            }
            
            .close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                padding: 0;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .close-btn:active {
                transform: scale(0.95);
            }
            
            /* محتوى النافذة */
            .user-modal-content {
                padding: 24px;
            }
            
            /* مجموعات النماذج */
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
            }
            
            .form-label i {
                color: #4f46e5;
                font-size: 14px;
            }
            
            /* الحقول */
            .form-input {
                width: 100%;
                padding: 14px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.2s;
                background: white;
                box-sizing: border-box;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .form-hint {
                font-size: 12px;
                color: #6b7280;
                margin-top: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            /* محددات الاختيار */
            .select-wrapper {
                position: relative;
            }
            
            .form-select {
                width: 100%;
                padding: 14px 40px 14px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 16px;
                background: white;
                appearance: none;
                cursor: pointer;
                transition: all 0.2s;
                box-sizing: border-box;
            }
            
            .form-select:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .select-icon {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #9ca3af;
                pointer-events: none;
            }
            
            /* الأزرار */
            .form-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 24px 0;
            }
            
            .btn {
                padding: 16px 24px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                box-sizing: border-box;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
            }
            
            .btn-primary:not(:disabled):hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            }
            
            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                color: white;
                border: none;
            }
            
            .btn-secondary:hover {
                background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
            }
            
            .btn:active {
                transform: translateY(0);
            }
            
            /* التذييل */
            .form-footer {
                border-top: 1px solid #f3f4f6;
                padding-top: 20px;
            }
            
            .security-note {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .security-note i {
                color: #4f46e5;
                font-size: 16px;
                margin-top: 2px;
            }
            
            .note-title {
                font-size: 13px;
                font-weight: 600;
                color: #374151;
                margin: 0 0 4px;
            }
            
            .note-text {
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
                margin: 0;
            }
            
            /* تحسينات للشاشات الصغيرة */
            @media (max-width: 480px) {
                .user-modal-overlay {
                    padding: 12px;
                }
                
                .user-modal-container {
                    max-width: 100%;
                    margin: auto;
                }
                
                .user-modal-header {
                    padding: 16px 20px;
                }
                
                .user-modal-content {
                    padding: 20px;
                }
                
                .form-input,
                .form-select {
                    padding: 16px;
                    font-size: 17px;
                }
                
                .btn {
                    padding: 18px 20px;
                    font-size: 17px;
                    min-height: 56px;
                }
                
                .close-btn {
                    width: 40px;
                    height: 40px;
                }
            }
            
            /* تحسينات للأجهزة اللوحية */
            @media (min-width: 481px) and (max-width: 768px) {
                .user-modal-container {
                    max-width: 440px;
                }
            }
            
            /* تحسينات للوضع الأفقي */
            @media (max-height: 600px) and (orientation: landscape) {
                .user-modal-overlay {
                    align-items: flex-start;
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
                
                .user-modal-container {
                    max-height: 90vh;
                    overflow-y: auto;
                }
            }
        `;
        document.head.appendChild(style);
        console.log('✅ تم إضافة أنماط الجوال');
    }

    /**
     * إغلاق النافذة المنبثقة
     */
    closeModal(modal) {
        console.log('🗑️ إغلاق النافذة...');
        
        // إزالة مستمع ESC
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler);
        }
        
        // إضافة أنيميشن الخروج
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        modal.style.transition = 'all 0.2s ease';
        
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = '';
            
            // إزالة الأنماط المضافة
            const styles = document.getElementById('user-manager-mobile-styles');
            if (styles && styles.parentNode) {
                styles.parentNode.removeChild(styles);
            }
            
            console.log('✅ تم إغلاق النافذة بنجاح');
        }, 200);
    }

    /**
     * الحصول على أيقونة المادة
     */
    getSubjectIcon(subject) {
        const icons = {
            'الإسلامية': 'fa-mosque',
            'العربي': 'fa-language',
            'الانجليزي': 'fa-globe',
            'الرياضيات': 'fa-calculator',
            'الاجتماعيات': 'fa-map',
            'الكيمياء': 'fa-flask',
            'الفيزياء': 'fa-atom',
            'الأحياء': 'fa-dna',
            'الحاسوب': 'fa-laptop-code',
            'الفنية': 'fa-palette',
            'الرياضة': 'fa-running',
            'عام': 'fa-book'
        };
        
        return icons[subject] || 'fa-book';
    }

    /**
     * حفظ معلومات المستخدم
     */
    saveUserInfo(userInfo) {
        try {
            this.currentUser = {
                ...userInfo,
                sessionId: this.sessionId || this.generateSessionId(),
                lastUpdated: new Date().toISOString()
            };

            // حفظ في localStorage
            localStorage.setItem('challenge_user_info', JSON.stringify(this.currentUser));
            
            // حفظ إعدادات المادة والمرحلة
            localStorage.setItem('user_grade', userInfo.grade);
            localStorage.setItem('user_subject', userInfo.subject);
            
            console.log('✅ User info saved:', this.currentUser);
            return this.currentUser;
            
        } catch (error) {
            console.error('❌ Error saving user info:', error);
            throw error;
        }
    }

    /**
     * تحميل بيانات المستخدم
     */
    loadUserData() {
        try {
            const savedUser = localStorage.getItem('challenge_user_info');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                
                // التحقق من صحة البيانات
                if (!this.currentUser.grade || !this.gradeLevels.includes(this.currentUser.grade)) {
                    this.currentUser.grade = 'الصف 10';
                }
                
                if (!this.currentUser.subject || !this.subjects.includes(this.currentUser.subject)) {
                    this.currentUser.subject = 'عام';
                }
                
                console.log('📥 User data loaded:', this.currentUser);
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            this.currentUser = null;
        }
        
        return this.currentUser;
    }

    /**
     * حفظ نتائج التحدي
     */
    async saveChallengeResults(results) {
        try {
            // التحقق من صحة البيانات
            if (!results || typeof results !== 'object') {
                throw new Error('بيانات النتائج غير صالحة');
            }

            // إضافة بيانات المستخدم والجلسة
            const challengeData = {
                // بيانات النتائج
                ...results,
                
                // بيانات المستخدم
                fullName: this.currentUser?.fullName || 'زائر',
                grade: this.currentUser?.grade || 'غير محدد',
                subject: this.currentUser?.subject || 'عام',
                sessionId: this.sessionId || this.generateSessionId(),
                
                // معلومات النظام
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language || 'ar-SA',
                platform: navigator.platform,
                browser: this.getBrowserInfo(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                
                // معلومات إضافية
                challengeDuration: results.timeSpent || 0,
                completionRate: Math.round((results.correctAnswers / results.totalQuestions) * 100),
                difficultyLevel: this.getDifficultyLevel(results.challengeType),
                isMobile: this.isMobileDevice()
            };

            console.log('💾 Preparing challenge data:', challengeData);

            // حفظ محلياً
            const localSaveResult = this.saveToLocalStorage(challengeData);
            
            // إرسال إلى Google Sheets
            let sheetsSaveResult = null;
            if (this.googleSheetsUrl) {
                sheetsSaveResult = await this.sendToGoogleSheets(challengeData);
            }

            // تحديث الإحصائيات
            this.updateUserStats(challengeData);

            return {
                success: true,
                data: challengeData,
                localSave: localSaveResult,
                sheetsSave: sheetsSaveResult,
                message: 'تم حفظ النتائج بنجاح'
            };

        } catch (error) {
            console.error('❌ Error saving challenge results:', error);
            
            // محاولة حفظ محلياً فقط في حالة فشل الإرسال
            try {
                const localSave = this.saveToLocalStorage(results);
                return {
                    success: true,
                    error: error.message,
                    localSave: localSave,
                    sheetsSave: null,
                    message: 'تم الحفظ محلياً فقط'
                };
            } catch (localError) {
                return {
                    success: false,
                    error: error.message,
                    message: 'فشل في حفظ النتائج'
                };
            }
        }
    }

    /**
     * حفظ في localStorage
     */
    saveToLocalStorage(challengeData) {
        try {
            // تحميل السجل الحالي
            let challengeHistory = JSON.parse(localStorage.getItem('challenge_history') || '[]');
            
            // إضافة النتيجة الجديدة
            const historyEntry = {
                id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                ...challengeData
            };
            
            challengeHistory.unshift(historyEntry);
            
            // حفظ آخر 200 نتيجة فقط
            if (challengeHistory.length > 200) {
                challengeHistory = challengeHistory.slice(0, 200);
            }
            
            // الحفظ
            localStorage.setItem('challenge_history', JSON.stringify(challengeHistory));
            
            // تحديث أفضل النتائج
            this.updateBestScores(challengeData);
            
            console.log('💾 Challenge saved to localStorage:', historyEntry);
            return { success: true, id: historyEntry.id };
            
        } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * إرسال إلى Google Sheets
     */
    async sendToGoogleSheets(data) {
        try {
            if (!this.googleSheetsUrl) {
                throw new Error('رابط Google Sheets غير متوفر');
            }

            // تحضير البيانات للإرسال
            const postData = {
                // معلومات المستخدم
                fullName: data.fullName,
                grade: data.grade,
                subject: data.subject,
                
                // معلومات التحدي
                challengeType: data.challengeType,
                percentage: data.percentage,
                earnedPoints: data.earnedPoints,
                totalPoints: data.totalPoints,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions,
                totalTime: data.totalTime,
                timeLeft: data.timeLeft,
                timeSpent: data.timeSpent,
                passed: data.passed,
                
                // معلومات النظام
                sessionId: data.sessionId,
                timestamp: data.timestamp,
                userAgent: data.userAgent,
                screenResolution: data.screenResolution,
                language: data.language,
                browser: data.browser,
                timezone: data.timezone,
                
                // معلومات إضافية
                ip: await this.getClientIP(),
                completionRate: data.completionRate,
                difficultyLevel: data.difficultyLevel,
                isMobile: data.isMobile
            };

            console.log('📤 Sending to Google Sheets:', postData);

            // إرسال الطلب مع مهلة زمنية
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(this.googleSheetsUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(postData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`خطأ في الشبكة: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Google Sheets response:', result);
            
            return result;

        } catch (error) {
            console.error('❌ Error sending to Google Sheets:', error);
            throw error;
        }
    }

    /**
     * الحصول على IP العميل
     */
    async getClientIP() {
        try {
            // محاولات متعددة للحصول على IP
            const services = [
                'https://api.ipify.org?format=json',
                'https://api64.ipify.org?format=json',
                'https://ipapi.co/json/'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service, { timeout: 3000 });
                    const data = await response.json();
                    return data.ip || data.query || 'unknown';
                } catch (err) {
                    continue;
                }
            }
            
            return 'unknown';
            
        } catch (error) {
            console.warn('⚠️ Could not get client IP:', error);
            return 'unknown';
        }
    }

    /**
     * تحميل إحصائيات المستخدم
     */
    loadUserStats() {
        try {
            const stats = JSON.parse(localStorage.getItem('user_stats') || '{}');
            this.userStats = {
                totalAttempts: stats.totalAttempts || 0,
                passedAttempts: stats.passedAttempts || 0,
                totalPoints: stats.totalPoints || 0,
                earnedPoints: stats.earnedPoints || 0,
                averageScore: stats.averageScore || 0,
                bestScore: stats.bestScore || 0,
                lastUpdated: stats.lastUpdated || null
            };
            return this.userStats;
        } catch (error) {
            console.error('❌ Error loading user stats:', error);
            return this.userStats;
        }
    }

    /**
     * تحديث إحصائيات المستخدم
     */
    updateUserStats(challengeData) {
        try {
            // تحديث الإحصائيات
            this.userStats.totalAttempts += 1;
            
            if (challengeData.passed) {
                this.userStats.passedAttempts += 1;
            }
            
            this.userStats.totalPoints += challengeData.totalPoints || 0;
            this.userStats.earnedPoints += challengeData.earnedPoints || 0;
            
            // حساب متوسط الدرجة
            const totalScore = this.userStats.averageScore * (this.userStats.totalAttempts - 1);
            this.userStats.averageScore = (totalScore + challengeData.percentage) / this.userStats.totalAttempts;
            
            // تحديث أفضل درجة
            if (challengeData.percentage > this.userStats.bestScore) {
                this.userStats.bestScore = challengeData.percentage;
            }
            
            this.userStats.lastUpdated = new Date().toISOString();
            
            // حفظ في localStorage
            localStorage.setItem('user_stats', JSON.stringify(this.userStats));
            
            console.log('📈 User stats updated:', this.userStats);
            return this.userStats;
            
        } catch (error) {
            console.error('❌ Error updating user stats:', error);
            return this.userStats;
        }
    }

    /**
     * تحديث أفضل النتائج
     */
    updateBestScores(challengeData) {
        try {
            let bestScores = JSON.parse(localStorage.getItem('best_scores') || '{}');
            
            const key = `${challengeData.grade}_${challengeData.subject}_${challengeData.challengeType}`;
            
            if (!bestScores[key] || challengeData.percentage > bestScores[key].percentage) {
                bestScores[key] = {
                    percentage: challengeData.percentage,
                    points: challengeData.earnedPoints,
                    totalPoints: challengeData.totalPoints,
                    date: new Date().toISOString(),
                    grade: challengeData.grade,
                    subject: challengeData.subject,
                    challengeType: challengeData.challengeType
                };
                
                localStorage.setItem('best_scores', JSON.stringify(bestScores));
                console.log('🏆 Best score updated:', bestScores[key]);
            }
            
            return bestScores;
        } catch (error) {
            console.error('❌ Error updating best scores:', error);
            return {};
        }
    }

    /**
     * الحصول على سجل التحديات
     */
    getChallengeHistory(limit = 50, filter = {}) {
        try {
            const history = JSON.parse(localStorage.getItem('challenge_history') || '[]');
            
            // تطبيق الفلاتر
            let filteredHistory = history;
            
            if (filter.grade) {
                filteredHistory = filteredHistory.filter(h => h.grade === filter.grade);
            }
            
            if (filter.subject) {
                filteredHistory = filteredHistory.filter(h => h.subject === filter.subject);
            }
            
            if (filter.challengeType) {
                filteredHistory = filteredHistory.filter(h => h.challengeType === filter.challengeType);
            }
            
            if (filter.dateFrom) {
                const dateFrom = new Date(filter.dateFrom);
                filteredHistory = filteredHistory.filter(h => new Date(h.date) >= dateFrom);
            }
            
            if (filter.dateTo) {
                const dateTo = new Date(filter.dateTo);
                filteredHistory = filteredHistory.filter(h => new Date(h.date) <= dateTo);
            }
            
            // تطبيق الحد
            filteredHistory = filteredHistory.slice(0, limit);
            
            return filteredHistory;
            
        } catch (error) {
            console.error('❌ Error getting challenge history:', error);
            return [];
        }
    }

    /**
     * إنشاء معرف جلسة فريد
     */
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `ses_${timestamp}_${random}`;
    }

    /**
     * الحصول على معلومات المتصفح
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'غير معروف';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('IE')) browser = 'Internet Explorer';
        
        return browser;
    }

    /**
     * التحقق من الجهاز المحمول
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * الحصول على مستوى الصعوبة
     */
    getDifficultyLevel(challengeType) {
        const levels = {
            'Challenger': 'مبتدئ',
            'Adventurer': 'متوسط',
            'Hacker': 'متقدم'
        };
        return levels[challengeType] || 'غير محدد';
    }

    /**
     * مسح سجل التحديات
     */
    clearHistory() {
        if (confirm('⚠️ هل أنت متأكد من رغبتك في مسح سجل التحديات؟\n\nهذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع النتائج المحفوظة.')) {
            localStorage.removeItem('challenge_history');
            localStorage.removeItem('best_scores');
            localStorage.removeItem('user_stats');
            this.userStats = {
                totalAttempts: 0,
                passedAttempts: 0,
                totalPoints: 0,
                earnedPoints: 0,
                averageScore: 0,
                bestScore: 0
            };
            alert('✅ تم مسح سجل التحديات والإحصائيات بنجاح');
            return true;
        }
        return false;
    }

    /**
     * مسح جميع بيانات المستخدم
     */
    clearAllUserData() {
        if (confirm('⚠️ ⚠️ تحذير: هذا الإجراء سيمسح جميع بياناتك!\n\n• جميع النتائج المحفوظة\n• سجل التحديات\n• الإحصائيات\n• معلومات المستخدم\n\nهل أنت متأكد من المتابعة؟')) {
            localStorage.clear();
            sessionStorage.clear();
            this.currentUser = null;
            this.userStats = {
                totalAttempts: 0,
                passedAttempts: 0,
                totalPoints: 0,
                earnedPoints: 0,
                averageScore: 0,
                bestScore: 0
            };
            alert('✅ تم مسح جميع البيانات بنجاح');
            return true;
        }
        return false;
    }
}

// إنشاء وتصدير كائن مدير المستخدم العام
const userManager = new UserManager();

// التصدير للاستخدام العام
if (typeof window !== 'undefined') {
    window.userManager = userManager;
    window.UserManager = UserManager;
    console.log('🚀 User Manager loaded successfully');
}