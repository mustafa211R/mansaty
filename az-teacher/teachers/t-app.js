/* واجهة نماذج المعلمين T-AZ — رسمية. تعتمد: TSPEC, TQ, TScenes, TEngine */
(function () {
  const T = window.TSPEC, E = window.TEngine, Q = window.TQ;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = "taz_state_v1", QKEY = "taz_queue_v1";
  const KIND = { base: "موقف مهني", trap: "موقف مهني", fast: "استجابة سريعة", slow: "تأمّل", visual: "مشهد صفي" };
  const CLS_COL = ["#9b3a3a", "#c98a2b", "#5b7aa6", "#7a8aa6", "#6b4f7a"];
  const MAT_COL = m => m >= 80 ? "#2f6b4f" : m >= 60 ? "#5b7aa6" : m >= 40 ? "#c98a2b" : "#9b3a3a";

  let root, cfg, S;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function uuid() { try { return crypto.randomUUID(); } catch (e) { return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); } }
  function fresh() { return { v: 1, consent: false, teacher: null, warm: null, rho: null, results: {}, raw: {}, open: null, openText: "", log: [] }; }

  /* ---------- الإرسال مع التحقق ---------- */
  async function sendPayload(ep, payload) {
    try {
      const r = await fetch(ep, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const txt = await r.text();
      let j = null; try { j = JSON.parse(txt); } catch (e) { }
      if (j && j.ok) return { state: "ok", detail: j };
      if (j) return { state: "server", detail: j.error || "رفض الخادم الطلب" };
      if (/<html/i.test(txt)) return { state: "html", detail: "الرابط لا يشير إلى تطبيق ويب صالح (تحقّق أنه ينتهي بـ /exec وأن الوصول لـ «أي شخص»)" };
      return { state: "unverified", detail: "ردّ غير مفهوم" };
    } catch (e) { return { state: "net", detail: String(e && e.message || e) }; }
  }
  function queue() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch (e) { return []; } }
  function setQueue(q) { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch (e) { } }
  function setStatus(t) { const s = $(".t-status", root); if (s) s.textContent = t || ""; }
  async function flush() {
    if (!cfg.endpoint) { setStatus("تنبيه: لم يُضبط رابط الإرسال؛ النتائج محفوظة في هذا المتصفح فقط."); return; }
    let q = queue(); if (!q.length) return;
    const left = []; let ok = 0, last = "";
    for (const p of q) { const r = await sendPayload(cfg.endpoint, p); if (r.state === "ok") ok++; else { left.push(p); last = r.detail; } }
    setQueue(left);
    setStatus(left.length ? `تعذّر إرسال ${left.length} سجل (${last}). سيُعاد المحاولة تلقائياً.` : `تم تأكيد استلام ${ok} سجل لدى الخادم.`);
  }
  function enqueue(p) { const q = queue(); q.push(p); setQueue(q); flush(); }

  /* ---------- هيكل الصفحة ---------- */
  function shell(inner, opts) {
    opts = opts || {};
    root.innerHTML = `<div class="t-top"><b>منظومة T-AZ لتشخيص الممارسة التربوية للمعلم</b><span>${S.teacher ? "المعلم: " + esc(S.teacher.code || S.teacher.id.slice(0, 8)) : "الإصدار " + T.version}</span></div><div class="t-wrap">${inner}</div><div class="t-foot">الاستخدام لأغراض التطوير المهني، لا لتقييم الأداء الوظيفي أو القرارات الإدارية الفردية. المصادر والمنهجية في صفحة «المنهجية والمراجع».</div><div class="t-status"></div>`;
    if (opts.noStatus) $(".t-status", root).style.display = "none";
  }
  const nav = (cur) => `<div class="t-row t-noprint" style="margin-bottom:16px"><button class="t-btn alt" data-go="hub">لوحة النماذج</button><button class="t-btn alt" data-go="profile">الملف الشامل</button><button class="t-btn alt" data-go="open">السؤال المفتوح</button><button class="t-btn alt" data-go="method">المنهجية والمراجع</button></div>`;
  function bindNav() { root.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go)); }
  function go(v, a) { ({ consent, form, warm: warmScreen, hub, intro, open: openScreen, profile: profileScreen, method: methodScreen, report: reportScreen })[v](a); bindNav(); window.scrollTo && window.scrollTo(0, 0); flush(); }

  /* ---------- 1) الموافقة ---------- */
  function consent() {
    shell(`<h1>إشعار الموافقة على المشاركة</h1>
    <div class="t-card"><p>تقيس هذه المنظومة أنماط الممارسة التربوية عبر ستة وعشرين نموذجاً قصيراً (T-A إلى T-Z) تتضمن مواقف صفية ومشاهد تفسيرية. نرجو قراءة ما يأتي قبل البدء:</p>
    <ul class="t-ul">
    <li><b>ما الذي يُسجَّل:</b> اختياراتك، والزمن المستغرق في كل سؤال، وما إذا غادرتَ الصفحة أثناء الإجابة، ومعلومات مهنية عامة (التخصص والمرحلة والمدرسة).</li>
    <li><b>لماذا يُسجَّل الزمن:</b> لاستخدامه مؤشراً مساعداً على أسلوب المعالجة (سرعة بديهية أو تأمل)؛ وهو مؤشر ظنّي لا يُثبت صدقاً ولا كذباً، ولا يُستعمل وحده للحكم.</li>
    <li><b>الخصوصية:</b> لا يُطلب الاسم؛ يُعرَّف بمعرّف مستعار ويُشفَّر عند الخادم. لا يطّلع على تقريرك الفردي سواك، وتُجمَّع النتائج على مستوى المدرسة بعدد لا يقل عن ثلاثة معلمين.</li>
    <li><b>الغرض:</b> التطوير المهني والتدريب المخصَّص، وليس تقييم الأداء أو المساءلة الإدارية.</li>
    <li><b>الطوعية:</b> المشاركة اختيارية ولك التوقف في أي وقت، وطلب حذف بياناتك عبر الجهة المنفِّذة.</li>
    <li><b>الإيقاع المقترح:</b> نموذجان في الأسبوع على الأكثر، تفادياً للإجهاد وتحسيناً لجودة الإجابة.</li></ul>
    <div class="t-note">لا توجد إجابات «صحيحة» أو «خاطئة» بالمعنى الحرفي؛ المطلوب أن تختار ما تفعله فعلاً أو ما أقرب إلى ما تفعله، لا ما تظنه المثالي.</div>
    <label><input type="checkbox" id="ck"> قرأتُ ما سبق وأوافق على المشاركة.</label><div style="margin-top:14px"><button class="t-btn" id="go" disabled>متابعة</button></div></div>`, { noStatus: true });
    $("#ck").onchange = e => $("#go").disabled = !e.target.checked;
    $("#go").onclick = () => { S.consent = true; save(); go("form"); };
  }

  /* ---------- 2) بيانات المعلم ---------- */
  function form() {
    const u = cfg.user || {};
    shell(`<h1>بيانات مهنية عامة</h1><div class="t-card t-form"><label>رمز المعلم (اختياري، إن زوّدتك الجهة به)</label><input id="code" value="${esc(u.code || "")}">
    <label>التخصص الدراسي</label><input id="spec" value="${esc(u.specialization || "")}" placeholder="مثال: رياضيات، لغة عربية، فيزياء">
    <label>المرحلة التي تدرّسها</label><select id="stage"><option>ابتدائي</option><option>متوسط</option><option>إعدادي</option></select>
    <label>المدرسة (اختياري؛ تُستخدم للتجميع على مستوى المدرسة فقط)</label><input id="school" value="${esc(u.school || "")}">
    <label>سنوات الخدمة</label><select id="yrs"><option>أقل من 5</option><option>5 – 10</option><option>11 – 20</option><option>أكثر من 20</option></select>
    <div style="margin-top:16px"><button class="t-btn" id="go">متابعة إلى فقرتي الإحماء</button></div></div>`, { noStatus: true });
    $("#go").onclick = () => {
      const spec = $("#spec").value.trim(); if (!spec) { $("#spec").focus(); return; }
      S.teacher = { id: (u.id || uuid()), code: $("#code").value.trim(), spec, stage: $("#stage").value, school: $("#school").value.trim(), yrs: $("#yrs").value };
      save(); go("warm");
    };
  }

  /* ---------- محرك السؤال ---------- */
  function seededShuffle(n, seed) { const a = [...Array(n).keys()]; let s = seed; for (let i = n - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) % 4294967296; const j = s % (i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function runItems(items, mkItem, onDone, headHtml) {
    let i = 0; const recs = [];
    function next() {
      if (i >= items.length) return onDone(recs);
      const it = items[i], d = mkItem(it, i);
      const order = d.fixed ? [0, 1, 2, 3] : seededShuffle(4, (S.teacher.id.length * 7919 + i * 104729 + (d.seed || 0)) >>> 0);
      const scene = d.scene ? `<div class="t-scene">${window.TScenes.svg(d.scene)}</div>` : "";
      const cue = d.cue ? `<div class="t-cue"><i></i></div>` : "";
      shell(`${headHtml || ""}<div class="t-prog"><i style="width:${(i / items.length * 100).toFixed(1)}%"></i></div><span class="t-kind">${esc(d.kindLabel)}</span><span class="t-k"> — ${i + 1} من ${items.length}</span>${d.hint ? `<div class="t-note">${esc(d.hint)}</div>` : ""}${scene}${cue}<div class="t-q">${esc(it.q)}</div>${order.map((oi, p) => `<button class="t-opt" data-p="${p}"><kbd>${p + 1}</kbd><span>${esc(it.o[oi])}</span></button>`).join("")}`, { noStatus: true });
      const t0 = performance.now(); let hidden = 0, hs = null;
      const vis = () => { if (document.hidden) hs = performance.now(); else if (hs) { hidden += performance.now() - hs; hs = null; } };
      document.addEventListener("visibilitychange", vis);
      if (d.cue) { const bar = $(".t-cue i", root); bar.style.transition = `width ${d.cue}s linear`; requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = "0%")); }
      let done = false;
      const pick = p => {
        if (done) return; done = true;
        const t = (performance.now() - t0) / 1000;
        document.removeEventListener("visibilitychange", vis); document.removeEventListener("keydown", key);
        recs.push({ k: d.k, idx: order[p], pos: p, t: Math.round(t * 100) / 100, wc: E.itemWC(it), hid: hidden / 1000 > E.CFG.hiddenCut, pair: it.pair || null, ctx: it.ctx || null, i });
        i++; shell(`<div class="t-lead" style="padding:60px 0;text-align:center">…</div>`, { noStatus: true }); setTimeout(next, 450);
      };
      const key = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= 4) pick(n - 1); };
      document.addEventListener("keydown", key);
      root.querySelectorAll(".t-opt").forEach(b => b.onclick = () => pick(+b.dataset.p));
    }
    next();
  }

  /* ---------- 3) الإحماء ---------- */
  function warmScreen() {
    if (S.warm) return go("hub");
    shell(`<h1>فقرتان تمهيديتان</h1><div class="t-card"><p>فقرتان قصيرتان محايدتان لضبط سرعة قراءتك الطبيعية. أجب بالطريقة التي تقرأ بها عادةً، دون استعجال أو إبطاء متعمد. يمكنك الاختيار بالفأرة أو بالأرقام 1–4.</p><button class="t-btn" id="go">ابدأ</button></div>`, { noStatus: true });
    $("#go").onclick = () => runItems(T.warm, (it, i) => ({ k: "warm", kindLabel: "تمهيد", fixed: true, seed: 0 }), recs => {
      const w = recs.map((r, i) => ({ t: r.t, wc: r.wc, ok: T.warm[i].ok >= 0 ? r.idx === T.warm[i].ok : null }));
      const cal = E.calibrate(w); S.warm = w; S.rho = cal.rho; S.calNote = cal.note; save(); go("hub");
    });
  }

  /* ---------- 4) لوحة النماذج ---------- */
  function hub() {
    if (!S.warm) return go("warm");
    const n = Object.keys(S.results).length;
    const today = Object.values(S.results).filter(r => r.at && new Date(r.at).toDateString() === new Date().toDateString()).length;
    shell(`${nav()}<h1>لوحة النماذج</h1><p class="t-lead">أُنجز ${n} من 26 نموذجاً. كل نموذج نحو خمس دقائق.${S.calNote ? " " + esc(S.calNote) : ""}</p>
    ${today >= 2 ? `<div class="t-note">أنجزتَ ${today} نماذج اليوم. يُقترح الاكتفاء بنموذجين في اليوم الواحد والعودة لاحقاً حفاظاً على جودة الإجابة.</div>` : ""}
    ${T.groups.map(g => `<div class="t-card"><h3>المجموعة ${g.id}: ${esc(g.name)}</h3><div class="t-grid">${g.ids.split("").map(id => `<button class="t-tile ${S.results[id] ? "done" : ""}" data-m="${id}"><b>T-${id}</b><small>${esc(T.models[id].name)}</small></button>`).join("")}</div></div>`).join("")}`);
    root.querySelectorAll("[data-m]").forEach(b => b.onclick = () => S.results[b.dataset.m] ? go("report", b.dataset.m) : go("intro", b.dataset.m));
  }

  /* ---------- 5) مقدمة النموذج والاختبار ---------- */
  function intro(id) {
    const M = T.models[id];
    shell(`${nav()}<h1>T-${id} — ${esc(M.name)}</h1><div class="t-card"><p>${esc(M.goal)}</p><ul class="t-ul"><li>عشرة أسئلة: مواقف مهنية، وأسئلة سريعة تُجاب بالحدس، وأسئلة تأمّلية، ومشهد صفي.</li><li>في السؤال السريع يظهر شريط زمني إرشادي (٥ ثوانٍ) دون إيقاف السؤال.</li><li>في السؤال التأملي خذ وقتك.</li><li>اختر ما تفعله فعلاً، لا ما تراه المثالي.</li></ul><button class="t-btn" id="go">بدء النموذج</button></div>`);
    $("#go").onclick = () => startModel(id);
  }
  function startModel(id) {
    const items = Q[id];
    const t0 = Date.now();
    runItems(items, (it, i) => ({
      k: it.k, kindLabel: KIND[it.k], scene: it.scene, cue: it.k === "fast" ? 5 : 0, seed: id.charCodeAt(0) * 31,
      hint: it.k === "fast" ? "سؤال سريع: أجب بما يخطر لك أولاً." : it.k === "slow" ? "سؤال تأمّلي: تمهّل في التفكير قبل الاختيار." : it.k === "visual" ? "انظر إلى المشهد ثم اختر ما يخطر لك أولاً." : ""
    }), recs => {
      const an = E.analyzeModel(id, recs, S.rho);
      an.at = Date.now(); an.totalSec = Math.round((Date.now() - t0) / 1000);
      S.results[id] = an; S.raw[id] = recs; save();
      const T_ = S.teacher;
      enqueue({
        action: "t_save", id: id + "|" + T_.id + "|" + an.at, model: id, teacherId: T_.id, code: T_.code, spec: T_.spec, stage: T_.stage, school: T_.school, yrs: T_.yrs,
        rho: S.rho, totalSec: an.totalSec, meanLI: an.lat.mean, patternIdx: an.dom, pattern: an.pattern, dist: an.dist, maturity: an.maturity, fake: an.fake, reliability: an.reliability,
        imp: an.lat.imp, dbl: an.lat.dbl, gap: an.gap, flags: an.flags.join(" | "), answers: an.recs, forecast: an.forecast, ts: new Date(an.at).toISOString()
      });
      go("report", id);
    }, `<div class="t-top" style="margin:-26px -28px 18px;padding:8px 24px;font-size:.85rem"><span>T-${id} — ${esc(T.models[id].name)}</span></div>`);
  }

  /* ---------- 6) تقرير النموذج ---------- */
  function gaugeSVG(v, col) {
    const r = 70, c = Math.PI * r, off = c * (1 - v / 100);
    return `<svg viewBox="0 0 180 110" width="220"><path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="#ece7d6" stroke-width="14"/><path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${c}" stroke-dashoffset="${off}"/><text x="90" y="86" text-anchor="middle" font-size="30" font-family="Amiri,serif" fill="#14213d">${Math.round(v)}</text><text x="90" y="104" text-anchor="middle" font-size="10" fill="#5d6778">مؤشر النضج من 100</text></svg>`;
  }
  function bars(vals, labels, cols) { return `<div class="t-bars">${vals.map((v, i) => `<div class="r"><span>${esc(labels[i])}</span><div class="b"><i style="width:${Math.min(100, v)}%;background:${cols[i]}"></i></div><span>${v}%</span></div>`).join("")}</div>`; }
  function strip(recs) {
    return `<div class="t-strip">${recs.map((r, i) => `<div title="${esc(r.k)}: ${r.t}ث" style="height:${Math.max(6, Math.min(100, r.li / 3 * 100))}%;background:${r.hid ? "#bbb" : CLS_COL[r.cls]}"></div>`).join("")}</div><div class="t-leg">${E.LI_LABEL.map((l, i) => `<span><i style="background:${CLS_COL[i]}"></i>${l}</span>`).join("")}<span><i style="background:#bbb"></i>منقطع</span></div>`;
  }
  function reportScreen(id) {
    const a = S.results[id], M = T.models[id], P = M.P;
    const cons = 100 - a.fake;
    const pat = P.map((p, i) => ({ ...p, i }));
    shell(`${nav()}<h1>تقرير T-${id}: ${esc(M.name)}</h1><p class="t-lead">${esc(M.goal)}</p>
    <div class="t-card"><h3>النتيجة العامة</h3><div class="t-row" style="align-items:center">${gaugeSVG(a.maturity, MAT_COL(a.maturity))}<div style="flex:1;min-width:230px"><p><b>النمط الغالب:</b> ${esc(a.pattern)} <span class="t-tag">${a.maturityLabel}</span></p><p>${esc(a.patternDesc)}</p></div></div></div>
    <div class="t-card"><h3>توزيع الإجابات على الأنماط الأربعة</h3>${bars(a.pct, P.map(p => p.n), ["#9b3a3a", "#c98a2b", "#5b7aa6", "#2f6b4f"])}<p class="t-k">الأوزان تأخذ زمن الاستجابة في الاعتبار؛ والتعادل يُحسم للنمط الأدنى تحفظاً.</p></div>
    <div class="t-card"><h3>أسلوب الاستجابة الزمني</h3><div class="t-stats"><div class="t-stat"><b>${a.lat.mean}</b><span>متوسط مؤشر الزمن LI (1.0 = متوقَّع)</span></div><div class="t-stat"><b>${a.lat.imp}%</b><span>استجابات متسرعة</span></div><div class="t-stat"><b>${a.lat.dbl}%</b><span>استجابات متأنية جداً</span></div><div class="t-stat"><b>${a.gap > 0 ? "+" : ""}${a.gap}</b><span>الفرق: تأمّلي − سريع (على مقياس 0–3)</span></div></div>${strip(a.recs)}<p class="t-k">كل عمود سؤال بحسب ترتيب ظهوره؛ ارتفاع العمود نسبة زمنك إلى المتوقع لقراءتك.</p></div>
    <div class="t-card"><h3>اتساق الاستجابة وموثوقية القراءة</h3><div class="t-stats"><div class="t-stat"><b>${cons}</b><span>مؤشر الاتساق من 100</span></div><div class="t-stat"><b>${a.reliability}</b><span>موثوقية القراءة (${a.relLabel})</span></div><div class="t-stat"><b>${Math.round(a.consistency * 100)}%</b><span>الاتساق الداخلي بين الأسئلة</span></div></div>
    ${a.flags.length ? `<ul class="t-ul">${a.flags.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : `<p>لا مؤشرات تستدعي التنبيه.</p>`}<div class="t-note">هذه المؤشرات إرشادية ولا تُعدّ حكماً على صدقك؛ تتأثر بالتعب والغرض من الإجابة وطريقة قراءتك.</div></div>
    <div class="t-card"><h3>التوقع</h3><p>${esc(a.forecast)}</p><h3 style="margin-top:14px">التوصية التدريبية</h3><p>${esc(a.advice)}</p></div>
    <div class="t-card"><h3>المصادر العلمية لهذا النموذج</h3>${E.refsFor(id).map(r => `<p class="t-ref">${esc(r)}</p>`).join("")}</div>
    <div class="t-row t-noprint"><button class="t-btn" onclick="window.print()">طباعة / حفظ PDF</button><button class="t-btn alt" data-go="hub">العودة إلى اللوحة</button></div>`);
  }

  /* ---------- 7) السؤال المفتوح ---------- */
  function openScreen() {
    shell(`${nav()}<h1>سؤال مفتوح</h1><div class="t-card t-form"><p class="t-q" style="font-size:1.2rem">${esc(T.open)}</p><textarea id="tx" placeholder="اكتب بحرية وبإيجاز">${esc(S.openText || "")}</textarea><div class="t-note">لا تذكر أسماء أشخاص. يُحلَّل النص آلياً لاستخراج المحاور ونمط الإسناد، ولا يُقرأ بوصفه حكماً.</div><button class="t-btn" id="go">حفظ وتحليل</button></div>${S.open ? `<div class="t-card"><h3>تحليل الإجابة</h3><p>${esc(S.open.summary)}</p>${S.open.themes.length ? bars(S.open.themes.slice(0, 5).map(t => Math.min(100, t.hits * 25)), S.open.themes.slice(0, 5).map(t => t.label), S.open.themes.slice(0, 5).map(() => "#5b7aa6")) : ""}</div>` : ""}`);
    $("#go").onclick = () => { S.openText = $("#tx").value; S.open = E.analyzeOpen(S.openText); save(); sendProfile(); openScreen(); bindNav(); };
  }

  /* ---------- 8) الملف الشامل ---------- */
  function sendProfile() {
    const p = E.profile(S.results, S.open); if (!p) return; const T_ = S.teacher;
    enqueue({ action: "t_profile", id: "P|" + T_.id + "|" + p.done + "|" + (S.openText || "").length, teacherId: T_.id, code: T_.code, spec: T_.spec, stage: T_.stage, school: T_.school, yrs: T_.yrs, done: p.done, pmi: p.indices.pmi, groups: p.groups.map(g => g.mean), indices: p.indices, meanFake: p.meanFake, meanRel: p.meanRel, tpg: p.tpg, syndromes: p.syndromes.map(s => s.name + ":" + s.level), results: Object.fromEntries(Object.entries(S.results).map(([k, v]) => [k, v.dom])), maturities: Object.fromEntries(Object.entries(S.results).map(([k, v]) => [k, v.maturity])), open: S.openText, openAnalysis: S.open ? S.open.summary : "", forecast: p.forecast, ts: new Date().toISOString() });
  }
  function profileScreen() {
    const p = E.profile(S.results, S.open);
    if (!p) { shell(`${nav()}<div class="t-card"><p>أكمل نموذجاً واحداً على الأقل لتظهر نتيجة الملف الشامل.</p></div>`); return; }
    const I = p.indices, iv = v => v === null ? "—" : v;
    shell(`${nav()}<h1>الملف التربوي الشامل</h1><p class="t-lead">استناداً إلى ${p.done} من 26 نموذجاً. ${p.done < 13 ? "الملف أولي؛ يزداد ثباتاً بإكمال بقية النماذج." : ""}</p>
    <div class="t-card"><h3>المؤشرات الرئيسة</h3><div class="t-stats"><div class="t-stat"><b>${iv(I.pmi)}</b><span>مؤشر النضج التربوي (${esc(I.label)})</span></div><div class="t-stat"><b>${iv(I.rigidity)}</b><span>خطر الجمود المهني</span></div><div class="t-stat"><b>${iv(I.burnout)}</b><span>خطر الاحتراق الوظيفي</span></div><div class="t-stat"><b>${iv(I.exclusion)}</b><span>خطر إقصاء الطلاب</span></div><div class="t-stat"><b>${iv(I.accountability)}</b><span>المساءلة الذاتية</span></div><div class="t-stat"><b>${p.tpg === null ? "—" : p.tpgPct + "%"}</b><span>فجوة النظرية والممارسة (${p.tpgLevel})</span></div></div><p>${esc(p.forecast)}</p></div>
    <div class="t-card"><h3>المجموعات الأربع</h3>${bars(p.groups.map(g => g.mean || 0), p.groups.map(g => g.name + " (" + g.n + "/" + g.of + ")"), p.groups.map(g => MAT_COL(g.mean || 0)))}</div>
    <div class="t-card"><h3>نضج النماذج الستة والعشرين</h3>${(() => { const d = T.ids.split("").filter(i => S.results[i]); return bars(d.map(i => S.results[i].maturity), d.map(i => "T-" + i + " " + T.models[i].name), d.map(i => MAT_COL(S.results[i].maturity))); })()}</div>
    <div class="t-card"><h3>نقاط القوة</h3><ul class="t-ul">${p.strengths.map(s => `<li><b>${esc(s.name)}</b> — ${esc(s.pattern)} (${s.m}%)</li>`).join("")}</ul></div>
    <div class="t-card"><h3>أولويات التطوير والمسارات التدريبية</h3><table class="t-tbl"><tr><th>النموذج</th><th>النمط الحالي</th><th>المسار المقترح</th></tr>${p.prio.map(r => `<tr><td>T-${r.id} ${esc(r.name)}</td><td>${esc(r.pattern)} (${r.m}%)</td><td>${esc(r.path)} — ${esc(r.advice)}</td></tr>`).join("")}</table></div>
    <div class="t-card"><h3>المتلازمات المهنية المرصودة</h3>${p.syndromes.length ? p.syndromes.map(s => `<p><b>${esc(s.name)}</b><span class="t-tag ${s.level === "قوي" ? "strong" : "part"}">${s.level}</span><br>${esc(s.desc)}<br><span class="t-k">${esc(s.path)}</span></p>`).join("") : `<p>لا متلازمات سلبية مرصودة ضمن النماذج المنجزة.</p>`}${p.positives.map(s => `<p><b>${esc(s.name)}</b><span class="t-tag">إيجابي</span><br>${esc(s.desc)}</p>`).join("")}</div>
    <div class="t-card"><h3>أزواج الاتساق: الهدوء مقابل الضغط</h3>${p.pairs.length ? `<table class="t-tbl"><tr><th>السمة</th><th>في السياق الهادئ</th><th>تحت الضغط</th><th>الفرق</th></tr>${p.pairs.map(x => `<tr><td>${esc(x.trait)}</td><td>${esc(x.calmLabel)} (T-${x.calm})</td><td>${esc(x.pressLabel)} (T-${x.pressure})</td><td>${x.gap > 0 ? "−" + x.gap : x.gap < 0 ? "+" + (-x.gap) : "0"}</td></tr>`).join("")}</table>` : `<p>تظهر عندما يكتمل طرفا الزوج (مثل T-A وT-D).</p>`}</div>
    <div class="t-card"><h3>مؤشرات الاستجابة الإجمالية</h3><div class="t-stats"><div class="t-stat"><b>${p.lat.li}</b><span>متوسط LI</span></div><div class="t-stat"><b>${p.lat.imp}%</b><span>متسرعة</span></div><div class="t-stat"><b>${p.lat.dbl}%</b><span>متأنية جداً</span></div><div class="t-stat"><b>${p.meanFake}</b><span>متوسط مؤشر التجميل</span></div><div class="t-stat"><b>${p.meanRel}</b><span>متوسط الموثوقية</span></div></div></div>
    ${S.open ? `<div class="t-card"><h3>النص المفتوح</h3><p>${esc(S.open.summary)}</p><p>${esc(p.openLink || "")}</p></div>` : ""}
    <div class="t-row t-noprint"><button class="t-btn" onclick="window.print()">طباعة / حفظ PDF</button></div>`);
  }

  /* ---------- 9) المنهجية والمراجع ---------- */
  function methodScreen() {
    const all = new Set(T.methodRefs); Object.values(T.modelRefs).forEach(a => a.forEach(k => all.add(k)));
    shell(`${nav()}<h1>المنهجية والمراجع</h1>
    <div class="t-card"><h3>الإطار</h3><p>تستند المنظومة إلى ورقة «النموذج T-AZ»: ستة وعشرون نموذجاً فرعياً في أربع مجموعات، ولكل نموذج أربعة أنماط متدرجة النضج (من 0 إلى 3). تُستخلص النتيجة من أسئلة مواقف، وأسئلة سريعة، وأسئلة تأمّلية، ومشهد تفسيري، مع فقرتين تمهيديتين لقياس القراءة الطبيعية.</p></div>
    <div class="t-card"><h3>مؤشر زمن الاستجابة</h3><p>LI = الزمن الفعلي ÷ الزمن المتوقع، والمتوقع = سرعة القراءة المعيارية (من الفقرتين التمهيديتين) × عدد كلمات السؤال. الحدود المعتمدة: أقل من 0.45 اندفاعي، 0.45–0.75 انتقالي سريع، 0.75–1.35 متوازن، 1.35–1.85 انتقالي بطيء، أكثر من 1.85 معالجة مزدوجة. تُخفَّض أوزان الإجابات المتسرعة جداً، وتُخفَّض أوزان الإجابات الناضجة المتأنية جداً، وتُستبعد الإجابات المنقطعة من الإحصاءات.</p></div>
    <div class="t-card"><h3>مؤشر التجميل (مؤشر الاتساق)</h3><p>يجمع أربعة مكوّنات: نسبة الإجابات المثالية، ونسبة الإجابات الناضجة ذات الزمن المزدوج، والفرق بين نضج الإجابات التأمّلية والسريعة، والإجابة الموحَّدة على الأقصى. ويُعرض للمعلم بصيغة «مؤشر الاتساق» (100 − مؤشر التجميل).</p></div>
    <div class="t-card"><h3>أزواج الاتساق</h3><p>لثلاثة عشر زوجاً من النماذج سؤال-فخ في السياق الهادئ وآخر تحت الضغط للسمة نفسها؛ ويُستخرج منه مؤشر فجوة النظرية والممارسة.</p></div>
    <div class="t-card"><h3>القيود المنهجية</h3><ul class="t-ul"><li>حدود LI مأخوذة من الورقة ولم تُعايَر على عيّنة محلية؛ فهي إرشادية، وتنبغي معايرتها بالمئينات بعد جمع بيانات كافية.</li><li>زمن الاستجابة مؤشر ظنّي؛ والدراسات المتعلقة باكتشاف الخداع من السلوك الظاهر تُظهر دقة محدودة (Bond & DePaulo, 2006)، فلا يُستعمل وحده للحكم.</li><li>الأنماط الأربعة تصنيف نظري مبسّط، والنتيجة وصف لميل لا تشخيص نفسي.</li><li>الأسئلة موضوعة لهذه المنظومة وتحتاج لدراسات صدق وثبات على المعلمين العراقيين قبل أي استخدام عالي الأثر.</li><li>تحليل النص المفتوح معجمي بسيط ولا يغني عن القراءة البشرية.</li></ul></div>
    <div class="t-card"><h3>الأخلاقيات</h3><p>موافقة صريحة قبل البدء، ومعرّف مستعار مشفَّر عند الخادم، وتقرير فردي للمعلم وحده، وتجميع على مستوى المدرسة لا يقل عن ثلاثة معلمين، واستخدام للتطوير المهني دون التقييم الوظيفي.</p></div>
    <div class="t-card"><h3>المراجع</h3>${[...all].map(k => T.refs[k]).filter(Boolean).sort().map(r => `<p class="t-ref">${esc(r)}</p>`).join("")}<p class="t-k">ملاحظة: يُنصح بالتحقق من بيانات النشر لكل مرجع قبل الاستشهاد الأكاديمي.</p></div>`);
  }

  /* ---------- نقطة الدخول ---------- */
  function mount(el, c) {
    root = el; root.id = "t-root"; cfg = c || {}; S = load() || fresh();
    if (cfg.user && cfg.user.id && S.teacher && S.teacher.id !== cfg.user.id) S = fresh();
    window.addEventListener("online", flush);
    if (!S.consent) return go("consent");
    if (!S.teacher) return go("form");
    if (!S.warm) return go("warm");
    go("hub");
  }
  window.TQuiz = { mount, send: sendPayload, _state: () => S };
})();
