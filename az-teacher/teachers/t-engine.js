/* محرّك تحليل نماذج المعلمين T-AZ — يعتمد على الورقة البحثية (مؤشر زمن الاستجابة LI، درجة الاتساق/التجميل، أنماط النضج الأربعة).
   تنبيه منهجي: العتبات الواردة هنا مأخوذة من الورقة وهي غير معايَرة على عيّنة محلية؛ تُعامَل مؤشرات إرشادية لا أحكاماً (انظر Calibration في Teachers.gs). */
(function () {
  const T = window.TSPEC;
  const CFG = {
    li: [0.45, 0.75, 1.35, 1.85],           // حدود: اندفاعي | انتقالي سريع | متوازن | انتقالي بطيء | معالجة مزدوجة
    fastTarget: 5, fastInhibit: 12, slowSuperficial: 3, hiddenCut: 1.5,
    defaultRho: 0.5, rhoMin: 0.15, rhoMax: 1.2, minExpected: 3,
    k: 3
  };
  const LI_LABEL = ["اندفاعي", "انتقالي سريع", "متوازن", "انتقالي بطيء", "معالجة مزدوجة"];
  const LI_KEY = ["imp", "fast", "bal", "slow", "dbl"];
  const MAT_LABEL = m => m >= 80 ? "متقدم" : m >= 60 ? "متطور" : m >= 40 ? "متوسط" : "بحاجة إلى دعم مكثّف";
  const sum = a => a.reduce((x, y) => x + y, 0);
  const mean = a => a.length ? sum(a) / a.length : 0;
  const sd = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(sum(a.map(x => (x - m) ** 2)) / (a.length - 1)); };
  const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
  const wc = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
  const itemWC = it => wc(it.q) + sum((it.o || []).map(wc));

  /* ---------- 1) المعايرة من فقرتي الإحماء ---------- */
  function calibrate(warm) {                // warm: [{t, wc, ok}]
    const v = (warm || []).filter(w => w && w.t > 0.8 && w.wc > 0);
    if (!v.length) return { rho: CFG.defaultRho, n: 0, ok: false, attn: false, note: "لم تتوفر قراءة معيارية؛ استُخدمت قيمة افتراضية." };
    let rho = mean(v.map(w => w.t / w.wc));
    rho = Math.min(CFG.rhoMax, Math.max(CFG.rhoMin, rho));
    const attn = (warm || []).some(w => w && w.ok === false);
    return { rho: r2(rho), n: v.length, ok: true, attn, note: attn ? "أخفق في فقرة الإحماء ذات الإجابة الواضحة؛ يُحتمل ضعف الانتباه أو العجلة." : "" };
  }
  const expected = (w, rho) => Math.max(CFG.minExpected, rho * w);
  function liClass(li) { const c = CFG.li; return li < c[0] ? 0 : li < c[1] ? 1 : li < c[2] ? 2 : li < c[3] ? 3 : 4; }

  /* ---------- 2) تقدير كل إجابة ---------- */
  function scoreRec(r, rho) {
    const hid = !!r.hid;
    const exp = expected(r.wc, rho);
    const li = r.t / exp;
    const cls = liClass(li);
    let w = [0.5, 0.85, 1, 0.9, r.idx >= 2 ? 0.75 : 1][cls];
    const flags = [];
    if (r.k === "fast") {
      if (r.t <= CFG.fastTarget) w *= 1.1; else if (r.t <= CFG.fastInhibit) w *= 0.9; else { if (r.idx >= 2) w *= 0.7; flags.push("inhibited"); }
    }
    if (r.k === "slow" && r.t < CFG.slowSuperficial) { w *= 0.5; flags.push("superficial"); }
    if (hid) { w = 0.6; flags.push("interrupted"); }
    return Object.assign({}, r, { exp: r2(exp), li: r2(li), cls, w: r2(w), flags, hid });
  }

  /* ---------- 3) تحليل نموذج واحد ---------- */
  function forecast(id, dom, risk, ctx) {
    const base = [
      `إذا استمر هذا النمط دون تدخل فالمرجّح أن تتفاقم مخاطر «${risk}»، وأن ينعكس ذلك على مناخ الصف وعلى ثقة الطلاب بأنفسهم خلال الفصل الدراسي.`,
      `النمط انتقالي ويُرجَّح أن تظهر «${risk}» في المواقف الضاغطة تحديداً؛ ويتوقع أن يتحسّن الأداء بمتابعة تدريبية قصيرة وممارسة مُوجَّهة.`,
      `النمط جيّد في الغالب، ومخاطر «${risk}» محدودة ما لم يشتدّ الضغط الإداري أو الزمني؛ ويُتوقع أن يرتقي بالممارسة المقصودة والتغذية الراجعة.`,
      `النمط ناضج ويُتوقع أن يُحدِث أثراً إيجابياً مستداماً، مع انخفاض احتمال «${risk}»؛ ويمكن توظيفه في الإرشاد المهني للزملاء.`
    ][dom];
    const m = [];
    if (ctx.fake >= 50) m.push("يبقى هذا التوقع مشروطاً بالتحقق الميداني (ملاحظة صفية)؛ لأن مؤشر الاتساق منخفض.");
    if (ctx.impShare >= 0.4) m.push("كثرة الاستجابات المتسرعة تُضعف الثقة في دقة التوقع.");
    if (ctx.gap >= 1) m.push("الفرق بين الإجابات السريعة والمتأنية يوحي بأن الممارسة تحت الضغط أقل نضجاً من المعلن.");
    return base + (m.length ? " " + m.join(" ") : "");
  }

  function analyzeModel(id, recsIn, rho) {
    const M = T.models[id];
    const recs = recsIn.map(r => scoreRec(r, rho));
    const valid = recs.filter(r => !r.hid);
    const W = sum(recs.map(r => r.w)) || 1;
    const distW = [0, 0, 0, 0], distN = [0, 0, 0, 0];
    recs.forEach(r => { distW[r.idx] += r.w; distN[r.idx]++; });
    const pctW = distW.map(x => r1(x / W * 100));
    const maturity = r1(sum(recs.map(r => r.w * r.idx / 3)) / W * 100);
    let dom = 0; for (let i = 1; i < 4; i++) if (distW[i] > distW[dom] + 1e-9) dom = i;  // التعادل يذهب للأدنى (تحفظ)
    const meanIdx = r2(sum(recs.map(r => r.w * r.idx)) / W);

    const cnt = [0, 0, 0, 0, 0]; valid.forEach(r => cnt[r.cls]++);
    const nV = valid.length || 1;
    const impShare = cnt[0] / nV, dblShare = cnt[4] / nV;
    const slowSup = recs.filter(r => r.k === "slow" && r.flags.includes("superficial")).length / (recs.filter(r => r.k === "slow").length || 1);
    const intShare = recs.filter(r => r.hid).length / recs.length;
    const meanLI = r2(mean(valid.map(r => r.li)));

    const fastR = recs.filter(r => r.k === "fast"), slowR = recs.filter(r => r.k === "slow");
    const reflR = recs.filter(r => r.k === "slow" || r.k === "base");
    const fastIdx = fastR.length ? mean(fastR.map(r => r.idx)) : meanIdx;
    const reflIdx = reflR.length ? mean(reflR.map(r => r.idx)) : meanIdx;
    const gap = r2(reflIdx - fastIdx);

    /* مؤشر التجميل F1..F4 */
    const share3 = distN[3] / recs.length;
    const F1 = share3 >= 0.85 ? 25 : share3 >= 0.70 ? 15 : share3 >= 0.55 ? 6 : 0;
    const high = valid.filter(r => r.idx >= 2);
    const highSlow = high.filter(r => r.cls === 4 || r.flags.includes("inhibited")).length;
    const F2 = high.length >= 3 ? r1(25 * highSlow / high.length) : 0;
    const F3 = gap >= 1.5 ? 25 : gap >= 1 ? 14 : gap >= 0.5 ? 6 : 0;
    const F4 = distN[3] >= recs.length - 1 && recs.length >= 8 ? 15 : 0;
    const fake = Math.min(100, Math.round(F1 + F2 + F3 + F4));
    const fakeLevel = fake >= 55 ? "مرتفع" : fake >= 30 ? "متوسط" : "منخفض";

    /* الاتساق الداخلي + التحيّز الموضعي */
    const consistency = Math.max(0, Math.min(1, 1 - sd(recs.map(r => r.idx)) / 1.5));
    const posCnt = [0, 0, 0, 0]; recs.forEach(r => { if (r.pos >= 0) posCnt[r.pos]++; });
    const posBias = Math.max(...posCnt) / recs.length;
    const posFlag = posBias >= 0.7;

    let reliability = 100 - impShare * 40 - slowSup * 20 - intShare * 30 - fake * 0.3 - (1 - consistency) * 15 - (posFlag ? 15 : 0);
    reliability = Math.round(Math.max(0, Math.min(100, reliability)));
    const relLabel = reliability >= 75 ? "عالية" : reliability >= 50 ? "متوسطة" : "منخفضة";

    const trapRec = recs.find(r => r.k === "trap");
    const flags = [];
    if (impShare >= 0.4) flags.push("استجابات متسرعة بنسبة مرتفعة");
    if (dblShare >= 0.3) flags.push("معالجة مزدوجة متكررة (تردد أو انتقاء للإجابة)");
    if (slowSup > 0) flags.push("تأمل سطحي في فقرة مخصصة للتأمل");
    if (intShare > 0) flags.push("انقطاع عن الصفحة أثناء الإجابة");
    if (posFlag) flags.push("ميل موضعي إلى الخيار نفسه");
    if (fake >= 55) flags.push("نمط تجميل مرجّح");
    if (gap >= 1) flags.push("فجوة بين السريع والمتأني");

    return {
      id, name: M.name, n: recs.length, rho,
      dist: distN, distW: distW.map(r2), pct: pctW, dom, pattern: M.P[dom].n, patternDesc: M.P[dom].d, advice: M.P[dom].a,
      maturity, maturityLabel: MAT_LABEL(maturity), meanIdx,
      lat: { mean: meanLI, cls: cnt, imp: r1(impShare * 100), dbl: r1(dblShare * 100), slowSup: r1(slowSup * 100), interrupted: r1(intShare * 100) },
      fastIdx: r2(fastIdx), reflIdx: r2(reflIdx), gap,
      fake, fakeLevel, F: { F1, F2, F3, F4 }, consistency: r2(consistency), posBias: r2(posBias),
      reliability, relLabel, flags,
      trap: trapRec ? { pair: trapRec.pair, ctx: trapRec.ctx, idx: trapRec.idx } : null,
      forecast: forecast(id, dom, M.risk, { fake, impShare, gap }),
      recs: recs.map(r => ({ k: r.k, idx: r.idx, t: r2(r.t), li: r.li, cls: r.cls, w: r.w, hid: r.hid, flags: r.flags.join(","), pos: r.pos }))
    };
  }

  /* ---------- 4) تحليل النص المفتوح ---------- */
  const THEMES = [
    ["curr", "كثافة المنهج وضغط الوقت", /المنهج|المقرر|كثاف|الوقت|ضيق|الحصة|الامتحان الوزاري|الوزاري|حشو/],
    ["admin", "الإدارة والإجراءات الإدارية", /الإدار|روتين|بيروقراط|المدير|المشرف|التعليمات|الأوراق|السجلات|تفتيش/],
    ["res", "الموارد والبيئة المادية", /وسائل|وسيلة|مختبر|تقني|حاسوب|إنترنت|كهرباء|مكتظ|اكتظاظ|عدد الطلاب|الصف الضيق|القاعة|مقاعد|تجهيز/],
    ["stu", "دافعية الطلاب وانضباطهم", /دافعي|انضباط|سلوك|إهمال|لا يهتم|غياب|شغب|ضعف الطلاب|مستوى الطلاب|لا يدرسون/],
    ["par", "أولياء الأمور والمجتمع", /أولياء|ولي الأمر|الأهل|الأسرة|المجتمع|دروس خصوصية|الدروس الخصوصية/],
    ["self", "الإرهاق والأجر والتقدير", /راتب|أجر|تعب|إرهاق|ضغط نفسي|تقدير|احتراق|عبء|مكافأة|حوافز/],
    ["aut", "الاستقلالية والتجديد", /حرية|استقلال|أجدد|تجديد|إبداع|ابتكار|أجرّب|أجرب|أطبق|قيود|تقييد/],
    ["dev", "التدريب والتطوير المهني", /تدريب|دورات|تطوير|ورش|خبرة|أتعلم|معرفة|مهارة/]
  ];
  const EXT = /الإدار|الوزار|المنهج|الظروف|الأهل|أولياء|الطلاب|الطالب|الدولة|النظام|التعليمات|المشرف|لا يسمح|لا توجد|غياب|قلة|نقص|ضعف|بسبب/g;
  const INT = /\bأنا\b|نفسي|أحتاج|تقصيري|مسؤوليتي|أستطيع|أحاول|أقصّر|أقصر|لم أتمكن|أرى أنني|ينقصني|أتعلم|أطور|بوسعي|أخطأت/g;
  function analyzeOpen(text) {
    const t = String(text || "").trim();
    const n = wc(t);
    if (!n) return { n: 0, depth: "لا توجد إجابة", themes: [], ext: 0, int: 0, locus: "غير متاح", summary: "لم تُقدَّم إجابة مفتوحة." };
    const themes = THEMES.map(([k, l, re]) => ({ k, label: l, hits: (t.match(new RegExp(re.source, "g")) || []).length })).filter(x => x.hits).sort((a, b) => b.hits - a.hits);
    const ext = (t.match(EXT) || []).length, int = (t.match(INT) || []).length;
    const tot = ext + int;
    const extShare = tot ? ext / tot : 0.5;
    const locus = !tot ? "محايد" : extShare >= 0.75 ? "إسناد خارجي غالب" : extShare >= 0.5 ? "إسناد خارجي مع إقرار جزئي" : "إسناد ذاتي ومسؤولية معلنة";
    const depth = n < 6 ? "مقتضبة جداً" : n < 15 ? "موجزة" : n < 45 ? "متوسطة" : "مفصلة";
    const top = themes.slice(0, 3).map(x => x.label);
    const summary = `الإجابة ${depth} (${n} كلمة). ${top.length ? "أبرز المحاور: " + top.join("، ") + "." : "لا محور ظاهراً بحسب المعجم المعتمد."} نمط الإسناد: ${locus}.`;
    return { n, depth, themes, ext, int, extShare: r2(extShare), locus, summary };
  }

  /* ---------- 5) الملف الشامل ---------- */
  const PW = Object.fromEntries(T.ids.split("").map(k => [k, T.models[k].pw || 1]));
  const SYN = [
    ["التلقين الامتحاني", ["A", "H", "P", "D"], 1, "الوزن الغالب للحفظ والامتحان على حساب الفهم والاستدلال.", "مسار: بناء الفهم وتصميم تقويم استدلالي."],
    ["التسلط الصفي والترهيب", ["R", "Q", "E"], 1, "ضبط الصف بالسلطة والعقوبة وتكريس الخوف من الخطأ.", "مسار: إدارة صفية إيجابية وتحويل الخطأ إلى فرصة."],
    ["الاحتراق المصحوب بتفريغ الضغط", ["K", "Y", "J"], 1, "استنزاف نفسي يتسرب إلى الصف في صورة انفعال أو برود.", "مسار: الدعم النفسي-المهني وتنظيم العبء ومهارات تنظيم الانفعال."],
    ["الوصم والتهميش", ["M", "N", "G"], 1, "قراءة الطالب المتعثر أو المختلف بوصفه مشكلة لا حالة تحتاج فهماً.", "مسار: التعليم المتمايز وتشخيص جذور التعثر."],
    ["إسقاط اللوم وضعف المساءلة الذاتية", ["O", "Y", "T"], 1, "ميل إلى إرجاع التعثر إلى الطالب أو الأسرة أو الإدارة.", "مسار: التأمل المهني الموجَّه وتحليل الحوادث الصفية."],
    ["العزلة المهنية والجمود", ["S", "L", "I"], 1, "انغلاق عن الزملاء والجديد وغياب التجريب والربط بالواقع.", "مسار: مجتمعات التعلم المهنية والدرس المشترك."],
    ["المراوغة العلمية", ["V", "B", "F"], 1, "تجنّب الاعتراف بحدود المعرفة وقطع الأسئلة العميقة.", "مسار: ثقافة «لا أعرف، لنبحث معاً»."],
    ["الانفصال عن السياق", ["U", "T", "I"], 1, "ضعف ربط التعلم بسياق الطلاب البيئي والأسري.", "مسار: الاستجابة الثقافية والشراكة الأسرية."],
    ["الجمود التجريدي", ["C", "P", "H"], 1, "ثبات على قالب واحد في الشرح والتقويم.", "مسار: تنويع التمثيلات والأسئلة."],
    ["التحفيز بالخوف", ["W", "Q", "E"], 1, "اعتماد الرسوب والعلامات كمحرك أساسي.", "مسار: نظرية تقرير المصير وتعزيز الدافعية الداخلية."]
  ];
  const PATHS = { A: "فلسفة التدريس والتعلم البنائي", B: "أسئلة «لماذا» والتفكير العميق", C: "تنويع التمثيلات", D: "إدارة الوقت مع بقاء الفهم", E: "التعامل مع الخطأ بوصفه فرصة", F: "إدارة الحوار الصفي", G: "التعليم المتمايز", H: "تصميم تقويم استدلالي", I: "التعلم القائم على التجريب", J: "تنظيم الانفعال", K: "العناية بالصحة المهنية", L: "التطوير المهني الذاتي", M: "تشخيص جذور التعثر", N: "رعاية الموهوبين", O: "المساءلة الذاتية", P: "التعلم بالاستقراء", Q: "إدارة الانتباه الإيجابية", R: "الإدارة الصفية الديمقراطية", S: "مجتمعات التعلم المهنية", T: "الشراكة مع الأسرة", U: "الاستجابة الثقافية", V: "الأمانة العلمية", W: "الدافعية الداخلية", X: "الملاحظة الصفية الاستكشافية", Y: "إدارة الضغوط الإدارية", Z: "الاتساق بين المعلن والممارس" };

  function profile(results, open) {              // results: {A: analysis,...}
    const ids = Object.keys(results);
    const done = ids.length;
    if (!done) return null;
    const mat = id => results[id] ? results[id].maturity : null;
    const idxOf = id => results[id] ? results[id].dom : null;
    const wm = list => { const v = list.filter(id => results[id]); const w = sum(v.map(id => PW[id])); return v.length ? r1(sum(v.map(id => mat(id) * PW[id])) / w) : null; };
    const groups = T.groups.map(g => ({ id: g.id, name: g.name, n: g.ids.split("").filter(i => results[i]).length, of: g.ids.length, mean: wm(g.ids.split("")) }));
    const pmi = wm(ids);
    const inv = list => { const m = wm(list); return m === null ? null : r1(100 - m); };
    const indices = {
      pmi, label: MAT_LABEL(pmi),
      rigidity: inv(["A", "B", "C", "L", "F", "H"]),
      burnout: inv(["K", "Y", "J", "W"]),
      exclusion: inv(["E", "G", "M", "N", "F"]),
      accountability: wm(["O", "V", "Z", "E"]),
      relational: wm(["S", "T", "U", "M", "N"])
    };
    const meanFake = r1(mean(ids.map(i => results[i].fake)));
    const meanRel = r1(mean(ids.map(i => results[i].reliability)));
    const lat = { imp: r1(mean(ids.map(i => results[i].lat.imp))), dbl: r1(mean(ids.map(i => results[i].lat.dbl))), li: r2(mean(ids.map(i => results[i].lat.mean))), gap: r2(mean(ids.map(i => results[i].gap))) };

    /* فجوة النظرية-الممارسة من أزواج الاتساق */
    const pairs = [];
    T.pairs.forEach(p => {
      const a = results[p.calm], b = results[p.pressure];
      if (!a || !b || !a.trap || !b.trap) return;
      const gapv = a.trap.idx - b.trap.idx;
      pairs.push({ id: p.id, trait: p.trait, calm: p.calm, pressure: p.pressure, calmIdx: a.trap.idx, pressIdx: b.trap.idx, calmLabel: p.ladder[a.trap.idx], pressLabel: p.ladder[b.trap.idx], gap: gapv });
    });
    const tpg = pairs.length ? r2(mean(pairs.map(p => Math.max(0, p.gap)))) : null;
    const tpgPct = tpg === null ? null : r1(tpg / 3 * 100);
    const tpgLevel = tpg === null ? "غير متاح" : tpg >= 1.2 ? "مرتفعة" : tpg >= 0.6 ? "متوسطة" : "منخفضة";

    /* نقاط القوة والأولويات */
    const rank = ids.map(i => ({ id: i, name: T.models[i].name, m: results[i].maturity, pattern: results[i].pattern }));
    const strengths = rank.slice().sort((a, b) => b.m - a.m).slice(0, 4);
    const prio = rank.map(r => ({ ...r, score: (100 - r.m) * PW[r.id] })).sort((a, b) => b.score - a.score).slice(0, 5)
      .map(r => ({ id: r.id, name: r.name, m: r.m, pattern: r.pattern, path: PATHS[r.id], advice: results[r.id].advice }));

    /* المتلازمات */
    const syndromes = [];
    SYN.forEach(([name, req, cut, desc, path]) => {
      const have = req.filter(id => results[id]);
      if (have.length < Math.min(req.length, 2) || have.length < req.length - 1) return;
      const low = have.filter(id => idxOf(id) <= cut);
      if (low.length === have.length && have.length === req.length) syndromes.push({ name, level: "قوي", models: req, desc, path });
      else if (low.length >= have.length - 1 && low.length >= 2 && mean(have.map(id => results[id].meanIdx)) <= 1.4) syndromes.push({ name, level: "جزئي", models: req, desc, path });
    });
    if (tpg !== null && tpg >= 0.8 && idxOf("Z") !== null) syndromes.push({ name: "التناقض بين المعلن والممارس", level: tpg >= 1.2 ? "قوي" : "جزئي", models: ["Z", "X"], desc: "تنخفض أجوبته تحت الضغط عمّا يعلنه في السياق الهادئ.", path: "مسار: التأمل في الممارسة والملاحظة الصفية المتبادلة." });
    if (meanFake >= 45) syndromes.push({ name: "نمط الاستجابة المُجمَّل", level: meanFake >= 60 ? "قوي" : "جزئي", models: ids, desc: "تتكرر مؤشرات الاتساق المنخفض بين النماذج؛ يُنصح بالتحقق الميداني قبل الاعتماد على النتائج.", path: "مسار: ملاحظة صفية قبل أي قرار." });
    const pos = [];
    if (pmi >= 80 && ids.every(i => results[i].dom >= 2) && meanFake < 30) pos.push({ name: "المربي المتكامل", desc: "نمط ناضج متسق يصلح للإرشاد المهني." });
    if (indices.accountability !== null && indices.accountability >= 75) pos.push({ name: "المسؤولية الذاتية", desc: "تحمّل واضح للمسؤولية وقبول للمساءلة." });

    /* التوقع الكلي */
    const riskOrder = ["rigidity", "burnout", "exclusion"];
    const lbl = { rigidity: "الجمود المهني", burnout: "الاحتراق الوظيفي", exclusion: "إقصاء الطلاب المختلفين أو المتعثرين" };
    const topRisk = riskOrder.map(k => ({ k, v: indices[k] })).filter(x => x.v !== null).sort((a, b) => b.v - a.v)[0];
    const forecastAll = `بحسب ${done} نموذجاً مُنجَزاً من 26، يبلغ مؤشر النضج التربوي ${pmi} (${MAT_LABEL(pmi)}). ` +
      (topRisk ? `أعلى المخاطر المتوقعة: ${lbl[topRisk.k]} (${topRisk.v} من 100). ` : "") +
      (tpg !== null ? `فجوة النظرية والممارسة ${tpgLevel}. ` : "") +
      (meanFake >= 45 ? "تحتاج النتائج إلى تحقق ميداني لانخفاض مؤشر الاتساق. " : "") +
      (done < 26 ? "يتحسن موثوقية الملف بإكمال بقية النماذج." : "الملف مكتمل.");

    /* الجمع بين النص المفتوح والسلوك */
    let openLink = null;
    if (open && open.n) {
      const o = results.O ? results.O.dom : null;
      if (open.extShare >= 0.75 && o !== null && o >= 2) openLink = "الخطاب المفتوح يُسند العقبات إلى الخارج بقوة بينما أجوبته المعلنة تُظهر تحمّلاً للمسؤولية؛ يُنصح بحوار مهني حول ما يمكن ضبطه داخل الصف.";
      else if (open.extShare >= 0.75 && o !== null && o <= 1) openLink = "الإسناد الخارجي في النص المفتوح ينسجم مع نمط إسقاط اللوم في نموذج O.";
      else if (open.extShare < 0.5 && o !== null && o <= 1) openLink = "يتحدث النص المفتوح بلغة المسؤولية الذاتية بينما تظهر أجوبة النموذج O أقل نضجاً؛ يُنصح بمتابعة الاتساق.";
      else openLink = "لا تناقض ظاهراً بين النص المفتوح والإجابات المقيّدة.";
    }
    return { done, groups, indices, meanFake, meanRel, lat, pairs, tpg, tpgPct, tpgLevel, strengths, prio, syndromes, positives: pos, forecast: forecastAll, openLink };
  }

  /* ---------- 6) المصادر ---------- */
  function refsFor(id) { return (T.modelRefs[id] || []).map(k => T.refs[k]).filter(Boolean); }
  function methodRefs() { return T.methodRefs.map(k => T.refs[k]).filter(Boolean); }

  window.TEngine = { CFG, LI_LABEL, LI_KEY, MAT_LABEL, wc, itemWC, calibrate, expected, liClass, scoreRec, analyzeModel, analyzeOpen, profile, refsFor, methodRefs, PATHS };
})();
