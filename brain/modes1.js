/* =====================================================================
   modes1.js — محرك تشغيل الجولات + أدوات مشتركة + أنماط:
   المعرفة والاستدلال (10) • الذاكرة العاملة (8) • سرعة المعالجة (7)
   ===================================================================== */
(function () {
    'use strict';
    var BD = window.BrainData, esc = BD.esc, shuffle = BD.shuffle;
    var LET = ['A', 'B', 'C', 'D', 'E', 'F'];
    var MODES = [], MODE = {};

    function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function ri(n) { return Math.floor(Math.random() * n); }

    function def(id, name, ab, t, accept, desc, extra, run) {
        var m = { id: id, name: name, ab: ab, t: t, accept: accept, desc: desc, items: 1, choices: 4, sw: 0.2, manual: false };
        for (var k in (extra || {})) m[k] = extra[k];
        m.run = run;
        MODES.push(m); MODE[id] = m;
    }

    /* ---------------- أدوات مشتركة ---------------- */
    function qBlock(it, cls) {
        return h('<div class="bq ' + (cls || '') + '">' +
            (it.scenario ? '<div class="bq-scn">' + esc(it.scenario) + '</div>' : '') +
            '<div class="bq-q">' + BD.qHtml(it) + '</div></div>');
    }
    function note(txt) { return h('<div class="note">' + txt + '</div>'); }
    function phaseBar(ms) {
        var p = h('<div class="pbar"><i></i></div>'), i = p.firstChild;
        i.style.width = '100%';
        setTimeout(function () { i.style.transition = 'width ' + ms + 'ms linear'; i.style.width = '0%'; }, 30);
        return p;
    }
    function reveal(btns, chosen) {
        btns.forEach(function (x) {
            if (x._t !== undefined) x.querySelector('.tx').textContent = x._t;
            if (x.dataset.ok === '1') x.classList.add('ok'); else if (x === chosen) x.classList.add('bad');
        });
    }
    function options(ctx, box, list, onPick, cfg) {
        cfg = cfg || {};
        var btns = [];
        list.forEach(function (o, i) {
            var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(cfg.hide ? '••••' : o.text) + '</span></button>');
            b._o = o; b._t = o.text;
            b.onclick = function () {
                if (ctx.locked || b.disabled || b.classList.contains('gone')) return;
                ctx.locked = true; b.classList.add('sel');
                if (!cfg.noReveal) reveal(btns, b);
                onPick(o, b, i);
            };
            box.appendChild(b); btns.push(b);
        });
        return btns;
    }
    function solveOk(btns) {
        return function () { var b = btns.filter(function (x) { return x.dataset.ok === '1' && !x.disabled; })[0]; b.click(); };
    }
    function plainDone(ctx) { return function (o) { ctx.done({ acc: o.ok ? 1 : 0 }); }; }
    function stdChoice(ctx, boxCls, cfg) {
        ctx.body.appendChild(qBlock(ctx.item, cfg && cfg.qcls));
        var box = h('<div class="opts ' + boxCls + '"></div>');
        ctx.body.appendChild(box);
        var bt = options(ctx, box, ctx.opts, plainDone(ctx), cfg);
        ctx.solve = solveOk(bt);
        return { box: box, btns: bt };
    }
    function fmtStatement(s) { return '<div class="stmt">' + esc(s.text) + '</div>'; }
    function typedOk(ans, correct) {
        if (window.answerProcessor) return window.answerProcessor.processFillBlank(ans, correct);
        return String(ans).trim().toLowerCase() === String(correct).trim().toLowerCase();
    }

    /* ---------------- مشغّل الجولة ---------------- */
    function play(mode, items, env) {
        return new Promise(function (resolve) {
            var ctx = {
                mode: mode, items: items, item: items[0], env: env, pool: env.pool || BD.items, stage: env.stage,
                finished: false, locked: false, t0: performance.now(), _timers: [], _raf: 0, _loops: []
            };
            ctx.limit = Math.round(mode.t * 1000 * env.timeScale * (1.2 - 0.06 * env.theta));
            ctx.body = h('<div class="rbody"></div>');
            ctx.bar = h('<div class="tbar"><i></i></div>');
            ctx.stage.innerHTML = '';
            ctx.stage.appendChild(ctx.bar);
            ctx.stage.appendChild(ctx.body);
            ctx.opts = mode.choices ? BD.choices(ctx.item, mode.choices, ctx.pool) : null;
            ctx.chance = ctx.opts ? 1 / ctx.opts.length : 0;

            ctx.startClock = function (ms) {
                ms = ms || ctx.limit; ctx.limitNow = ms;
                clearTimeout(ctx._tc);
                var i = ctx.bar.firstChild;
                i.style.transition = 'none'; i.style.width = '100%';
                ctx.bar.style.visibility = 'visible';
                void i.offsetWidth;
                i.style.transition = 'width ' + ms + 'ms linear'; i.style.width = '0%';
                ctx.t0 = performance.now();
                ctx._tc = setTimeout(function () { ctx.timeout(); }, ms);
            };
            ctx.stopClock = function () { clearTimeout(ctx._tc); ctx.bar.style.visibility = 'hidden'; };
            ctx.timeout = function () {
                if (ctx.finished) return;
                var part = ctx.partial ? ctx.partial() : 0;
                ctx.done({ acc: part, timedOut: true, rt: ctx.limitNow || ctx.limit });
            };
            ctx.after = function (ms, fn) { var t = setTimeout(function () { if (!ctx.finished) fn(); }, ms); ctx._timers.push(t); return t; };
            ctx.loop = function (fn) {
                ctx._loops.push(fn);
                if (!ctx._raf) {
                    var last = performance.now();
                    var tick = function (now) {
                        if (ctx.finished) return;
                        var dt = Math.min(0.05, (now - last) / 1000); last = now;
                        ctx._loops.slice().forEach(function (f) { f(dt, now); });
                        ctx._raf = requestAnimationFrame(tick);
                    };
                    ctx._raf = requestAnimationFrame(tick);
                }
            };
            ctx.done = function (res) {
                if (ctx.finished) return;
                ctx.finished = true;
                clearTimeout(ctx._tc);
                ctx._timers.forEach(clearTimeout);
                if (ctx._raf) cancelAnimationFrame(ctx._raf);
                res = res || {};
                var d = items.reduce(function (s, x) { return s + x.d; }, 0) / items.length;
                var out = {
                    modeId: mode.id, ab: mode.ab, sw: mode.sw, d: d,
                    keys: items.map(function (x) { return x.key; }),
                    courseIds: items.map(function (x) { return x.courseId; }),
                    limit: ctx.limitNow || ctx.limit, g: ctx.chance, answerText: ctx.answerText || null,
                    rt: performance.now() - ctx.t0, acc: 0
                };
                for (var k in res) out[k] = res[k];
                out.acc = clamp(out.acc, 0, 1);
                setTimeout(function () { resolve(out); }, 0);
            };
            env.onCtx && env.onCtx(ctx);
            if (!mode.manual) ctx.startClock();
            else ctx.bar.style.visibility = 'hidden';
            try { mode.run(ctx); } catch (e) { console.error('mode error', mode.id, e); ctx.done({ acc: 0, error: String(e) }); }
        });
    }

    /* =================================================================
       1) المعرفة والاستدلال (know) — 10 أنماط
       ================================================================= */
    def('classic', 'الكلاسيكي', 'know', 20, 'any', 'اختر الإجابة الصحيحة من القائمة.', {}, function (ctx) {
        stdChoice(ctx, 'list');
    });

    def('cards', 'البطاقات', 'know', 20, 'any', 'اختر البطاقة التي تحمل الإجابة الصحيحة.', {}, function (ctx) {
        stdChoice(ctx, 'grid2');
    });

    def('circle', 'الدائرة', 'know', 22, 'any', 'الخيارات موزعة على دائرة، اضغط الصحيح منها.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var ring = h('<div class="ring"><div class="ring-c">؟</div></div>');
        ctx.body.appendChild(ring);
        var n = ctx.opts.length;
        var bt = options(ctx, ring, ctx.opts, plainDone(ctx));
        bt.forEach(function (b, i) { b.style.setProperty('--a', (i * 360 / n) + 'deg'); });
        ctx.solve = solveOk(bt);
    });

    def('elim', 'الإقصاء', 'know', 25, 'c3', 'اضغط على الخيارات الخاطئة لإقصائها حتى يبقى خيار واحد وهو إجابتك.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var bt = [];
        ctx.opts.forEach(function (o, i) {
            var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span></button>');
            b._t = o.text;
            b.onclick = function () {
                if (ctx.locked || b.classList.contains('elim')) return;
                b.classList.add('elim');
                var left = bt.filter(function (x) { return !x.classList.contains('elim'); });
                if (left.length === 1) {
                    ctx.locked = true;
                    var w = left[0];
                    reveal(bt, w);
                    ctx.done({ acc: w.dataset.ok === '1' ? 1 : 0 });
                }
            };
            box.appendChild(b); bt.push(b);
        });
        ctx.solve = function () { bt.forEach(function (b) { if (b.dataset.ok !== '1') b.click(); }); };
    });

    def('half', 'النصف ثم الخيار', 'know', 25, 'c3', 'اختر المجموعة التي تحتوي الإجابة الصحيحة، ثم حدّد الإجابة بداخلها.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts grid2"></div>'); ctx.body.appendChild(box);
        var groups = [ctx.opts.slice(0, Math.ceil(ctx.opts.length / 2)), ctx.opts.slice(Math.ceil(ctx.opts.length / 2))];
        var gOk = null;
        var msg = note('الخطوة 1: أي مجموعة تحوي الإجابة الصحيحة؟');
        ctx.body.insertBefore(msg, box);
        var gb = groups.map(function (g, gi) {
            var b = h('<button type="button" class="opt grp" data-ok="' + (g.some(function (o) { return o.ok; }) ? 1 : 0) + '"><span class="tx">' +
                g.map(function (o) { return '• ' + esc(o.text); }).join('<br>') + '</span></button>');
            b.onclick = function () {
                if (gOk !== null) return;
                gOk = groups[gi].some(function (o) { return o.ok; });
                box.innerHTML = ''; box.className = 'opts list';
                msg.textContent = 'الخطوة 2: حدّد الإجابة الصحيحة داخل المجموعة';
                var bt2 = options(ctx, box, groups[gi], function (o) { ctx.done({ acc: (gOk && o.ok) ? 1 : 0, g: 0.25 }); });
                ctx.solve = solveOk(bt2);
            };
            box.appendChild(b); return b;
        });
        ctx.chance = 0.25;
        ctx.solve = function () { gb.filter(function (b) { return b.dataset.ok === '1'; })[0].click(); };
    });
    MODE.half.choices = 4;

    def('duel', 'المبارزة', 'know', 15, 'c3', 'خياران فقط: أحدهما الإجابة الصحيحة والآخر مضلّل.', { choices: 2 }, function (ctx) {
        stdChoice(ctx, 'grid2 big');
    });

    def('lifeline', 'خط النجدة 50:50', 'know', 25, 'c3', 'يمكنك استخدام «50:50» مرة واحدة لحذف خيارين خاطئين، لكنها تخصم نصف النقاط.', {}, function (ctx) {
        var r = stdChoice(ctx, 'list');
        var used = false;
        // نعيد ربط الاختيار ليراعي استخدام المساعدة
        r.btns.forEach(function (b) {
            b.onclick = function () {
                if (ctx.locked || b.classList.contains('gone')) return;
                ctx.locked = true; b.classList.add('sel'); reveal(r.btns, b);
                ctx.done({ acc: b._o.ok ? (used ? 0.5 : 1) : 0 });
            };
        });
        var lb = h('<button type="button" class="btn ghost lifeline">🛟 50:50 (يخصم نصف النقاط)</button>');
        lb.onclick = function () {
            if (used || ctx.locked) return; used = true; lb.disabled = true;
            shuffle(r.btns.filter(function (b) { return b.dataset.ok !== '1'; })).slice(0, 2).forEach(function (b) { b.classList.add('gone'); });
        };
        ctx.body.appendChild(lb);
    });

    def('reverse', 'المعكوس', 'know', 22, 'rev', 'ظهرت لك الإجابة! اختر السؤال الذي تجيب عنه.', { choices: 0 }, function (ctx) {
        var it = ctx.item;
        var others = ctx.pool.filter(function (x) { return x.key !== it.key && BD.accepts.rev(x) && BD.norm(x.q) !== BD.norm(it.q); });
        var same = others.filter(function (x) { return x.courseId === it.courseId; });
        var pickFrom = shuffle(same).concat(shuffle(others.filter(function (x) { return x.courseId !== it.courseId; })));
        var wrong = pickFrom.slice(0, 3);
        var opts = shuffle([{ text: it.q.replace(/_{3,}/g, '﹍﹍'), ok: true }].concat(wrong.map(function (x) { return { text: x.q.replace(/_{3,}/g, '﹍﹍'), ok: false }; })));
        ctx.opts = opts; ctx.chance = 1 / opts.length;
        ctx.body.appendChild(h('<div class="bq"><div class="bq-scn">هذه هي الإجابة</div><div class="bq-q ans">«' + esc(it.correct) + '»</div></div>'));
        ctx.body.appendChild(note('أي سؤال من التالي تكون هذه الإجابة صحيحة له؟'));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var bt = options(ctx, box, opts, plainDone(ctx));
        ctx.answerText = 'السؤال الصحيح: ' + it.q;
        ctx.solve = solveOk(bt);
    });

    def('matchLines', 'التوصيل', 'know', 50, 'pair', 'صِل كل سؤال بإجابته: اضغط السؤال ثم الإجابة المناسبة، وأكّد عند الانتهاء.', { items: 4, choices: 0 }, function (ctx) {
        var its = ctx.items, n = its.length;
        var qs = its.map(function (x, i) { return { i: i, t: BD.cut(x.q.replace(/_{3,}/g, '﹍﹍'), 80) }; });
        var as = shuffle(its.map(function (x, i) { return { i: i, t: BD.cut(x.correct, 46) }; }));
        var pair = {}, sel = null;   // pair[qIdx] = answer card index in `as`
        var wrap = h('<div class="match"><div class="mcol" id="mq"></div><div class="mcol" id="ma"></div></div>');
        var cq = wrap.children[0], ca = wrap.children[1];
        var qb = qs.map(function (q) {
            var b = h('<button type="button" class="mcard"><b class="mn">' + (q.i + 1) + '</b><span>' + esc(q.t) + '</span></button>');
            b.onclick = function () { if (ctx.locked) return; sel = q.i; paint(); };
            cq.appendChild(b); return b;
        });
        var ab = as.map(function (a, ai) {
            var b = h('<button type="button" class="mcard"><b class="mn"></b><span>' + esc(a.t) + '</span></button>');
            b.onclick = function () {
                if (ctx.locked || sel === null) return;
                Object.keys(pair).forEach(function (k) { if (pair[k] === ai) delete pair[k]; });
                pair[sel] = ai; sel = null; paint();
            };
            ca.appendChild(b); return b;
        });
        var ok = h('<button type="button" class="btn gold" disabled>تأكيد المطابقة</button>');
        function paint() {
            qb.forEach(function (b, i) { b.classList.toggle('sel', sel === i); b.classList.toggle('paired', pair[i] !== undefined); b.dataset.c = pair[i] !== undefined ? i : ''; });
            ab.forEach(function (b, ai) {
                var q = Object.keys(pair).filter(function (k) { return pair[k] === ai; })[0];
                b.classList.toggle('paired', q !== undefined); b.dataset.c = q !== undefined ? q : '';
                b.querySelector('.mn').textContent = q !== undefined ? (+q + 1) : '';
            });
            ok.disabled = Object.keys(pair).length < n;
        }
        function score() { var c = 0; Object.keys(pair).forEach(function (k) { if (as[pair[k]].i === +k) c++; }); return c / n; }
        ok.onclick = function () {
            if (ctx.locked) return; ctx.locked = true;
            Object.keys(pair).forEach(function (k) { var good = as[pair[k]].i === +k; qb[k].classList.add(good ? 'ok' : 'bad'); ab[pair[k]].classList.add(good ? 'ok' : 'bad'); });
            ctx.done({ acc: score(), g: 0.25 });
        };
        ctx.partial = function () { return score() * 0.7; };
        ctx.chance = 0.25;
        ctx.answerText = its.map(function (x, i) { return (i + 1) + ') ' + x.correct; }).join(' ، ');
        ctx.body.appendChild(wrap); ctx.body.appendChild(ok);
        ctx.solve = function () {
            qs.forEach(function (q) { qb[q.i].click(); var ai = as.findIndex(function (a) { return a.i === q.i; }); ab[ai].click(); });
            ok.click();
        };
    });

    def('liar', 'اكتشف الكاذب', 'know', 28, 'stmtN', 'أربع عبارات: ثلاث صحيحة وواحدة خاطئة. اضغط العبارة الخاطئة.', { items: 4, choices: 0 }, function (ctx) {
        var sts = ctx.items.map(function (it, i) { return BD.statement(it, i !== 0, ctx.pool); });
        var list = shuffle(sts.map(function (s, i) { return { s: s, i: i }; }));
        var box = h('<div class="opts list"></div>');
        ctx.body.appendChild(note('🕵️ أيّ العبارات التالية خاطئة؟'));
        ctx.body.appendChild(box);
        var bt = [];
        list.forEach(function (o, k) {
            var b = h('<button type="button" class="opt" data-ok="' + (!o.s.truth ? 1 : 0) + '"><span class="lt">' + LET[k] + '</span><span class="tx">' + esc(o.s.text) + '</span></button>');
            b.onclick = function () {
                if (ctx.locked) return; ctx.locked = true; b.classList.add('sel');
                bt.forEach(function (x) { if (x.dataset.ok === '1') x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
                ctx.done({ acc: o.s.truth ? 0 : 1, g: 0.25 });
            };
            box.appendChild(b); bt.push(b);
        });
        ctx.chance = 0.25;
        var fi = list.filter(function (o) { return !o.s.truth; })[0];
        ctx.answerText = 'العبارة الخاطئة: ' + fi.s.text + '  — الصحيح: «' + ctx.items[0].correct + '»';
        ctx.solve = solveOk(bt);
    });

    /* =================================================================
       2) الذاكرة العاملة (memory) — 8 أنماط
       ================================================================= */
    def('flashQ', 'فلاش السؤال', 'memory', 20, 'any', 'سيظهر السؤال لثوانٍ ثم يختفي. تذكّره ثم أجب.', { manual: true }, function (ctx) {
        var qb = qBlock(ctx.item), info = note('📖 احفظ السؤال قبل أن يختفي…'), pb = phaseBar(4000);
        ctx.body.appendChild(info); ctx.body.appendChild(pb); ctx.body.appendChild(qb);
        ctx.after(4000, function () {
            pb.remove(); info.textContent = '🙈 اختفى السؤال — اختر الإجابة الصحيحة';
            qb.innerHTML = '<div class="bq-hide">؟؟؟</div>';
            var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
            var bt = options(ctx, box, ctx.opts, plainDone(ctx));
            ctx.solve = solveOk(bt); ctx.startClock();
        });
    });

    def('flashOpt', 'فلاش الخيارات', 'memory', 22, 'c3', 'الخيارات تظهر لثوانٍ ثم تُخفى وتبقى الحروف فقط. تذكّر مكان الصحيح.', { manual: true }, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var info = note('👀 اقرأ الخيارات وتذكّر مكانها…'), pb = phaseBar(5000);
        ctx.body.insertBefore(pb, ctx.body.firstChild); ctx.body.insertBefore(info, ctx.body.firstChild);
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var bt = options(ctx, box, ctx.opts, plainDone(ctx));
        ctx.locked = true;
        ctx.after(5000, function () {
            pb.remove(); info.textContent = '🔒 اختر الحرف الذي يمثل الإجابة الصحيحة';
            bt.forEach(function (b) { b.querySelector('.tx').textContent = '••••'; });
            ctx.locked = false; ctx.solve = solveOk(bt); ctx.startClock();
        });
    });

    def('vanish', 'الاختفاء الكامل', 'memory', 24, 'c3', 'السؤال والخيارات يختفيان معاً بعد قليل — أجب من الذاكرة.', { manual: true }, function (ctx) {
        var qb = qBlock(ctx.item), info = note('👀 احفظ السؤال والخيارات…'), pb = phaseBar(6000);
        ctx.body.appendChild(info); ctx.body.appendChild(pb); ctx.body.appendChild(qb);
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var bt = options(ctx, box, ctx.opts, plainDone(ctx));
        ctx.locked = true;
        ctx.after(6000, function () {
            pb.remove(); info.textContent = '🌫️ اختفى كل شيء — اختر الحرف الصحيح';
            qb.innerHTML = '<div class="bq-hide">؟؟؟</div>';
            bt.forEach(function (b) { b.querySelector('.tx').textContent = '••••'; });
            ctx.locked = false; ctx.solve = solveOk(bt); ctx.startClock();
        });
    });

    def('studyTest', 'احفظ ثم أجب', 'memory', 20, 'any', 'ستُعرض عليك الإجابة الصحيحة لثوانٍ، احفظها ثم اخترها بين الخيارات.', { manual: true }, function (ctx) {
        var qb = qBlock(ctx.item), info = note('✅ احفظ هذه الإجابة جيداً'), pb = phaseBar(4000);
        var ans = h('<div class="answer-flash">الإجابة: «' + esc(ctx.item.correct) + '»</div>');
        ctx.body.appendChild(info); ctx.body.appendChild(pb); ctx.body.appendChild(qb); ctx.body.appendChild(ans);
        ctx.after(4000, function () {
            pb.remove(); ans.remove(); info.textContent = '🧩 اختر الإجابة التي رأيتها قبل قليل';
            var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
            var bt = options(ctx, box, ctx.opts, plainDone(ctx));
            ctx.solve = solveOk(bt); ctx.startClock();
        });
    });

    def('shell', 'الكؤوس المتحركة', 'memory', 30, 'c3', 'اقرأ الخيارات ثم تنقلب البطاقات وتتبدل أماكنها. تتبّع البطاقة التي تحمل الإجابة الصحيحة.', { manual: true }, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var info = note('👀 اقرأ الخيارات وحدّد الإجابة الصحيحة…'); ctx.body.appendChild(info);
        var arena = h('<div class="arena shell"></div>'); ctx.body.appendChild(arena);
        var n = ctx.opts.length, slots = [[1, 1], [51, 1], [1, 51], [51, 51]];
        var cards = ctx.opts.map(function (o, i) {
            var c = h('<div class="shcard"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span><span class="q">؟</span></div>');
            c._o = o; arena.appendChild(c); return c;
        });
        var slotOf = cards.map(function (_, i) { return i; });
        function place() { cards.forEach(function (c, i) { var s = slots[slotOf[i]]; c.style.left = s[0] + '%'; c.style.top = s[1] + '%'; }); }
        place();
        ctx.after(3800, function () {
            cards.forEach(function (c) { c.classList.add('down'); });
            info.textContent = '🔀 تتبّع البطاقة الصحيحة…';
            var k = 0;
            (function swap() {
                if (k++ >= 6) { go(); return; }
                var a = ri(n), b = (a + 1 + ri(n - 1)) % n;
                var ia = slotOf.indexOf(a), ib = slotOf.indexOf(b);
                slotOf[ia] = b; slotOf[ib] = a; place();
                ctx.after(620, swap);
            })();
        });
        function go() {
            info.textContent = '👆 أين البطاقة التي تحمل الإجابة الصحيحة؟';
            cards.forEach(function (c) {
                c.onclick = function () {
                    if (ctx.locked) return; ctx.locked = true;
                    cards.forEach(function (x) { x.classList.remove('down'); if (x._o.ok) x.classList.add('ok'); else if (x === c) x.classList.add('bad'); });
                    ctx.done({ acc: c._o.ok ? 1 : 0 });
                };
            });
            ctx.solve = function () { cards.filter(function (c) { return c._o.ok; })[0].click(); };
            ctx.startClock();
        }
    });

    def('flipLimit', 'نظرتان فقط', 'memory', 28, 'c3', 'الخيارات مخفية! يمكنك التجسّس على خيارين فقط (🔍) ثم اختر (✔) الإجابة.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var left = 2, cnt = h('<div class="note">🔍 المتبقي لك: <b>2</b> نظرات</div>');
        ctx.body.appendChild(cnt);
        var box = h('<div class="opts grid2"></div>'); ctx.body.appendChild(box);
        var cards = ctx.opts.map(function (o, i) {
            var c = h('<div class="fcard" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">؟؟؟</span>' +
                '<div class="facts"><button type="button" class="mini peek">🔍</button><button type="button" class="mini take">✔ اختر</button></div></div>');
            var pk = c.querySelector('.peek'), tk = c.querySelector('.take');
            pk.onclick = function () {
                if (left <= 0 || c.classList.contains('seen') || ctx.locked) return;
                left--; c.classList.add('seen'); c.querySelector('.tx').textContent = o.text;
                cnt.innerHTML = '🔍 المتبقي لك: <b>' + left + '</b> نظرات';
                if (left === 0) cards.forEach(function (x) { x.querySelector('.peek').disabled = true; });
            };
            tk.onclick = function () {
                if (ctx.locked) return; ctx.locked = true;
                cards.forEach(function (x) { x.querySelector('.tx').textContent = x._o.text; if (x._o.ok) x.classList.add('ok'); else if (x === c) x.classList.add('bad'); });
                ctx.done({ acc: o.ok ? 1 : 0 });
            };
            c._o = o; box.appendChild(c); return c;
        });
        ctx.solve = function () { cards.filter(function (c) { return c._o.ok; })[0].querySelector('.take').click(); };
    });

    def('memMatch', 'ذاكرة الأزواج', 'memory', 75, 'pair', 'اقلب بطاقتين: سؤال وإجابته. طابق جميع الأزواج بأقل عدد من المحاولات.', { items: 6, choices: 0, sw: 0.1 }, function (ctx) {
        var cards = [];
        ctx.items.forEach(function (it, i) {
            cards.push({ pid: i, k: 'q', t: BD.cut(it.q.replace(/_{3,}/g, '﹍'), 56) });
            cards.push({ pid: i, k: 'a', t: BD.cut(it.correct, 34) });
        });
        cards = shuffle(cards);
        var grid = h('<div class="mgrid"></div>'), open = [], matched = 0, moves = 0, busy = false;
        var info = h('<div class="note">المحاولات: <b>0</b> — الأزواج: <b>0</b>/' + ctx.items.length + '</div>');
        var els = cards.map(function (c, i) {
            var e = h('<button type="button" class="mc ' + c.k + '"><span class="front">?</span><span class="back">' + esc(c.t) + '</span></button>');
            e.onclick = function () {
                if (busy || ctx.locked || e.classList.contains('up') || e.classList.contains('done')) return;
                e.classList.add('up'); open.push(i);
                if (open.length === 2) {
                    moves++; busy = true;
                    var a = cards[open[0]], b = cards[open[1]];
                    if (a.pid === b.pid) {
                        els[open[0]].classList.add('done'); els[open[1]].classList.add('done'); matched++; open = []; busy = false;
                        if (matched === ctx.items.length) finish();
                    } else {
                        var o = open.slice(); open = [];
                        ctx.after(750, function () { els[o[0]].classList.remove('up'); els[o[1]].classList.remove('up'); busy = false; });
                    }
                    info.innerHTML = 'المحاولات: <b>' + moves + '</b> — الأزواج: <b>' + matched + '</b>/' + ctx.items.length;
                }
            };
            grid.appendChild(e); return e;
        });
        function factor() { return moves <= 9 ? 1 : (moves <= 14 ? 0.85 : 0.7); }
        function finish() { ctx.locked = true; ctx.done({ acc: matched / ctx.items.length * factor(), g: 0.12 }); }
        ctx.partial = function () { return matched / ctx.items.length * 0.6; };
        ctx.chance = 0.12;
        ctx.answerText = ctx.items.map(function (x) { return BD.cut(x.q, 30) + ' ← ' + x.correct; }).join(' | ');
        ctx.body.appendChild(info); ctx.body.appendChild(grid);
        ctx.solve = function () {
            ctx.items.forEach(function (it, pid) {
                var idx = cards.map(function (c, i) { return c.pid === pid ? i : -1; }).filter(function (i) { return i >= 0; });
                els[idx[0]].onclick(); els[idx[1]].onclick();
            });
        };
    });

    /* منشئ البطاقات القابلة للترتيب (كلمات أو حروف) */
    function tileBuilder(ctx, parts, cfg) {
        cfg = cfg || {};
        var order = parts.map(function (t, i) { return { t: t, i: i }; });
        var bank = shuffle(order), built = [];
        if (bank.length > 1 && bank.every(function (x, k) { return x.i === k; })) bank.reverse();
        var wrap = h('<div class="tiles"><div class="tline"></div><div class="tbank"></div></div>');
        var line = wrap.children[0], bk = wrap.children[1];
        var okb = h('<button type="button" class="btn gold" disabled>تحقق</button>');
        function paint() {
            line.innerHTML = ''; bk.innerHTML = '';
            built.forEach(function (x, k) {
                var b = h('<button type="button" class="tile on">' + esc(x.t) + '</button>');
                b.onclick = function () { if (ctx.locked) return; bank.push(built.splice(k, 1)[0]); paint(); };
                line.appendChild(b);
            });
            if (!built.length) line.appendChild(h('<span class="tph">' + (cfg.placeholder || 'اضغط البطاقات بالترتيب الصحيح') + '</span>'));
            bank.forEach(function (x) {
                var b = h('<button type="button" class="tile">' + esc(x.t) + '</button>');
                b.onclick = function () { if (ctx.locked) return; built.push(bank.splice(bank.indexOf(x), 1)[0]); paint(); if (cfg.auto && !bank.length) okb.click(); };
                bk.appendChild(b);
            });
            okb.disabled = bank.length > 0;
        }
        okb.onclick = function () {
            if (ctx.locked || bank.length) return; ctx.locked = true;
            var good = cfg.check ? cfg.check(built.map(function (x) { return x.t; })) : built.every(function (x, k) { return x.i === k; });
            var pos = built.filter(function (x, k) { return x.i === k; }).length / built.length;
            line.classList.add(good ? 'ok' : 'bad');
            cfg.onDone(good, pos);
        };
        paint();
        wrap.appendChild(okb);
        wrap.solve = function () {
            order.forEach(function (x) { var b = Array.prototype.filter.call(bk.children, function (el) { return el.textContent === x.t; })[0]; if (b) b.click(); });
            okb.click();
        };
        return wrap;
    }
    window.__tileBuilder = tileBuilder;

    def('echo', 'صدى الإجابة', 'memory', 40, 'words', 'تُعرض الإجابة الصحيحة لثوانٍ ثم تتبعثر كلماتها. أعد ترتيبها من الذاكرة.', { manual: true, choices: 0 }, function (ctx) {
        var it = ctx.item, w = it.correct.trim().split(/\s+/);
        ctx.body.appendChild(qBlock(it));
        var info = note('✅ احفظ هذه الإجابة بترتيب كلماتها'), pb = phaseBar(5000);
        var ans = h('<div class="answer-flash">«' + esc(it.correct) + '»</div>');
        ctx.body.appendChild(info); ctx.body.appendChild(pb); ctx.body.appendChild(ans);
        ctx.after(5000, function () {
            pb.remove(); ans.remove(); info.textContent = '🧩 أعد ترتيب كلمات الإجابة من ذاكرتك';
            var tb = tileBuilder(ctx, w, { onDone: function (good, pos) { ctx.done({ acc: good ? 1 : pos * 0.5, g: 0 }); } });
            ctx.body.appendChild(tb); ctx.solve = tb.solve; ctx.startClock();
        });
    });

    /* =================================================================
       3) سرعة المعالجة (speed) — 7 أنماط
       ================================================================= */
    def('speed8', 'سباق الثماني ثوانٍ', 'speed', 8, 'any', 'أجب بأسرع ما يمكن — لديك 8 ثوانٍ فقط!', { sw: 0.5 }, function (ctx) {
        stdChoice(ctx, 'list');
    });

    def('lightning', 'البرق', 'speed', 5, 'c3', 'ثلاثة خيارات و5 ثوانٍ! لا وقت للتردد.', { sw: 0.5, choices: 3 }, function (ctx) {
        stdChoice(ctx, 'list');
    });

    def('tfFast', 'صح أم خطأ؟ سريعاً', 'speed', 7, 'stmt', 'اقرأ العبارة وحدّد: صحيحة أم خاطئة؟ بسرعة!', { sw: 0.5, choices: 0 }, function (ctx) {
        var s = BD.statement(ctx.item, undefined, ctx.pool); ctx.chance = 0.5;
        ctx.answerText = (s.truth ? 'العبارة صحيحة' : 'العبارة خاطئة') + (s.truth ? '' : ' — الصحيح: «' + ctx.item.correct + '»');
        ctx.body.appendChild(h(fmtStatement(s)));
        var row = h('<div class="opts grid2 tfrow"><button type="button" class="opt big" data-v="1"><span class="tx">✔ صحيحة</span></button><button type="button" class="opt big" data-v="0"><span class="tx">✘ خاطئة</span></button></div>');
        ctx.body.appendChild(row);
        var bs = Array.prototype.slice.call(row.children);
        bs.forEach(function (b) {
            b.onclick = function () {
                if (ctx.locked) return; ctx.locked = true;
                var v = b.dataset.v === '1', good = v === s.truth;
                bs.forEach(function (x) { if ((x.dataset.v === '1') === s.truth) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
                ctx.done({ acc: good ? 1 : 0 });
            };
        });
        ctx.solve = function () { bs.filter(function (b) { return (b.dataset.v === '1') === s.truth; })[0].click(); };
    });

    def('rapid5', 'الرشق السريع', 'speed', 20, 'stmt', 'خمس عبارات متتالية، لكل واحدة 3 ثوانٍ. صحيحة أم خاطئة؟', { items: 5, choices: 0, sw: 0.3 }, function (ctx) {
        var sts = ctx.items.map(function (it) { return BD.statement(it, undefined, ctx.pool); });
        var k = 0, correct = 0, tm;
        var head = h('<div class="note"></div>'), card = h('<div></div>'), pb = h('<div class="pbar"><i></i></div>');
        ctx.body.appendChild(head); ctx.body.appendChild(pb); ctx.body.appendChild(card);
        ctx.chance = 0.5; ctx.partial = function () { return correct / sts.length; };
        ctx.answerText = ctx.items.map(function (x, i) { return (sts[i].truth ? '✔' : '✘') + ' ' + BD.cut(sts[i].text, 60); }).join(' | ');
        function show() {
            if (k >= sts.length) { ctx.done({ acc: correct / sts.length, g: 0.5 }); return; }
            var s = sts[k]; head.innerHTML = 'العبارة <b>' + (k + 1) + '</b> من ' + sts.length + ' — صحيحة: <b>' + correct + '</b>';
            card.innerHTML = fmtStatement(s) + '<div class="opts grid2 tfrow"><button type="button" class="opt big" data-v="1"><span class="tx">✔ صحيحة</span></button><button type="button" class="opt big" data-v="0"><span class="tx">✘ خاطئة</span></button></div>';
            var i = pb.firstChild; i.style.transition = 'none'; i.style.width = '100%'; void i.offsetWidth; i.style.transition = 'width 3s linear'; i.style.width = '0%';
            clearTimeout(tm); tm = ctx.after(3000, function () { k++; show(); });
            Array.prototype.forEach.call(card.querySelectorAll('.opt'), function (b) {
                b.onclick = function () { clearTimeout(tm); if ((b.dataset.v === '1') === s.truth) correct++; k++; show(); };
            });
            ctx.solve = function () { Array.prototype.filter.call(card.querySelectorAll('.opt'), function (b) { return (b.dataset.v === '1') === s.truth; })[0].click(); };
        }
        show();
    });

    def('goNoGo', 'اصطد الصحيح', 'speed', 22, 'stmtN', 'ست عبارات: اضغط على الصحيحة فقط (تضيء بالأخضر) ثم اضغط «تم».', { items: 6, choices: 0, sw: 0.3 }, function (ctx) {
        var sts = shuffle(ctx.items.map(function (it, i) { return BD.statement(it, i < 3, ctx.pool); }));
        var marked = sts.map(function () { return false; });
        var grid = h('<div class="opts grid2 tiles6"></div>');
        var bt = sts.map(function (s, i) {
            var b = h('<button type="button" class="opt stm"><span class="tx">' + esc(s.text) + '</span></button>');
            b.onclick = function () { if (ctx.locked) return; marked[i] = !marked[i]; b.classList.toggle('sel', marked[i]); };
            grid.appendChild(b); return b;
        });
        function score() { var c = 0; sts.forEach(function (s, i) { if (marked[i] === s.truth) c++; }); return c / sts.length; }
        var ok = h('<button type="button" class="btn gold">تم</button>');
        ok.onclick = function () {
            if (ctx.locked) return; ctx.locked = true;
            sts.forEach(function (s, i) { bt[i].classList.remove('sel'); if (s.truth) bt[i].classList.add('ok'); else if (marked[i]) bt[i].classList.add('bad'); });
            ctx.done({ acc: score(), g: 0.5 });
        };
        ctx.chance = 0.5; ctx.partial = function () { return score() * 0.8; };
        ctx.answerText = 'العبارات الصحيحة هي المضيئة بالأخضر';
        ctx.body.appendChild(note('✔ اضغط العبارات <b>الصحيحة</b> فقط')); ctx.body.appendChild(grid); ctx.body.appendChild(ok);
        ctx.solve = function () { sts.forEach(function (s, i) { if (s.truth) bt[i].click(); }); ok.click(); };
    });

    def('multitask', 'تعدد المهام', 'speed', 40, 'any', 'ثلاثة أسئلة أمامك في وقت واحد! أجبها بالترتيب الذي تريده.', { items: 3, choices: 0, sw: 0.3 }, function (ctx) {
        var answered = 0, correct = 0, sols = [], total = ctx.items.length;
        ctx.chance = 0.3;
        ctx.partial = function () { return correct / total; };
        ctx.answerText = ctx.items.map(function (x, i) { return (i + 1) + ') ' + x.correct; }).join(' ، ');
        ctx.items.forEach(function (it, qi) {
            var card = h('<div class="mini-q"><div class="bq-q sm">' + (qi + 1) + '. ' + BD.qHtml(it) + '</div><div class="opts list sm"></div></div>');
            if (it.scenario) card.insertBefore(h('<div class="bq-scn">' + esc(it.scenario) + '</div>'), card.firstChild);
            var local = { locked: false };
            var list = BD.choices(it, 4, ctx.pool), btns = [];
            list.forEach(function (o, i) {
                var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span></button>');
                b.onclick = function () {
                    if (local.locked) return; local.locked = true; reveal(btns, b); answered++; if (o.ok) correct++;
                    card.classList.add('answered');
                    if (answered === total) ctx.done({ acc: correct / total, g: 0.3 });
                };
                card.lastChild.appendChild(b); btns.push(b);
            });
            sols.push(function () { btns.filter(function (b) { return b.dataset.ok === '1'; })[0].click(); });
            ctx.body.appendChild(card);
        });
        ctx.solve = function () { sols.forEach(function (f) { f(); }); };
    });

    def('survive', 'الصمود', 'speed', 36, 'any', 'أسئلة متتالية (6 ثوانٍ لكل سؤال). تنتهي الجولة عند أول خطأ — اصمد أطول فترة!', { items: 5, choices: 0, sw: 0.3 }, function (ctx) {
        var k = 0, correct = 0, tm, total = ctx.items.length, pb = h('<div class="pbar"><i></i></div>'), head = h('<div class="note"></div>'), area = h('<div></div>');
        ctx.body.appendChild(head); ctx.body.appendChild(pb); ctx.body.appendChild(area);
        ctx.chance = 0.3; ctx.partial = function () { return correct / total; };
        ctx.answerText = 'الإجابات: ' + ctx.items.map(function (x) { return x.correct; }).join(' ، ');
        function next() {
            if (k >= total) { ctx.done({ acc: correct / total, g: 0.3 }); return; }
            var it = ctx.items[k]; head.innerHTML = '🔥 السلسلة: <b>' + correct + '</b> — السؤال ' + (k + 1) + ' من ' + total;
            area.innerHTML = ''; area.appendChild(qBlock(it)); var box = h('<div class="opts list"></div>'); area.appendChild(box);
            var list = BD.choices(it, 4, ctx.pool), btns = [], lk = false;
            var i = pb.firstChild; i.style.transition = 'none'; i.style.width = '100%'; void i.offsetWidth; i.style.transition = 'width 6s linear'; i.style.width = '0%';
            clearTimeout(tm); tm = ctx.after(6000, function () { reveal(btns, null); ctx.done({ acc: correct / total, g: 0.3 }); });
            list.forEach(function (o, n) {
                var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[n] + '</span><span class="tx">' + esc(o.text) + '</span></button>');
                b.onclick = function () {
                    if (lk) return; lk = true; clearTimeout(tm); reveal(btns, b);
                    if (o.ok) { correct++; k++; ctx.after(350, next); } else { ctx.done({ acc: correct / total, g: 0.3 }); }
                };
                box.appendChild(b); btns.push(b);
            });
            ctx.solve = function () { btns.filter(function (b) { return b.dataset.ok === '1'; })[0].click(); };
        }
        next();
    });

    window.BrainModes = { list: MODES, map: MODE, play: play, def: def, util: { h: h, clamp: clamp, rnd: rnd, ri: ri, qBlock: qBlock, note: note, phaseBar: phaseBar, options: options, reveal: reveal, solveOk: solveOk, plainDone: plainDone, stdChoice: stdChoice, fmtStatement: fmtStatement, typedOk: typedOk, tileBuilder: tileBuilder, LET: LET } };
})();
