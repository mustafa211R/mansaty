// info_temp.js - ملف مؤقت لتخزين وإرسال البيانات (محدث)

class InfoTemp {
    constructor() {
        this.STORAGE_KEY = 'challenge_temp_data';
        this.GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzYPTx2-zcr1fKhHyV8zjhxsJHggeDsyDs4_nbziMV4CTsXB5OXGLPza62vmRYX2sakWA/exec';
        this.pendingData = [];
        this.loadTempData(); // تحميل البيانات عند الإنشاء
    }

    /**
     * تحميل البيانات المؤقتة
     */
    loadTempData() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                this.pendingData = JSON.parse(savedData);
                console.log(`📥 تم تحميل ${this.pendingData.length} سجل مؤقت`);
            }
            return this.pendingData;
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات المؤقتة:', error);
            this.pendingData = [];
            return [];
        }
    }

    /**
     * حفظ البيانات مؤقتاً
     */
    saveTempData(data) {
        try {
            const tempData = {
                ...data,
                savedAt: new Date().toISOString(),
                id: this.generateId(),
                status: 'pending'
            };

            this.pendingData.push(tempData);
            this.saveToLocalStorage();
            
            console.log('💾 تم حفظ البيانات مؤقتاً:', tempData.id);
            return tempData;
            
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات المؤقتة:', error);
            throw error;
        }
    }

    /**
     * إرسال البيانات إلى Google Sheets باستخدام no-cors
     */
    async sendToGoogleSheets(data) {
        try {
            // تحضير البيانات للإرسال
            const payload = {
                timestamp: data.date || new Date().toISOString(),
                fullName: data.fullName || 'زائر',
                grade: data.grade || 'غير محدد',
                subject: data.subject || 'عام',
                challengeType: data.challengeType || 'Challenger',
                percentage: data.percentage || 0,
                earnedPoints: data.earnedPoints || 0,
                totalPoints: data.totalPoints || 0,
                correctAnswers: data.correctAnswers || 0,
                totalQuestions: data.totalQuestions || 0,
                totalTime: data.totalTime || 0,
                timeLeft: data.timeLeft || 0,
                timeSpent: data.timeSpent || 0,
                passed: data.passed || false,
                userAgent: navigator.userAgent || '',
                screenResolution: `${window.screen.width || 0}x${window.screen.height || 0}`,
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                platform: navigator.platform || '',
                language: navigator.language || 'ar',
                sessionId: this.generateSessionId(),
                difficultyLevel: this.getDifficultyLevel(data.challengeType),
                completionRate: Math.round((data.correctAnswers / data.totalQuestions) * 100) || 0
            };

            console.log('📤 إرسال البيانات إلى Google Sheets:', payload);

            // استخدام mode: 'no-cors' كما في المثال
            await fetch(this.GOOGLE_SHEET_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            console.log('✅ تم إرسال البيانات (no-cors mode)');
            
            // في وضع no-cors لا يمكننا التحقق من الاستجابة
            return { 
                success: true, 
                message: 'تم الإرسال بنجاح',
                sentAt: new Date().toISOString()
            };

        } catch (error) {
            console.warn("❗ لا يمكن التحقق من استجابة Google Sheet بسبب no-cors:", error);
            throw error;
        }
    }

    /**
     * إرسال بيانات مع التعامل مع الأخطاء
     */
    async sendData(data) {
        try {
            const result = await this.sendToGoogleSheets(data);
            
            if (result.success) {
                // حذف البيانات من localStorage بعد الإرسال الناجح
                const index = this.pendingData.findIndex(item => item.id === data.id);
                if (index > -1) {
                    this.pendingData.splice(index, 1);
                    this.saveToLocalStorage();
                    console.log(`🗑️ تم حذف السجل ${data.id} بعد الإرسال الناجح`);
                }
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ خطأ في إرسال البيانات:', error);
            return {
                success: false,
                error: error.message,
                message: 'فشل في إرسال البيانات'
            };
        }
    }

    /**
     * إرسال جميع البيانات المعلقة
     */
    async sendAllPendingData() {
        const pending = [...this.pendingData];
        
        if (pending.length === 0) {
            console.log('📭 لا توجد بيانات معلقة للإرسال');
            return { success: true, sent: 0 };
        }

        console.log(`📤 إرسال ${pending.length} سجل معلق...`);
        
        let successCount = 0;
        let failedCount = 0;

        for (const data of pending) {
            try {
                await this.sendData(data);
                successCount++;
                
                // تأخير قصير بين الطلبات
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`❌ فشل إرسال السجل ${data.id}:`, error);
                failedCount++;
                
                // تحديث حالة السجل
                const index = this.pendingData.findIndex(item => item.id === data.id);
                if (index > -1) {
                    this.pendingData[index] = {
                        ...this.pendingData[index],
                        status: 'failed',
                        lastAttempt: new Date().toISOString(),
                        error: error.message
                    };
                }
            }
        }

        // حفظ التحديثات
        this.saveToLocalStorage();

        console.log(`✅ تم إرسال ${successCount} سجل بنجاح، فشل ${failedCount}`);

        return {
            success: successCount > 0,
            sent: successCount,
            failed: failedCount,
            total: successCount + failedCount
        };
    }

    /**
     * حذف سجل محدد
     */
    removeTempData(id) {
        try {
            const initialLength = this.pendingData.length;
            this.pendingData = this.pendingData.filter(item => item.id !== id);
            
            if (this.pendingData.length < initialLength) {
                this.saveToLocalStorage();
                console.log(`🗑️ تم حذف السجل ${id}`);
                return { success: true, message: 'تم الحذف بنجاح' };
            } else {
                return { success: false, message: 'السجل غير موجود' };
            }
        } catch (error) {
            console.error('❌ خطأ في حذف السجل:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * مسح جميع البيانات المؤقتة
     */
    clearTempData() {
        try {
            this.pendingData = [];
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('🗑️ تم مسح جميع البيانات المؤقتة');
            return { success: true, message: 'تم المسح بنجاح' };
        } catch (error) {
            console.error('❌ خطأ في مسح البيانات المؤقتة:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * الحصول على إحصائيات البيانات
     */
    getStats() {
        const pending = this.pendingData.filter(item => item.status === 'pending');
        const failed = this.pendingData.filter(item => item.status === 'failed');
        
        return {
            total: this.pendingData.length,
            pending: pending.length,
            failed: failed.length,
            lastSaved: this.pendingData.length > 0 
                ? this.pendingData[this.pendingData.length - 1].savedAt 
                : null
        };
    }

    /**
     * حفظ البيانات في localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingData));
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
        }
    }

    /**
     * إنشاء معرف فريد
     */
    generateId() {
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * إنشاء معرف جلسة
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
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
     * اختبار الاتصال
     */
    async testConnection() {
        try {
            const testData = {
                fullName: 'اختبار الاتصال',
                grade: 'اختبار',
                subject: 'اختبار',
                challengeType: 'Challenger',
                percentage: 100,
                earnedPoints: 10,
                totalPoints: 10,
                correctAnswers: 10,
                totalQuestions: 10,
                totalTime: 600,
                timeLeft: 0,
                timeSpent: 600,
                passed: true,
                date: new Date().toISOString()
            };

            console.log('🔗 اختبار الاتصال بـ Google Sheets...');
            const result = await this.sendToGoogleSheets(testData);
            return result;
        } catch (error) {
            console.error('❌ فشل اختبار الاتصال:', error);
            return { success: false, error: error.message };
        }
    }
}

// إنشاء وتصدير الكائن
const infoTemp = new InfoTemp();

// محاولة إرسال البيانات المعلقة عند تحميل الصفحة
if (typeof window !== 'undefined') {
    window.infoTemp = infoTemp;
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(async () => {
            if (infoTemp.pendingData.length > 0) {
                console.log('🔄 محاولة إرسال البيانات المعلقة...');
                await infoTemp.sendAllPendingData();
            }
        }, 2000);
    });
    
    console.log('🚀 InfoTemp loaded successfully');
    console.log('📊 بيانات مؤقتة:', infoTemp.getStats());
}