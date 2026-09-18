// processing_the_answers.js
// معالجة الإجابات بطريقة صحيحة للنصوص وأوامر Terminal

window.answerProcessor = {

    /* =========================
       أدوات عامة
    ========================= */

    cleanSpaces: function (text) {
        return text.toString().trim().replace(/\s+/g, ' ');
    },

    toLower: function (text) {
        return text.toLowerCase();
    },

    /* =========================
       1) معالجة النصوص العادية
       نحذف الرموز غير المهمة
    ========================= */

    normalizeText: function (text) {
        if (!text) return '';

        text = this.cleanSpaces(text);
        text = this.toLower(text);

        // حذف الرموز غير المهمة للنصوص
        text = text.replace(/[.,!?;:]/g, '');

        return this.cleanSpaces(text);
    },

    compareAnswers: function (userAnswer, correctAnswer) {
        return this.normalizeText(userAnswer) ===
               this.normalizeText(correctAnswer);
    },

    /* =========================
       2) معالجة أوامر Terminal (مهم جداً)
       لا نحذف أي رمز إطلاقاً
    ========================= */

    normalizeTerminalText: function (text) {
        if (!text) return '';

        text = this.cleanSpaces(text);
        text = this.toLower(text);

        // لا نحذف أي رموز هنا
        return text;
    },

    processTerminalAnswer: function (userAnswer, correctAnswer, expectedPattern = null) {
        const normalizedUser = this.normalizeTerminalText(userAnswer);
        const normalizedCorrect = this.normalizeTerminalText(correctAnswer);

        // إذا يوجد Regex متوقع
        if (expectedPattern) {
            try {
                const pattern = new RegExp(expectedPattern, 'i');
                return pattern.test(normalizedUser);
            } catch (err) {
                console.error('Pattern error:', err);
                return normalizedUser === normalizedCorrect;
            }
        }

        return normalizedUser === normalizedCorrect;
    },

    /* =========================
       3) اختيار متعدد / صح خطأ
    ========================= */

    processMultipleChoice: function (userAnswer, correctAnswer) {
        return parseInt(userAnswer) === correctAnswer;
    },

    processTrueFalse: function (userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    },

    /* =========================
       4) الفراغات
    ========================= */

    processFillBlank: function (userAnswer, correctAnswer) {
        return this.compareAnswers(userAnswer, correctAnswer);
    }

};
