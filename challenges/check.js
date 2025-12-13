// check.js - نظام متقدم للتحقق من الإجابات مع تحسينات كبيرة

class AnswerChecker {
    constructor() {
        this.settings = {
            similarityThreshold: 0.85, // نسبة التشابه المطلوبة 85%
            maxLevenshteinDistance: 3, // أقصى مسافة ليفنشتاين مسموح بها
            ignoreArticles: true, // تجاهل أداة التعريف
            normalizeArabicNumbers: true, // توحيد الأرقام العربية
            caseSensitive: false, // غير حساس لحالة الأحرف
            trimSpaces: true, // إزالة الفراغات الزائدة
            removeDiacritics: true // إزالة التشكيل
        };
        
        this.commonPatterns = {
            numbers: /[٠١٢٣٤٥٦٧٨٩0-9]+/g,
            arabicLetters: /[\u0600-\u06FF]/g,
            punctuation: /[.,،;؛:!?؟'"`~@#$%^&*()\[\]{}\\/|<>+=_-]/g,
            whitespace: /\s+/g,
            diacritics: /[\u064B-\u065F]/g,
            arabicArticles: /^(ال|الـ|و|ف|ب|ك|ل|س|ي|ت|ن|ه|أ|إ|آ)/,
            englishArticles: /^(the|a|an)\s+/i
        };
        
        this.numberMap = {
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
        };
        
        this.commonErrors = {
            spelling: {
                patterns: [
                    // أخطاء شائعة في الهجاء العربي
                    { from: 'الهمزة', to: 'ء', weight: 0.1 },
                    { from: 'التاء المربوطة', to: 'ة', weight: 0.2 },
                    { from: 'الألف المقصورة', to: 'ى', weight: 0.1 },
                    { from: 'الهاء', to: 'ه', weight: 0.1 }
                ]
            },
            math: {
                patterns: [
                    // أخطاء في الرياضيات
                    { pattern: /[-+]\s*(\d+)/, message: 'انتبه لإشارة الرقم' },
                    { pattern: /ريال|دولار|يورو/, message: 'تأكد من كتابة الوحدة النقدية' }
                ]
            },
            science: {
                patterns: [
                    // أخطاء في المصطلحات العلمية
                    { from: /اوكسجين/gi, to: 'أوكسجين' },
                    { from: /هيدروجين/gi, to: 'هيدروجين' },
                    { from: /كربون/gi, to: 'كربون' }
                ]
            }
        };
    }

    /**
     * التحقق الرئيسي من الإجابة مع تحسينات متعددة
     */
    checkAnswer(userAnswer, correctAnswer, options = {}) {
        // دمج الإعدادات مع الخيارات الممررة
        const settings = { ...this.settings, ...options };
        
        // إذا كانت الإجابة فارغة
        if (!userAnswer || userAnswer.trim() === '') {
            return false;
        }

        // التحقق المباشر السريع
        if (this.directMatch(userAnswer, correctAnswer, settings)) {
            return true;
        }

        // التحقق من المقارنة العددية
        if (this.numericMatch(userAnswer, correctAnswer)) {
            return true;
        }

        // التحقق باستخدام خوارزميات متقدمة
        return this.advancedMatch(userAnswer, correctAnswer, settings);
    }

    /**
     * تطابق مباشر مع معالجة مسبقة
     */
    directMatch(userAnswer, correctAnswer, settings) {
        const normalizedUser = this.normalize(userAnswer, settings);
        const normalizedCorrect = this.normalize(correctAnswer, settings);
        
        return normalizedUser === normalizedCorrect;
    }

    /**
     * تطابق عددي مع مراعاة الأرقام العربية والإنجليزية
     */
    numericMatch(userAnswer, correctAnswer) {
        const userNumbers = this.extractNumbers(userAnswer);
        const correctNumbers = this.extractNumbers(correctAnswer);
        
        if (userNumbers.length === 0 || correctNumbers.length === 0) {
            return false;
        }

        // مقارنة كمجموعة أو بالتسلسل
        if (userNumbers.length === 1 && correctNumbers.length === 1) {
            return userNumbers[0] === correctNumbers[0];
        }

        // مقارنة التسلسل للأعداد المتعددة
        return JSON.stringify(userNumbers) === JSON.stringify(correctNumbers);
    }

    /**
     * تطابق متقدم باستخدام خوارزميات متعددة
     */
    advancedMatch(userAnswer, correctAnswer, settings) {
        const normalizedUser = this.normalize(userAnswer, settings);
        const normalizedCorrect = this.normalize(correctAnswer, settings);
        
        // حساب درجة التشابه
        const similarityScore = this.calculateSimilarityScore(normalizedUser, normalizedCorrect);
        
        // التحقق من المسافة التحريرية
        const levenshteinDistance = this.levenshtein(normalizedUser, normalizedCorrect);
        const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
        const distanceScore = 1 - (levenshteinDistance / maxLength);
        
        // استخدام أفضل الدرجتين
        const finalScore = Math.max(similarityScore, distanceScore);
        
        return finalScore >= settings.similarityThreshold;
    }

    /**
     * حساب درجة التشابه باستخدام خوارزميات متعددة
     */
    calculateSimilarityScore(str1, str2) {
        if (str1 === str2) return 1.0;
        
        const scores = [
            this.jaroWinkler(str1, str2),
            this.diceCoefficient(str1, str2),
            this.cosineSimilarity(str1, str2)
        ];
        
        // استخدام المتوسط المرجح
        const weights = [0.4, 0.3, 0.3];
        const weightedAverage = scores.reduce((sum, score, index) => 
            sum + (score * weights[index]), 0);
        
        return weightedAverage;
    }

    /**
     * تطبيع النص مع جميع التحسينات
     */
    normalize(text, settings) {
        if (!text || typeof text !== 'string') return '';
        
        let normalized = text;
        
        // إزالة الفراغات الزائدة
        if (settings.trimSpaces) {
            normalized = normalized.replace(this.commonPatterns.whitespace, ' ').trim();
        }
        
        // إزالة التشكيل
        if (settings.removeDiacritics) {
            normalized = normalized.replace(this.commonPatterns.diacritics, '');
        }
        
        // تحويل الأرقام العربية إلى إنجليزية
        if (settings.normalizeArabicNumbers) {
            normalized = this.normalizeArabicNumbers(normalized);
        }
        
        // تجاهل حساسية حالة الأحرف
        if (!settings.caseSensitive) {
            normalized = normalized.toLowerCase();
        }
        
        // إزالة علامات الترقيم
        normalized = normalized.replace(this.commonPatterns.punctuation, '');
        
        // إزالة أدوات التعريف
        if (settings.ignoreArticles) {
            normalized = normalized
                .replace(this.commonPatterns.arabicArticles, '')
                .replace(this.commonPatterns.englishArticles, '');
        }
        
        // إزالة الفراغات المتبقية
        normalized = normalized.replace(this.commonPatterns.whitespace, '');
        
        return normalized;
    }

    /**
     * تحويل الأرقام العربية إلى إنجليزية
     */
    normalizeArabicNumbers(text) {
        return text.replace(/[٠١٢٣٤٥٦٧٨٩]/g, char => this.numberMap[char] || char);
    }

    /**
     * استخراج الأرقام من النص
     */
    extractNumbers(text) {
        const normalized = this.normalizeArabicNumbers(text);
        const matches = normalized.match(this.commonPatterns.numbers);
        
        if (!matches) return [];
        
        return matches.map(num => {
            // تحويل النصوص الرقمية إلى أعداد
            const parsed = parseInt(num, 10);
            return isNaN(parsed) ? num : parsed;
        });
    }

    /**
     * خوارزمية جارو-وينكلر (مناسبة للأسماء والعبارات القصيرة)
     */
    jaroWinkler(str1, str2) {
        if (str1 === str2) return 1.0;
        
        const jaroDistance = this.jaro(str1, str2);
        const prefixScale = 0.1;
        const prefixLength = this.commonPrefixLength(str1, str2, 4);
        
        return jaroDistance + (prefixLength * prefixScale * (1 - jaroDistance));
    }

    jaro(str1, str2) {
        const s1 = str1.length;
        const s2 = str2.length;
        
        if (s1 === 0 || s2 === 0) return 0;
        
        const matchDistance = Math.floor(Math.max(s1, s2) / 2) - 1;
        const matches1 = new Array(s1).fill(false);
        const matches2 = new Array(s2).fill(false);
        
        let matches = 0;
        let transpositions = 0;
        
        // البحث عن التطابقات
        for (let i = 0; i < s1; i++) {
            const start = Math.max(0, i - matchDistance);
            const end = Math.min(i + matchDistance + 1, s2);
            
            for (let j = start; j < end; j++) {
                if (!matches2[j] && str1[i] === str2[j]) {
                    matches1[i] = matches2[j] = true;
                    matches++;
                    break;
                }
            }
        }
        
        if (matches === 0) return 0;
        
        // حساب التباديل
        let k = 0;
        for (let i = 0; i < s1; i++) {
            if (matches1[i]) {
                while (!matches2[k]) k++;
                if (str1[i] !== str2[k]) transpositions++;
                k++;
            }
        }
        
        transpositions /= 2;
        
        return ((matches / s1) + (matches / s2) + ((matches - transpositions) / matches)) / 3;
    }

    /**
     * حساب طول البادئة المشتركة
     */
    commonPrefixLength(str1, str2, maxLength) {
        const n = Math.min(maxLength, str1.length, str2.length);
        for (let i = 0; i < n; i++) {
            if (str1[i] !== str2[i]) return i;
        }
        return n;
    }

    /**
     * معامل ديس (مناسبة للكلمات والعبارات)
     */
    diceCoefficient(str1, str2) {
        if (str1.length < 2 || str2.length < 2) return 0;
        
        const bigrams1 = this.getBigrams(str1);
        const bigrams2 = this.getBigrams(str2);
        
        const intersection = this.intersectionSize(bigrams1, bigrams2);
        
        return (2 * intersection) / (bigrams1.size + bigrams2.size);
    }

    getBigrams(str) {
        const bigrams = new Set();
        for (let i = 0; i < str.length - 1; i++) {
            bigrams.add(str.substr(i, 2));
        }
        return bigrams;
    }

    intersectionSize(set1, set2) {
        let count = 0;
        for (const item of set1) {
            if (set2.has(item)) count++;
        }
        return count;
    }

    /**
     * تشابه جيب التمام (مناسبة للنصوص الطويلة)
     */
    cosineSimilarity(str1, str2) {
        const vec1 = this.textToVector(str1);
        const vec2 = this.textToVector(str2);
        
        const intersection = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
        
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        
        for (const term of intersection) {
            const v1 = vec1[term] || 0;
            const v2 = vec2[term] || 0;
            
            dotProduct += v1 * v2;
            magnitude1 += v1 * v1;
            magnitude2 += v2 * v2;
        }
        
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        
        if (magnitude1 === 0 || magnitude2 === 0) return 0;
        
        return dotProduct / (magnitude1 * magnitude2);
    }

    textToVector(text) {
        const words = text.split('');
        const vector = {};
        
        for (const word of words) {
            vector[word] = (vector[word] || 0) + 1;
        }
        
        return vector;
    }

    /**
     * خوارزمية ليفنشتاين للمسافة التحريرية
     */
    levenshtein(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // حذف
                    dp[i][j - 1] + 1,      // إدراج
                    dp[i - 1][j - 1] + cost // استبدال
                );
                
                // تبديل حرفين متجاورين
                if (i > 1 && j > 1 && str1[i - 1] === str2[j - 2] && str1[i - 2] === str2[j - 1]) {
                    dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
                }
            }
        }
        
        return dp[m][n];
    }

    /**
     * التحليل المتقدم للإجابة مع تقديم تغذية راجعة
     */
    analyzeAnswer(userAnswer, correctAnswer, questionType = '') {
        const result = {
            isCorrect: false,
            confidence: 0,
            feedback: '',
            suggestions: [],
            details: {}
        };
        
        // التحقق من الصحة
        result.isCorrect = this.checkAnswer(userAnswer, correctAnswer);
        
        // حساب درجة الثقة
        result.confidence = this.calculateConfidence(userAnswer, correctAnswer);
        
        // تقديم تغذية راجعة
        if (result.isCorrect) {
            result.feedback = 'إجابة صحيحة! ممتاز!';
            result.suggestions = ['استمر في التقدم!', 'أنت على الطريق الصحيح'];
        } else {
            const analysis = this.detailedAnalysis(userAnswer, correctAnswer, questionType);
            result.feedback = analysis.feedback;
            result.suggestions = analysis.suggestions;
            result.details = analysis.details;
        }
        
        return result;
    }

    /**
     * حساب درجة الثقة في الإجابة
     */
    calculateConfidence(userAnswer, correctAnswer) {
        const normalizedUser = this.normalize(userAnswer, this.settings);
        const normalizedCorrect = this.normalize(correctAnswer, this.settings);
        
        const similarity = this.calculateSimilarityScore(normalizedUser, normalizedCorrect);
        const distance = this.levenshtein(normalizedUser, normalizedCorrect);
        const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
        
        const distanceScore = 1 - (distance / maxLength);
        
        // متوسط الدرجتين مع وزن أكبر للتشابه
        return (similarity * 0.7) + (distanceScore * 0.3);
    }

    /**
     * تحليل مفصل للإجابة الخاطئة
     */
    detailedAnalysis(userAnswer, correctAnswer, questionType) {
        const analysis = {
            feedback: 'هناك خطأ في إجابتك.',
            suggestions: [],
            details: {}
        };
        
        const normalizedUser = this.normalize(userAnswer, this.settings);
        const normalizedCorrect = this.normalize(correctAnswer, this.settings);
        
        // تحليل الأخطاء الشائعة
        const commonErrors = this.detectCommonErrors(normalizedUser, normalizedCorrect, questionType);
        
        if (commonErrors.length > 0) {
            analysis.feedback = `إجابة خاطئة. ${commonErrors[0].message}`;
            analysis.suggestions = commonErrors.map(error => error.suggestion);
        } else {
            // التحليل العام
            const similarity = this.calculateSimilarityScore(normalizedUser, normalizedCorrect);
            
            if (similarity > 0.7) {
                analysis.feedback = 'قريب جداً من الإجابة الصحيحة!';
                analysis.suggestions = ['تحقق من الكتابة', 'قد يكون هناك خطأ مطبعي'];
            } else if (similarity > 0.5) {
                analysis.feedback = 'جيد، ولكن الإجابة ليست دقيقة تماماً';
                analysis.suggestions = ['راجع المفاهيم', 'تحقق من التفاصيل'];
            } else {
                analysis.feedback = 'الإجابة غير صحيحة';
                analysis.suggestions = ['راجع الدرس', 'حاول مرة أخرى'];
            }
        }
        
        // تفاصيل إضافية
        analysis.details = {
            similarity: Math.round(this.calculateSimilarityScore(normalizedUser, normalizedCorrect) * 100),
            levenshteinDistance: this.levenshtein(normalizedUser, normalizedCorrect),
            userAnswerLength: normalizedUser.length,
            correctAnswerLength: normalizedCorrect.length
        };
        
        return analysis;
    }

    /**
     * كشف الأخطاء الشائعة
     */
    detectCommonErrors(userAnswer, correctAnswer, questionType) {
        const errors = [];
        
        // أخطاء في الأرقام
        const userNumbers = this.extractNumbers(userAnswer);
        const correctNumbers = this.extractNumbers(correctAnswer);
        
        if (userNumbers.length > 0 && correctNumbers.length > 0) {
            if (userNumbers.length !== correctNumbers.length) {
                errors.push({
                    type: 'numeric_count',
                    message: 'عدد الأرقام غير صحيح',
                    suggestion: 'تحقق من عدد الأرقام في إجابتك'
                });
            } else if (JSON.stringify(userNumbers) !== JSON.stringify(correctNumbers)) {
                errors.push({
                    type: 'numeric_value',
                    message: 'قيمة الأرقام غير صحيحة',
                    suggestion: 'راجع الحسابات الرياضية'
                });
            }
        }
        
        // أخطاء في كتابة المصطلحات العلمية
        if (questionType.includes('علم') || questionType.includes('كيمياء') || questionType.includes('فيزياء')) {
            for (const [wrong, correct] of Object.entries(this.commonErrors.science.patterns)) {
                if (userAnswer.includes(wrong) && !correctAnswer.includes(wrong)) {
                    errors.push({
                        type: 'terminology',
                        message: 'خطأ في كتابة المصطلح العلمي',
                        suggestion: `استخدم "${correct}" بدلاً من "${wrong}"`
                    });
                }
            }
        }
        
        // أخطاء في المسافات والفواصل
        const extraSpaces = (userAnswer.match(/\s{2,}/g) || []).length;
        if (extraSpaces > 0) {
            errors.push({
                type: 'spacing',
                message: 'هناك مسافات زائدة',
                suggestion: 'تجنب المسافات الزائدة بين الكلمات'
            });
        }
        
        return errors;
    }

    /**
     * التحقق من التطابق الجزئي
     */
    partialMatch(userAnswer, correctAnswer) {
        const normalizedUser = this.normalize(userAnswer, this.settings);
        const normalizedCorrect = this.normalize(correctAnswer, this.settings);
        
        const result = {
            score: 0,
            matchedPart: '',
            missingPart: '',
            extraPart: ''
        };
        
        // البحث عن أطول جزء مشترك
        const lcs = this.longestCommonSubstring(normalizedUser, normalizedCorrect);
        result.matchedPart = lcs;
        
        if (lcs.length > 0) {
            result.score = lcs.length / normalizedCorrect.length;
            result.missingPart = normalizedCorrect.replace(lcs, '');
            result.extraPart = normalizedUser.replace(lcs, '');
        }
        
        return result;
    }

    /**
     * أطول سلسلة مشتركة
     */
    longestCommonSubstring(str1, str2) {
        const dp = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));
        let maxLength = 0;
        let endIndex = 0;
        
        for (let i = 1; i <= str1.length; i++) {
            for (let j = 1; j <= str2.length; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLength) {
                        maxLength = dp[i][j];
                        endIndex = i;
                    }
                }
            }
        }
        
        return str1.substring(endIndex - maxLength, endIndex);
    }

    /**
     * تحديث إعدادات النظام
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        return this.settings;
    }

    /**
     * الحصول على الإحصائيات
     */
    getStatistics() {
        return {
            version: '2.0.0',
            algorithms: ['Jaro-Winkler', 'Dice Coefficient', 'Cosine Similarity', 'Levenshtein Distance'],
            features: ['Normalization', 'Numeric Matching', 'Error Detection', 'Partial Matching'],
            settings: this.settings
        };
    }
}

// إنشاء كائن الفاحص العام
const answerChecker = new AnswerChecker();

// واجهات للاستخدام المباشر
function checkAnswer(userAnswer, correctAnswer, options = {}) {
    return answerChecker.checkAnswer(userAnswer, correctAnswer, options);
}

function analyzeAnswer(userAnswer, correctAnswer, questionType = '') {
    return answerChecker.analyzeAnswer(userAnswer, correctAnswer, questionType);
}

function partialMatch(userAnswer, correctAnswer) {
    return answerChecker.partialMatch(userAnswer, correctAnswer);
}

// تصدير الوظائف للاستخدام في الملفات الأخرى
if (typeof window !== 'undefined') {
    window.answerChecker = answerChecker;
    window.checkAnswer = checkAnswer;
    window.analyzeAnswer = analyzeAnswer;
    window.partialMatch = partialMatch;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnswerChecker,
        answerChecker,
        checkAnswer,
        analyzeAnswer,
        partialMatch
    };
}

// تسجيل معلومات النظام
console.log('✅ Answer Checker v2.0.0 loaded successfully');
console.log('📊 Features:', answerChecker.getStatistics().features.join(', '));