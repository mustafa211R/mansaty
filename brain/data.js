/* =====================================================================
   data.js — تحميل أسئلة الكورسات تلقائياً من ../course/quizzes وتحويلها
   إلى صيغ تصلح لجميع ألعاب العقل (خيارات، عبارات صح/خطأ، نصوص، كلمات...)
   ===================================================================== */
(function () {
    'use strict';
    var COURSE_DIR = '../course/';
    var BLANK = /_{3,}/;

    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function shuffle(a) {
        a = a.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function norm(t) {
        t = String(t == null ? '' : t);
        if (window.answerProcessor) return window.answerProcessor.normalizeText(t);
        return t.trim().toLowerCase();
    }
    function script(s) { return /[؀-ۿ]/.test(s) ? 'ar' : 'en'; }
    function cut(s, n) {
        s = String(s);
        if (s.length <= n) return s;
        var c = s.slice(0, n), sp = c.lastIndexOf(' ');
        return (sp > n * 0.5 ? c.slice(0, sp) : c) + '…';
    }

    var BD = window.BrainData = {
        courses: [], items: [], byCourse: {}, esc: esc, shuffle: shuffle, pick: pick, norm: norm, cut: cut, BLANK: BLANK
    };

    function loadScript(src) {
        return new Promise(function (res, rej) {
            var s = document.createElement('script');
            s.src = src; s.onload = res; s.onerror = function () { rej(new Error('تعذر تحميل ' + src)); };
            document.head.appendChild(s);
        });
    }

    function normalize(q, c, key) {
        var it = {
            key: key, courseId: c.id, subject: c.subject || 'عام', grade: c.grade || '', type: q.type,
            q: String(q.question), scenario: q.scenario ? String(q.scenario) : '',
            explanation: q.explanation ? String(q.explanation) : ''
        };
        if (q.type === 'multiple-choice' || q.type === 'scenario') {
            if (!Array.isArray(q.options) || q.options.length < 2 || q.options[q.correctAnswer] === undefined) return null;
            it.options = q.options.map(String);
            it.correctIdx = q.correctAnswer;
            it.correct = it.options[it.correctIdx];
        } else if (q.type === 'true-false') {
            it.isTF = true;
            it.truth = (q.correctAnswer === true || q.correctAnswer === 'true');
            it.options = ['صواب', 'خطأ'];
            it.correctIdx = it.truth ? 0 : 1;
            it.correct = it.options[it.correctIdx];
        } else if (q.type === 'fill-blank') {
            it.fill = true;
            it.correct = String(q.correctAnswer);
        } else return null;
        var len = it.q.length + it.scenario.length;
        var d = it.isTF ? 1 : (it.fill ? 3 : (it.scenario ? 3 : 2));
        if (len > 140) d += 1;
        if (it.correct.length > 28) d += 0;
        it.d = Math.max(1, Math.min(5, d));
        return it;
    }

    BD.load = function () {
        var db = window.coursesDB;
        if (!db || !Array.isArray(db.courses)) return Promise.reject(new Error('تعذر تحميل قائمة الكورسات (db_course.js)'));
        var list = db.courses.filter(function (c) { return c && c.quizzesPath; });
        return Promise.all(list.map(function (c) {
            return loadScript(COURSE_DIR + c.quizzesPath).catch(function (e) { console.warn(e.message); });
        })).then(function () {
            list.forEach(function (c) {
                var data = window['quizzes_course' + c.id];
                if (!data) return;
                var arr = [];
                Object.keys(data).forEach(function (k) {
                    var it = data[k] && data[k].question ? normalize(data[k], c, k) : null;
                    if (it) arr.push(it);
                });
                if (arr.length) { BD.byCourse[c.id] = arr; BD.courses.push(c); BD.items = BD.items.concat(arr); }
            });
            if (!BD.items.length) throw new Error('لم يتم العثور على أسئلة داخل course/quizzes');
        });
    };

    BD.groups = function () {
        var order = [], map = {};
        BD.courses.forEach(function (c) {
            var k = (c.subject || 'عام') + ' — ' + (c.grade || '');
            if (!map[k]) { map[k] = { title: k, courses: [] }; order.push(k); }
            map[k].courses.push(c);
        });
        return order.map(function (k) { return map[k]; });
    };

    BD.courseLabel = function (c) {
        var t = String(c.title || ('كورس ' + c.id)).trim();
        var m = t.match(/الوحدة\s*\d+\s*\/.*$/);
        return m ? m[0] : t;
    };

    /* ---------- مشتّتات الإجابة ---------- */
    BD.distractors = function (it, n, pool) {
        var seen = {}; seen[norm(it.correct)] = 1;
        var out = [];
        function take(list, strict) {
            shuffle(list).forEach(function (x) {
                if (out.length >= n) return;
                var nx = norm(x);
                if (!x || seen[nx]) return;
                if (strict && (script(x) !== script(it.correct) || Math.abs(x.length - it.correct.length) > 8)) return;
                seen[nx] = 1; out.push(x);
            });
        }
        if (it.options && !it.isTF) {
            it.options.forEach(function (o, i) { if (i !== it.correctIdx) { var nx = norm(o); if (!seen[nx]) { seen[nx] = 1; out.push(o); } } });
            return shuffle(out).slice(0, n);
        }
        pool = pool || BD.items;
        var same = pool.filter(function (x) { return x.courseId === it.courseId && x.key !== it.key && !x.isTF; });
        var ansSame = same.filter(function (x) { return x.fill; }).map(function (x) { return x.correct; });
        take(ansSame, true);
        take(same.map(function (x) { return x.correct; }), true);
        var other = pool.filter(function (x) { return x.courseId !== it.courseId && !x.isTF; });
        take(other.filter(function (x) { return x.fill; }).map(function (x) { return x.correct; }), true);
        take(other.map(function (x) { return x.correct; }), true);
        take(same.map(function (x) { return x.correct; }), false);
        take(other.map(function (x) { return x.correct; }), false);
        return out.slice(0, n);
    };

    BD.wrongPick = function (it, pool) {
        var d = BD.distractors(it, 3, pool);
        return d.length ? pick(d) : 'لا شيء مما سبق';
    };

    /* خيارات للعبة: [{text, ok}] */
    BD.choices = function (it, n, pool) {
        n = n || 4;
        var res;
        if (it.isTF) {
            res = [{ text: 'صواب', ok: it.truth }, { text: 'خطأ', ok: !it.truth }];
        } else {
            var wrong = BD.distractors(it, Math.max(1, n - 1), pool);
            res = [{ text: it.correct, ok: true }].concat(wrong.map(function (w) { return { text: w, ok: false }; }));
        }
        return shuffle(res);
    };

    /* عبارة صح/خطأ مشتقة من السؤال */
    BD.statement = function (it, wantTrue, pool) {
        if (it.isTF) return { text: it.q, truth: it.truth, cand: null };
        var truth = wantTrue === undefined ? Math.random() < 0.5 : !!wantTrue;
        var cand = truth ? it.correct : BD.wrongPick(it, pool);
        var text = BLANK.test(it.q) ? it.q.replace(BLANK, '«' + cand + '»') : (it.q + '  ←  «' + cand + '»');
        return { text: text, truth: truth, cand: cand };
    };

    /* السؤال مع الفراغ كـ HTML */
    BD.qHtml = function (it) {
        return esc(it.q).replace(/_{3,}/g, '<span class="blank">؟</span>');
    };

    function words(it) { return it.correct.trim().split(/\s+/); }

    /* ---------- أي الأسئلة يصلح لأي لعبة ---------- */
    BD.accepts = {
        any: function () { return true; },
        c3: function (it) { return !it.isTF; },
        stmt: function (it) { return !it.scenario && it.q.length <= 160; },
        stmtN: function (it) { return !it.isTF && !it.scenario && it.q.length <= 160; },
        text: function (it) {
            if (it.isTF) return false;
            var t = it.correct.replace(/\s+/g, '');
            return /^[؀-ۿa-zA-Z]+$/.test(t) && t.length >= 3 && t.length <= 14 && words(it).length <= 2;
        },
        words: function (it) {
            if (it.isTF) return false;
            var w = words(it);
            return w.length >= 3 && w.length <= 8 && it.correct.length <= 80;
        },
        pair: function (it) { return !it.isTF && !it.scenario && it.q.length <= 160 && it.correct.length <= 70; },
        rev: function (it) { return !it.isTF && !it.scenario && it.q.length <= 120; }
    };
})();
