/* محرك التحليل (بدون واجهة) — تحليل الزمن، الموثوقية، التنبؤ، والملف الشامل عبر النماذج */
(function (root) {
  /* قيمة كل نمط: 1 = نقطة قوة، 0 = محايد، -1 = يحتاج انتباه */
  const VAL = {
    A: [1, 0, 1, -1], B: [1, 1, 1, 0], C: [1, 0, 0, -1], D: [1, 0, -1, -1], E: [1, 0, 0, 0], F: [1, 0, 0, -1],
    G: [1, 0, -1, 0], H: [1, 0, 0, -1], I: [1, 0, -1, -1], J: [1, 0, -1, -1], K: [1, 0, -1, -1], L: [0, 1, 1, -1],
    M: [0, 1, 1, -1], N: [1, 0, -1, -1], O: [1, 0, -1, -1], P: [1, 0, 0, -1], Q: [1, 1, 1, 1], R: [1, 0, -1, -1],
    S: [1, 0, -1, -1], T: [1, 0, 0, -1], U: [1, 0, -1, 0], V: [1, 0, -1, -1], W: [1, 0, -1, -1], X: [1, -1, -1, -1],
    Y: [1, 0, -1, 0], Z: [1, 0, -1, -1]
  };

  const words = s => (String(s).trim().match(/\S+/g) || []).length;

  /* الزمن المتوقع للقراءة والاختيار (ثوانٍ): يعتمد على طول السؤال والخيارات */
  function expectedSec(q, opts) {
    const w = words(q) + (opts || []).reduce((s, o) => s + words(o), 0);
    return Math.round((1.2 + w * 0.18) * 10) / 10;
  }
  /* تصنيف الزمن: اندفاع (<2ث أو أقل من 35% من المتوقع)، متزن، بطيء جداً (>2.5× المتوقع و≥9ث) */
  function classify(sec, exp) {
    const r = sec / Math.max(exp, 1);
    if (sec < 2 || r < 0.35) return "imp";
    if (r > 2.5 && sec >= 9) return "slow";
    return "bal";
  }
  const CLS_AR = { imp: "اندفاع", bal: "متزن", slow: "بطيء جداً" };

  const THEMES = [
    { k: ["امتحان", "اختبار", "درجة", "درجات", "رسوب"], t: "قلق الامتحانات والدرجات" },
    { k: ["أبي", "ابي", "أمي", "امي", "أهلي", "اهلي", "البيت", "المنزل", "اخي", "أخي"], t: "علاقة البيت والأسرة" },
    { k: ["معلم", "مدرس", "أستاذ", "استاذ", "مدرسة"], t: "العلاقة مع المعلم أو المدرسة" },
    { k: ["ملل", "أمل", "مملة", "ممل"], t: "الملل" },
    { k: ["هاتف", "موبايل", "ألعاب", "العاب", "نت", "يوتيوب", "تيك"], t: "الهاتف والألعاب" },
    { k: ["نوم", "أنام", "انام", "تعب", "تعبان", "صداع", "جوع"], t: "التعب أو النوم" },
    { k: ["صديق", "أصدقاء", "اصدقاء", "وحيد", "وحدة", "تنمر", "يضحكون"], t: "الأصدقاء والعلاقات" },
    { k: ["أفهم", "افهم", "صعب", "صعبة", "فهم", "حفظ"], t: "صعوبة الفهم أو الحفظ" },
    { k: ["خوف", "أخاف", "اخاف", "قلق", "أتوتر", "اتوتر"], t: "الخوف والتوتر" }
  ];
  const RISK_WORDS = ["ضرب", "يضربني", "عنف", "تنمر", "يتنمر", "تحرش", "جوع", "أكره نفسي", "أموت", "انتحار", "أؤذي نفسي", "أخاف من أبي", "أخاف من أمي"];

  function analyze(model, answers, problems) {
    problems = problems || "";
    const id = model.id, val = VAL[id] || [0, 0, 0, 0];
    const raw = [0, 0, 0, 0], w = [0, 0, 0, 0];
    const lat = { imp: 0, bal: 0, slow: 0, n: 0, sum: 0 };
    let timeouts = 0, ideal = 0, scored = 0, fast = null, slow = null;
    const posFreq = [0, 0, 0, 0];

    answers.forEach(a => {
      if (a.pos >= 0) posFreq[a.pos]++;
      if (a.kind === "fast") fast = a; if (a.kind === "slow") slow = a;
      if (a.timeout) timeouts++;
      if (a.type < 0) return;
      let weight = 1;
      if (a.kind === "base" || a.kind === "image") {
        a.cls = classify(a.sec, a.exp || 6);
        lat[a.cls]++; lat.n++; lat.sum += a.sec;
        if (a.cls === "imp") weight = 0.5;
        else if (a.cls === "slow" && val[a.type] === 1) weight = 0.75;   // بطء + اختيار مثالي: وزن أقل
      }
      raw[a.type]++; w[a.type] += weight;
      scored++; if (val[a.type] === 1) ideal++;
    });

    const totW = w.reduce((s, x) => s + x, 0) || 1;
    const pct = w.map(x => Math.round(x / totW * 100));
    const order = [0, 1, 2, 3].sort((a, b) => w[b] - w[a] || a - b);
    const dom = order[0], sec2 = order[1];

    const impS = lat.n ? lat.imp / lat.n : 0, slowS = lat.n ? lat.slow / lat.n : 0;
    const avgSec = lat.n ? Math.round(lat.sum / lat.n * 10) / 10 : 0;
    const idealRate = scored ? ideal / scored : 0;

    /* مقارنة الإجابة السريعة بالمتأنية على السؤال نفسه */
    let dual = { ok: false };
    if (fast && slow && fast.type >= 0 && slow.type >= 0) {
      const d = val[slow.type] - val[fast.type];
      dual = { ok: true, same: fast.type === slow.type, fastType: fast.type, slowType: slow.type,
               shift: fast.type === slow.type ? "none" : (d > 0 ? "slowBetter" : d < 0 ? "fastBetter" : "sideways") };
    }

    /* مؤشر احتمال تجميل الصورة (إرشادي وليس حكماً) */
    let faking = 0;
    if (idealRate >= 0.85) faking += 30; else if (idealRate >= 0.7) faking += 15;
    if (slowS >= 0.3) faking += 20;
    if (dual.ok && dual.shift === "slowBetter") faking += 30;
    if (lat.slow >= 2 && lat.bal >= 2) {
      // هل الإجابات البطيئة أكثر مثالية من المتزنة؟
      const g = x => { const a = answers.filter(q => (q.kind === "base" || q.kind === "image") && q.cls === x && q.type >= 0); return a.length ? a.filter(q => val[q.type] === 1).length / a.length : 0; };
      if (g("slow") - g("bal") >= 0.4) faking += 20;
    }
    faking = Math.min(100, faking);

    const sameSpot = answers.length >= 6 && Math.max.apply(null, posFreq) >= answers.length - 1;
    let reliability = "جيدة", relCode = 2;
    if (impS >= 0.5 || sameSpot) { reliability = "منخفضة (اندفاع أو نمط ضغط واحد)"; relCode = 0; }
    else if (faking >= 60) { reliability = "منخفضة (احتمال تجميل الصورة)"; relCode = 0; }
    else if (faking >= 30 || impS >= 0.3 || timeouts >= 2) { reliability = "متوسطة"; relCode = 1; }

    const clarity = pct[dom] >= 60 ? "واضحة" : pct[dom] >= 43 ? "متوسطة" : "متداخلة مع أنماط أخرى";
    const speedStyle = impS >= 0.4 ? "سريع ومندفع" : slowS >= 0.3 ? "بطيء ومتردد" : avgSec < 4 ? "سريع متزن" : "متأنٍّ متزن";
    const alerts = RISK_WORDS.filter(x => problems.includes(x));
    const themes = THEMES.filter(t => t.k.some(k => problems.includes(k))).map(t => t.t);

    return { raw, pct, dom, sec2, lat: { imp: lat.imp, bal: lat.bal, slow: lat.slow, n: lat.n, avgSec, impS, slowS },
             dual, idealRate, faking, reliability, relCode, clarity, speedStyle, timeouts, alerts, themes, val: val[dom] };
  }

  /* التنبؤ: نمط + زمن + مشاكل مكتوبة */
  function predict(model, an, problems) {
    const T = model.types[an.dom], v = an.val, L = an.lat;
    const out = [];
    out.push(T.p);
    if (v === 1) {
      out.push(L.impS >= 0.3
        ? "التوقع: قدرته جيدة لكن التسرع قد يُضيّع عليه درجات بلا داعٍ؛ يتحسن بعادة المراجعة قبل التسليم."
        : "التوقع: مؤشرات الاستمرار والتفوق جيدة في الأشهر القادمة، والخطر الأكبر هو الملل إن لم يجد تحدياً.");
    } else if (v === 0) {
      out.push("التوقع: لا مؤشر خطر واضح؛ يتأثر أداؤه بطريقة التدريس وبمدى الدعم الذي يتلقاه.");
    } else {
      if (L.slowS >= 0.3 || an.timeouts >= 1) out.push("التوقع: قد يتعثر في الامتحانات المحددة بوقت ويظهر عليه تردد وقلق، ويُرجّح أن يتراجع أداؤه إن لم يُدعم خلال الأشهر القادمة.");
      else if (L.impS >= 0.3) out.push("التوقع: قد يميل إلى الانسحاب أو العناد أو الاستعجال في الحل؛ تنفع معه جلسة حوار هادئة وتدريب على التمهل.");
      else out.push("التوقع: إن لم يُعالج السبب فقد تتكرر المشكلة وتتسع؛ يُنصح بحوار مع المعلم أو المرشد خلال أسابيع.");
    }
    if (an.themes.length) out.push("ما كتبه الطالب يشير إلى: " + an.themes.join("، ") + " — وهذا يدعم قراءة النتيجة أعلاه ويحتاج متابعة مباشرة.");
    return out.join(" ");
  }

  function reportText(model, an, problems) {
    const D = model.types[an.dom], S = model.types[an.sec2];
    const L = an.lat;
    let t = `النمط الغالب: ${D.n} (${an.pct[an.dom]}%) — وضوح ${an.clarity}. `;
    if (an.pct[an.sec2] >= 25) t += `النمط الثاني: ${S.n} (${an.pct[an.sec2]}%). `;
    t += `${D.d} `;
    t += `تحليل الزمن: ${L.imp} اندفاع، ${L.bal} متزن، ${L.slow} بطيء جداً من ${L.n} (متوسط ${L.avgSec}ث) — النمط: ${an.speedStyle}. `;
    if (an.dual.ok) t += an.dual.same ? "الإجابة السريعة والمتأنية على السؤال المزدوج متطابقة (اتساق). "
      : `اختلفت الإجابة السريعة (${model.types[an.dual.fastType].n}) عن المتأنية (${model.types[an.dual.slowType].n})` +
        (an.dual.shift === "slowBetter" ? " وهي أقرب للصورة المثالية عند التأني (مؤشر احتمال تجميل). " : an.dual.shift === "fastBetter" ? " والعفوية كانت أفضل من التأني. " : ". ");
    t += `مؤشر احتمال تجميل الصورة: ${an.faking}/100. الموثوقية: ${an.reliability}. `;
    t += predict(model, an, problems);
    if (an.alerts.length) t += ` ⚠ تنبيه للمرشد: ورد في كلام الطالب ما يستدعي المتابعة (${an.alerts.join("، ")}).`;
    t += " (مؤشر تربوي إرشادي وليس تشخيصاً نفسياً.)";
    return t;
  }

  /* ===== الملف الشامل عبر النماذج ===== */
  const NAMES = { A: "التفكير", B: "الذكاء", C: "المنطق", D: "الكسل", E: "الفلسفة", F: "المنطق الفطري", G: "المنطق الرياضي", H: "السرعة", I: "اكتشاف المشكلة",
    J: "الاستقراء", K: "الاستدلال", L: "الحفظ", M: "الذاكرة", N: "الغضب", O: "المعلم", P: "الشغف", Q: "المهارة", R: "الفضول", S: "التركيز", T: "المساعدة",
    U: "الأنانية", V: "التلقين", W: "الصعوبة", X: "الخوف", Y: "التجارب", Z: "البيت" };
  const has = (D, id, arr) => D[id] !== undefined && arr.includes(D[id]);
  const RULES = [
    { t: "ضعف التذكر قد يكون سببه التشتت", f: D => (has(D, "L", [3]) || has(D, "M", [0, 3])) && has(D, "S", [2, 3]),
      m: "تعثر الحفظ أو الذاكرة يظهر مع تشتت التركيز؛ الأرجح أن المشكلة في الانتباه والنوم لا في قدرة الذاكرة. ابدأ بتحسين التركيز قبل أي خطة حفظ." },
    { t: "خوف مرتبط بضغط البيت", f: D => has(D, "X", [1, 2, 3]) && has(D, "Z", [2, 3]),
      m: "الخوف عند الطالب يتزامن مع بيئة ضاغطة أو ضعيفة الدعم؛ يفيد التواصل مع الأهل بأسلوب يخفف المقارنة والعقاب." },
    { t: "التلقين وأسلوب المعلم يصنعان تعلماً سطحياً", f: D => has(D, "V", [1, 2, 3]) && has(D, "O", [1, 2]),
      m: "اعتياد الحفظ مع نظرة إلى المعلم كمصدر معلومات أو سلطة يشير إلى بيئة صفية تلقينية؛ جرّب أسئلة مفتوحة ومهام تطبيقية قصيرة." },
    { t: "ذكي لكنه مملول", f: D => has(D, "D", [1]) && (has(D, "W", [0]) || has(D, "R", [0]) || has(D, "A", [0]) || has(D, "B", [0])),
      m: "الكسل هنا ملل معرفي مع قدرة جيدة؛ ينفع تحدٍّ إضافي ومشروع بحثي صغير بدل العقاب." },
    { t: "تمرد كردّ فعل", f: D => has(D, "N", [3]) && (has(D, "O", [3]) || has(D, "Z", [2, 3])),
      m: "السلوك المتمرد يبدو مرتبطاً بعلاقة متوترة بالمعلم أو ببيئة البيت؛ ابدأ بجلسة استماع قبل أي إجراء انضباطي." },
    { t: "قدرة جيدة يضيعها التسرع", f: D => has(D, "H", [1]) && (has(D, "G", [0]) || has(D, "A", [0]) || has(D, "C", [0])),
      m: "منطق جيد مع اندفاع في الحل؛ يُتوقع فقدان درجات في الامتحانات، ويفيد تدريبه على قائمة مراجعة قصيرة." },
    { t: "قلة الفرص وليست قلة القدرة", f: D => has(D, "Y", [3]) && has(D, "Z", [3]),
      m: "قلة التجارب مع بيئة قليلة الدعم؛ وفّر له تجارب بسيطة داخل المدرسة قبل الحكم على قدراته." },
    { t: "قلق امتحان", f: D => has(D, "X", [3]) && has(D, "H", [2, 3]),
      m: "خوف من الدرجات مع بطء أو تردد في الحل؛ يتوقع أن يظلم نفسه في الامتحانات المحددة بوقت." },
    { t: "فضول مكبوت", f: D => has(D, "R", [2]) && (has(D, "O", [2]) || has(D, "X", [1, 2])),
      m: "لديه أسئلة لا يطرحها خوفاً؛ اجعل الأسئلة آمنة ومقبولة (صندوق أسئلة مجهول مثلاً)." },
    { t: "اعتمادية وتجنب للصعب", f: D => has(D, "T", [2]) && has(D, "W", [1, 2]),
      m: "يطلب المساعدة سريعاً ويتجنب الصعب؛ درّبه على محاولة أولى مستقلة بمهام قصيرة تضمن له نجاحاً." },
    { t: "غضب مكتوم مع خوف", f: D => has(D, "N", [2]) && has(D, "X", [1, 2, 3]),
      m: "كتمان الغضب مع الخوف قد يظهر لاحقاً كانسحاب أو انفجار؛ يحتاج شخصاً يستمع إليه." },
    { t: "بنية استدلالية قوية", f: D => has(D, "A", [0]) && has(D, "C", [0]) && has(D, "K", [0]),
      m: "تفكير تحليلي ومنطق واستدلال بالدليل؛ مرشح لمسارات إثرائية ومشاريع بحثية." }
  ];

  function cross(results) {
    const D = {}, ids = Object.keys(results);
    ids.forEach(i => D[i] = results[i].dom);
    const strengths = [], attention = [];
    ids.forEach(i => {
      const v = (VAL[i] || [])[D[i]];
      const label = `${NAMES[i]}: ${results[i].domName}`;
      if (v === 1) strengths.push(label); else if (v === -1) attention.push(label);
    });
    const causes = RULES.filter(r => r.f(D)).map(r => ({ title: r.t, msg: r.m }));
    const low = ids.filter(i => results[i].relCode === 0).map(i => NAMES[i]);
    return { done: ids.length, strengths, attention, causes, lowReliability: low,
             summary: `أُنجز ${ids.length} من 26 نموذجاً. نقاط القوة: ${strengths.length}، نقاط تحتاج انتباه: ${attention.length}، أسباب جذرية محتملة: ${causes.length}.` };
  }

  root.SDEngine = { VAL, NAMES, expectedSec, classify, CLS_AR, analyze, predict, reportText, cross };
  if (typeof module !== "undefined") module.exports = root.SDEngine;
})(typeof window !== "undefined" ? window : globalThis);
