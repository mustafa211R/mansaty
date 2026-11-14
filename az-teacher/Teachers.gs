/**
 * Teachers.gs — خادم نماذج المعلمين T-AZ (يُضاف كملف ثانٍ بجانب Code.gs في المشروع نفسه).
 * الأوراق: T_Model_A_sheet … T_Model_Z_sheet، T_Profiles، Teacher_Sheet_Analysis، Teacher_School_Analysis،
 *          Cross_SxT (تقاطع الطلاب × المعلمين)، T_Calibration (معايرة عتبات LI).
 * الخصوصية: معرّف المعلم يُشفَّر بـ HMAC-SHA256 بمفتاح SALT في Script properties (يُنشأ تلقائياً مرة واحدة)،
 *           وتُحجَب التجميعات التي يقل عدد معلميها عن K_MIN.
 * التفعيل: في Code.gs داخل handle_ يُستدعى tHandle_ للإجراءات التي تبدأ بـ t_ (انظر التعليمة الملحقة).
 */
const K_MIN = 3;
const T_NAMES = {"A": "فلسفة التدريس وغايته", "B": "العمق المعرفي وسؤال «لماذا»", "C": "المرونة التجريدية والرموز", "D": "إدارة الوقت والمنهج", "E": "التعامل مع الخطأ الصفي", "F": "احتواء الفضول والمشاكسة", "G": "العدالة المعرفية والفروق الفردية", "H": "أسلوب التقييم وبناء الأسئلة", "I": "التجريب والربط بالواقع", "J": "الذكاء الانفعالي وضبط الغضب", "K": "الاحتراق الوظيفي والشغف", "L": "مقاومة التغيير والتطور الذاتي", "M": "النظرة إلى الطالب المتعثر", "N": "النظرة إلى الطالب الموهوب أو المختلف", "O": "الإسقاط المهني وتوزيع اللوم", "P": "توليد الاستقراء والاستدلال", "Q": "إدارة الانتباه والتركيز الصفي", "R": "السلطة الصفية مقابل الحرية الفكرية", "S": "التعاون المهني وتبادل الخبرات", "T": "التواصل مع أولياء الأمور", "U": "الحساسية الثقافية والبيئية", "V": "الأمانة العلمية والاعتراف بالجهل", "W": "تحفيز الدافعية الداخلية", "X": "الإدراك البصري والتفسير السريع", "Y": "التعامل مع الضغوط الإدارية", "Z": "البصمة التربوية الشاملة"};
const T_PATTERNS = {"A": ["المُلَقِّن الناقل", "المُدرِّب الامتحاني", "المُيسِّر الحواري", "المُلهِم البنائي"], "B": ["الحافظ النصي", "المتهرب الدبلوماسي", "المحلل التفسيري", "الباحث الفلسفي"], "C": ["أسير القالب", "المُقلِّد المحدود", "المُنوِّع المرن", "مُهندس التجريد"], "D": ["عبد الخطة", "المنجز السريع", "الموازن الواقعي", "المستثمر في الفهم"], "E": ["المُعاقِب الصارم", "المُصحِّح الفوري", "المُحلِّل للخطأ", "المُستثمر المعرفي"], "F": ["القاطع للحوار", "الموجِّه الدبلوماسي", "المستوعب الهادئ", "المُشعل للنقاش"], "G": ["المُوحِّد الأعمى", "المنحاز للمتفوقين", "المراعي جزئياً", "المُفصِّل للتعليم"], "H": ["ناقل الكتاب", "المُكرِّر للأنماط", "المُطوِّر التدريجي", "صانع التحديات"], "I": ["النظري البحت", "السارد للأمثلة", "المُجرِّب المحدود", "الرابط بالبيئة والحياة"], "J": ["المنفعل القمعي", "المتوتر الكاتم", "المتزن الحازم", "الهادئ المُحتوي"], "K": ["المستنزف نفسياً", "المؤدّي الروتيني", "المتأرجح المرهق", "الشغوف المتجدد"], "L": ["المتحجِّر الرافض", "المتشكك الحذر", "المتعلم الانتقائي", "المجدد المستمر"], "M": ["الواصم بالفشل", "اللامبالي", "المتعاطف العاجز", "المُشخِّص للجذور"], "N": ["المُهدَّد منه", "المُقيِّد له بالقالب", "المُشجِّع اللفظي", "الراعي والمُتحدِّي"], "O": ["المُبرِّئ لذاته كلياً", "اللائم المتذمر", "المعترف جزئياً", "المتحمل للمسؤولية"], "P": ["المُلقِّن المباشر", "المُلمِّح السريع", "المُدرِّب على الخطوات", "قائد الاستكشاف"], "Q": ["المُرهِب بالدرجات", "المنبِّه التقليدي", "المُنوِّع للوسائل", "المُثير للفضول"], "R": ["الديكتاتور الصفي", "الفوضوي المتساهل", "المنضبط الحذر", "القائد الديمقراطي"], "S": ["المنعزل الحذر", "المتنافس الخفي", "المتعاون الشكلي", "الشريك المعرفي"], "T": ["المُشتكي العقابي", "الناقل للدرجات", "المُتواصل الموسمي", "الشريك التربوي"], "U": ["المُنفصل عن الواقع", "المُعمِّم للأحكام", "المتفهم نظرياً", "المُراعي للسياق"], "V": ["المُراوِغ المدّعي", "القامع للسؤال", "المؤجِّل الحذر", "الباحث الصادق"], "W": ["المُخوِّف بالرسوب", "المُكافِئ بالدرجات", "المُشجِّع المعنوي", "المُوقِظ للشغف"], "X": ["الشكلي الصارم", "الرقابي الحذر", "الملاحظ المتوازن", "الاستكشافي المرن"], "Y": ["المُفرِّغ للضغط صفياً", "المتذمر المستمر", "المتكيِّف الصامت", "الحاجز الواقي"], "Z": ["المُتناقض المُجمِّل", "التقليدي الواضح", "المتطوّر الجزئي", "المربي المتكامل"]};
const T_GROUPS = [["A","B","C","D","E","F","G"],["H","I","J","K","L","M","N"],["O","P","Q","R","S","T"],["U","V","W","X","Y","Z"]];
const T_HEAD = ["التاريخ","المعرّف المشفّر","التخصص","المرحلة","سنوات الخدمة","المدرسة","الزمن الكلي (ث)","سرعة القراءة ρ (ث/كلمة)","متوسط LI","فهرس النمط (0-3)","النمط","التوزيع %","مؤشر النضج","مؤشر التجميل","الموثوقية","اندفاعي %","معالجة مزدوجة %","فجوة تأمّلي−سريع","تنبيهات","تفاصيل الإجابات","التوقع","JSON خام"];
const P_HEAD = ["المعرّف المشفّر","التخصص","المرحلة","سنوات الخدمة","المدرسة","النماذج المنجزة","مؤشر النضج الكلي","م1","م2","م3","م4","جمود","احتراق","إقصاء","مساءلة","متوسط التجميل","متوسط الموثوقية","فجوة النظرية-الممارسة","المتلازمات","النص المفتوح","تحليل النص","التوقع","آخر تحديث","JSON النماذج"];

function tHash_(id) {
  const sp = PropertiesService.getScriptProperties();
  let salt = sp.getProperty("SALT");
  if (!salt) { salt = Utilities.getUuid() + Utilities.getUuid(); sp.setProperty("SALT", salt); }
  const sig = Utilities.computeHmacSha256Signature(String(id || "anon"), salt);
  return sig.map(b => ("0" + (b & 0xff).toString(16)).slice(-2)).join("").slice(0, 16);
}
function tSheet_(ss, name, head, color, widths) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name); sh.setRightToLeft(true);
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight("bold").setBackground(color || "#14213d").setFontColor("#fff");
    sh.setFrozenRows(1); sh.setColumnWidths(1, head.length, widths || 130);
  }
  return sh;
}
const tModelSheet_ = (ss, id) => tSheet_(ss, "T_Model_" + id + "_sheet", T_HEAD, "#14213d", 130);

function tHandle_(d) {
  if (d.action === "t_ping") return json_({ ok: true, pong: true, module: "T-AZ" });
  if (d.action === "t_profile") return tSaveProfile_(d);
  if (d.action !== "t_save" || !T_NAMES[d.model]) return json_({ ok: false, error: "bad request" });
  const cache = CacheService.getScriptCache();
  if (d.id && cache.get("t" + d.id)) return json_({ ok: true, duplicate: true });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const ss = ss_(), sh = tModelSheet_(ss, d.model), h = tHash_(d.teacherId);
    const dist = d.dist || [0, 0, 0, 0], tot = dist.reduce((a, b) => a + b, 0) || 1;
    sh.appendRow([new Date(d.ts || Date.now()), h, d.spec, d.stage, d.yrs, String(d.school || "").trim(), d.totalSec, d.rho, d.meanLI, d.patternIdx, d.pattern,
      dist.map((n, i) => (T_PATTERNS[d.model][i] || i) + ": " + Math.round(n / tot * 100) + "%").join(" | "), d.maturity, d.fake, d.reliability, d.imp, d.dbl, d.gap, d.flags,
      (d.answers || []).map(a => a.k + ":" + a.idx + "@" + a.t + "s/LI" + a.li).join(" ; "), d.forecast, JSON.stringify(d.answers || [])]);
    if (d.id) cache.put("t" + d.id, "1", 21600);   // بعد نجاح الكتابة فقط، كي لا يضيع سجل فشل مرة
    try { tUpdateModelRow_(ss, d.model); } catch (e) { Logger.log("T analysis skipped: " + e); }
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

function tSaveProfile_(d) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const ss = ss_(), sh = tSheet_(ss, "T_Profiles", P_HEAD, "#a68a3e", 120), h = tHash_(d.teacherId);
    const n = Math.max(sh.getLastRow() - 1, 0), keys = n ? sh.getRange(2, 1, n, 1).getValues().map(r => r[0]) : [], i = keys.indexOf(h);
    const g = d.groups || [], I = d.indices || {};
    const row = [h, d.spec, d.stage, d.yrs, String(d.school || "").trim(), d.done, d.pmi, g[0], g[1], g[2], g[3], I.rigidity, I.burnout, I.exclusion, I.accountability, d.meanFake, d.meanRel, d.tpg,
      (d.syndromes || []).join(" | "), d.open || "", d.openAnalysis || "", d.forecast || "", new Date(d.ts || Date.now()), JSON.stringify({ dom: d.results, mat: d.maturities })];
    if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

/* ---------- تحليلات ---------- */
const avg_ = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const rd_ = (x, p) => { const m = Math.pow(10, p || 1); return Math.round(x * m) / m; };
function pct_(sorted, p) { if (!sorted.length) return ""; const k = (sorted.length - 1) * p, f = Math.floor(k), c = Math.ceil(k); return rd_(sorted[f] + (sorted[c] - sorted[f]) * (k - f), 2); }
/** يُبقي آخر سجل لكل معلم في النموذج الواحد */
function tLatest_(sh) {
  const n = sh.getLastRow() - 1; if (n < 1) return [];
  const v = sh.getRange(2, 1, n, T_HEAD.length).getValues(), m = {};
  v.forEach(r => { const k = r[1]; if (!m[k] || r[0] >= m[k][0]) m[k] = r; });
  return Object.keys(m).map(k => m[k]);
}
function tUpdateModelRow_(ss, id) {
  const an = tSheet_(ss, "Teacher_Sheet_Analysis", ["النموذج", "الاسم", "عدد المعلمين", "متوسط النضج", "نمط 0", "نمط 1", "نمط 2", "نمط 3", "الأكثر شيوعاً", "متوسط التجميل", "متوسط الموثوقية", "اندفاعي %", "مزدوج %", "متوسط الفجوة", "ملاحظة"], "#22345c", 120);
  const rows = tLatest_(tModelSheet_(ss, id)), n = rows.length, ix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(id) + 2;
  let out;
  if (n < K_MIN) out = [id, T_NAMES[id], n, "—", "—", "—", "—", "—", "—", "—", "—", "—", "—", "—", "محجوب (أقل من " + K_MIN + " معلمين)"];
  else {
    const c = [0, 0, 0, 0]; rows.forEach(r => c[r[9]]++);
    const top = c.indexOf(Math.max.apply(null, c));
    out = [id, T_NAMES[id], n, rd_(avg_(rows.map(r => +r[12])), 1), c[0], c[1], c[2], c[3], T_PATTERNS[id][top], rd_(avg_(rows.map(r => +r[13])), 1), rd_(avg_(rows.map(r => +r[14])), 1),
      rd_(avg_(rows.map(r => +r[15])), 1), rd_(avg_(rows.map(r => +r[16])), 1), rd_(avg_(rows.map(r => +r[17])), 2), ""];
  }
  an.getRange(ix, 1, 1, out.length).setValues([out]);
}

/** تحديث شامل: صفوف كل النماذج + المدارس + التقاطع + المعايرة + الرسم */
function tRefreshAll() {
  const ss = ss_();
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(id => { if (ss.getSheetByName("T_Model_" + id + "_sheet")) tUpdateModelRow_(ss, id); });
  try { tSchoolAnalysis_(ss); } catch (e) { Logger.log("school: " + e); }
  try { tCross_(ss); } catch (e) { Logger.log("cross: " + e); }
  try { tCalibration_(ss); } catch (e) { Logger.log("calib: " + e); }
  try { tChart_(ss); } catch (e) { Logger.log("chart: " + e); }
}
function tSchoolAnalysis_(ss) {
  const ps = ss.getSheetByName("T_Profiles"); if (!ps || ps.getLastRow() < 2) return;
  const v = ps.getRange(2, 1, ps.getLastRow() - 1, P_HEAD.length).getValues(), by = {};
  v.forEach(r => { const s = String(r[4] || "").trim() || "(بلا مدرسة)"; (by[s] = by[s] || []).push(r); });
  const sh = tSheet_(ss, "Teacher_School_Analysis", ["المدرسة", "عدد المعلمين", "متوسط النضج", "م1", "م2", "م3", "م4", "جمود", "احتراق", "إقصاء", "مساءلة", "متوسط التجميل", "ملاحظة"], "#22345c", 120);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 13).clearContent();
  const out = [];
  Object.keys(by).forEach(s => {
    const a = by[s]; if (a.length < K_MIN) { out.push([s, a.length, "—", "—", "—", "—", "—", "—", "—", "—", "—", "—", "محجوب (أقل من " + K_MIN + ")"]); return; }
    const m = i => rd_(avg_(a.map(r => +r[i] || 0)), 1);
    out.push([s, a.length, m(6), m(7), m(8), m(9), m(10), m(11), m(12), m(13), m(14), m(15), ""]);
  });
  if (out.length) sh.getRange(2, 1, out.length, 13).setValues(out);
}

/** قواعد التقاطع من الورقة. الطالب: typeIndex يبدأ من 1. المعلم: فهرس النمط يبدأ من 0 (0 = الأضعف ≙ «النمط 1» في الورقة). عدّل الجدول حسب الحاجة. */
const CROSS_RULES = [
  { name: "طالب كسول بسبب الملل مع نظرة إلى المعلم كملقّن  ×  إدارة وقت جامدة وجمود تجريدي", s: [["D", [2]], ["O", [2]]], t: [["D", [0]], ["C", [0]]] },
  { name: "طالب خائف واعتمادي  ×  معلم يعاقب على الخطأ ولا يضبط انفعاله", s: [["X", [2, 3, 4]], ["T", [3]]], t: [["E", [0]], ["J", [0]]] },
  { name: "طالب بفضول مكبوت أو ضعيف  ×  تلقين واحتراق", s: [["R", [3, 4]]], t: [["A", [0]], ["K", [0]]] }
];
function tCross_(ss) {
  const sh = tSheet_(ss, "Cross_SxT", ["المدرسة", "القاعدة", "طلاب مطابقون", "معلمون مطابقون", "إجمالي معلمي المدرسة", "تقاطع", "ملاحظة"], "#7a3b3b", 150);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
  // معلمون: آخر سجل لكل معلم ونموذج
  const T = {}; "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(id => { const s = ss.getSheetByName("T_Model_" + id + "_sheet"); if (s) tLatest_(s).forEach(r => { const sc = String(r[5] || "").trim(); (T[sc] = T[sc] || {})[r[1]] = (T[sc][r[1]] || {}); T[sc][r[1]][id] = r[9]; }); });
  // طلاب: آخر سجل لكل طالب ونموذج
  const S = {}; "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(id => { const s = ss.getSheetByName("Model_" + id + "_sheet"); if (!s || s.getLastRow() < 2) return;
    s.getRange(2, 1, s.getLastRow() - 1, 7).getValues().forEach(r => { const sc = String(r[3] || "").trim(), k = r[1] + "|" + r[2]; ((S[sc] = S[sc] || {})[k] = S[sc][k] || {})[id] = +r[6]; }); });
  const out = [];
  const schools = Object.keys(T);
  schools.forEach(sc => {
    const teachers = Object.keys(T[sc]), nT = teachers.length;
    CROSS_RULES.forEach(rule => {
      const ns = Object.keys(S[sc] || {}).filter(k => rule.s.every(c => c[1].indexOf(S[sc][k][c[0]]) >= 0)).length;
      const nt = teachers.filter(h => rule.t.every(c => c[1].indexOf(T[sc][h][c[0]]) >= 0)).length;
      if (nT < K_MIN) out.push([sc, rule.name, "—", "—", nT, "—", "محجوب (أقل من " + K_MIN + " معلمين)"]);
      else out.push([sc, rule.name, ns, nt, nT, ns > 0 && nt > 0 ? "نعم — يستحق التدخل المشترك" : "لا", ""]);
    });
  });
  if (out.length) sh.getRange(2, 1, out.length, 7).setValues(out);
}
function tCalibration_(ss) {
  const sh = tSheet_(ss, "T_Calibration", ["المقياس", "العدد", "p10", "p25", "p50", "p75", "p90", "ملاحظة"], "#444", 110);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 8).clearContent();
  const li = [], rho = [];
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(id => { const s = ss.getSheetByName("T_Model_" + id + "_sheet"); if (s && s.getLastRow() > 1) s.getRange(2, 8, s.getLastRow() - 1, 2).getValues().forEach(r => { if (+r[0] > 0) rho.push(+r[0]); if (+r[1] > 0) li.push(+r[1]); }); });
  const row = (nm, a) => { a.sort((x, y) => x - y); return [nm, a.length, pct_(a, .1), pct_(a, .25), pct_(a, .5), pct_(a, .75), pct_(a, .9), a.length < 100 ? "عيّنة صغيرة (أقل من 100) — لا تُعتمد لتغيير العتبات" : "يمكن مقارنة p10/p90 مع عتبتي الاندفاع والمعالجة المزدوجة"]; };
  sh.getRange(2, 1, 2, 8).setValues([row("متوسط LI لكل سجل", li), row("سرعة القراءة ρ (ث/كلمة)", rho)]);
  sh.getRange(5, 1).setValue("العتبات الحالية في الواجهة: 0.45 / 0.75 / 1.35 / 1.85 (من الورقة، غير معايَرة محلياً).");
}
function tChart_(ss) {
  const an = ss.getSheetByName("Teacher_Sheet_Analysis"); if (!an) return;
  an.getCharts().forEach(c => an.removeChart(c));
  an.insertChart(an.newChart().setChartType(Charts.ChartType.COLUMN).addRange(an.getRange("B1:B27")).addRange(an.getRange("D1:D27"))
    .setPosition(30, 1, 0, 0).setOption("title", "متوسط النضج لكل نموذج (للنماذج غير المحجوبة)").setOption("legend", { position: "none" }).build());
}

/** قائمة مخصصة وتشغيل دوري */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("T-AZ").addItem("تحديث كل التحليلات", "tRefreshAll").addItem("تثبيت تحديث كل ساعة", "tInstallTrigger").addItem("اختبار حفظ تجريبي", "tTestSave").addToUi();
}
function tInstallTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "tRefreshAll").forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("tRefreshAll").timeBased().everyHours(1).create();
}
function tTestSave() {
  const r = doPost({ postData: { contents: JSON.stringify({ action: "t_save", id: "ttest-" + Date.now(), model: "A", teacherId: "test-teacher", spec: "اختبار", stage: "-", yrs: "-", school: "مدرسة تجريبية",
    totalSec: 1, rho: 0.4, meanLI: 1, patternIdx: 2, pattern: "اختبار", dist: [1, 2, 3, 4], maturity: 50, fake: 0, reliability: 90, imp: 0, dbl: 0, gap: 0, flags: "", answers: [{ k: "base", idx: 2, t: 5, li: 1 }], forecast: "سجل تجريبي — احذفه", ts: new Date().toISOString() }) } });
  Logger.log(r.getContent());
}
