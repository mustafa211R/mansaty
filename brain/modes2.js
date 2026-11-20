/* =====================================================================
   modes2.js — الانتباه (8) • اللغة والمفردات (8) • الإدراك البصري (8) • التقدير الذاتي (7)
   ===================================================================== */
(function () {
    'use strict';
    var BD = window.BrainData, esc = BD.esc, shuffle = BD.shuffle;
    var M = window.BrainModes, def = M.def, U = M.util;
    var h = U.h, qBlock = U.qBlock, note = U.note, options = U.options, reveal = U.reveal, solveOk = U.solveOk,
        plainDone = U.plainDone, stdChoice = U.stdChoice, fmtStatement = U.fmtStatement, typedOk = U.typedOk,
        phaseBar = U.phaseBar, tileBuilder = U.tileBuilder, clamp = U.clamp, rnd = U.rnd, ri = U.ri, LET = U.LET;

    function inputRow(ctx, ph, onSubmit) {
        var row = h('<div class="inrow"><input type="text" class="tin" placeholder="' + ph + '" autocomplete="off"><button type="button" class="btn gold">تحقق</button></div>');
        var inp = row.firstChild, btn = row.lastChild;
        function go() { var v = inp.value.trim(); if (!v || ctx.locked) return; onSubmit(v, inp, btn); }
        btn.onclick = go;
        inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
        ctx.after(80, function () { try { inp.focus({ preventScroll: true }); } catch (e) { } });
        return { row: row, inp: inp, btn: btn };
    }
    function boxes(chars, cls) {
        return '<div class="wbox ' + (cls || '') + '">' + chars.map(function (c) { return '<span class="wb' + (c === ' ' ? ' sp' : '') + '">' + (c === '_' ? '&nbsp;' : esc(c)) + '</span>'; }).join('') + '</div>';
    }
    function typedFinish(ctx, v, inp, acc) {
        ctx.locked = true; inp.readOnly = true; inp.classList.add(acc >= 0.99 ? 'ok' : 'bad');
        ctx.answerText = ctx.item.correct;
        ctx.done({ acc: acc, g: 0 });
    }

    /* =================================================================
       4) الانتباه والتركيز (attention) — 8 أنماط
       ================================================================= */
    def('distract', 'المشتتات', 'attention', 24, 'any', 'ركّز على السؤال وتجاهل الأشكال المتحركة حولك!', {}, function (ctx) {
        stdChoice(ctx, 'list');
        var noise = h('<div class="noise"></div>'), em = ['⭐', '🔴', '🔷', '🟡', '💥', '🌀', '❓', '🎈', '⚡', '🔔', '🟣', '❗'];
        for (var i = 0; i < 18; i++) {
            var s = h('<span>' + em[i % em.length] + '</span>');
            s.style.left = rnd(0, 92) + '%'; s.style.top = rnd(0, 92) + '%';
            s.style.fontSize = rnd(16, 34) + 'px'; s.style.animationDuration = rnd(2.5, 6) + 's'; s.style.animationDelay = (-rnd(0, 5)) + 's';
            noise.appendChild(s);
        }
        ctx.body.appendChild(noise);
    });

    def('mirror', 'المرآة', 'attention', 26, 'any', 'النص معكوس كالمرآة! اقرأه بتركيز ثم أجب.', {}, function (ctx) {
        var r = stdChoice(ctx, 'list', { qcls: 'mirror' });
        r.box.classList.add('mirror-tx');
    });

    def('upside', 'رأساً على عقب', 'attention', 26, 'any', 'السؤال مقلوب رأساً على عقب. اقلب عقلك وأجب!', {}, function (ctx) {
        stdChoice(ctx, 'list', { qcls: 'flip180' });
    });

    def('blur', 'الضباب', 'attention', 12, 'any', 'النص ضبابي ويتضح تدريجياً. كلما أجبت أبكر نلت نقاطاً أكثر.', { sw: 0.4 }, function (ctx) {
        stdChoice(ctx, 'list');
        var w = ctx.body;
        w.style.filter = 'blur(9px)'; void w.offsetWidth;
        w.style.transition = 'filter 7s linear'; w.style.filter = 'blur(0px)';
    });

    def('spotlight', 'الكشّاف', 'attention', 35, 'any', 'الشاشة معتمة! حرّك إصبعك/الماوس لتضيء النص، ثم اختر الإجابة.', {}, function (ctx) {
        var wrap = h('<div class="spot"><div class="spot-in"></div><div class="spot-mask"></div></div>');
        ctx.body.appendChild(note('🔦 حرّك الكشّاف فوق النص لتقرأه'));
        ctx.body.appendChild(wrap);
        var inner = wrap.firstChild, mask = wrap.lastChild;
        inner.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts list"></div>'); inner.appendChild(box);
        var bt = options(ctx, box, ctx.opts, plainDone(ctx));
        function move(e) {
            var r = wrap.getBoundingClientRect();
            mask.style.setProperty('--x', (e.clientX - r.left) + 'px'); mask.style.setProperty('--y', (e.clientY - r.top) + 'px');
        }
        wrap.addEventListener('pointermove', move); wrap.addEventListener('pointerdown', move);
        ctx.solve = function () { mask.style.display = 'none'; solveOk(bt)(); };
    });

    def('typewriter', 'الآلة الكاتبة', 'attention', 22, 'any', 'السؤال يُكتب حرفاً حرفاً… انتظره كاملاً ثم أجب.', { manual: true }, function (ctx) {
        var it = ctx.item;
        if (it.scenario) ctx.body.appendChild(h('<div class="bq"><div class="bq-scn">' + esc(it.scenario) + '</div></div>'));
        var qd = h('<div class="bq"><div class="bq-q tw"></div></div>'), tgt = qd.firstChild;
        ctx.body.appendChild(qd);
        var txt = it.q.replace(/_{3,}/g, '؟'), k = 0, iv = clamp(3600 / txt.length, 10, 40);
        function type() {
            if (ctx.finished) return;
            k = Math.min(txt.length, k + 1); tgt.textContent = txt.slice(0, k);
            if (k < txt.length) ctx.after(iv, type); else showOpts();
        }
        function showOpts() {
            tgt.classList.remove('tw');
            var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
            var bt = options(ctx, box, ctx.opts, plainDone(ctx)); ctx.solve = solveOk(bt); ctx.startClock();
        }
        type();
    });

    def('code', 'الشيفرة', 'attention', 28, 'c3', 'لكل خيار رمز من رقمين. اكتب رمز الإجابة الصحيحة ثم اضغط «تحقق».', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var n = ctx.opts.length, codes = [];
        while (codes.length < n) { var c = 10 + ri(90); if (codes.indexOf(c) < 0) codes.push(c); }
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var rows = ctx.opts.map(function (o, i) {
            var r = h('<div class="opt row" data-ok="' + (o.ok ? 1 : 0) + '" data-code="' + codes[i] + '"><span class="lt code">' + codes[i] + '</span><span class="tx">' + esc(o.text) + '</span></div>');
            box.appendChild(r); return r;
        });
        var ir = inputRow(ctx, 'رمز الإجابة', function (v, inp) {
            var idx = codes.indexOf(parseInt(v, 10));
            if (idx < 0) { inp.value = ''; inp.classList.add('shake'); setTimeout(function () { inp.classList.remove('shake'); }, 400); return; }
            ctx.locked = true; inp.readOnly = true;
            rows.forEach(function (r, i) { if (r.dataset.ok === '1') r.classList.add('ok'); else if (i === idx) r.classList.add('bad'); });
            ctx.done({ acc: ctx.opts[idx].ok ? 1 : 0 });
        });
        ir.inp.setAttribute('inputmode', 'numeric');
        ctx.body.appendChild(ir.row);
        ctx.solve = function () { ir.inp.value = rows.filter(function (r) { return r.dataset.ok === '1'; })[0].dataset.code; ir.btn.click(); };
    });

    def('shuffleLive', 'المراوغ', 'attention', 26, 'any', 'الخيارات تتبدّل أماكنها كل ثانيتين! تتبّع الصحيح واضغطه.', {}, function (ctx) {
        var r = stdChoice(ctx, 'list'), box = r.box;
        box.classList.add('live');
        (function shuf() {
            if (ctx.locked) return;
            r.btns.forEach(function (b) { b.style.order = ri(100); b.classList.add('flash'); setTimeout(function () { b.classList.remove('flash'); }, 300); });
            ctx.after(2200, shuf);
        })();
    });

    /* =================================================================
       5) اللغة والمفردات (verbal) — 8 أنماط
       ================================================================= */
    def('typeIt', 'اكتب الإجابة', 'verbal', 28, 'text', 'لا خيارات هنا! اكتب الإجابة الصحيحة بنفسك.', { choices: 0 }, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item)); ctx.body.appendChild(note('✍️ اكتب الإجابة ثم اضغط Enter'));
        var ir = inputRow(ctx, 'اكتب الإجابة هنا…', function (v, inp) { typedFinish(ctx, v, inp, typedOk(v, ctx.item.correct) ? 1 : 0); });
        ctx.body.appendChild(ir.row);
        ctx.solve = function () { ir.inp.value = ctx.item.correct; ir.btn.click(); };
    });

    def('scramble', 'الحروف المبعثرة', 'verbal', 35, 'text', 'رتّب الحروف المبعثرة لتكوّن الإجابة الصحيحة.', { choices: 0 }, function (ctx) {
        var it = ctx.item, letters = Array.from(it.correct.replace(/\s+/g, ''));
        ctx.body.appendChild(qBlock(it));
        ctx.body.appendChild(note('🔤 عدد الحروف: ' + letters.length + (it.correct.trim().indexOf(' ') > 0 ? ' (كلمتان)' : '')));
        ctx.answerText = it.correct;
        var tb = tileBuilder(ctx, letters, {
            auto: true, placeholder: 'اضغط الحروف بالترتيب',
            check: function (b) { return BD.norm(b.join('')) === BD.norm(letters.join('')); },
            onDone: function (good, pos) { ctx.done({ acc: good ? 1 : pos * 0.3, g: 0 }); }
        });
        ctx.body.appendChild(tb); ctx.solve = tb.solve;
    });

    def('hangman', 'المشنقة', 'verbal', 50, 'text', 'خمّن الحروف واحداً واحداً. لديك 6 أخطاء فقط قبل أن تخسر.', { choices: 0 }, function (ctx) {
        var it = ctx.item, ans = it.correct, isAr = /[؀-ۿ]/.test(ans);
        var AR = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split(''), EN = 'abcdefghijklmnopqrstuvwxyz'.split('');
        var kb = isAr ? AR : EN;
        function nc(ch) {
            if (isAr) return ch.replace(/[ً-ْ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
            return ch.toLowerCase();
        }
        var chars = Array.from(ans), guessed = {}, lives = 6;
        ctx.body.appendChild(qBlock(it));
        var info = h('<div class="note"></div>'), word = h('<div></div>'), kbd = h('<div class="kbd"></div>');
        ctx.body.appendChild(info); ctx.body.appendChild(word); ctx.body.appendChild(kbd);
        function shown(c) { return kb.indexOf(nc(c)) < 0 || guessed[nc(c)]; }
        function paint(all) {
            word.innerHTML = boxes(chars.map(function (c) { return (all || shown(c)) ? c : '_'; }));
            info.innerHTML = '❤️ المحاولات المتبقية: <b>' + lives + '</b>';
        }
        paint();
        var keys = kb.map(function (k) {
            var b = h('<button type="button" class="key">' + k + '</button>');
            b.onclick = function () {
                if (ctx.locked || b.disabled) return; b.disabled = true; guessed[k] = true;
                if (chars.some(function (c) { return nc(c) === k; })) b.classList.add('ok'); else { b.classList.add('bad'); lives--; }
                paint();
                if (chars.every(shown)) { ctx.locked = true; ctx.answerText = ans; ctx.done({ acc: 0.5 + 0.5 * lives / 6, g: 0 }); }
                else if (lives <= 0) { ctx.locked = true; paint(true); ctx.answerText = ans; ctx.done({ acc: 0, g: 0 }); }
            };
            kbd.appendChild(b); return b;
        });
        ctx.partial = function () { return 0; };
        ctx.solve = function () { keys.forEach(function (b) { if (chars.some(function (c) { return nc(c) === b.textContent; })) b.click(); }); };
    });

    def('missing', 'الحروف الناقصة', 'verbal', 28, 'text', 'بعض حروف الإجابة مفقودة. اكتب الكلمة كاملة.', { choices: 0 }, function (ctx) {
        var it = ctx.item, chars = Array.from(it.correct);
        var idx = chars.map(function (c, i) { return c !== ' ' && i > 0 ? i : -1; }).filter(function (i) { return i >= 0; });
        var hide = shuffle(idx).slice(0, Math.max(1, Math.round(idx.length * 0.5))), hs = {};
        hide.forEach(function (i) { hs[i] = 1; });
        ctx.body.appendChild(qBlock(it));
        ctx.body.appendChild(h(boxes(chars.map(function (c, i) { return hs[i] ? '_' : c; }))));
        ctx.body.appendChild(note('🧩 أكمل الحروف الناقصة واكتب الكلمة كاملة'));
        var ir = inputRow(ctx, 'اكتب الإجابة كاملة…', function (v, inp) { typedFinish(ctx, v, inp, typedOk(v, it.correct) ? 1 : 0); });
        ctx.body.appendChild(ir.row);
        ctx.solve = function () { ir.inp.value = it.correct; ir.btn.click(); };
    });

    def('firstHint', 'تلميح الحرف الأول', 'verbal', 28, 'text', 'لديك الحرف الأول وعدد الحروف فقط. اكتب الإجابة.', { choices: 0 }, function (ctx) {
        var it = ctx.item, chars = Array.from(it.correct);
        ctx.body.appendChild(qBlock(it));
        ctx.body.appendChild(h(boxes(chars.map(function (c, i) { return i === 0 || c === ' ' ? c : '_'; }))));
        ctx.body.appendChild(note('💡 عدد الحروف: ' + chars.filter(function (c) { return c !== ' '; }).length));
        var ir = inputRow(ctx, 'اكتب الإجابة…', function (v, inp) { typedFinish(ctx, v, inp, typedOk(v, it.correct) ? 1 : 0); });
        ctx.body.appendChild(ir.row);
        ctx.solve = function () { ir.inp.value = it.correct; ir.btn.click(); };
    });

    def('attempts', 'ثلاث محاولات', 'verbal', 45, 'text', 'لديك 3 محاولات. بعد كل خطأ يظهر تلميح جديد، لكن النقاط تقل.', { choices: 0 }, function (ctx) {
        var it = ctx.item, chars = Array.from(it.correct), tries = 0, scores = [1, 0.6, 0.3];
        ctx.body.appendChild(qBlock(it));
        var hint = h('<div></div>'), msg = h('<div class="note">المحاولة 1 من 3 — لا تلميح بعد</div>');
        ctx.body.appendChild(msg); ctx.body.appendChild(hint);
        var ir = inputRow(ctx, 'اكتب إجابتك…', function (v, inp) {
            if (typedOk(v, it.correct)) { typedFinish(ctx, v, inp, scores[tries]); return; }
            tries++;
            if (tries >= 3) { typedFinish(ctx, v, inp, 0); return; }
            inp.value = ''; inp.classList.add('shake'); setTimeout(function () { inp.classList.remove('shake'); }, 400);
            var keep = tries === 1 ? function (c, i) { return i === 0; } : function (c, i) { return i % 2 === 0; };
            hint.innerHTML = boxes(chars.map(function (c, i) { return c === ' ' || keep(c, i) ? c : '_'; }));
            msg.textContent = 'المحاولة ' + (tries + 1) + ' من 3 — تلميح جديد ظهر';
        });
        ctx.body.appendChild(ir.row);
        ctx.partial = function () { return 0; };
        ctx.solve = function () { ir.inp.value = it.correct; ir.btn.click(); };
    });

    def('wordOrder', 'ترتيب الكلمات', 'verbal', 40, 'words', 'كلمات الإجابة الصحيحة مبعثرة. رتّبها لتكوّن العبارة الصحيحة.', { choices: 0 }, function (ctx) {
        var it = ctx.item, w = it.correct.trim().split(/\s+/);
        ctx.body.appendChild(qBlock(it)); ctx.answerText = it.correct;
        var tb = tileBuilder(ctx, w, { onDone: function (good, pos) { ctx.done({ acc: good ? 1 : pos * 0.5, g: 0 }); } });
        ctx.body.appendChild(tb); ctx.solve = tb.solve;
    });

    def('dragBlank', 'اسحب إلى الفراغ', 'verbal', 28, 'any', 'اسحب الإجابة الصحيحة (أو اضغطها) إلى مكان الفراغ.', {}, function (ctx) {
        var it = ctx.item, slot;
        if (BD.BLANK.test(it.q)) {
            var html = esc(it.q).replace(/_{3,}/, '<span class="slot">أسقِط هنا</span>').replace(/_{3,}/g, '؟');
            ctx.body.appendChild(h('<div class="bq">' + (it.scenario ? '<div class="bq-scn">' + esc(it.scenario) + '</div>' : '') + '<div class="bq-q">' + html + '</div></div>'));
        } else {
            ctx.body.appendChild(qBlock(it));
            ctx.body.appendChild(h('<div class="bq slotline">الإجابة: <span class="slot">أسقِط هنا</span></div>'));
        }
        slot = ctx.body.querySelector('.slot');
        var tray = h('<div class="tray"></div>'); ctx.body.appendChild(tray);
        var chips = ctx.opts.map(function (o) {
            var c = h('<div class="chip" data-ok="' + (o.ok ? 1 : 0) + '">' + esc(o.text) + '</div>'); c._o = o; tray.appendChild(c); return c;
        });
        function place(c) {
            if (ctx.locked) return; ctx.locked = true;
            slot.textContent = c._o.text; slot.classList.add(c._o.ok ? 'ok' : 'bad'); c.classList.add('used');
            if (!c._o.ok) chips.filter(function (x) { return x._o.ok; })[0].classList.add('ok');
            ctx.done({ acc: c._o.ok ? 1 : 0 });
        }
        chips.forEach(function (c) {
            var sx = 0, sy = 0, drag = false, moved = 0;
            c.addEventListener('pointerdown', function (e) { if (ctx.locked) return; drag = true; moved = 0; sx = e.clientX; sy = e.clientY; c.setPointerCapture(e.pointerId); c.classList.add('drag'); });
            c.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - sx, dy = e.clientY - sy; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); c.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; });
            c.addEventListener('pointerup', function (e) {
                if (!drag) return; drag = false; c.classList.remove('drag'); c.style.transform = '';
                var r = slot.getBoundingClientRect(), pad = 18;
                var inside = e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
                if (moved < 8 || inside) place(c);
            });
        });
        ctx.solve = function () { place(chips.filter(function (c) { return c._o.ok; })[0]); };
    });

    /* =================================================================
       6) الإدراك البصري المكاني (visual) — 8 أنماط
       ================================================================= */
    function lanesGame(ctx, dir) {
        var H = 380, W = null;
        ctx.body.appendChild(qBlock(ctx.item));
        var arena = h('<div class="arena sky ' + (dir < 0 ? 'up' : 'down') + '"></div>');
        arena.style.height = H + 'px'; ctx.body.appendChild(arena);
        var st = [];
        function miss() {
            if (ctx.locked) return; ctx.locked = true;
            st.forEach(function (s) { if (s.o.ok) s.e.classList.add('ok'); });
            ctx.done({ acc: 0, missed: true });
        }
        ctx.opts.forEach(function (o, i) {
            var e = h('<button type="button" class="balloon c' + (i % 4) + '" data-ok="' + (o.ok ? 1 : 0) + '"><span class="tx">' + esc(o.text) + '</span><i class="str"></i></button>');
            e.style.left = (i % 2 ? 52 : 4) + '%'; arena.appendChild(e);
            var stagger = Math.floor(i / 2) * 175 + (i % 2) * 70 + ri(25);
            var y = dir < 0 ? H + 10 + stagger : -150 - stagger;
            var s = { e: e, o: o, y: y, v: rnd(52, 78) + ctx.env.theta * 7 };
            e.style.top = y + 'px'; st.push(s);
            e.onclick = function () {
                if (ctx.locked) return; ctx.locked = true; e.classList.add('pop');
                st.forEach(function (x) { if (x.o.ok) x.e.classList.add('ok'); else if (x === s) x.e.classList.add('bad'); });
                ctx.done({ acc: o.ok ? 1 : 0 });
            };
        });
        ctx.loop(function (dt) {
            st.forEach(function (s) {
                s.y += dir * s.v * dt; s.e.style.top = s.y + 'px';
                if (s.o.ok && ((dir < 0 && s.y < -175) || (dir > 0 && s.y > H))) miss();
            });
        });
        ctx.solve = function () { st.filter(function (s) { return s.o.ok; })[0].e.click(); };
    }
    def('balloons', 'البالونات', 'visual', 14, 'c3', 'البالونات تطير للأعلى! فجّر البالون الذي يحمل الإجابة الصحيحة قبل أن يهرب.', { sw: 0.3 }, function (ctx) { lanesGame(ctx, -1); });
    def('falling', 'الأمطار', 'visual', 14, 'c3', 'الخيارات تتساقط! التقط الإجابة الصحيحة قبل أن تسقط على الأرض.', { sw: 0.3 }, function (ctx) { lanesGame(ctx, 1); });

    def('bounce', 'الأهداف المتحركة', 'visual', 22, 'c3', 'الخيارات ترتد في الشاشة. اصطد الإجابة الصحيحة.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var arena = h('<div class="arena bounce"></div>'); arena.style.height = '380px'; ctx.body.appendChild(arena);
        var st = ctx.opts.map(function (o, i) {
            var e = h('<button type="button" class="opt mover" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span></button>');
            arena.appendChild(e);
            var s = { e: e, o: o, x: rnd(0, 150), y: rnd(0, 250), vx: (Math.random() < 0.5 ? -1 : 1) * rnd(40, 75), vy: (Math.random() < 0.5 ? -1 : 1) * rnd(35, 65) };
            e.onclick = function () {
                if (ctx.locked) return; ctx.locked = true;
                st.forEach(function (x) { x.vx = x.vy = 0; if (x.o.ok) x.e.classList.add('ok'); else if (x === s) x.e.classList.add('bad'); });
                ctx.done({ acc: o.ok ? 1 : 0 });
            };
            return s;
        });
        ctx.loop(function (dt) {
            var W = arena.clientWidth, H = arena.clientHeight;
            st.forEach(function (s) {
                var w = s.e.offsetWidth, hh = s.e.offsetHeight;
                s.x += s.vx * dt; s.y += s.vy * dt;
                if (s.x < 0) { s.x = 0; s.vx = Math.abs(s.vx); } if (s.x + w > W) { s.x = Math.max(0, W - w); s.vx = -Math.abs(s.vx); }
                if (s.y < 0) { s.y = 0; s.vy = Math.abs(s.vy); } if (s.y + hh > H) { s.y = Math.max(0, H - hh); s.vy = -Math.abs(s.vy); }
                s.e.style.transform = 'translate(' + s.x + 'px,' + s.y + 'px)';
            });
        });
        ctx.solve = function () { st.filter(function (s) { return s.o.ok; })[0].e.click(); };
    });

    def('orbit', 'المدار', 'visual', 24, 'any', 'الخيارات تدور حول المركز. اضغط الإجابة الصحيحة أثناء دورانها.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var ring = h('<div class="ring orbit"><div class="ring-c">؟</div></div>'); ctx.body.appendChild(ring);
        var n = ctx.opts.length, bt = options(ctx, ring, ctx.opts, plainDone(ctx));
        bt.forEach(function (b, i) { b.style.setProperty('--a', (i * 360 / n) + 'deg'); });
        ctx.solve = solveOk(bt);
    });

    def('wheel', 'عجلة التوقيت', 'visual', 22, 'c3', 'اعرف الإجابة الصحيحة (حرفها)، ثم اضغط «قف» لحظة يشير السهم إلى قطاعها.', { sw: 0.1 }, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var n = ctx.opts.length, seg = 360 / n, R = 105, cols = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];
        function pt(a) { var r = a * Math.PI / 180; return [(R * Math.sin(r)).toFixed(1), (-R * Math.cos(r)).toFixed(1)]; }
        var paths = '', labels = '';
        for (var i = 0; i < n; i++) {
            var p0 = pt(i * seg), p1 = pt((i + 1) * seg), mid = pt(i * seg + seg / 2);
            paths += '<path d="M0 0 L' + p0.join(' ') + ' A' + R + ' ' + R + ' 0 0 1 ' + p1.join(' ') + ' Z" fill="' + cols[i] + '" stroke="#fff" stroke-width="3"/>';
            labels += '<text x="' + (mid[0] * 0.62) + '" y="' + (mid[1] * 0.62 + 7) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">' + LET[i] + '</text>';
        }
        var wheel = h('<div class="wheel"><svg viewBox="-120 -120 240 240" class="wsvg">' + paths + labels +
            '<g class="needle"><line x1="0" y1="0" x2="0" y2="-112" stroke="#0b1f3a" stroke-width="5" stroke-linecap="round"/><circle r="9" fill="#0b1f3a"/><polygon points="0,-124 -8,-106 8,-106" fill="#c9a227" stroke="#0b1f3a" stroke-width="2"/></g></svg></div>');
        ctx.body.appendChild(wheel);
        var list = h('<div class="opts list sm"></div>'); ctx.body.appendChild(list);
        var items = ctx.opts.map(function (o, i) { var d = h('<div class="opt row" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span></div>'); list.appendChild(d); return d; });
        var needle = wheel.querySelector('.needle'), angle = rnd(0, 360), speed = 130 + ctx.env.theta * 22;
        ctx.loop(function (dt) { angle = (angle + speed * dt) % 360; needle.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ')'); });
        var stop = h('<button type="button" class="btn gold big-stop">✋ قِف!</button>');
        stop.onclick = function () {
            if (ctx.locked) return; ctx.locked = true;
            var idx = Math.floor(angle / seg) % n;
            items.forEach(function (d, i) { if (d.dataset.ok === '1') d.classList.add('ok'); else if (i === idx) d.classList.add('bad'); });
            ctx.done({ acc: ctx.opts[idx].ok ? 1 : 0 });
        };
        ctx.body.appendChild(stop);
        ctx.solve = function () {
            var target = ctx.opts.findIndex(function (o) { return o.ok; });
            angle = target * seg + seg / 2; stop.click();
        };
    });

    def('swipe', 'اسحب الحكم', 'visual', 12, 'stmt', 'اسحب البطاقة يميناً إن كانت العبارة صحيحة، ويساراً إن كانت خاطئة.', { choices: 0, sw: 0.35 }, function (ctx) {
        var s = BD.statement(ctx.item, undefined, ctx.pool); ctx.chance = 0.5;
        ctx.answerText = (s.truth ? 'العبارة صحيحة' : 'العبارة خاطئة') + (s.truth ? '' : ' — الصحيح: «' + ctx.item.correct + '»');
        var area = h('<div class="swipe"><div class="sw-l">✘ خاطئة<br>◀ يساراً</div><div class="swcard"><div class="stmt">' + esc(s.text) + '</div></div><div class="sw-r">✔ صحيحة<br>يميناً ▶</div></div>');
        ctx.body.appendChild(area);
        var card = area.querySelector('.swcard'), sx = 0, dx = 0, drag = false;
        function decide(v) {
            if (ctx.locked) return; ctx.locked = true;
            var good = v === s.truth;
            card.style.transition = 'transform .3s, opacity .3s'; card.style.transform = 'translateX(' + (v ? 300 : -300) + 'px) rotate(' + (v ? 20 : -20) + 'deg)'; card.style.opacity = '.2';
            area.classList.add(good ? 'ok' : 'bad');
            ctx.done({ acc: good ? 1 : 0 });
        }
        card.addEventListener('pointerdown', function (e) { if (ctx.locked) return; drag = true; sx = e.clientX; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
        card.addEventListener('pointermove', function (e) {
            if (!drag) return; dx = e.clientX - sx;
            card.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 18) + 'deg)';
            area.classList.toggle('lean-r', dx > 40); area.classList.toggle('lean-l', dx < -40);
        });
        card.addEventListener('pointerup', function () {
            if (!drag) return; drag = false;
            if (dx > 90) decide(true); else if (dx < -90) decide(false);
            else { card.style.transition = 'transform .2s'; card.style.transform = ''; area.classList.remove('lean-r', 'lean-l'); }
            dx = 0;
        });
        ctx.solve = function () { decide(s.truth); };
    });

    def('slider', 'المنزلق', 'visual', 14, 'stmt', 'اسحب المقبض إلى أقصى اليمين (صحيحة) أو أقصى اليسار (خاطئة) لتحديد حكمك.', { choices: 0, sw: 0.3 }, function (ctx) {
        var s = BD.statement(ctx.item, undefined, ctx.pool); ctx.chance = 0.5;
        ctx.answerText = (s.truth ? 'العبارة صحيحة' : 'العبارة خاطئة') + (s.truth ? '' : ' — الصحيح: «' + ctx.item.correct + '»');
        ctx.body.appendChild(h(fmtStatement(s)));
        var tr = h('<div class="strack"><span class="sl-l">✘ خاطئة</span><span class="sl-r">✔ صحيحة</span><div class="sknob">⇄</div></div>');
        ctx.body.appendChild(tr);
        var kn = tr.querySelector('.sknob'), pos = 0.5, drag = false;
        function set(p) { pos = clamp(p, 0, 1); kn.style.left = (pos * 100) + '%'; }
        function decide(v) {
            if (ctx.locked) return; ctx.locked = true; set(v ? 1 : 0);
            tr.classList.add(v === s.truth ? 'ok' : 'bad'); ctx.done({ acc: v === s.truth ? 1 : 0 });
        }
        set(0.5);
        kn.addEventListener('pointerdown', function (e) { if (ctx.locked) return; drag = true; kn.setPointerCapture(e.pointerId); });
        kn.addEventListener('pointermove', function (e) { if (!drag) return; var r = tr.getBoundingClientRect(); set((e.clientX - r.left) / r.width); });
        kn.addEventListener('pointerup', function () {
            if (!drag) return; drag = false;
            if (pos > 0.88) decide(true); else if (pos < 0.12) decide(false); else set(0.5);
        });
        ctx.solve = function () { decide(s.truth); };
    });

    def('scratch', 'الخدش', 'visual', 30, 'c3', 'الخيارات مغطاة! اخدش الغطاء لتقرأها ثم اضغط «اختر» على الإجابة الصحيحة.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts grid2"></div>'); ctx.body.appendChild(box);
        var cards = ctx.opts.map(function (o, i) {
            var c = h('<div class="scard" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span><canvas></canvas><button type="button" class="mini take">✔ اختر</button></div>');
            c._o = o;
            c.querySelector('.take').onclick = function () {
                if (ctx.locked) return; ctx.locked = true;
                cards.forEach(function (x) { x.querySelector('canvas').style.opacity = 0; if (x._o.ok) x.classList.add('ok'); else if (x === c) x.classList.add('bad'); });
                ctx.done({ acc: o.ok ? 1 : 0 });
            };
            box.appendChild(c); return c;
        });
        ctx.after(30, function () {
            cards.forEach(function (c) {
                var cv = c.querySelector('canvas'), w = c.offsetWidth, hh = c.offsetHeight;
                cv.width = w; cv.height = hh;
                var g = cv.getContext('2d');
                g.fillStyle = '#9aa5b5'; g.fillRect(0, 0, w, hh);
                g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
                for (var x = -hh; x < w; x += 14) { g.beginPath(); g.moveTo(x, hh); g.lineTo(x + hh, 0); g.stroke(); }
                g.fillStyle = '#fff'; g.font = 'bold 15px sans-serif'; g.textAlign = 'center'; g.fillText('اخدش هنا', w / 2, hh / 2);
                var down = false;
                function erase(e) {
                    if (!down) return; var r = cv.getBoundingClientRect();
                    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(e.clientX - r.left, e.clientY - r.top, 18, 0, 7); g.fill();
                }
                cv.addEventListener('pointerdown', function (e) { down = true; cv.setPointerCapture(e.pointerId); erase(e); });
                cv.addEventListener('pointermove', erase);
                cv.addEventListener('pointerup', function () { down = false; });
            });
        });
        ctx.solve = function () { cards.filter(function (c) { return c._o.ok; })[0].querySelector('.take').click(); };
    });

    /* =================================================================
       7) التقدير الذاتي والمعايرة (meta) — 7 أنماط
       ================================================================= */
    function confirmStage(ctx, titleTxt, build) {
        var panel = h('<div class="confpanel"><div class="note">' + titleTxt + '</div></div>');
        ctx.body.appendChild(panel); build(panel); return panel;
    }

    def('bet', 'الرهان', 'meta', 28, 'any', 'اختر إجابتك ثم راهن بثقتك: كلما رفعت الرهان زاد الربح عند الصواب وزادت الخسارة عند الخطأ.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var chosen = null, rt1 = 0;
        var bt = options(ctx, box, ctx.opts, function (o, b) {
            chosen = o; rt1 = performance.now() - ctx.t0;
            confirmStage(ctx, '🎲 ما مدى ثقتك بإجابتك؟', function (p) {
                [['🙂 ثقة خفيفة', 0.55], ['😎 ثقة متوسطة', 0.75], ['🔥 واثق جداً', 0.95]].forEach(function (c) {
                    var k = h('<button type="button" class="btn gold bet" data-c="' + c[1] + '">' + c[0] + '</button>');
                    k.onclick = function () { if (ctx.betDone) return; ctx.betDone = true; reveal(bt, b); ctx.done({ acc: o.ok ? 1 : 0, conf: c[1], rt: rt1 }); };
                    p.appendChild(k);
                });
            });
        }, { noReveal: true });
        ctx.solve = function () { solveOk(bt)(); ctx.body.querySelector('.bet[data-c="0.95"]').click(); };
    });

    def('confSlider', 'شريط الثقة', 'meta', 30, 'any', 'اختر إجابتك ثم حدّد نسبة ثقتك بها من 50% إلى 100%.', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var rt1 = 0;
        var bt = options(ctx, box, ctx.opts, function (o, b) {
            rt1 = performance.now() - ctx.t0;
            confirmStage(ctx, '🎚️ كم تثق بإجابتك؟ <b class="cv">75%</b>', function (p) {
                var r = h('<input type="range" min="50" max="100" step="5" value="75" class="confrange">'), ok = h('<button type="button" class="btn gold">تأكيد</button>');
                r.oninput = function () { p.querySelector('.cv').textContent = r.value + '%'; };
                ok.onclick = function () { if (ctx.betDone) return; ctx.betDone = true; reveal(bt, b); ctx.done({ acc: o.ok ? 1 : 0, conf: r.value / 100, rt: rt1 }); };
                p.appendChild(r); p.appendChild(ok);
            });
        }, { noReveal: true });
        ctx.solve = function () { solveOk(bt)(); ctx.body.querySelector('.confpanel .btn').click(); };
    });

    def('rank', 'رتّب حسب الاحتمال', 'meta', 30, 'c3', 'اضغط الخيارات بالترتيب: من الأرجح أن يكون صحيحاً إلى الأقل ترجيحاً.', { sw: 0.1 }, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item)); ctx.body.appendChild(note('🥇 اضغط الأرجح أولاً… ثم الذي يليه'));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var order = [], pts = [1, 0.5, 0.2, 0, 0, 0];
        ctx.chance = pts.slice(0, ctx.opts.length).reduce(function (a, b) { return a + b; }, 0) / ctx.opts.length;
        var bt = [];
        ctx.opts.forEach(function (o, i) {
            var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt rk"></span><span class="tx">' + esc(o.text) + '</span></button>');
            b.onclick = function () {
                if (ctx.locked || order.indexOf(b) >= 0) return;
                order.push(b); b.querySelector('.lt').textContent = order.length; b.classList.add('sel');
                if (order.length === ctx.opts.length) {
                    ctx.locked = true;
                    var pos = order.findIndex(function (x) { return x.dataset.ok === '1'; });
                    bt.forEach(function (x) { if (x.dataset.ok === '1') x.classList.add('ok'); });
                    ctx.done({ acc: pts[pos], g: ctx.chance });
                }
            };
            box.appendChild(b); bt.push(b);
        });
        ctx.solve = function () { bt.filter(function (b) { return b.dataset.ok === '1'; })[0].click(); bt.forEach(function (b) { b.click(); }); };
    });

    def('abstain', 'أعرف أم لا أعرف', 'meta', 22, 'any', 'يمكنك اختيار «لا أعرف» (تنال ربع الدرجة) بدل المخاطرة بخطأ. الصادق مع نفسه يربح!', {}, function (ctx) {
        var r = stdChoice(ctx, 'list');
        r.btns.forEach(function (b) {
            b.onclick = function () {
                if (ctx.locked) return; ctx.locked = true; b.classList.add('sel'); reveal(r.btns, b);
                ctx.done({ acc: b._o.ok ? 1 : 0, score: b._o.ok ? 1 : 0 });
            };
        });
        var ab = h('<button type="button" class="btn ghost">🤷 لا أعرف</button>');
        ab.onclick = function () {
            if (ctx.locked) return; ctx.locked = true; reveal(r.btns, null);
            ctx.done({ acc: 0, score: 0.25, abstained: true });
        };
        ctx.body.appendChild(ab);
    });

    def('hintBuy', 'متجر التلميحات', 'meta', 26, 'c3', 'يمكنك شراء تلميح (حذف خيار خاطئ) مرتين كحد أقصى، لكل تلميح ثمن من النقاط.', {}, function (ctx) {
        var r = stdChoice(ctx, 'list'), hints = 0;
        r.btns.forEach(function (b) {
            b.onclick = function () {
                if (ctx.locked || b.classList.contains('gone')) return; ctx.locked = true; b.classList.add('sel'); reveal(r.btns, b);
                ctx.done({ acc: b._o.ok ? Math.max(0.1, 1 - 0.22 * hints) : 0 });
            };
        });
        var hb = h('<button type="button" class="btn ghost">🛒 اشترِ تلميحاً (−22% من النقاط) — المتبقي: 2</button>');
        hb.onclick = function () {
            if (ctx.locked || hints >= 2) return;
            var w = shuffle(r.btns.filter(function (b) { return b.dataset.ok !== '1' && !b.classList.contains('gone'); }))[0];
            if (!w) return; w.classList.add('gone'); hints++;
            hb.textContent = '🛒 اشترِ تلميحاً (−22% من النقاط) — المتبقي: ' + (2 - hints);
            if (hints >= 2 || r.btns.filter(function (b) { return !b.classList.contains('gone'); }).length <= 2) hb.disabled = true;
        };
        ctx.body.appendChild(hb);
    });

    def('revise', 'المراجعة الأخيرة', 'meta', 30, 'any', 'اختر إجابتك، ثم لديك 5 ثوانٍ لتغييرها مرة واحدة إن شككت. المراجع الذكي يربح!', {}, function (ctx) {
        ctx.body.appendChild(qBlock(ctx.item));
        var box = h('<div class="opts list"></div>'); ctx.body.appendChild(box);
        var cur = null, changes = 0, phase = false, rt1 = 0, pb, info = note('');
        var bt = [];
        function finalize() {
            if (ctx.locked) return; ctx.locked = true; reveal(bt, cur);
            ctx.done({ acc: cur._o.ok ? 1 : 0, changed: changes, rt: rt1 });
        }
        ctx.opts.forEach(function (o, i) {
            var b = h('<button type="button" class="opt" data-ok="' + (o.ok ? 1 : 0) + '"><span class="lt">' + LET[i] + '</span><span class="tx">' + esc(o.text) + '</span></button>');
            b._o = o; b._t = o.text;
            b.onclick = function () {
                if (ctx.locked) return;
                if (!phase) {
                    phase = true; cur = b; rt1 = performance.now() - ctx.t0; b.classList.add('sel'); ctx.stopClock();
                    pb = phaseBar(5000); ctx.body.insertBefore(pb, box); ctx.body.insertBefore(info, box);
                    info.innerHTML = '🔁 راجع إجابتك — يمكنك تغييرها مرة واحدة';
                    var ok = h('<button type="button" class="btn gold">تأكيد نهائي</button>'); ok.onclick = finalize; ctx.body.appendChild(ok);
                    ctx.after(5000, finalize);
                } else if (b !== cur && changes < 1) {
                    changes++; cur.classList.remove('sel'); cur = b; b.classList.add('sel'); info.innerHTML = '✅ تم التغيير — لا يمكن التغيير مرة أخرى';
                }
            };
            box.appendChild(b); bt.push(b);
        });
        ctx.solve = function () { bt.filter(function (b) { return b.dataset.ok === '1'; })[0].click(); finalize(); };
    });

    def('tfConf', 'الحكم بالثقة', 'meta', 15, 'stmt', 'احكم على العبارة مع بيان درجة يقينك: صحيحة/خاطئة بثقة أو بتردد.', { choices: 0 }, function (ctx) {
        var s = BD.statement(ctx.item, undefined, ctx.pool); ctx.chance = 0.5;
        ctx.answerText = (s.truth ? 'العبارة صحيحة' : 'العبارة خاطئة') + (s.truth ? '' : ' — الصحيح: «' + ctx.item.correct + '»');
        ctx.body.appendChild(h(fmtStatement(s)));
        var row = h('<div class="opts grid2 conf4"></div>'); ctx.body.appendChild(row);
        var defs = [['✔✔ صحيحة بثقة', true, 0.95], ['✔ صحيحة ربما', true, 0.6], ['✘ خاطئة ربما', false, 0.6], ['✘✘ خاطئة بثقة', false, 0.95]];
        var bs = defs.map(function (d) {
            var b = h('<button type="button" class="opt big" data-v="' + (d[1] ? 1 : 0) + '" data-c="' + d[2] + '"><span class="tx">' + d[0] + '</span></button>');
            b.onclick = function () {
                if (ctx.locked) return; ctx.locked = true; var good = d[1] === s.truth;
                bs.forEach(function (x) { if ((x.dataset.v === '1') === s.truth) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
                ctx.done({ acc: good ? 1 : 0, conf: d[2] });
            };
            row.appendChild(b); return b;
        });
        ctx.solve = function () { bs.filter(function (b) { return (b.dataset.v === '1') === s.truth && b.dataset.c === '0.95'; })[0].click(); };
    });
})();
