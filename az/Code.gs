/**
 * Google Apps Script — استقبال نتائج النماذج التشخيصية A–Z
 * الخطوات: 1) الصق الكود في Extensions > Apps Script داخل Google Sheet
 *          2) شغّل الدالة setup() مرة واحدة (وافق على الصلاحيات)
 *          3) Deploy > New deployment > Web app (Execute as: Me — Who has access: Anyone)
 *          4) انسخ الرابط وضعه في CONFIG.WEB_APP_URL داخل app.js
 * (اختياري للذكاء الاصطناعي): Project Settings > Script properties > ANTHROPIC_API_KEY
 */

const MODELS = {
  A: "طريقة التفكير", B: "أنواع الذكاء", C: "المنطق", D: "الكسل", E: "الفلسفة والتأمل",
  F: "المنطق الفطري", G: "المنطق الرياضي", H: "سرعة التفكير والحل", I: "اكتشاف المشكلة",
  J: "الاستقراء", K: "الاستدلال", L: "الحفظ", M: "الذاكرة (قصيرة وطويلة)", N: "الغضب والسلوك",
  O: "النظرة إلى المعلم", P: "الشغف", Q: "المهارة", R: "الفضول", S: "التركيز", T: "المساعدة",
  U: "الأنانية والتعاون", V: "التلقين", W: "السهولة والصعوبة", X: "الخوف", Y: "التجارب", Z: "البيت والبيئة"
};
const IDS = Object.keys(MODELS);
const HEADERS = ["التاريخ", "الاسم", "الصف", "المدرسة", "الزمن الكلي (ث)", "متوسط زمن السؤال (ث)",
  "رقم النمط", "النمط الغالب", "التوزيع %", "تفاصيل الإجابات", "المشاكل (كتبها الطالب)", "النتائج والتحليل", "الموثوقية", "تنبيهات",
  "تحليل الزمن", "سريع/متأنٍّ", "مؤشر تجميل الصورة", "التوقع"];
const AN = "sheet_analysis";

function sheetName_(id) { return "Model_" + id + "_sheet"; }

/** تشغيل مرة واحدة: ينشئ 26 شيت + sheet_analysis + الرسوم البيانية */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  IDS.forEach(id => {
    let sh = ss.getSheetByName(sheetName_(id));
    if (!sh) sh = ss.insertSheet(sheetName_(id));
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight("bold").setBackground("#4f46e5").setFontColor("#fff").setHorizontalAlignment("center");
    if (sh.getLastRow() <= 1) {
      sh.setFrozenRows(1);
      sh.setRightToLeft(true);
      sh.setColumnWidths(1, HEADERS.length, 130);
      sh.setColumnWidth(10, 380); sh.setColumnWidth(11, 260); sh.setColumnWidth(12, 420); sh.setColumnWidth(15, 220); sh.setColumnWidth(18, 380);
      sh.getRange("J:L").setWrap(true); sh.getRange("R:R").setWrap(true);
      sh.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
    }
  });
  buildAnalysis_(ss);
  const def = ss.getSheetByName("Sheet1") || ss.getSheetByName("ورقة1");
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
}

function buildAnalysis_(ss) {
  let sh = ss.getSheetByName(AN);
  if (sh) { sh.getCharts().forEach(c => sh.removeChart(c)); sh.clear(); } else sh = ss.insertSheet(AN, 0);
  sh.setRightToLeft(true);
  const head = ["النموذج", "العنوان", "عدد الطلاب", "متوسط الزمن الكلي (ث)", "متوسط زمن السؤال (ث)",
    "نمط 1", "نمط 2", "نمط 3", "نمط 4", "الأكثر شيوعاً", "أسماء الأنماط", "عدد التنبيهات", "متوسط مؤشر تجميل الصورة"];
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#fff").setHorizontalAlignment("center");
  sh.setFrozenRows(1);
  IDS.forEach((id, i) => sh.getRange(i + 2, 1, 1, 2).setValues([[id, MODELS[id]]]));
  sh.setColumnWidths(1, head.length, 120); sh.setColumnWidth(2, 170); sh.setColumnWidth(11, 420);
  IDS.forEach(id => updateAnalysisRow_(ss, id));
  const last = IDS.length + 1;

  const c1 = sh.newChart().setChartType(Charts.ChartType.COLUMN)
    .addRange(sh.getRange("B1:C" + last)).setPosition(last + 3, 1, 0, 0)
    .setOption("title", "عدد الطلاب في كل نموذج").setOption("legend", { position: "none" })
    .setOption("width", 820).setOption("height", 340).build();
  const c2 = sh.newChart().setChartType(Charts.ChartType.COLUMN)
    .addRange(sh.getRange("B1:B" + last)).addRange(sh.getRange("F1:I" + last)).setPosition(last + 21, 1, 0, 0)
    .setOption("title", "توزيع الأنماط داخل كل نموذج (نمط 1–4)").setOption("isStacked", true)
    .setOption("width", 820).setOption("height", 380).build();
  const c3 = sh.newChart().setChartType(Charts.ChartType.LINE)
    .addRange(sh.getRange("B1:B" + last)).addRange(sh.getRange("E1:E" + last)).setPosition(last + 41, 1, 0, 0)
    .setOption("title", "متوسط زمن الإجابة لكل سؤال (ثانية)").setOption("legend", { position: "none" })
    .setOption("width", 820).setOption("height", 320).build();
  [c1, c2, c3].forEach(c => sh.insertChart(c));
}

function updateAnalysisRow_(ss, id) {
  const an = ss.getSheetByName(AN), sh = ss.getSheetByName(sheetName_(id));
  if (!an || !sh) return;
  const row = IDS.indexOf(id) + 2;
  const n = Math.max(sh.getLastRow() - 1, 0);
  let count = 0, totalSum = 0, avgSum = 0, alerts = 0, fakeSum = 0;
  const c = [0, 0, 0, 0], names = {};
  if (n > 0) {
    const data = sh.getRange(2, 1, n, HEADERS.length).getValues();
    data.forEach(r => {
      if (!r[1]) return;
      count++; totalSum += Number(r[4]) || 0; avgSum += Number(r[5]) || 0;
      const idx = Number(r[6]); if (idx >= 1 && idx <= 4) { c[idx - 1]++; names[idx] = r[7]; }
      if (r[13]) alerts++;
      fakeSum += Number(r[16]) || 0;
    });
  }
  const top = c.indexOf(Math.max.apply(null, c));
  const topName = count && names[top + 1] ? names[top + 1] : "—";
  const namesStr = [1, 2, 3, 4].map(i => names[i] ? i + ": " + names[i] : "").filter(String).join(" | ");
  an.getRange(row, 3, 1, 11).setValues([[
    count, count ? Math.round(totalSum / count) : 0, count ? Math.round(avgSum / count * 10) / 10 : 0,
    c[0], c[1], c[2], c[3], topName, namesStr, alerts, count ? Math.round(fakeSum / count) : 0
  ]]);
}

function doGet() { return ContentService.createTextOutput("OK — Diagnostic models endpoint is running"); }

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad json" }); }
  if (d.action === "ai") return json_({ text: aiText_(d.summary) });
  if (d.action === "profile") return saveProfile_(d);
  if (d.action !== "save" || !MODELS[d.model]) return json_({ ok: false, error: "bad request" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss.getSheetByName(sheetName_(d.model))) setup();
    const sh = ss.getSheetByName(sheetName_(d.model));
    sh.appendRow([
      new Date(d.ts || Date.now()), d.name, d.grade, d.school, d.totalSec, d.avgSec,
      d.typeIndex, d.typeName, (d.typeNames || []).map((n, i) => n + ": " + (d.dist || [])[i] + "%").join(" | "),
      d.details, d.problems, d.result, d.reliability, d.alerts,
      d.latency, d.dualText, Number(d.faking) || 0, d.forecast
    ]);
    updateAnalysisRow_(ss, d.model);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

/** ملف الطالب الشامل عبر النماذج: صف واحد لكل طالب (يُحدَّث عند كل نموذج جديد) */
function saveProfile_(d) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName("Student_Profiles");
    if (!sh) {
      sh = ss.insertSheet("Student_Profiles"); sh.setRightToLeft(true);
      sh.getRange(1, 1, 1, 10).setValues([["المفتاح", "الاسم", "الصف", "المدرسة", "عدد النماذج", "النماذج المنجزة", "نقاط القوة", "تحتاج انتباه", "الأسباب الجذرية المحتملة", "آخر تحديث"]])
        .setFontWeight("bold").setBackground("#4f46e5").setFontColor("#fff");
      sh.setFrozenRows(1); sh.setColumnWidths(1, 10, 140); sh.setColumnWidth(9, 480); sh.getRange("G:I").setWrap(true);
    }
    const key = [d.name, d.grade, d.school].join("|");
    const n = Math.max(sh.getLastRow() - 1, 0);
    const keys = n ? sh.getRange(2, 1, n, 1).getValues().map(r => r[0]) : [];
    const idx = keys.indexOf(key);
    const row = [key, d.name, d.grade, d.school, d.done, d.doneList, d.strengths, d.attention, d.causes, new Date(d.ts || Date.now())];
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** تفسير اختياري بالذكاء الاصطناعي — يحتاج ANTHROPIC_API_KEY في Script properties */
function aiText_(summary) {
  const key = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  if (!key) return "";
  const prompt = summary.kind === "profile"
    ? "أنت مرشد تربوي. هذه خلاصة ملف طالب عبر عدة نماذج. نقاط القوة: " + JSON.stringify(summary.strengths) + ". ما يحتاج انتباهاً: " + JSON.stringify(summary.attention) +
      ". أسباب جذرية محتملة: " + JSON.stringify(summary.causes) + ". اكتب بالعربية البسيطة في 5 أسطر كحد أقصى: صورة إيجابية عامة، أرجح جذر للمشكلة، توقع حذر للأشهر القادمة، وخطوتان عمليتان للمعلم. لا تشخّص أمراضاً ولا تجزم، واستخدم عبارات احتمالية."
    : "أنت مرشد تربوي. هذه نتيجة طالب (عمره 11-17 سنة) في نموذج «" + summary.model + "». " +
    "التوزيع: " + JSON.stringify(summary.types) + ". متوسط الزمن لكل سؤال: " + summary.avgSecPerQuestion + " ث. " +
    "تحليل الزمن: " + JSON.stringify(summary.latency) + ". مقارنة السريع/المتأني: " + JSON.stringify(summary.dual) + ". الموثوقية: " + summary.reliability + ". ما كتبه الطالب عن مشاكله: «" + (summary.problems || "لا شيء") + "». " +
    "اكتب بالعربية البسيطة في 5 أسطر كحد أقصى: (1) وصف إيجابي لشخصيته، (2) مشكلة محتملة قد تظهر عنده، (3) نصيحة عملية للمعلم، (4) نصيحة قصيرة للطالب. " +
    "لا تشخّص أمراضاً نفسية ولا تجزم، واستخدم عبارات احتمالية.";
  try {
    const r = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
      method: "post", contentType: "application/json", muteHttpExceptions: true,
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
      payload: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 600, messages: [{ role: "user", content: prompt }] })
    });
    const j = JSON.parse(r.getContentText());
    return (j.content && j.content[0] && j.content[0].text) || "";
  } catch (e) { return ""; }
}
