// student-config.js - نظام إدارة بيانات الطالب وإعدادات التحدي

class StudentConfigManager {
    constructor() {
        this.studentData = null;
        this.currentConfig = null;
        this.subjects = this.getSubjects();
        this.grades = this.getGrades();
        this.challengeTypes = this.getChallengeTypes();
    }

    // الحصول على القوائم الكاملة
    getGrades() {
        return [
            'الصف 1', 'الصف 2', 'الصف 3', 'الصف 4', 'الصف 5', 'الصف 6',
            'الصف 7', 'الصف 8', 'الصف 9', 'الصف 10', 'الصف 11', 'الصف 12'
        ];
    }

    getSubjects() {
        return {
            'عام': ['عام'],
            'ابتدائي': ['العربي', 'الرياضيات', 'الانجليزي', 'التربية الإسلامية', 'التربية الفنية', 'التربية البدنية'],
            'متوسط': ['العربي', 'الرياضيات', 'الانجليزي', 'العلوم', 'الاجتماعيات', 'التربية الإسلامية', 'الحاسوب'],
            'ثانوي': ['العربي', 'الرياضيات', 'الانجليزي', 'الكيمياء', 'الفيزياء', 'الأحياء', 'الاجتماعيات', 'التربية الإسلامية', 'الحاسوب']
        };
    }

    getChallengeTypes() {
        return [
            { id: 'Challenger', name: 'المبتدئ', time: 900, questions: 7, color: 'green' },
            { id: 'Adventurer', name: 'المغامر', time: 1500, questions: 10, color: 'blue' },
            { id: 'Hacker', name: 'الهاكر', time: 2400, questions: 15, color: 'red' }
        ];
    }

    // عرض نافذة إدخال بيانات الطالب
    showStudentConfigModal() {
        return new Promise((resolve) => {
            // إنشاء عناصر النافذة المنبثقة
            const modalHTML = `
                <div id="student-config-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden animate-slide-up">
                        <!-- رأس النافذة -->
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h2 class="text-2xl font-bold">
                                        <i class="fas fa-user-graduate mr-2"></i>بيانات الطالب
                                    </h2>
                                    <p class="text-blue-100 mt-1">أدخل بياناتك لبدء التحدي</p>
                                </div>
                                <button onclick="this.closeModal(false)" class="text-white hover:text-gray-200 text-2xl">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- محتوى النافذة -->
                        <div class="p-8">
                            <form id="student-config-form" class="space-y-6">
                                <!-- اسم الطالب -->
                                <div>
                                    <label class="block text-gray-700 mb-2 font-semibold">
                                        <i class="fas fa-user mr-2"></i>اسم الطالب
                                    </label>
                                    <input type="text" 
                                           id="student-name"
                                           required
                                           class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                                           placeholder="أدخل اسمك الثلاثي"
                                           autocomplete="off">
                                </div>
                                
                                <!-- المرحلة الدراسية -->
                                <div>
                                    <label class="block text-gray-700 mb-2 font-semibold">
                                        <i class="fas fa-graduation-cap mr-2"></i>المرحلة الدراسية
                                    </label>
                                    <div class="relative">
                                        <select id="student-grade"
                                                required
                                                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg appearance-none cursor-pointer">
                                            <option value="">اختر المرحلة الدراسية</option>
                                            ${this.grades.map(grade => `
                                                <option value="${grade}">${grade}</option>
                                            `).join('')}
                                        </select>
                                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <i class="fas fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- المادة -->
                                <div>
                                    <label class="block text-gray-700 mb-2 font-semibold">
                                        <i class="fas fa-book mr-2"></i>المادة الدراسية
                                    </label>
                                    <div class="relative">
                                        <select id="student-subject"
                                                required
                                                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg appearance-none cursor-pointer">
                                            <option value="">اختر المادة الدراسية</option>
                                            <!-- سيتم تعبئة الخيارات بناءً على المرحلة -->
                                        </select>
                                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <i class="fas fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- نوع التحدي -->
                                <div>
                                    <label class="block text-gray-700 mb-2 font-semibold">
                                        <i class="fas fa-trophy mr-2"></i>مستوى التحدي
                                    </label>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        ${this.challengeTypes.map(type => `
                                            <div class="challenge-type-option relative">
                                                <input type="radio" 
                                                       id="challenge-${type.id}"
                                                       name="challenge-type"
                                                       value="${type.id}"
                                                       class="hidden peer">
                                                <label for="challenge-${type.id}" 
                                                       class="block p-4 border-2 border-gray-300 rounded-xl cursor-pointer 
                                                              hover:border-${type.color}-400 transition-all duration-300 
                                                              peer-checked:border-${type.color}-500 peer-checked:bg-${type.color}-50">
                                                    <div class="flex items-center">
                                                        <div class="w-10 h-10 flex items-center justify-center bg-${type.color}-100 
                                                                    text-${type.color}-600 rounded-full mr-3">
                                                            <i class="fas fa-${type.id === 'Challenger' ? 'seedling' : 
                                                                               type.id === 'Adventurer' ? 'mountain' : 
                                                                               'fire'}"></i>
                                                        </div>
                                                        <div>
                                                            <div class="font-bold text-lg">${type.name}</div>
                                                            <div class="text-sm text-gray-600 mt-1">
                                                                ${type.questions} أسئلة - ${Math.floor(type.time / 60)} دقيقة
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- تنويهات -->
                                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div class="flex items-start">
                                        <i class="fas fa-info-circle text-blue-500 text-xl mt-1 mr-3"></i>
                                        <div>
                                            <h4 class="font-bold text-blue-700 mb-1">معلومات مهمة:</h4>
                                            <ul class="text-blue-600 text-sm list-disc mr-5 space-y-1">
                                                <li>سيتم حفظ نتائجك في نظام التخزين المحلي</li>
                                                <li>يمكنك العودة وإكمال التحدي لاحقاً</li>
                                                <li>نسبة النجاح هي 80% للحصول على شهادة الإكمال</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- أزرار الإجراء -->
                                <div class="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
                                    <button type="button"
                                            onclick="this.closeModal(false)"
                                            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                                        إلغاء
                                    </button>
                                    <button type="submit"
                                            class="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl 
                                                   hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold 
                                                   flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                        <i class="fas fa-play mr-2"></i>بدء التحدي
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // إضافة النافذة إلى DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);

            // إضافة دالة closeModal إلى this
            this.closeModal = (save = false) => {
                const modal = document.getElementById('student-config-modal');
                if (modal) {
                    modal.classList.add('animate-fade-out');
                    setTimeout(() => {
                        modal.remove();
                        resolve(save ? this.getFormData() : null);
                    }, 300);
                }
            };

            // ربط أحداث النموذج
            const form = document.getElementById('student-config-form');
            const gradeSelect = document.getElementById('student-grade');
            const subjectSelect = document.getElementById('student-subject');

            // تحديث المواد بناءً على المرحلة
            gradeSelect.addEventListener('change', (e) => {
                this.updateSubjects(e.target.value, subjectSelect);
            });

            // معالجة إرسال النموذج
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    this.closeModal(true);
                }
            });

            // إضافة تأثيرات CSS
            this.addModalStyles();
        });
    }

    // تحديث قائمة المواد بناءً على المرحلة
    updateSubjects(grade, subjectSelect) {
        let stage = 'ابتدائي';
        const gradeNum = parseInt(grade.replace('الصف ', ''));
        
        if (gradeNum >= 7 && gradeNum <= 9) {
            stage = 'متوسط';
        } else if (gradeNum >= 10 && gradeNum <= 12) {
            stage = 'ثانوي';
        }

        const subjects = this.subjects[stage];
        subjectSelect.innerHTML = `
            <option value="">اختر المادة الدراسية</option>
            ${subjects.map(subject => `
                <option value="${subject}">${subject}</option>
            `).join('')}
        `;
    }

    // الحصول على بيانات النموذج
    getFormData() {
        const name = document.getElementById('student-name').value.trim();
        const grade = document.getElementById('student-grade').value;
        const subject = document.getElementById('student-subject').value;
        const challengeType = document.querySelector('input[name="challenge-type"]:checked')?.value;

        return {
            name,
            grade,
            subject,
            challengeType,
            startTime: new Date().toISOString(),
            studentId: this.generateStudentId(name)
        };
    }

    // التحقق من صحة النموذج
    validateForm() {
        const name = document.getElementById('student-name').value.trim();
        const grade = document.getElementById('student-grade').value;
        const subject = document.getElementById('student-subject').value;
        const challengeType = document.querySelector('input[name="challenge-type"]:checked');

        let isValid = true;

        // التحقق من الاسم
        if (!name || name.length < 2) {
            this.showFieldError('student-name', 'الرجاء إدخال اسم صحيح');
            isValid = false;
        } else {
            this.hideFieldError('student-name');
        }

        // التحقق من المرحلة
        if (!grade) {
            this.showFieldError('student-grade', 'الرجاء اختيار المرحلة الدراسية');
            isValid = false;
        } else {
            this.hideFieldError('student-grade');
        }

        // التحقق من المادة
        if (!subject) {
            this.showFieldError('student-subject', 'الرجاء اختيار المادة الدراسية');
            isValid = false;
        } else {
            this.hideFieldError('student-subject');
        }

        // التحقق من نوع التحدي
        if (!challengeType) {
            this.showGeneralError('الرجاء اختيار مستوى التحدي');
            isValid = false;
        }

        return isValid;
    }

    // عرض خطأ للحقل
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}-error`) || this.createErrorElement(fieldId, message);
        
        field.classList.add('border-red-500', 'bg-red-50');
        field.classList.remove('border-gray-300');
        
        if (!document.getElementById(`${fieldId}-error`)) {
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    }

    // إخفاء خطأ الحقل
    hideFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}-error`);
        
        field.classList.remove('border-red-500', 'bg-red-50');
        field.classList.add('border-gray-300');
        
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // إنشاء عنصر خطأ
    createErrorElement(fieldId, message) {
        const div = document.createElement('div');
        div.id = `${fieldId}-error`;
        div.className = 'text-red-500 text-sm mt-1 flex items-center';
        div.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i> ${message}`;
        return div;
    }

    // عرض خطأ عام
    showGeneralError(message) {
        const existingError = document.querySelector('.general-error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'general-error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center animate-shake';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle text-lg mr-3"></i>
            <div>${message}</div>
        `;

        const form = document.getElementById('student-config-form');
        form.insertBefore(errorDiv, form.firstChild);

        // إزالة الخطأ بعد 5 ثواني
        setTimeout(() => {
            errorDiv.classList.add('animate-fade-out');
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }

    // توليد معرف فريد للطالب
    generateStudentId(name) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${name.replace(/\s/g, '').toLowerCase()}_${timestamp}_${random}`;
    }

    // إضافة أنماط CSS للنافذة المنبثقة
    addModalStyles() {
        const styles = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-fade-out {
                    animation: fadeOut 0.3s ease-out;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                /* تأثيرات الخيارات */
                .challenge-type-option input:checked + label {
                    transform: scale(1.02);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                
                /* تأثيرات focus للعناصر */
                input:focus, select:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // حفظ بيانات الطالب في localStorage
    saveStudentData(data) {
        try {
            this.studentData = data;
            
            // حفظ في localStorage
            localStorage.setItem('currentStudent', JSON.stringify(data));
            
            // تحديث سجل الطلاب
            this.updateStudentHistory(data);
            
            console.log('تم حفظ بيانات الطالب:', data);
            return true;
        } catch (error) {
            console.error('خطأ في حفظ بيانات الطالب:', error);
            return false;
        }
    }

    // تحديث سجل الطلاب
    updateStudentHistory(studentData) {
        try {
            const history = JSON.parse(localStorage.getItem('studentsHistory') || '[]');
            
            // التحقق من عدم وجود تكرار
            const existingIndex = history.findIndex(s => s.studentId === studentData.studentId);
            
            if (existingIndex !== -1) {
                // تحديث البيانات الموجودة
                history[existingIndex] = {
                    ...history[existingIndex],
                    ...studentData,
                    lastUpdate: new Date().toISOString()
                };
            } else {
                // إضافة طالب جديد
                history.push({
                    ...studentData,
                    registrationDate: new Date().toISOString(),
                    totalChallenges: 0,
                    totalPoints: 0
                });
            }
            
            localStorage.setItem('studentsHistory', JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('خطأ في تحديث سجل الطلاب:', error);
            return false;
        }
    }

    // تحميل بيانات الطالب من localStorage
    loadStudentData() {
        try {
            const data = localStorage.getItem('currentStudent');
            if (data) {
                this.studentData = JSON.parse(data);
                return this.studentData;
            }
            return null;
        } catch (error) {
            console.error('خطأ في تحميل بيانات الطالب:', error);
            return null;
        }
    }

    // حذف بيانات الطالب
    clearStudentData() {
        try {
            localStorage.removeItem('currentStudent');
            this.studentData = null;
            return true;
        } catch (error) {
            console.error('خطأ في حذف بيانات الطالب:', error);
            return false;
        }
    }

    // الحصول على تاريخ الطلاب
    getStudentsHistory() {
        try {
            return JSON.parse(localStorage.getItem('studentsHistory') || '[]');
        } catch (error) {
            console.error('خطأ في جلب سجل الطلاب:', error);
            return [];
        }
    }

    // عرض قائمة الطلاب
    showStudentsList() {
        const history = this.getStudentsHistory();
        if (history.length === 0) {
            return '<div class="text-center text-gray-500 py-8">لا توجد بيانات طلاب مسجلة</div>';
        }

        return `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
                    <thead class="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                        <tr>
                            <th class="py-3 px-6 text-right">الاسم</th>
                            <th class="py-3 px-6 text-right">المرحلة</th>
                            <th class="py-3 px-6 text-right">المادة</th>
                            <th class="py-3 px-6 text-right">تاريخ التسجيل</th>
                            <th class="py-3 px-6 text-right">التحديات</th>
                            <th class="py-3 px-6 text-right">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${history.map((student, index) => `
                            <tr class="hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                                <td class="py-4 px-6 font-semibold">${student.name}</td>
                                <td class="py-4 px-6">${student.grade}</td>
                                <td class="py-4 px-6">${student.subject}</td>
                                <td class="py-4 px-6">${new Date(student.registrationDate).toLocaleDateString('ar-SA')}</td>
                                <td class="py-4 px-6">
                                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        ${student.totalChallenges || 0}
                                    </span>
                                </td>
                                <td class="py-4 px-6">
                                    <button onclick="studentConfig.selectStudent('${student.studentId}')"
                                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                        <i class="fas fa-play mr-1"></i>تحدي
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // اختيار طالب من القائمة
    selectStudent(studentId) {
        const history = this.getStudentsHistory();
        const student = history.find(s => s.studentId === studentId);
        
        if (student) {
            this.studentData = student;
            localStorage.setItem('currentStudent', JSON.stringify(student));
            return student;
        }
        return null;
    }
}

// إنشاء كائن مدير بيانات الطالب العام
const studentConfig = new StudentConfigManager();

// تصدير للاستخدام في الملفات الأخرى
if (typeof window !== 'undefined') {
    window.studentConfig = studentConfig;
}