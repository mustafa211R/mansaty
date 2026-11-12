/* =====================================================================
   app.js — الإعدادات، مخطّط الجلسة، حلقة الجولات، النتائج، الشهادة
   ===================================================================== */
(function () {
    'use strict';
    var BD = window.BrainData, BM = window.BrainModes, IQ = window.BrainIQ;
    var U = BM.util, h = U.h, clamp = U.clamp, esc = BD.esc, shuffle = BD.shuffle;
    var COURSE_DIR = '../course/';
    var root = document.getElementById('brainApp');
    function $(id) { return document.getElementById(id); }
    function fast() { return window.__brainFast ? 0.03 : 1; }
    function sget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
    function sset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

    var PREC = {
        quick: { n: 12, name: 'سريع', min: '7', note: 'نظرة أولية (هامش خطأ أكبر)' },
        std: { n: 24, name: 'قياسي', min: '14', note: 'توازن جيد بين الوقت والدقة' },
        deep: { n: 40, name: 'دقيق', min: '23', note: 'هامش خطأ صغير' },
        full: { n: 56, name: 'شامل', min: '32', note: 'جميع الأنماط الـ56 — أعلى دقة' }
    };
    var STRICT = { relaxed: { k: 1.4, name: 'مريح' }, normal: { k: 1, name: 'عادي' }, strict: { k: 0.7, name: 'صارم' } };
    var S = { prec: 'std', strict: 'normal', adaptive: true, courses: null, session: null, token: 0 };

    function courseById(id) { return BD.courses.filter(function (c) { return String(c.id) === String(id); })[0]; }
    function courseName(id) { var c = courseById(id); return c ? (c.subject || '') + ' — ' + BD.courseLabel(c) : 'كورس ' + id; }

    /* ------------------------------ التحميل ------------------------------ */
    function showLoading() { root.innerHTML = '<div class="card center"><div class="spin"></div><p>جاري تحميل أسئلة الكورسات…</p></div>'; }
    function showError(msg) {
        root.innerHTML = '<div class="card center"><h3>تعذّر التحميل</h3><p class="muted">' + esc(msg) + '</p><p class="muted small">تأكد أن مجلد <b>course</b> موجود بجانب مجلد <b>brain</b> وأن الموقع يعمل على خادم أو استضافة.</p></div>';
    }

    /* ------------------------------ الإعدادات ------------------------------ */
    function modeCounts() {
        var c = {}; BM.list.forEach(function (m) { c[m.ab] = (c[m.ab] || 0) + 1; }); return c;
    }
    function showSetup() {
        S.token++;
        var cnt = modeCounts(), hist = sget('brain_history') || [];
        var groups = BD.groups();
        if (!S.courses) S.courses = BD.courses.map(function (c) { return String(c.id); });
        var html = '<div class="card"><div class="pill">اختبار ذكاء معرفي تقديري</div><h2>ألعاب العقل</h2>' +
            '<p class="muted">' + BM.list.length + ' نمطاً مختلفاً لعرض الأسئلة والإجابات، تقيس 7 قدرات عقلية وتُنتج مؤشر ذكاء تقديرياً وتحليلاً لشخصيتك المعرفية، وتأتي كل الأسئلة من أسئلة الكورسات.</p>' +
            '<div class="abrow">' + IQ.ORDER.map(function (k) { return '<span class="abchip">' + IQ.AB[k].ico + ' ' + IQ.AB[k].name + ' <b>' + (cnt[k] || 0) + '</b></span>'; }).join('') + '</div></div>';

        html += '<div class="card"><h3>١) دقّة القياس</h3><div class="grid4" id="precGrid">' +
            Object.keys(PREC).map(function (k) {
                var p = PREC[k], m = Math.round(34 / Math.sqrt(p.n));
                return '<label class="choice ' + (S.prec === k ? 'on' : '') + '"><input type="radio" name="prec" value="' + k + '" ' + (S.prec === k ? 'checked' : '') + '>' +
                    '<b>' + p.name + '</b><span>' + p.n + ' جولة</span><span>≈ ' + p.min + ' دقيقة</span><em>هامش الخطأ ±' + m + '</em><small>' + p.note + '</small></label>';
            }).join('') + '</div></div>';

        html += '<div class="card"><h3>٢) صرامة الوقت</h3><div class="grid3" id="strictGrid">' +
            Object.keys(STRICT).map(function (k) {
                return '<label class="choice ' + (S.strict === k ? 'on' : '') + '"><input type="radio" name="strict" value="' + k + '" ' + (S.strict === k ? 'checked' : '') + '><b>' + STRICT[k].name + '</b><span>×' + STRICT[k].k + ' من الوقت الأساسي</span></label>';
            }).join('') + '</div>' +
            '<label class="switch"><input type="checkbox" id="adaptive" ' + (S.adaptive ? 'checked' : '') + '><span>اختبار تكيّفي: ترتفع صعوبة الأسئلة وتضيق مهلتها كلما أجبت أفضل</span></label></div>';

        html += '<div class="card"><h3>٣) مصدر الأسئلة</h3><div class="row"><button type="button" class="mini" id="selAll">تحديد الكل</button><button type="button" class="mini" id="selNone">إلغاء الكل</button><span class="muted small" id="selInfo"></span></div><div id="courseBox">' +
            groups.map(function (g) {
                return '<div class="cgroup"><div class="cg-t">' + esc(g.title) + '</div>' + g.courses.map(function (c) {
                    var n = (BD.byCourse[c.id] || []).length;
                    return '<label class="ck"><input type="checkbox" class="cc" value="' + esc(c.id) + '" ' + (S.courses.indexOf(String(c.id)) >= 0 ? 'checked' : '') + '><span>' + esc(BD.courseLabel(c)) + ' <small>(' + n + ' سؤالاً)</small></span></label>';
                }).join('') + '</div>';
            }).join('') + '</div></div>';

        html += '<div class="card center"><p class="note-honest">ℹ️ هذا مقياس تقديري لأدائك في أسئلة المنهج وسرعتك وتركيزك وتقديرك لذاتك، وليس اختباراً سريرياً معتمداً لقياس الذكاء. أجب بتركيز وبدون مساعدة لتحصل على نتيجة موثوقة.</p>' +
            '<button type="button" class="btn gold big" id="startBtn">🚀 ابدأ الاختبار</button><div class="err" id="setupErr"></div></div>';

        if (hist.length) {
            html += '<div class="card"><h3>سجلّ محاولاتك</h3><div class="hist">' + hist.slice(-6).reverse().map(function (x) {
                return '<div class="hrow"><b>' + x.iq + '</b><span>' + esc(x.date) + '</span><span class="muted">' + x.rounds + ' جولة</span></div>';
            }).join('') + '</div></div>';
        }
        root.innerHTML = html;

        function syncInfo() {
            var n = BD.items.filter(function (i) { return S.courses.indexOf(String(i.courseId)) >= 0; }).length;
            $('selInfo').textContent = 'عدد الأسئلة المتاحة: ' + n;
        }
        syncInfo();
        root.querySelectorAll('input[name=prec]').forEach(function (r) { r.onchange = function () { S.prec = r.value; root.querySelectorAll('#precGrid .choice').forEach(function (l) { l.classList.toggle('on', l.querySelector('input').checked); }); }; });
        root.querySelectorAll('input[name=strict]').forEach(function (r) { r.onchange = function () { S.strict = r.value; root.querySelectorAll('#strictGrid .choice').forEach(function (l) { l.classList.toggle('on', l.querySelector('input').checked); }); }; });
        $('adaptive').onchange = function () { S.adaptive = this.checked; };
        function readCourses() { S.courses = Array.prototype.map.call(root.querySelectorAll('.cc:checked'), function (c) { return c.value; }); syncInfo(); }
        root.querySelectorAll('.cc').forEach(function (c) { c.onchange = readCourses; });
        $('selAll').onclick = function () { root.querySelectorAll('.cc').forEach(function (c) { c.checked = true; }); readCourses(); };
        $('selNone').onclick = function () { root.querySelectorAll('.cc').forEach(function (c) { c.checked = false; }); readCourses(); };
        $('startBtn').onclick = function () {
            readCourses();
            var pool = BD.items.filter(function (i) { return S.courses.indexOf(String(i.courseId)) >= 0; });
            if (pool.length < 30) { $('setupErr').textContent = 'اختر كورسات تحتوي مجتمعةً على 30 سؤالاً على الأقل (المتاح الآن ' + pool.length + ').'; return; }
            startSession(pool);
        };
    }

    /* ------------------------------ مخطّط الجلسة ------------------------------ */
    function planModes(n) {
        var byAb = {};
        BM.list.forEach(function (m) { (byAb[m.ab] = byAb[m.ab] || []).push(m); });
        Object.keys(byAb).forEach(function (k) { byAb[k] = shuffle(byAb[k]); });
        var abs = shuffle(IQ.ORDER.slice()), plan = [], guard = 0;
        while (plan.length < n && guard++ < 500) {
            for (var i = 0; i < abs.length && plan.length < n; i++) {
                var m = byAb[abs[i]].shift();
                if (m) plan.push(m);
            }
        }
        return shuffle(plan);
    }

    function pickItems(mode, pool, used, theta) {
        var need = mode.items || 1, acc = BD.accepts[mode.accept] || BD.accepts.any;
        var el = pool.filter(acc);
        if (el.length < need) el = pool.filter(BD.accepts.any);
        if (el.length < need) return null;
        var fresh = el.filter(function (i) { return !used[i.key + '|' + i.courseId]; });
        if (fresh.length < need) { fresh = el; }
        var ranked = fresh.map(function (i) { return { i: i, k: Math.abs(i.d - theta) + Math.random() * 1.3 }; })
            .sort(function (a, b) { return a.k - b.k; }).map(function (x) { return x.i; });
        return ranked.slice(0, need);
    }

    /* ------------------------------ الجلسة ------------------------------ */
    function startSession(pool) {
        var n = PREC[S.prec].n, token = ++S.token;
        var sess = S.session = { pool: pool, plan: planModes(n), results: [], theta: 2.5, used: {}, k: 0, token: token };
        root.innerHTML = '<div class="runhead"><div class="rh-top"><button type="button" class="mini" id="quit">✕ إنهاء</button><div class="rh-t" id="rhT"></div><div class="rh-n" id="rhN"></div></div>' +
            '<div class="prog"><i id="progI"></i></div></div><div id="stage" class="stage card"></div>';
        $('quit').onclick = function () {
            if (sess.results.length >= 12 && confirm('تريد إنهاء الاختبار وعرض النتيجة بما أنجزته؟')) { abort(); finish(sess); }
            else if (sess.results.length < 12 && confirm('سيتم إلغاء الاختبار (أنجزت أقل من 12 جولة). متأكد؟')) { abort(); showSetup(); }
        };
        nextRound(sess);
    }
    function abort() {
        S.token++;
        var c = window.__ctx;
        if (c && !c.finished) { c.finished = true; clearTimeout(c._tc); (c._timers || []).forEach(clearTimeout); if (c._raf) cancelAnimationFrame(c._raf); }
    }

    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function waitSkippable(el, ms, token) {
        return new Promise(function (res) {
            var t = setTimeout(done, ms);
            function done() { clearTimeout(t); el.removeEventListener('click', done); res(); }
            el.addEventListener('click', done);
        });
    }

    function nextRound(sess) {
        if (sess.token !== S.token) return;
        var total = sess.plan.length;
        if (sess.k >= total) return finish(sess);
        var mode = sess.plan[sess.k], items = pickItems(mode, sess.pool, sess.used, sess.theta);
        if (!items) { sess.plan.splice(sess.k, 1); return nextRound(sess); }
        items.forEach(function (i) { sess.used[i.key + '|' + i.courseId] = 1; });
        var ab = IQ.AB[mode.ab], stage = $('stage');
        $('rhT').innerHTML = ab.ico + ' ' + ab.name;
        $('rhN').textContent = (sess.k + 1) + ' / ' + total;
        $('progI').style.width = (100 * sess.k / total) + '%';

        stage.innerHTML = '<div class="intro-card"><div class="big-ico">' + ab.ico + '</div><h3>' + esc(mode.name) + '</h3><p>' + esc(mode.desc) + '</p><small class="muted">اضغط للبدء مباشرة</small></div>';
        waitSkippable(stage.firstChild, 1800 * fast(), sess.token).then(function () {
            if (sess.token !== S.token) return;
            var env = {
                stage: stage, theta: S.adaptive ? sess.theta : 2.5, timeScale: STRICT[S.strict].k, pool: sess.pool,
                onCtx: function (c) { window.__ctx = c; }
            };
            return BM.play(mode, items, env).then(function (res) {
                if (sess.token !== S.token) return;
                res._s = IQ.roundScore(res);
                sess.results.push(res);
                if (S.adaptive) {
                    if (res._s >= 0.7) sess.theta = clamp(sess.theta + 0.35, 1, 5);
                    else if (res._s <= 0.3) sess.theta = clamp(sess.theta - 0.35, 1, 5);
                }
                return sleep(600 * fast()).then(function () { return feedback(mode, items, res, stage, sess); });
            }).then(function () { if (sess.token !== S.token) return; sess.k++; nextRound(sess); });
        });
    }

    function feedback(mode, items, res, stage, sess) {
        var ok = res.acc >= 0.99, part = !ok && res.acc > 0.2, it = items[0];
        var cls = ok ? 'ok' : (part ? 'part' : 'bad');
        var head = res.timedOut ? '⏰ انتهى الوقت' : (ok ? '✅ أحسنت!' : (part ? '🟡 إجابة جزئية' : '❌ إجابة خاطئة'));
        var body;
        if (items.length > 1) body = '<p>نتيجتك في هذه الجولة: <b>' + Math.round(res.acc * 100) + '%</b></p>';
        else body = '<p class="ans">الإجابة الصحيحة: <b>' + esc(res.answerText || it.correct) + '</b></p>' + (it.explanation ? '<p class="exp">💡 ' + esc(it.explanation) + '</p>' : '');
        stage.innerHTML = '<div class="fb-card ' + cls + '"><h3>' + head + '</h3>' + body + '<div class="fb-meta">درجة الجولة: ' + Math.round(res._s * 100) + '% · الزمن ' + (res.rt / 1000).toFixed(1) + 'ث</div><small class="muted">اضغط للمتابعة</small></div>';
        return waitSkippable(stage.firstChild, (ok ? 2600 : 4000) * fast(), sess.token);
    }

    /* ------------------------------ النتائج ------------------------------ */
    function finish(sess) {
        S.token++;
        var r = IQ.analyze(sess.results);
        sess.analysis = r;
        var date = new Date().toISOString().split('T')[0];
        var hist = sget('brain_history') || [], prev = hist.length ? hist[hist.length - 1] : null;
        if (r.valid) { hist.push({ date: date, iq: r.iq, rounds: r.rounds, abilities: r.abilities }); sset('brain_history', hist.slice(-30)); }
        render(sess, r, prev);
    }

    function bar(label, v, cls) {
        return '<div class="bar"><span>' + label + '</span><div class="bt"><i class="' + (cls || '') + '" style="width:' + (v || 0) + '%"></i></div><b>' + (v === null || v === undefined ? '—' : v) + '</b></div>';
    }
    function lvl(v) { return v >= 75 ? 'hi' : (v >= 50 ? 'md' : 'lo'); }

    function render(sess, r, prev) {
        var h2 = '';
        if (!r.valid) {
            h2 += '<div class="card center"><h2>لا يمكن إصدار مؤشر موثوق</h2><ul class="reasons">' + r.reasons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
                '<p class="muted">لن تصدر شهادة ذكاء لهذه المحاولة. أعد الاختبار بتركيز وبعدد جولات أكبر.</p><button class="btn gold" id="again">🔁 محاولة جديدة</button></div>';
            root.innerHTML = h2; $('again').onclick = showSetup; return;
        }
        var diff = prev ? r.iq - prev.iq : null;
        h2 += '<div class="card result-hero"><div class="iqring ' + r.band.key + '"><small>مؤشر الذكاء التقديري</small><div class="iqnum" id="iqNum">' + r.iq + '</div><span dir="ltr" style="unicode-bidi:isolate">± ' + r.margin + '</span></div>' +
            '<h2>' + esc(r.band.name) + '</h2><p class="muted">' + esc(r.band.desc) + '</p>' +
            '<div class="facts"><div><b>' + r.percentile + '%</b><small>ترتيب تقديري بين الأفراد</small></div><div><b>' + r.accuracy + '%</b><small>الإجابات الصحيحة تماماً</small></div><div><b>' + r.avgRt + 'ث</b><small>متوسط زمن الإجابة</small></div><div><b>' + r.rounds + '</b><small>جولة</small></div></div>' +
            (diff !== null ? '<div class="cmp ' + (diff >= 0 ? 'up' : 'dn') + '">' + (diff >= 0 ? '▲' : '▼') + ' ' + Math.abs(diff) + ' نقطة مقارنةً بمحاولتك السابقة (' + prev.iq + ')</div>' : '') + '</div>';

        var prof = r.profile;
        h2 += '<div class="card"><h3>🔎 اكتشاف شخصيتك المعرفية</h3><div class="profile"><div class="pf-ico">' + IQ.AB[r.top].ico + '</div><div><h4>' + esc(prof.name) + '</h4><p>' + esc(prof.desc) + '</p></div></div>' +
            '<div class="tags"><span class="tag">أسلوب الأداء: ' + esc(r.style) + '</span><span class="tag">أقوى قدرة: ' + IQ.AB[r.top].name + '</span><span class="tag">أضعف قدرة: ' + IQ.AB[r.low].name + '</span>' +
            (r.calib ? '<span class="tag">المعايرة: ' + r.calib.label + '</span>' : '') + '</div></div>';

        h2 += '<div class="card"><h3>📊 قدراتك السبع</h3><div class="two"><div class="rad">' + IQ.radarSVG(r.abilities, 300) + '</div><div>' +
            IQ.ORDER.map(function (k) { var v = r.abilities[k]; return bar(IQ.AB[k].ico + ' ' + IQ.AB[k].name, v, v === null ? '' : lvl(v)); }).join('') +
            '</div></div></div>';

        function mname(m) { var d = BM.map[m.id]; return IQ.AB[m.ab].ico + ' ' + (d ? d.name : m.id) + ' <b>' + Math.round(m.avg * 100) + '%</b>'; }
        h2 += '<div class="card"><h3>🎮 أنماط اللعب</h3><div class="two"><div><h5>الأفضل لديك</h5><ul class="ml">' + r.bestModes.map(function (m) { return '<li>' + mname(m) + '</li>'; }).join('') +
            '</ul></div><div><h5>الأصعب عليك</h5><ul class="ml">' + r.worstModes.map(function (m) { return '<li>' + mname(m) + '</li>'; }).join('') + '</ul></div></div></div>';

        if (r.courses.length) {
            h2 += '<div class="card"><h3>📚 أداؤك حسب المادة</h3>' + r.courses.slice(0, 8).map(function (c) { return bar(esc(courseName(c.id)), c.avg, lvl(c.avg)); }).join('') + '</div>';
        }
        if (r.calib) {
            h2 += '<div class="card"><h3>⚖️ هل تعرف ما تعرفه؟</h3><p>متوسط ثقتك <b>' + r.calib.conf + '%</b> مقابل دقة فعلية <b>' + r.calib.acc + '%</b> → <b>' + r.calib.label + '</b>.</p></div>';
        }
        h2 += '<div class="card"><h3>💡 توصيات لتطوير قدراتك</h3><ul class="tips">' + r.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';

        h2 += '<div class="card center cert"><h3>🏅 شهادة الذكاء</h3><p class="muted">تُرسل شهادتك إلى نفس مكان شهادات الكورسات، وتظهر في صفحة «شهاداتي».</p>' +
            '<button type="button" class="btn gold big" id="certBtn">🎓 احصل على شهادة الذكاء</button><div class="err" id="certErr"></div></div>';
        h2 += '<div class="card center"><div class="row c"><button class="btn" id="again">🔁 محاولة جديدة</button><button class="btn ghost" id="printBtn">🖨️ طباعة التقرير</button></div>' +
            '<p class="note-honest">هذا مؤشر تقديري مبني على أدائك في أسئلة المنهج وليس اختباراً سريرياً للذكاء. هامش الخطأ ±' + r.margin + ' نقطة.</p></div>';
        root.innerHTML = h2;
        $('again').onclick = showSetup;
        $('printBtn').onclick = function () { window.print(); };
        $('certBtn').onclick = function () { goCertificate(sess, r); };
        window.scrollTo(0, 0);
    }

    function withTimeout(p, ms) { return Promise.race([p, new Promise(function (res) { setTimeout(function () { res(null); }, ms); })]); }

    function goCertificate(sess, r) {
        var btn = $('certBtn'), err = $('certErr');
        btn.disabled = true; btn.textContent = 'جاري تجهيز الشهادة…'; err.textContent = '';
        var loc = Promise.resolve(null);
        try { if (window.LOCATION_SERVICE) loc = withTimeout(window.LOCATION_SERVICE.getUserLocation(), 2500).catch(function () { return null; }); } catch (e) { }
        loc.then(function (l) {
            l = l || {};
            var id = 'HOOK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            var data = {
                certificateId: id, courseId: 'brain-games',
                courseTitle: 'ألعاب العقل — اختبار الذكاء المعرفي (' + PREC[S.prec].name + ')',
                score: r.iq, correctAnswers: Math.round(r.accuracy * r.rounds / 100), totalQuestions: r.rounds,
                issueDate: new Date().toISOString().split('T')[0],
                country: l.country || 'Unknown', region: l.region || '', city: l.city || '',
                studentName: '', email: '', phone: '', studentId: '',
                hoursCompleted: PREC[S.prec].min + ' دقيقة',
                certificateType: 'IQ Certificate',
                extra: 'الملف المعرفي: ' + r.profile.name + ' — أقوى قدرة: ' + IQ.AB[r.top].name + ' — هامش الخطأ ±' + r.margin,
                language: 'ar', status: 'PENDING', createdAt: new Date().toISOString(), ip: l.ip || '',
                timezone: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '',
                userAgent: navigator.userAgent, platform: navigator.platform,
                screenResolution: window.screen.width + 'x' + window.screen.height
            };
            try { localStorage.setItem('pendingCertificate', JSON.stringify(data)); }
            catch (e) { btn.disabled = false; btn.textContent = '🎓 احصل على شهادة الذكاء'; err.textContent = 'تعذر حفظ بيانات الشهادة، تأكد من تفعيل التخزين في المتصفح (وليس وضع التصفح الخفي).'; return; }
            window.location.href = COURSE_DIR + 'certificate.html?id=' + encodeURIComponent(id);
        });
    }

    window.BrainApp = { S: S, showSetup: showSetup, startSession: startSession, planModes: planModes };

    showLoading();
    BD.load().then(showSetup).catch(function (e) { showError(e.message || String(e)); });
})();
