/* images_map.js — صور الواجهات من روابط خارجية (بدل الرموز).
   عدّل أي رابط من هنا: مفتاح الكلمات (keywords) يحدد الصورة، ويمكنك استبدال الدالة url بروابطك الخاصة. */
(function () {
    'use strict';
    function hash(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h % 900 + 1; }
    var IMG = {
        // الصورة الرئيسية: صور موضوعية حسب الكلمات المفتاحية (خدمة loremflickr)
        url: function (kw, seed, w, h) { return 'https://loremflickr.com/' + (w || 640) + '/' + (h || 360) + '/' + kw.replace(/\s+/g, '') + '?lock=' + hash(seed || kw); },
        // بديل أول إذا تعذّر تحميل الصورة الرئيسية
        alt: function (seed, w, h) { return 'https://picsum.photos/seed/' + encodeURIComponent(seed || 'talib') + '/' + (w || 640) + '/' + (h || 360); },
        // بديل أخير محلي (تدرّج لوني) لا يحتاج إنترنت
        local: function (w, h) {
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (w || 640) + '" height="' + (h || 360) + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1f3a"/><stop offset="1" stop-color="#c9a227"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>';
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        },
        // يُستدعى من onerror في وسم img
        fb: function (img) {
            var st = parseInt(img.getAttribute('data-fb') || '0', 10);
            img.setAttribute('data-fb', st + 1);
            var seed = img.getAttribute('data-seed') || img.alt || 'talib';
            if (st === 0) img.src = IMG.alt(seed, img.naturalWidth || 640, img.naturalHeight || 360);
            else if (st === 1) img.src = IMG.local();
            else img.onerror = null;
        },
        subjects: {
            'اللغة الإنكليزية': 'english,books,library', 'حاسوب': 'computer,technology', 'فيزياء': 'physics,science,laboratory',
            'أحياء': 'biology,microscope', 'رياضيات': 'mathematics,geometry', 'عام': 'education,school'
        },
        grades: { 'الثالث المتوسط': 'students,classroom', 'الثاني المتوسط': 'students,school', 'الرابع الإعدادي': 'university,students', 'الخامس الإعدادي': 'study,students', 'السادس العلمي': 'graduation,students' },
        units: 'notebook,study',
        icon: function (kind, name) {
            var kw = kind === 'subject' ? (IMG.subjects[name] || 'education') : kind === 'grade' ? (IMG.grades[name] || 'school') : IMG.units;
            return IMG.url(kw, kind + name, 96, 96);
        },
        tag: function (kind, name) {
            var seed = kind + name;
            return '<img class="tt-img" loading="lazy" alt="" src="' + IMG.icon(kind, name) + '" data-seed="' + seed.replace(/"/g, '') + '" onerror="PLATFORM_IMG.fb(this)">';
        }
    };
    window.PLATFORM_IMG = IMG;
})();
