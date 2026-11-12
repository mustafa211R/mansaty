/* =====================================================================
   exam.js — محرك الاختبار الشهري (منصة طالب)
   ---------------------------------------------------------------------
   - الأسئلة تُقرأ تلقائياً من ../course/quizzes/courseN.js (نفس ملفات الدورة)
   - واجهة السؤال والشرح والإجابات مطابقة لصفحة course.html
   - المؤقت: الطالب يحدد مدة الاختبار بالدقائق من 1 إلى 60
   - عند النجاح (80% فأكثر) يُحوَّل الطالب إلى ../course/certificate.html
   ===================================================================== */
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       الإعدادات
    ------------------------------------------------------------------ */
    var PASS_PERCENT = 80;      // نسبة النجاح للحصول على الشهادة (نفس الدورة)
    var MIN_MINUTES = 1;
    var MAX_MINUTES = 60;
    var MAX_QUESTIONS = 100;
    var COURSE_DIR = '../course/';
    var PREFS_KEY = 'exam_prefs_v1';
    var SEEN_KEY = 'exam_seen_v1_';

    var TYPE_LABELS = {
        'multiple-choice': 'اختيار من متعدد',
        'true-false': 'صح / خطأ',
        'scenario': 'سيناريو',
        'fill-blank': 'إكمال الفراغ',
        'terminal': 'أوامر'
    };

    /* مستوى الصعوبة يُستنتج تلقائياً من نوع السؤال.
       وإن أضفتَ للسؤال حقل difficulty ("easy" | "medium" | "hard") في ملف quizzes
       فسيُعتمد هذا الحقل بدل نوع السؤال. */
    var LEVELS = {
        easy: {
            name: 'اختبار سهل', icon: 'fa-seedling', minutes: 10, count: 10,
            types: ['multiple-choice', 'true-false'],
            desc: 'أسئلة مباشرة لقياس معرفتك بالمفاهيم الأساسية: اختيار من متعدد وصح / خطأ.'
        },
        medium: {
            name: 'اختبار متوسط', icon: 'fa-bolt', minutes: 20, count: 15,
            types: ['multiple-choice', 'scenario'],
            desc: 'أسئلة تطبيقية وسيناريوهات تحتاج فهماً لا حفظاً، مع أسئلة الاختيار من متعدد.'
        },
        hard: {
            name: 'اختبار صعب', icon: 'fa-fire', minutes: 30, count: 20,
            types: ['scenario', 'fill-blank'],
            desc: 'سيناريوهات معقدة وأسئلة تكتب إجابتها بنفسك دون خيارات تساعدك.'
        }
    };

    var DIFF_ALIASES = {
        easy: 'easy', 'سهل': 'easy',
        medium: 'medium', 'متوسط': 'medium',
        hard: 'hard', 'صعب': 'hard'
    };

    /* ------------------------------------------------------------------
       الحالة
    ------------------------------------------------------------------ */
    var levelKey = (document.body.getAttribute('data-level') || 'easy');
    if (!LEVELS[levelKey]) levelKey = 'easy';
    var cfg = LEVELS[levelKey];

    var S = {
        courses: [],            // الكورسات التي لها ملف أسئلة
        pools: {},              // courseId -> [questions]
        selected: {},           // courseId -> true
        minutes: cfg.minutes,
        minutesValid: true,
        count: cfg.count,
        countValid: true,
        questions: [],
        idx: 0,
        answers: {},
        userAnswer: null,
        checked: false,
        startAt: 0,
        endAt: 0,
        timer: null,
        finished: false,
        result: null
    };

    var app = document.getElementById('examApp');

    /* ------------------------------------------------------------------
       أدوات
    ------------------------------------------------------------------ */
    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function $(id) { return document.getElementById(id); }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function fmtTime(sec) {
        sec = Math.max(0, Math.round(sec));
        var m = Math.floor(sec / 60), s = sec % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

    function storeGet(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
    }
    function storeSet(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* التخزين غير متاح */ }
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = function () { reject(new Error('تعذر تحميل ' + src)); };
            document.head.appendChild(s);
        });
    }

    /* ------------------------------------------------------------------
       تحميل الأسئلة تلقائياً من quizzes
    ------------------------------------------------------------------ */
    function loadData() {
        var db = window.coursesDB;
        if (!db || !Array.isArray(db.courses)) {
            return Promise.reject(new Error('تعذر تحميل قائمة الكورسات (db_course.js)'));
        }
        var list = db.courses.filter(function (c) { return c && c.quizzesPath; });

        return Promise.all(list.map(function (c) {
            return loadScript(COURSE_DIR + c.quizzesPath).catch(function (e) { console.warn(e.message); });
        })).then(function () {
            list.forEach(function (c) {
                var data = window['quizzes_course' + c.id];
                if (!data) return;
                var arr = [];
                Object.keys(data).forEach(function (key) {
                    var q = data[key];
                    if (!q || !q.type || !q.question) return;
                    var copy = {};
                    Object.keys(q).forEach(function (k) { copy[k] = q[k]; });
                    copy.key = key;
                    copy.courseId = c.id;
                    arr.push(copy);
                });
                if (arr.length) {
                    S.pools[c.id] = arr;
                    S.courses.push(c);
                }
            });
            if (!S.courses.length) {
                throw new Error('لم يتم العثور على أي ملف أسئلة داخل مجلد course/quizzes');
            }
        });
    }

    function matchesLevel(q) {
        if (q.difficulty) {
            var d = DIFF_ALIASES[String(q.difficulty).trim().toLowerCase()] || DIFF_ALIASES[String(q.difficulty).trim()];
            if (d) return d === levelKey;
        }
        return cfg.types.indexOf(q.type) > -1;
    }

    function levelPool(courseId) {
        return (S.pools[courseId] || []).filter(matchesLevel);
    }

    function groupKey(c) { return (c.subject || 'عام') + ' — ' + (c.grade || ''); }

    function courseLabel(c) {
        var t = String(c.title || ('كورس ' + c.id)).trim();
        var m = t.match(/الوحدة\s*\d+\s*\/.*$/);
        return m ? m[0] : t;
    }

    function buildGroups() {
        var order = [], map = {};
        S.courses.forEach(function (c) {
            var k = groupKey(c);
            if (!map[k]) { map[k] = { title: k, courses: [] }; order.push(k); }
            map[k].courses.push(c);
        });
        return order.map(function (k) { return map[k]; });
    }

    function selectedIds() {
        return S.courses.filter(function (c) { return S.selected[c.id] && levelPool(c.id).length; })
            .map(function (c) { return c.id; });
    }

    function poolSize() {
        return selectedIds().reduce(function (n, id) { return n + levelPool(id).length; }, 0);
    }

    /* ------------------------------------------------------------------
       شاشة الإعداد (اختيار الدروس + المدة + عدد الأسئلة)
    ------------------------------------------------------------------ */
    function showLoading(msg) {
        app.innerHTML = '<div class="ios-card loading-box"><div class="spinner"></div>' +
            '<p style="color:var(--sf-text-secondary);margin:0">' + esc(msg) + '</p></div>';
    }

    function showError(msg) {
        app.innerHTML =
            '<div class="ios-card loading-box">' +
            '<i class="fas fa-exclamation-triangle" style="font-size:46px;color:#d33333;margin-bottom:14px"></i>' +
            '<h2 style="color:var(--oxford-blue);margin-bottom:8px">تعذر تحميل الأسئلة</h2>' +
            '<p style="color:var(--sf-text-secondary);margin:0 0 20px">' + esc(msg) + '</p>' +
            '<p style="color:var(--sf-text-tertiary);font-size:13px;margin:0 0 20px">' +
            'تأكد أن مجلد <b>course</b> موجود بجانب مجلد <b>challenges</b> على الموقع نفسه.</p>' +
            '<button class="btn-primary" onclick="location.reload()"><i class="fas fa-redo"></i> إعادة المحاولة</button>' +
            '</div>';
    }

    function renderSetup() {
        var groups = buildGroups();

        var groupsHtml = groups.map(function (g, gi) {
            var items = g.courses.map(function (c) {
                var n = levelPool(c.id).length;
                return '<label class="course-item' + (n ? '' : ' empty') + '">' +
                    '<input type="checkbox" class="course-cb" data-id="' + c.id + '" data-group="' + gi + '"' + (n ? '' : ' disabled') + '>' +
                    '<span class="name">' + esc(courseLabel(c)) + '</span>' +
                    '<span class="qcount">' + n + ' سؤال</span></label>';
            }).join('');
            return '<div class="group-box">' +
                '<label class="group-head"><input type="checkbox" class="group-cb" data-group="' + gi + '">' +
                '<span>' + esc(g.title) + '</span><span class="count">' + g.courses.length + ' كورس</span></label>' +
                items + '</div>';
        }).join('');

        var minuteChips = [5, 10, 15, 20, 30, 45, 60].map(function (m) {
            return '<button type="button" class="chip" data-minutes="' + m + '">' + m + ' د</button>';
        }).join('');

        var countChips = [5, 10, 15, 20, 30].map(function (n) {
            return '<button type="button" class="chip" data-count="' + n + '">' + n + '</button>';
        }).join('') + '<button type="button" class="chip" data-count="all">الكل</button>';

        app.innerHTML =
            '<div class="ios-card setup-intro">' +
            '<h2 style="display:flex;align-items:center;gap:10px;color:var(--oxford-blue)"><i class="fas ' + cfg.icon + '" style="color:var(--exam-accent)"></i>' + esc(cfg.name) + '</h2>' +
            '<p>' + esc(cfg.desc) + '</p>' +
            '<div class="type-tags">' + cfg.types.map(function (t) { return '<span class="type-tag">' + TYPE_LABELS[t] + '</span>'; }).join('') + '</div>' +
            '</div>' +

            '<div class="ios-card setup-card">' +
            '<h2><i class="fas fa-book-open"></i> 1) اختر دروس الاختبار</h2>' +
            '<p class="hint">تُسحب الأسئلة تلقائياً من أسئلة الكورسات التي تحددها هنا.</p>' +
            '<div class="quick-row">' +
            '<button type="button" class="link-btn" id="selAll">تحديد الكل</button>' +
            '<button type="button" class="link-btn" id="selNone">إلغاء التحديد</button></div>' +
            groupsHtml + '</div>' +

            '<div class="ios-card setup-card">' +
            '<h2><i class="fas fa-clock"></i> 2) حدد وقت الاختبار</h2>' +
            '<p class="hint">اختر المدة بالدقائق من ' + MIN_MINUTES + ' إلى ' + MAX_MINUTES + '. عند انتهاء الوقت يُسلَّم الاختبار تلقائياً.</p>' +
            '<div class="stepper">' +
            '<button type="button" class="step-btn" id="minPlus" aria-label="زيادة">+</button>' +
            '<input type="text" inputmode="numeric" class="num-input" id="minutesInput" maxlength="2" autocomplete="off" aria-label="مدة الاختبار بالدقائق">' +
            '<button type="button" class="step-btn" id="minMinus" aria-label="إنقاص">−</button>' +
            '<span class="unit-label">دقيقة</span></div>' +
            '<input type="range" class="range" id="minutesRange" min="' + MIN_MINUTES + '" max="' + MAX_MINUTES + '" step="1">' +
            '<div class="range-scale"><span>' + MIN_MINUTES + '</span><span>' + MAX_MINUTES + '</span></div>' +
            '<div class="chips" id="minuteChips">' + minuteChips + '</div>' +
            '<div class="field-error" id="minutesError"></div></div>' +

            '<div class="ios-card setup-card">' +
            '<h2><i class="fas fa-list-ol"></i> 3) عدد الأسئلة</h2>' +
            '<p class="hint" id="countHint"></p>' +
            '<div class="stepper">' +
            '<button type="button" class="step-btn" id="cntPlus" aria-label="زيادة">+</button>' +
            '<input type="text" inputmode="numeric" class="num-input" id="countInput" maxlength="3" autocomplete="off" aria-label="عدد الأسئلة">' +
            '<button type="button" class="step-btn" id="cntMinus" aria-label="إنقاص">−</button>' +
            '<span class="unit-label">سؤال</span></div>' +
            '<div class="chips" id="countChips">' + countChips + '</div>' +
            '<div class="field-error" id="countError"></div></div>' +

            '<div class="ios-card start-bar">' +
            '<div class="start-summary" id="startSummary"></div>' +
            '<button type="button" class="btn-primary btn-start-exam" id="startBtn"><i class="fas fa-play"></i> ابدأ الاختبار</button>' +
            '</div>';

        // استرجاع التفضيلات المحفوظة
        var prefs = storeGet(PREFS_KEY) || {};
        if (prefs.selected && Array.isArray(prefs.selected)) {
            prefs.selected.forEach(function (id) {
                if (S.pools[id] && levelPool(id).length) S.selected[id] = true;
            });
        }
        var pm = prefs.minutes && prefs.minutes[levelKey];
        if (pm >= MIN_MINUTES && pm <= MAX_MINUTES) S.minutes = pm;
        var pc = prefs.count && prefs.count[levelKey];
        if (pc >= 1 && pc <= MAX_QUESTIONS) S.count = pc;

        $('minutesInput').value = S.minutes;
        $('minutesRange').value = S.minutes;
        $('countInput').value = S.count;

        bindSetup();
        refreshSetup();
    }

    function savePrefs() {
        var prefs = storeGet(PREFS_KEY) || {};
        prefs.selected = selectedIds();
        prefs.minutes = prefs.minutes || {};
        prefs.count = prefs.count || {};
        if (S.minutesValid) prefs.minutes[levelKey] = S.minutes;
        if (S.countValid) prefs.count[levelKey] = S.count;
        storeSet(PREFS_KEY, prefs);
    }

    function setMinutes(n, fromInput) {
        S.minutes = clamp(n, MIN_MINUTES, MAX_MINUTES);
        S.minutesValid = true;
        if (!fromInput) $('minutesInput').value = S.minutes;
        $('minutesRange').value = S.minutes;
        $('minutesInput').classList.remove('invalid');
        $('minutesError').textContent = '';
        refreshSetup();
    }

    function setCount(n, fromInput) {
        var max = Math.max(1, Math.min(MAX_QUESTIONS, poolSize()));
        S.count = clamp(n, 1, max);
        S.countValid = true;
        if (!fromInput) $('countInput').value = S.count;
        $('countInput').classList.remove('invalid');
        $('countError').textContent = '';
        refreshSetup();
    }

    function onSetupChange(e) {
            var t = e.target;
            if (t.classList.contains('course-cb')) {
                if (t.checked) S.selected[t.getAttribute('data-id')] = true;
                else delete S.selected[t.getAttribute('data-id')];
                refreshSetup();
            } else if (t.classList.contains('group-cb')) {
                var gi = t.getAttribute('data-group');
                app.querySelectorAll('.course-cb[data-group="' + gi + '"]').forEach(function (cb) {
                    if (cb.disabled) return;
                    cb.checked = t.checked;
                    if (t.checked) S.selected[cb.getAttribute('data-id')] = true;
                    else delete S.selected[cb.getAttribute('data-id')];
                });
                refreshSetup();
            }
        }

    var changeBound = false;

    function bindSetup() {
        // تحديد الدروس (مستمع واحد على الحاوية، يُربط مرة واحدة فقط)
        if (!changeBound) { changeBound = true; app.addEventListener('change', onSetupChange); }

        $('selAll').addEventListener('click', function () {
            S.courses.forEach(function (c) { if (levelPool(c.id).length) S.selected[c.id] = true; });
            refreshSetup();
        });
        $('selNone').addEventListener('click', function () { S.selected = {}; refreshSetup(); });

        // الوقت
        var mi = $('minutesInput');
        mi.addEventListener('input', function () {
            var raw = mi.value.replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).trim();
            if (mi.value !== raw) mi.value = raw;
            var n = parseInt(raw, 10);
            if (/^\d{1,2}$/.test(raw) && n >= MIN_MINUTES && n <= MAX_MINUTES) {
                setMinutes(n, true);
            } else {
                S.minutesValid = false;
                mi.classList.add('invalid');
                $('minutesError').textContent = 'أدخل عدداً صحيحاً من ' + MIN_MINUTES + ' إلى ' + MAX_MINUTES + ' دقيقة.';
                refreshSetup();
            }
        });
        mi.addEventListener('blur', function () {
            if (!S.minutesValid) {
                var n = parseInt(mi.value, 10);
                setMinutes(isNaN(n) ? S.minutes : n);
            }
        });
        $('minutesRange').addEventListener('input', function (e) { setMinutes(parseInt(e.target.value, 10)); });
        $('minPlus').addEventListener('click', function () { setMinutes((S.minutesValid ? S.minutes : parseInt(mi.value, 10) || S.minutes) + 1); });
        $('minMinus').addEventListener('click', function () { setMinutes((S.minutesValid ? S.minutes : parseInt(mi.value, 10) || S.minutes) - 1); });
        $('minuteChips').addEventListener('click', function (e) {
            var b = e.target.closest('.chip');
            if (b) setMinutes(parseInt(b.getAttribute('data-minutes'), 10));
        });

        // عدد الأسئلة
        var ci = $('countInput');
        ci.addEventListener('input', function () {
            var raw = ci.value.replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).trim();
            if (ci.value !== raw) ci.value = raw;
            var n = parseInt(raw, 10);
            var max = Math.min(MAX_QUESTIONS, poolSize());
            if (/^\d{1,3}$/.test(raw) && n >= 1 && n <= max) {
                S.count = n; S.countValid = true;
                ci.classList.remove('invalid'); $('countError').textContent = '';
                refreshSetup();
            } else {
                S.countValid = false;
                ci.classList.add('invalid');
                $('countError').textContent = max ? ('أدخل عدداً من 1 إلى ' + max + '.') : 'اختر درساً واحداً على الأقل أولاً.';
                refreshSetup();
            }
        });
        ci.addEventListener('blur', function () {
            if (!S.countValid) {
                var n = parseInt(ci.value, 10);
                setCount(isNaN(n) ? S.count : n);
            }
        });
        $('cntPlus').addEventListener('click', function () { setCount(S.count + 1); });
        $('cntMinus').addEventListener('click', function () { setCount(S.count - 1); });
        $('countChips').addEventListener('click', function (e) {
            var b = e.target.closest('.chip');
            if (!b) return;
            var v = b.getAttribute('data-count');
            setCount(v === 'all' ? Math.min(MAX_QUESTIONS, poolSize()) : parseInt(v, 10));
        });

        $('startBtn').addEventListener('click', startExam);
    }

    function refreshSetup() {
        var size = poolSize();
        var max = Math.min(MAX_QUESTIONS, size);

        // حالة مربعات التحديد
        app.querySelectorAll('.course-cb').forEach(function (cb) {
            cb.checked = !!S.selected[cb.getAttribute('data-id')] && !cb.disabled;
        });
        app.querySelectorAll('.group-cb').forEach(function (gcb) {
            var gi = gcb.getAttribute('data-group');
            var all = app.querySelectorAll('.course-cb[data-group="' + gi + '"]:not(:disabled)');
            var on = app.querySelectorAll('.course-cb[data-group="' + gi + '"]:not(:disabled):checked');
            gcb.checked = all.length > 0 && on.length === all.length;
            gcb.indeterminate = on.length > 0 && on.length < all.length;
            gcb.disabled = all.length === 0;
        });

        // الحد الأعلى لعدد الأسئلة
        if (S.countValid && max > 0 && S.count > max) {
            S.count = max;
            $('countInput').value = max;
        }
        $('countHint').textContent = size
            ? 'المتاح للدروس المختارة: ' + size + ' سؤال من نوع ' + cfg.types.map(function (t) { return TYPE_LABELS[t]; }).join(' / ') + '.'
            : 'اختر درساً واحداً على الأقل لتظهر الأسئلة المتاحة.';

        // تمييز الشرائح النشطة
        app.querySelectorAll('#minuteChips .chip').forEach(function (b) {
            b.classList.toggle('active', S.minutesValid && parseInt(b.getAttribute('data-minutes'), 10) === S.minutes);
        });
        app.querySelectorAll('#countChips .chip').forEach(function (b) {
            var v = b.getAttribute('data-count');
            var n = v === 'all' ? max : parseInt(v, 10);
            b.classList.toggle('active', S.countValid && S.count === n && max > 0);
            b.disabled = max === 0 || (v !== 'all' && n > max);
            b.style.opacity = b.disabled ? .45 : 1;
        });

        var ready = S.minutesValid && S.countValid && size > 0;
        $('startBtn').disabled = !ready;
        $('startSummary').innerHTML = ready
            ? 'سيتكوّن الاختبار من <strong>' + Math.min(S.count, max) + '</strong> سؤالاً خلال <strong>' + S.minutes + '</strong> دقيقة.'
            : (size ? 'صحّح القيم المطلوبة لتبدأ.' : 'اختر درساً واحداً على الأقل لتبدأ.');

        savePrefs();
    }

    /* ------------------------------------------------------------------
       بناء الاختبار
    ------------------------------------------------------------------ */
    function buildExamQuestions() {
        var seen = storeGet(SEEN_KEY + levelKey) || {};
        // لكل درس: الأسئلة التي لم تظهر سابقاً أولاً، ثم توزيع متساوٍ بين الدروس
        var lists = selectedIds().map(function (id) {
            var all = shuffle(levelPool(id));
            return all.filter(function (q) { return !seen[q.key]; })
                .concat(all.filter(function (q) { return seen[q.key]; }));
        });
        var want = Math.min(S.count, MAX_QUESTIONS);
        var out = [], i = 0;
        while (out.length < want) {
            var added = false;
            for (var l = 0; l < lists.length && out.length < want; l++) {
                if (lists[l][i]) { out.push(lists[l][i]); added = true; }
            }
            if (!added) break;
            i++;
        }
        out = shuffle(out);
        out.forEach(function (q) { seen[q.key] = 1; });
        storeSet(SEEN_KEY + levelKey, seen);
        return out;
    }

    function startExam() {
        if ($('startBtn').disabled) return;
        var qs = buildExamQuestions();
        if (!qs.length) return;

        S.questions = qs;
        S.idx = 0;
        S.answers = {};
        S.finished = false;
        S.result = null;
        S.startAt = Date.now();
        S.endAt = S.startAt + S.minutes * 60000;

        renderExam();
        showQuestion();
        startTimer();

        window.onbeforeunload = function (e) { e.preventDefault(); e.returnValue = ''; return ''; };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ------------------------------------------------------------------
       شاشة الاختبار
    ------------------------------------------------------------------ */
    function renderExam() {
        app.innerHTML =
            '<div class="ios-card exam-statusbar">' +
            '<div class="exam-statusbar-row">' +
            '<span id="progressText"></span>' +
            '<span class="timer-chip" id="timerChip"><i class="fas fa-clock"></i><span id="timerText">--:--</span></span>' +
            '</div>' +
            '<div class="progress-container"><div id="progressBar" class="progress-bar" style="width:0%"></div></div>' +
            '</div>' +
            '<div style="height:18px"></div>' +
            '<div id="quizArea" class="lesson-card p-6" style="padding:24px">' +
            '<div id="quizContent"></div>' +
            '<div class="exam-actions">' +
            '<button id="nextBtn" class="btn-primary" disabled><i class="fas fa-arrow-left"></i><span id="nextBtnText">تأكيد الإجابة</span></button>' +
            '</div></div>' +
            '<div id="explanationArea" class="explanation-container" style="display:none"></div>';

        $('nextBtn').addEventListener('click', handleNext);
    }

    function updateProgress() {
        var total = S.questions.length;
        var answered = Object.keys(S.answers).length;
        $('progressText').textContent = 'سؤال ' + (S.idx + 1) + ' من ' + total + ' — تمت الإجابة على ' + answered;
        $('progressBar').style.width = Math.round(answered / total * 100) + '%';
    }

    function showQuestion() {
        var q = S.questions[S.idx];
        S.userAnswer = null;
        S.checked = false;

        var html;
        switch (q.type) {
            case 'multiple-choice': html = buildMultipleChoice(q); break;
            case 'fill-blank': html = buildFillBlank(q); break;
            case 'true-false': html = buildTrueFalse(q); break;
            case 'terminal': html = buildTerminal(q); break;
            case 'scenario': html = buildScenario(q); break;
            default: html = '<p class="text-center" style="padding:40px 0">نوع السؤال غير معروف</p>';
        }

        $('quizContent').innerHTML =
            '<div class="question-indicator mb-4 text-center"><span style="display:inline-block">سؤال ' +
            (S.idx + 1) + ' من ' + S.questions.length + '</span></div>' + html;

        setupEvents(q.type);

        $('nextBtn').disabled = true;
        $('nextBtnText').textContent = 'تأكيد الإجابة';
        $('explanationArea').style.display = 'none';
        updateProgress();
    }

    /* ---- بناء الأسئلة (نفس قوالب course.html) ---- */
    function optionsHtml(q) {
        return (q.options || []).map(function (o, i) {
            return '<div class="option" data-index="' + i + '"><div class="option-letter">' +
                String.fromCharCode(65 + i) + '</div><div class="flex-1">' + esc(o) + '</div></div>';
        }).join('');
    }

    function buildMultipleChoice(q) {
        return '<h2>اختبر معرفتك</h2><div class="question-text mb-6">' + esc(q.question) + '</div>' +
            '<div class="options-container">' + optionsHtml(q) + '</div>';
    }

    function buildScenario(q) {
        return '<h2>اختبار السيناريو</h2>' +
            (q.scenario ? '<div class="scenario-container"><div class="scenario-title"><i class="fas fa-file-alt"></i><h3>السيناريو</h3></div>' +
                '<div class="scenario-text">' + esc(q.scenario) + '</div></div>' : '') +
            '<div class="question-text mb-6">' + esc(q.question) + '</div>' +
            '<div class="options-container">' + optionsHtml(q) + '</div>';
    }

    function buildFillBlank(q) {
        var parts = String(q.question).split(/_{3,}/);
        var input = '<input type="text" class="blank-input" placeholder="اكتب الإجابة هنا..." id="blankAnswer" autocomplete="off">';
        return (q.instruction ? '<span class="instruction-text"><strong>' + esc(q.instruction) + '</strong></span>' : '') +
            '<div class="blank-container"><div class="blank-question mb-4">' +
            esc(parts[0] || '') + input + esc(parts.slice(1).join(' ') || '') +
            '</div></div>';
    }

    function buildTrueFalse(q) {
        return '<h2>اختبر معرفتك</h2><div class="question-text mb-6">' + esc(q.question) + '</div>' +
            '<div class="true-false-container">' +
            '<button class="true-false-btn true-btn" data-answer="true"><i class="fas fa-check"></i> صواب</button>' +
            '<button class="true-false-btn false-btn" data-answer="false"><i class="fas fa-times"></i> خطأ</button>' +
            '</div>';
    }

    function buildTerminal(q) {
        return '<h2>اختبار محاكاة طرفية</h2><div class="question-text mb-4">' + esc(q.question) + '</div>' +
            '<div class="terminal-container"><div class="terminal-header"><div class="terminal-dots">' +
            '<div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>' +
            '<div class="terminal-title">kali@hook:~</div></div>' +
            '<div class="terminal-body"><div class="terminal-instruction"><i class="fas fa-terminal"></i>' +
            '<span><strong>' + esc(q.instruction || 'اكتب الأمر التالي:') + '</strong></span></div>' +
            '<div class="terminal-command-display"><code class="command-code">$ ' + esc(q.command || q.hint || '') + '</code></div>' +
            '<div class="terminal-input-container"><label for="terminalOutput">أدخل الناتج أو الأمر الذي قمت بتنفيذه:</label>' +
            '<input type="text" class="terminal-input" id="terminalOutput" placeholder="اكتب الناتج هنا..." spellcheck="false" autocomplete="off"></div>' +
            '</div></div>';
    }

    /* ---- أحداث الأسئلة ---- */
    function enableNext() { $('nextBtn').disabled = false; }

    function setupEvents(type) {
        var qc = $('quizContent');

        if (type === 'multiple-choice' || type === 'scenario') {
            qc.querySelectorAll('.option').forEach(function (opt) {
                opt.addEventListener('click', function () {
                    if (S.checked || S.finished) return;
                    qc.querySelectorAll('.option').forEach(function (o) { o.classList.remove('selected'); });
                    opt.classList.add('selected');
                    S.userAnswer = parseInt(opt.getAttribute('data-index'), 10);
                    enableNext();
                });
            });
        } else if (type === 'true-false') {
            qc.querySelectorAll('.true-false-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    if (S.checked || S.finished) return;
                    qc.querySelectorAll('.true-false-btn').forEach(function (b) { b.classList.remove('selected'); });
                    btn.classList.add('selected');
                    S.userAnswer = btn.getAttribute('data-answer') === 'true';
                    enableNext();
                });
            });
        } else if (type === 'fill-blank' || type === 'terminal') {
            var input = $(type === 'fill-blank' ? 'blankAnswer' : 'terminalOutput');
            if (!input) return;
            input.addEventListener('input', function () {
                if (S.checked) return;
                S.userAnswer = input.value.trim();
                $('nextBtn').disabled = !S.userAnswer;
            });
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && input.value.trim() && !$('nextBtn').disabled) $('nextBtn').click();
            });
            setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { } }, 50);
        }
    }

    /* ---- التصحيح (نفس منطق الدورة + answerProcessor) ---- */
    function evaluate(q, ua) {
        var ca = q.correctAnswer;
        switch (q.type) {
            case 'multiple-choice':
            case 'scenario':
                return ua === ca;
            case 'true-false':
                return ua === (ca === true || ca === 'true');
            case 'fill-blank':
                if (window.answerProcessor) return window.answerProcessor.processFillBlank(ua, ca);
                return String(ua || '').trim().toLowerCase() === String(ca || '').trim().toLowerCase();
            case 'terminal':
                if (window.answerProcessor) return window.answerProcessor.processTerminalAnswer(ua, ca, q.expectedPattern);
                return String(ua || '').trim().toLowerCase() === String(ca || '').trim().toLowerCase();
            default:
                return false;
        }
    }

    function handleNext() {
        if (S.finished) return;
        if (!S.checked) { checkCurrent(); return; }
        if (S.idx < S.questions.length - 1) {
            S.idx++;
            showQuestion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            finish('done');
        }
    }

    function checkCurrent() {
        var q = S.questions[S.idx];
        var ok = evaluate(q, S.userAnswer);
        S.answers[q.key] = { answer: S.userAnswer, isCorrect: ok };
        S.checked = true;

        highlight(q, ok);
        showExplanation(q, ok);

        var last = S.idx === S.questions.length - 1;
        $('nextBtnText').textContent = last ? 'إنهاء الاختبار' : 'السؤال التالي';
        $('nextBtn').disabled = false;
        updateProgress();
    }

    function highlight(q, ok) {
        var qc = $('quizContent');
        if (q.type === 'multiple-choice' || q.type === 'scenario') {
            qc.querySelectorAll('.option').forEach(function (opt, i) {
                if (i === q.correctAnswer) opt.classList.add('correct');
                else if (opt.classList.contains('selected') && !ok) opt.classList.add('wrong');
            });
        } else if (q.type === 'true-false') {
            var t = qc.querySelector('.true-btn'), f = qc.querySelector('.false-btn');
            var truth = (q.correctAnswer === true || q.correctAnswer === 'true');
            if (truth) { t.classList.add('correct'); if (!ok) f.classList.add('wrong'); }
            else { f.classList.add('correct'); if (!ok) t.classList.add('wrong'); }
        } else {
            var input = $(q.type === 'fill-blank' ? 'blankAnswer' : 'terminalOutput');
            if (!input) return;
            input.readOnly = true;
            if (ok) input.classList.add('correct');
            else {
                input.classList.add('wrong');
                var box = document.createElement('div');
                box.className = 'correct-answer-display';
                box.innerHTML = '<div class="text-green-400 font-bold" style="margin-bottom:4px">الإجابة الصحيحة:</div>' +
                    '<div class="text-gray-300">' + esc(q.correctAnswer) + '</div>';
                input.parentNode.appendChild(box);
            }
        }
    }

    function showExplanation(q, ok) {
        var html = '<div class="result-message ' + (ok ? 'result-correct' : 'result-wrong') + '">' +
            '<i class="fas fa-' + (ok ? 'check-circle' : 'times-circle') + '"></i> ' +
            (ok ? 'إجابة صحيحة!' : 'إجابة غير صحيحة') + '</div>';
        if (q.explanation) {
            html += '<div class="explanation-title"><i class="fas fa-lightbulb"></i> الشرح</div>' +
                '<div class="text-gray-300 mt-2">' + esc(q.explanation) + '</div>';
        }
        var area = $('explanationArea');
        area.innerHTML = html;
        area.style.display = 'block';
    }

    /* ------------------------------------------------------------------
       المؤقت
    ------------------------------------------------------------------ */
    function startTimer() {
        stopTimer();
        tick();
        S.timer = setInterval(tick, 250);
    }

    function stopTimer() {
        if (S.timer) { clearInterval(S.timer); S.timer = null; }
    }

    function tick() {
        if (S.finished) return;
        var rem = Math.max(0, Math.ceil((S.endAt - Date.now()) / 1000));
        var txt = $('timerText'), chip = $('timerChip');
        if (txt) txt.textContent = fmtTime(rem);
        if (chip) chip.classList.toggle('warn', rem <= Math.min(60, S.minutes * 15));
        if (rem <= 0) finish('timeout');
    }

    /* ------------------------------------------------------------------
       إنهاء الاختبار والنتيجة
    ------------------------------------------------------------------ */
    function answerText(q, ua, isCorrectAnswer) {
        if (ua === null || ua === undefined || ua === '') return null;
        if (q.type === 'multiple-choice' || q.type === 'scenario') {
            var i = isCorrectAnswer ? q.correctAnswer : ua;
            return (q.options && q.options[i] !== undefined) ? String.fromCharCode(65 + i) + ') ' + q.options[i] : String(ua);
        }
        if (q.type === 'true-false') {
            var v = isCorrectAnswer ? (q.correctAnswer === true || q.correctAnswer === 'true') : ua;
            return v ? 'صواب' : 'خطأ';
        }
        return String(isCorrectAnswer ? q.correctAnswer : ua);
    }

    function finish(reason) {
        if (S.finished) return;
        S.finished = true;
        stopTimer();
        window.onbeforeunload = null;

        var total = S.questions.length, correct = 0, wrong = 0;
        S.questions.forEach(function (q) {
            var a = S.answers[q.key];
            if (!a) return;
            if (a.isCorrect) correct++; else wrong++;
        });
        var percent = total ? Math.round(correct / total * 100) : 0;
        var spent = Math.min(Math.round((Date.now() - S.startAt) / 1000), S.minutes * 60);

        S.result = {
            reason: reason, total: total, correct: correct, wrong: wrong,
            skipped: total - correct - wrong, percent: percent,
            passed: percent >= PASS_PERCENT, spent: spent
        };
        renderResult();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderResult() {
        var r = S.result;
        var timeout = r.reason === 'timeout';

        var review = S.questions.map(function (q, i) {
            var a = S.answers[q.key];
            var cls = !a ? 'skip' : (a.isCorrect ? 'ok' : 'bad');
            var label = !a ? 'لم تتم الإجابة' : (a.isCorrect ? 'صحيحة' : 'خاطئة');
            var userTxt = a ? answerText(q, a.answer, false) : null;
            return '<div class="review-item ' + cls + '">' +
                '<div class="review-head"><span>السؤال ' + (i + 1) + ' <span style="font-weight:500;color:var(--sf-text-tertiary)">· ' + (TYPE_LABELS[q.type] || '') + '</span></span>' +
                '<span class="badge ' + cls + '">' + label + '</span></div>' +
                (q.scenario ? '<div class="review-scn">' + esc(q.scenario) + '</div>' : '') +
                '<div class="review-q">' + esc(q.question) + '</div>' +
                '<div class="review-line"><b>إجابتك:</b> <span class="' + (cls === 'ok' ? 'good' : (cls === 'bad' ? 'badc' : '')) + '">' +
                (userTxt ? esc(userTxt) : '— لم تُجب —') + '</span></div>' +
                (cls !== 'ok' ? '<div class="review-line"><b>الإجابة الصحيحة:</b> <span class="good">' + esc(answerText(q, q.correctAnswer, true)) + '</span></div>' : '') +
                (q.explanation ? '<div class="review-exp"><i class="fas fa-lightbulb" style="color:var(--oxford-gold-dark)"></i> ' + esc(q.explanation) + '</div>' : '') +
                '</div>';
        }).join('');

        var passBlock = r.passed
            ? '<div class="cert-card"><h3><i class="fas fa-certificate"></i> أنت مؤهل للحصول على الشهادة</h3>' +
              '<p>حققت ' + r.percent + '% وهي أعلى من حد النجاح (' + PASS_PERCENT + '%).</p>' +
              '<button class="btn-success" id="certBtn"><i class="fas fa-award"></i> احصل على شهادتك</button>' +
              '<div class="field-error" id="certError"></div></div>'
            : '<div class="retry-card"><p>نسبتك ' + r.percent + '% — تحتاج إلى ' + PASS_PERCENT + '% للحصول على الشهادة. راجع إجاباتك أدناه وأعد المحاولة.</p></div>';

        app.innerHTML =
            '<div class="ios-card" style="padding:12px 22px 22px">' +
            (timeout ? '<div class="timeup-banner" style="margin-top:16px"><i class="fas fa-hourglass-end"></i> انتهى الوقت! تم تسليم الاختبار تلقائياً.</div>' : '') +
            '<div class="result-hero">' +
            '<i class="fas ' + (r.passed ? 'fa-trophy' : 'fa-book-reader') + ' big" style="color:' + (r.passed ? 'var(--oxford-gold)' : 'var(--oxford-blue)') + '"></i>' +
            '<h2>' + (r.passed ? 'أحسنت! لقد نجحت 🎉' : 'واصل المحاولة 💪') + '</h2>' +
            '<p>' + esc(cfg.name) + ' — ' + esc(subjectLabel()) + '</p></div>' +
            '<div class="stat-grid">' +
            '<div class="stat-box ' + (r.passed ? 'pass' : 'fail') + '"><div class="v">' + r.percent + '%</div><div class="l">النسبة المئوية</div></div>' +
            '<div class="stat-box"><div class="v" style="direction:ltr">' + r.correct + ' / ' + r.total + '</div><div class="l">الإجابات الصحيحة</div></div>' +
            '<div class="stat-box"><div class="v" style="direction:ltr">' + fmtTime(r.spent) + '</div><div class="l">الوقت المستغرق من ' + S.minutes + ' دقيقة</div></div>' +
            '</div>' +
            '<div class="progress-container" style="margin-bottom:22px"><div class="progress-bar ' + (r.passed ? 'bg-green-500' : 'bg-yellow-500') + '" style="width:' + r.percent + '%"></div></div>' +
            passBlock +
            '<div class="result-actions">' +
            '<button class="btn-primary" id="againBtn"><i class="fas fa-redo"></i> اختبار جديد</button>' +
            '<a class="btn-secondary on-light" href="index.html" style="text-decoration:none"><i class="fas fa-home"></i> العودة للاختبارات</a>' +
            '</div></div>' +
            '<div style="height:20px"></div>' +
            '<div class="ios-card" style="padding:22px">' +
            '<h3 class="review-title"><i class="fas fa-list-check"></i> مراجعة الإجابات</h3>' + review + '</div>';

        $('againBtn').addEventListener('click', function () {
            S.finished = false;
            renderSetup();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        var cb = $('certBtn');
        if (cb) cb.addEventListener('click', goCertificate);
    }

    /* ------------------------------------------------------------------
       الشهادة (نفس صفحة الدورة certificate.html)
    ------------------------------------------------------------------ */
    function subjectLabel() {
        var groups = {}, subjects = {};
        S.questions.forEach(function (q) {
            var c = S.courses.filter(function (x) { return String(x.id) === String(q.courseId); })[0];
            if (!c) return;
            groups[(c.subject || 'عام') + ' - ' + (c.grade || '')] = 1;
            subjects[c.subject || 'عام'] = 1;
        });
        var g = Object.keys(groups), s = Object.keys(subjects);
        if (g.length === 1) return g[0].replace(/ - $/, '');
        if (s.length === 1) return s[0];
        return 'مواد متعددة';
    }

    function withTimeout(promise, ms) {
        return Promise.race([promise, new Promise(function (res) { setTimeout(function () { res(null); }, ms); })]);
    }

    function goCertificate() {
        var btn = $('certBtn'), err = $('certError');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تجهيز الشهادة...';
        err.textContent = '';

        var locPromise = Promise.resolve(null);
        try {
            if (window.LOCATION_SERVICE) locPromise = withTimeout(window.LOCATION_SERVICE.getUserLocation(), 2500).catch(function () { return null; });
        } catch (e) { }

        locPromise.then(function (loc) {
            loc = loc || {};
            var r = S.result;
            var id = 'HOOK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            var data = {
                certificateId: id,
                courseId: 'exam-' + levelKey,
                courseTitle: 'الاختبار الشهري (' + cfg.name + ') - ' + subjectLabel(),
                score: r.percent,
                correctAnswers: r.correct,
                totalQuestions: r.total,
                issueDate: new Date().toISOString().split('T')[0],
                country: loc.country || 'Unknown',
                region: loc.region || '',
                city: loc.city || '',
                studentName: '',
                email: '',
                phone: '',
                studentId: '',
                hoursCompleted: S.minutes + ' دقيقة',
                certificateType: 'Monthly Exam',
                examLevel: levelKey,
                examMinutes: S.minutes,
                language: 'ar',
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                ip: loc.ip || '',
                timezone: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '',
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                screenResolution: window.screen.width + 'x' + window.screen.height
            };
            try {
                localStorage.setItem('pendingCertificate', JSON.stringify(data));
            } catch (e) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-award"></i> احصل على شهادتك';
                err.textContent = 'تعذر حفظ بيانات الشهادة، تأكد من تفعيل التخزين في المتصفح (وليس وضع التصفح الخفي).';
                return;
            }
            window.location.href = COURSE_DIR + 'certificate.html?id=' + encodeURIComponent(id);
        });
    }

    /* ------------------------------------------------------------------
       التشغيل
    ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        var y = $('year');
        if (y) y.textContent = new Date().getFullYear();

        showLoading('جاري تحميل أسئلة الكورسات...');
        loadData().then(renderSetup).catch(function (e) {
            console.error(e);
            showError(e.message || 'حدث خطأ غير متوقع');
        });
    });

    // للفحص من وحدة التحكم
    window.MonthlyExam = { state: S, levels: LEVELS };
})();
