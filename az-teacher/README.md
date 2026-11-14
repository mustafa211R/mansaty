# منظومة T-AZ للمعلمين — دليل التشغيل

## الملفات
- teachers/ : الواجهة (افتح index.html). مكوّنات: t-spec (المواصفات والمراجع)، t-questions-1..4 (260 فقرة)، t-scenes (9 مشاهد SVG)، t-engine (التحليل)، t-app (الواجهة).
- Teachers.gs : يُضاف إلى مشروع Apps Script نفسه بجانب Code.gs.
- student_fixed/ : ملفات نموذج الطالب بعد إصلاح الإرسال إلى Google Sheets (Code.gs, app.js, index.html, connection-test.html).

## الربط بـ Google Sheets (مرة واحدة)
1. في الجدول: Extensions > Apps Script. استبدل Code.gs بالنسخة المصلحة، وأضف ملفاً جديداً باسم Teachers.gs والصق محتواه.
2. شغّل setup() ثم tTestSave() من المحرر ووافق على الصلاحيات؛ يجب أن تظهر T_Model_A_sheet وفيها سجل تجريبي.
3. Deploy > Manage deployments > Edit > New version (بعد أي تعديل). Execute as: Me ، Who has access: Anyone. انسخ الرابط الذي ينتهي بـ /exec.
4. ضعه في endpoint داخل teachers/index.html (وفي student_fixed/index.html للطلاب). اختبره بـ connection-test.html.
5. من قائمة T-AZ داخل الجدول: «تثبيت تحديث كل ساعة».
6. اختياري: Script property باسم API_KEY لحماية الرابط (ويُرسَل مع كل طلب باسم key).

## ما يتولّد في الجدول
T_Model_A..Z_sheet ، T_Profiles ، Teacher_Sheet_Analysis (مع رسم) ، Teacher_School_Analysis ، Cross_SxT ، T_Calibration. المعرّف يُشفَّر بـ HMAC (SALT) وتُحجب المجاميع التي أقل من 3 معلمين.
