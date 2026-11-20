/* =====================================================================
   iq.js — احتساب القدرات ومؤشر الذكاء التقديري وتحليل شخصية المختبِر
   ===================================================================== */
(function () {
    'use strict';
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    var AB = {
        know: { name: 'المعرفة والاستدلال', ico: '🧠', tip: 'راجع الدروس بأسلوب الاسترجاع (اسأل نفسك قبل أن تقرأ الإجابة) واربط المفاهيم ببعضها.' },
        memory: { name: 'الذاكرة العاملة', ico: '💾', tip: 'جرّب تقسيم المعلومات إلى مجموعات صغيرة وتكرارها بصوت مسموع، وراجع قبل النوم.' },
        speed: { name: 'سرعة المعالجة', ico: '⚡', tip: 'تدرّب على أسئلة قصيرة بوقت محدد؛ السرعة تأتي من التكرار والثقة بالمعلومة.' },
        attention: { name: 'الانتباه والتركيز', ico: '🎯', tip: 'ادرس في مكان هادئ بدون مشتتات وبفترات قصيرة (25 دقيقة) تتخللها استراحة.' },
        verbal: { name: 'اللغة والمفردات', ico: '📚', tip: 'اكتب تعريفات المصطلحات بكلماتك، وحاول استرجاع المصطلح من دون خيارات.' },
        visual: { name: 'الإدراك البصري المكاني', ico: '👁️', tip: 'استعن بالرسومات والخرائط الذهنية والألوان عند الدراسة، وتدرّب على تتبّع الأهداف المتحركة.' },
        meta: { name: 'التقدير الذاتي', ico: '⚖️', tip: 'قبل كل إجابة اسأل: ما مدى يقيني؟ ثم قارن توقعك بالنتيجة لتضبط معايرتك.' }
    };
    var ORDER = ['know', 'memory', 'speed', 'attention', 'verbal', 'visual', 'meta'];

    var PROFILES = {
        know: ['المحلّل المعرفي', 'يستند تفكيرك إلى فهم المحتوى والاستدلال منه، وأداؤك الأقوى عند الأسئلة التي تتطلب الربط والتحليل.'],
        memory: ['صاحب الذاكرة الحديدية', 'تحتفظ بالمعلومات وتتعامل معها بكفاءة أثناء التفكير، وهي ميزة كبيرة في الحفظ والمراجعة.'],
        speed: ['البرق', 'تعالج المعلومات بسرعة لافتة وتتخذ القرار بسرعة، وهذا يمنحك أفضلية في الاختبارات المحددة بوقت.'],
        attention: ['القنّاص', 'تركيزك عالٍ ولا تشتّتك المؤثرات حولك، وتحافظ على مستوى ثابت في ظروف مربكة.'],
        verbal: ['اللغوي', 'تتفوق في فهم الألفاظ وصياغة الإجابة وتذكّر المصطلحات من دون خيارات تسندك.'],
        visual: ['العين الثاقبة', 'قدرتك على تتبع الأهداف واتخاذ القرار البصري السريع ممتازة، وتتعلم جيداً من الصور والحركة.'],
        meta: ['الحكيم', 'تعرف حدود معرفتك جيداً وتعاير ثقتك بنفسك بدقة، وهي سمة ترتبط بالتعلم الفعّال.']
    };

    /* درجة الجولة 0..1 */
    function roundScore(r) {
        var base;
        if (typeof r.score === 'number') base = clamp(r.score, 0, 1);
        else {
            var g = clamp(r.g || 0, 0, 0.9);
            base = clamp((r.acc - g) / (1 - g), 0, 1);
        }
        var sw = r.sw || 0;
        var spf = r.timedOut ? 0 : clamp(1 - (r.rt || 0) / Math.max(1, r.limit || 1), 0, 1);
        var s = base * (1 - sw + sw * spf);
        if (typeof r.conf === 'number') s = 0.5 * s + 0.5 * (1 - Math.pow(r.acc - r.conf, 2));
        return clamp(s, 0, 1);
    }
    function weight(r) { return 0.6 + 0.2 * (r.d || 2); }

    function bandOf(iq) {
        if (iq >= 130) return { key: 'top', name: 'متميّز جداً', desc: 'أداء استثنائي يضعك ضمن أعلى الفئات في هذا المقياس.' };
        if (iq >= 120) return { key: 'high', name: 'متفوّق', desc: 'أداء مرتفع بوضوح فوق المتوسط.' };
        if (iq >= 110) return { key: 'above', name: 'فوق المتوسط', desc: 'أداء جيد جداً يتجاوز المتوسط.' };
        if (iq >= 90) return { key: 'avg', name: 'متوسط', desc: 'أداء ضمن النطاق الطبيعي الذي يقع فيه معظم الناس.' };
        if (iq >= 80) return { key: 'below', name: 'دون المتوسط بقليل', desc: 'أداء أقل قليلاً من المتوسط ويمكن تحسينه بالتدريب.' };
        return { key: 'low', name: 'يحتاج إلى تطوير', desc: 'الأداء الحالي منخفض نسبياً، والتدريب المنتظم يحسّنه كثيراً.' };
    }

    function analyze(results, ctx) {
        ctx = ctx || {};
        var n = results.length;
        var out = { rounds: n, abilities: {}, abilityRounds: {}, valid: true, reasons: [] };
        var sums = {}, ws = {};
        var correct = 0, rushed = 0, timeouts = 0, rtSum = 0, rtN = 0, accSum = 0;
        var perMode = {}, perCourse = {}, confPairs = [];

        results.forEach(function (r) {
            var s = roundScore(r), w = weight(r);
            r._s = s;
            sums[r.ab] = (sums[r.ab] || 0) + w * s; ws[r.ab] = (ws[r.ab] || 0) + w;
            out.abilityRounds[r.ab] = (out.abilityRounds[r.ab] || 0) + 1;
            accSum += r.acc; if (r.acc >= 0.99) correct++;
            if (r.timedOut) timeouts++;
            if ((r.rt || 0) < 400 && r.acc < 0.5 && !r.timedOut) rushed++;
            if (!r.timedOut) { rtSum += r.rt; rtN++; }
            var m = perMode[r.modeId] || (perMode[r.modeId] = { id: r.modeId, ab: r.ab, s: 0, n: 0 });
            m.s += s; m.n++;
            (r.courseIds || []).forEach(function (cid, i) {
                var c = perCourse[cid] || (perCourse[cid] = { id: cid, s: 0, n: 0, ok: 0 });
                c.s += s; c.n++; if (r.acc >= 0.99) c.ok++;
            });
            if (typeof r.conf === 'number') confPairs.push([r.conf, r.acc >= 0.99 ? 1 : 0]);
        });

        var sc = [];
        ORDER.forEach(function (k) {
            if (ws[k]) { out.abilities[k] = Math.round(100 * sums[k] / ws[k]); sc.push(sums[k] / ws[k]); }
            else out.abilities[k] = null;
        });
        var P = sc.length ? sc.reduce(function (a, b) { return a + b; }, 0) / sc.length : 0;
        out.P = P;
        out.iq = Math.round(clamp(100 + 15 * ((P - 0.45) / 0.20), 55, 145));
        out.margin = n ? Math.max(3, Math.round(34 / Math.sqrt(n))) : 20;
        out.band = bandOf(out.iq);
        out.percentile = Math.round(clamp(100 * normCdf((out.iq - 100) / 15), 1, 99));

        out.accuracy = n ? Math.round(100 * correct / n) : 0;
        out.avgRt = rtN ? Math.round(rtSum / rtN / 100) / 10 : 0;
        out.timeouts = timeouts;
        out.rushed = rushed;

        if (n < 12) { out.valid = false; out.reasons.push('عدد الجولات غير كافٍ (أقل من 12) لإصدار مؤشر موثوق.'); }
        if (n && rushed / n > 0.35) { out.valid = false; out.reasons.push('إجابات كثيرة سريعة جداً وخاطئة (تخمين عشوائي).'); }
        if (n && timeouts / n > 0.5) { out.valid = false; out.reasons.push('انتهى الوقت في أكثر من نصف الجولات.'); }

        /* أفضل/أضعف الأنماط */
        var ml = Object.keys(perMode).map(function (k) { var m = perMode[k]; m.avg = m.s / m.n; return m; }).sort(function (a, b) { return b.avg - a.avg; });
        out.bestModes = ml.slice(0, 3); out.worstModes = ml.slice(-3).reverse();

        /* المواد */
        out.courses = Object.keys(perCourse).map(function (k) { var c = perCourse[k]; return { id: c.id, avg: Math.round(100 * c.s / c.n), n: c.n, ok: c.ok }; })
            .sort(function (a, b) { return b.avg - a.avg; });

        /* الشخصية */
        var ranked = ORDER.filter(function (k) { return out.abilities[k] !== null; }).sort(function (a, b) { return out.abilities[b] - out.abilities[a]; });
        out.ranked = ranked;
        out.top = ranked[0]; out.low = ranked[ranked.length - 1];
        var prof = PROFILES[out.top] || PROFILES.know;
        out.profile = { name: prof[0], desc: prof[1] };

        /* أسلوب السرعة/الدقة */
        var spd = out.abilities.speed, acc = out.accuracy;
        var style;
        if (out.avgRt && out.avgRt < 5 && acc >= 70) style = 'سريع ودقيق';
        else if (out.avgRt && out.avgRt < 5 && acc < 55) style = 'متسرّع';
        else if (out.avgRt >= 9 && acc >= 70) style = 'متأنٍّ ودقيق';
        else if (out.avgRt >= 9 && acc < 55) style = 'بطيء ويحتاج مراجعة';
        else style = 'متوازن';
        out.style = style;

        /* المعايرة */
        if (confPairs.length >= 3) {
            var mc = confPairs.reduce(function (a, p) { return a + p[0]; }, 0) / confPairs.length;
            var ma = confPairs.reduce(function (a, p) { return a + p[1]; }, 0) / confPairs.length;
            out.calib = { conf: Math.round(mc * 100), acc: Math.round(ma * 100), gap: Math.round((mc - ma) * 100) };
            out.calib.label = out.calib.gap > 12 ? 'مفرط الثقة' : (out.calib.gap < -12 ? 'يقلّل من نفسه' : 'معايرة جيدة');
        } else out.calib = null;

        /* نصائح */
        var tips = [];
        ranked.slice(-2).reverse().forEach(function (k) { if (out.abilities[k] < 70) tips.push(AB[k].ico + ' ' + AB[k].name + ': ' + AB[k].tip); });
        if (out.calib && out.calib.label === 'مفرط الثقة') tips.push('⚖️ تميل إلى الثقة الزائدة بإجاباتك؛ راجع إجابتك مرة قبل التأكيد.');
        if (out.calib && out.calib.label === 'يقلّل من نفسه') tips.push('⚖️ معرفتك أفضل مما تظن؛ ثق بإجاباتك الأولى أكثر.');
        if (style === 'متسرّع') tips.push('⏱️ تجيب بسرعة كبيرة على حساب الدقة؛ خصّص ثانيتين إضافيتين للتفكير.');
        if (style === 'بطيء ويحتاج مراجعة') tips.push('⏱️ تحتاج وقتاً طويلاً للإجابة؛ تدرّب على الاسترجاع السريع للمفاهيم الأساسية.');
        if (!tips.length) tips.push('🌟 مستواك متوازن وجيد؛ واصل التدريب لرفع الدقة وتوسيع نطاق المواد.');
        out.tips = tips;
        return out;
    }

    function normCdf(z) {
        var t = 1 / (1 + 0.2316419 * Math.abs(z));
        var d = 0.3989423 * Math.exp(-z * z / 2);
        var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return z > 0 ? 1 - p : p;
    }

    /* مخطط الرادار SVG */
    function radarSVG(ab, size) {
        size = size || 300;
        var cx = size / 2, cy = size / 2, R = size * 0.34, keys = ORDER, n = keys.length;
        function pt(i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
        var s = '<svg viewBox="0 0 ' + size + ' ' + size + '" class="radar" role="img" aria-label="مخطط القدرات">';
        [0.25, 0.5, 0.75, 1].forEach(function (f) {
            s += '<polygon points="' + keys.map(function (k, i) { return pt(i, R * f).join(','); }).join(' ') + '" fill="none" stroke="#d8d2c2" stroke-width="1"/>';
        });
        keys.forEach(function (k, i) { var p = pt(i, R); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="#d8d2c2"/>'; });
        s += '<polygon points="' + keys.map(function (k, i) { return pt(i, R * (ab[k] || 0) / 100).join(','); }).join(' ') + '" fill="rgba(201,162,39,.35)" stroke="#c9a227" stroke-width="2.5"/>';
        keys.forEach(function (k, i) {
            var p = pt(i, R * (ab[k] || 0) / 100), l = pt(i, R + 26);
            s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#0b1f3a"/>';
            s += '<text x="' + l[0] + '" y="' + l[1] + '" text-anchor="middle" font-size="18">' + AB[k].ico + '</text>';
        });
        return s + '</svg>';
    }

    window.BrainIQ = { AB: AB, ORDER: ORDER, analyze: analyze, roundScore: roundScore, bandOf: bandOf, radarSVG: radarSVG };
})();
