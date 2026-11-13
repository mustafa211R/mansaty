/* واجهة النماذج التشخيصية — قابلة للتضمين في منصة الطالب:
   SDQuiz.mount(document.getElementById("sd-root"), { user:{name,grade,school}, endpoint:"https://script.google.com/.../exec", ai:false }) */
(function () {
  const E = window.SDEngine;
  const DEFAULTS = { endpoint: "", ai: false, aiTimeout: 12000, user: null, lockModel: null, onFinish: null, title: "اكتشف شخصيتك" };
  const LETTERS = ["أ", "ب", "ج", "د"];
  const COLORS = ["var(--sd-c0)", "var(--sd-c1)", "var(--sd-c2)", "var(--sd-c3)"];
  const FAST_LIMIT = 6, SLOW_DELAY = 5;
  const INTRO = {
    chat: "أهلاً! أنا المرشد. سأسألك أسئلة كأننا نتحدث معاً. لا توجد إجابة صحيحة وأخرى خاطئة، اختر ما يشبهك فعلاً.",
    grid: "مرحباً! سترى بطاقات اخترْ منها الأقرب لك. لا يوجد صح وخطأ، فقط أنت.",
    story: "سأحكي لك مواقف قصيرة، وتخبرني ماذا ستفعل. أجب بصدق، فهذا يساعدنا على فهمك."
  };

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function mount(root, opts) {
    const cfg = Object.assign({}, DEFAULTS, window.SD_CONFIG || {}, opts || {});
    const qs = new URLSearchParams(location.search);
    const lock = (cfg.lockModel || qs.get("m") || "").toUpperCase();
    let user = cfg.user || window.SD_USER || (qs.get("name") ? { name: qs.get("name"), grade: qs.get("grade") || "", school: qs.get("school") || "" } : null);
    const userLocked = !!(user && user.name);
    if (!userLocked) user = LS.get("sd_user", {});
    let run = null, timers = [];

    root.classList.add("sd");
    root.innerHTML = `
      <div class="sd-head"><span class="logo">🧭</span><h1>${esc(cfg.title)}</h1><p>أسئلة بسيطة، ليس فيها إجابة صحيحة وأخرى خاطئة</p></div>
      <section data-s="home"></section><section data-s="intro" class="hidden"></section>
      <section data-s="quiz" class="hidden"></section><section data-s="problems" class="hidden"></section>
      <section data-s="result" class="hidden"></section><section data-s="profile" class="hidden"></section>
      <p class="sd-note">أداة تربوية لمساعدتك على التعلّم، وليست تشخيصاً نفسياً ولا تغني عن الأخصائي.</p>`;
    const $ = s => root.querySelector(s), S = n => $(`[data-s=${n}]`);
    const show = n => { root.querySelectorAll("section").forEach(s => s.classList.toggle("hidden", s.dataset.s !== n)); root.scrollIntoView({ behavior: "smooth", block: "start" }); };
    const clearTimers = () => { timers.forEach(t => { clearInterval(t); clearTimeout(t); }); timers = []; };
    const doneMap = () => LS.get("sd_done", {});

    /* ===== الرئيسية ===== */
    function home() {
      clearTimers(); root.removeAttribute("data-layout");
      const done = doneMap(), list = MODELS.filter(m => !lock || m.id === lock), nDone = Object.keys(done).length;
      S("home").innerHTML = `
        <div class="sd-card"><h2>👤 معلوماتك</h2>
          ${userLocked ? `<p>مرحباً <b>${esc(user.name)}</b> ${user.grade ? "— " + esc(user.grade) : ""}</p>` : `
          <div class="sd-form">
            <div><label class="l">الاسم</label><input type="text" id="sdName" value="${esc(user.name || "")}" placeholder="اسمك الكامل"></div>
            <div><label class="l">الصف</label><input type="text" id="sdGrade" value="${esc(user.grade || "")}" placeholder="مثال: الرابع الإعدادي"></div>
            <div><label class="l">المدرسة</label><input type="text" id="sdSchool" value="${esc(user.school || "")}" placeholder="اسم مدرستك"></div>
          </div>`}
          <label class="sd-consent"><input type="checkbox" id="sdConsent" ${LS.get("sd_consent", false) ? "checked" : ""}> أوافق على حفظ إجاباتي ومشاركتها مع معلمي والمرشد لمساعدتي (ولولي الأمر/المدرسة الحق في طلب حذفها).</label>
        </div>
        <div class="sd-card"><h2>🎯 اختر النموذج</h2>
          <div class="sd-grid">${list.map(m => `<button class="sd-tile ${done[m.id] ? "done" : ""}" data-id="${m.id}"><span class="lt">${m.id}</span><span class="em">${m.icon}</span><span class="nm">${esc(m.title)}</span></button>`).join("")}</div>
          ${nDone >= 2 ? `<div class="sd-btns"><button class="sd-btn ghost" id="sdProfile">📊 ملفي الشامل (${nDone} نموذج)</button></div>` : ""}
        </div>`;
      S("home").querySelectorAll(".sd-tile").forEach(t => t.addEventListener("click", () => begin(t.dataset.id)));
      const pb = $("#sdProfile"); if (pb) pb.addEventListener("click", profile);
      show("home"); flush();
    }
    function saveUser() {
      if (userLocked) return;
      user = { name: ($("#sdName").value || "").trim(), grade: ($("#sdGrade").value || "").trim(), school: ($("#sdSchool").value || "").trim() };
      LS.set("sd_user", user);
    }

    /* ===== بدء نموذج ===== */
    function begin(id) {
      saveUser();
      if (!user.name) { alert("من فضلك اكتب اسمك أولاً 🙂"); const n = $("#sdName"); if (n) n.focus(); return; }
      const ck = $("#sdConsent"); if (ck && !ck.checked) { alert("نحتاج موافقتك على حفظ الإجابات للمتابعة."); return; }
      LS.set("sd_consent", true);
      const model = MODELS.find(m => m.id === id), ex = EXTRA[id];
      const opt = arr => shuf(arr.map((text, type) => ({ text, type })));
      const base = model.qs.map(q => ({ kind: "base", q: q.q, opts: opt(q.o) }));
      const img = { kind: "image", q: ex.img.q, src: ex.img.src, mode: ex.img.mode || "free", limit: ex.img.limit || FAST_LIMIT, show: ex.img.show || 0, timeoutType: ex.img.timeoutType, opts: opt(ex.img.o) };
      const fast = { kind: "fast", q: ex.dual.q, limit: FAST_LIMIT, opts: opt(ex.dual.o) };
      const slow = { kind: "slow", q: ex.dual.q, delay: SLOW_DELAY, opts: opt(ex.dual.o) };
      const items = [...base.slice(0, 3), img, ...base.slice(3, 5), fast, ...base.slice(5), slow];
      items.forEach(it => it.exp = E.expectedSec(it.q, it.opts.map(o => o.text)));
      run = { model, ex, items, i: 0, answers: [], t0: Date.now(), start: 0, locked: false };
      root.setAttribute("data-layout", ex.layout);
      S("intro").innerHTML = `<div class="sd-card"><div class="sd-who"><div class="sd-av">🧑‍⚕️</div><div><b>المرشد</b><small>${esc(model.icon + " " + model.title)}</small></div></div>
        <div class="sd-bubble">${esc(INTRO[ex.layout])}</div>
        <div class="sd-bubble">💡 أحياناً سأطلب منك الإجابة <b>بسرعة</b> ⚡ وأحياناً <b>بتأنٍّ</b> 🐢. وسأعيد عليك سؤالاً مرة بسرعة ومرة بهدوء، وهذا جزء من اللعبة 🙂</div>
        <div class="sd-btns"><button class="sd-btn" id="sdGo">ابدأ ✨</button><button class="sd-btn ghost" id="sdBack">رجوع</button></div></div>`;
      $("#sdGo").addEventListener("click", () => { show("quiz"); render(); });
      $("#sdBack").addEventListener("click", home);
      show("intro");
    }

    /* ===== عرض سؤال ===== */
    function render() {
      clearTimers();
      const { model, items, i, ex } = run, it = items[i];
      run.locked = false;
      const modeTag = it.kind === "fast" ? `<span class="sd-mode fast">⚡ أجب بسرعة (${it.limit} ث)</span>`
        : it.kind === "slow" ? `<span class="sd-mode slow">🐢 سؤال سبق أن مرّ بك — فكّر بهدوء، ستظهر الخيارات بعد ${it.delay} ثوان</span>`
        : it.kind === "image" && it.mode === "fast" ? `<span class="sd-mode fast">⚡ أجب بسرعة (${it.limit} ث)</span>`
        : it.kind === "image" && it.show ? `<span class="sd-mode show">👀 انظر ${it.show} ثوان ثم ستختفي الصورة</span>` : "";
      S("quiz").innerHTML = `<div class="sd-card">
        <div class="sd-qhead"><span>${esc(model.icon + " " + model.title)}</span><span>${i + 1} / ${items.length}</span></div>
        <div class="sd-bar"><i style="width:${i / items.length * 100}%"></i></div>
        <div class="sd-who" style="margin-top:14px"><div class="sd-av">🧑‍⚕️</div><div><b>المرشد</b></div></div>
        <span class="sd-banner">${model.icon}</span>${modeTag}
        ${it.kind === "image" ? `<div class="sd-fig" id="sdFig"><span class="gone">جاري تحميل الصورة...</span></div>` : ""}
        <div class="sd-qtext">${esc(it.q)}</div>
        <div class="sd-opts" id="sdOpts"></div>
        <div class="sd-timer hidden" id="sdTimer"><i></i></div></div>`;
      const box = $("#sdOpts");
      const drawOpts = enabled => {
        box.innerHTML = it.opts.map((o, k) => `<button class="sd-opt" data-k="${k}" ${enabled ? "" : "disabled"}><span class="k">${LETTERS[k]}</span><span>${esc(o.text)}</span></button>`).join("");
        if (enabled) box.querySelectorAll(".sd-opt").forEach(b => b.addEventListener("click", () => pick(+b.dataset.k)));
      };
      const startClock = () => { run.start = Date.now(); };
      const countdown = (sec, onEnd) => {
        const tm = $("#sdTimer"); tm.classList.remove("hidden"); const bar = tm.querySelector("i"); const t0 = Date.now();
        const iv = setInterval(() => { const left = 1 - (Date.now() - t0) / (sec * 1000); bar.style.width = Math.max(0, left * 100) + "%"; if (left <= 0) { clearInterval(iv); onEnd(); } }, 100);
        timers.push(iv);
      };

      if (it.kind === "image") {
        const fig = $("#sdFig"); const im = new Image(); let handled = false;
        const ready = failed => {
          if (handled) return; handled = true; it.imgFailed = !!failed;
          fig.innerHTML = failed ? `<span class="gone">🖼️ تعذر تحميل الصورة، تخيّل شكلاً محيّراً وأجب</span>` : ""; if (!failed) fig.appendChild(im);
          if (it.show && !failed) {
            drawOpts(false); box.classList.add("hidden"); $(".sd-qtext").classList.add("hidden"); countdown(it.show, () => {
              fig.innerHTML = `<span class="gone">اختفت الصورة 🙈</span>`; $(".sd-qtext").classList.remove("hidden"); box.classList.remove("hidden"); $("#sdTimer").classList.add("hidden"); drawOpts(true); startClock();
            });
          } else { drawOpts(true); startClock(); if (it.mode === "fast") countdown(it.limit, () => timeout()); }
        };
        im.onload = () => ready(false); im.onerror = () => ready(true); im.alt = "صورة السؤال"; im.src = it.src;
        timers.push(setTimeout(() => ready(true), 9000));
      } else if (it.kind === "fast") { drawOpts(true); startClock(); countdown(it.limit, () => timeout()); }
      else if (it.kind === "slow") {
        drawOpts(false); countdown(it.delay, () => { $("#sdTimer").classList.add("hidden"); drawOpts(true); startClock(); });
        $("#sdTimer i").style.background = "var(--sd-c1)";
      } else { drawOpts(true); startClock(); }
    }
    function record(k, timedOut) {
      const it = run.items[run.i], o = k >= 0 ? it.opts[k] : null;
      const sec = Math.round((Date.now() - run.start) / 100) / 10;
      let type = o ? o.type : -1;
      if (timedOut && it.timeoutType !== undefined) type = it.timeoutType;
      run.answers.push({ n: run.i + 1, kind: it.kind, q: it.q, text: o ? o.text : "(انتهى الوقت)", type, pos: k, sec, exp: it.exp, timeout: !!timedOut, imgFailed: !!it.imgFailed });
    }
    function next() {
      run.i++;
      if (run.i < run.items.length) render();
      else { clearTimers(); S("problems").innerHTML = `<div class="sd-card"><div class="sd-who"><div class="sd-av">🧑‍⚕️</div><div><b>المرشد</b></div></div>
        <div class="sd-bubble">شكراً لك! سؤال أخير: هل هناك شيء يزعجك أو مشكلة تواجهها في الدراسة أو البيت أو المدرسة؟ اكتبها بكل صراحة (اختياري).</div>
        <textarea id="sdProb" placeholder="اكتب هنا..."></textarea><div class="sd-btns"><button class="sd-btn" id="sdFin">عرض نتيجتي ✨</button></div></div>`;
        $("#sdFin").addEventListener("click", finish); show("problems"); }
    }
    function pick(k) {
      if (run.locked) return; run.locked = true; clearTimers();
      record(k, false);
      const b = root.querySelectorAll(".sd-opt")[k]; if (b) b.classList.add("sel"); $("#sdOpts").classList.add("lock");
      setTimeout(next, 330);
    }
    function timeout() {
      if (run.locked) return; run.locked = true; clearTimers(); record(-1, true);
      $("#sdOpts").classList.add("lock"); const t = $("#sdTimer"); t.innerHTML = `<i style="width:100%;background:var(--sd-bad)"></i>`;
      setTimeout(next, 500);
    }

    /* ===== النهاية والتحليل ===== */
    async function aiCall(summary) {
      if (!cfg.ai || !cfg.endpoint) return "";
      try {
        const c = new AbortController(), t = setTimeout(() => c.abort(), cfg.aiTimeout);
        const r = await fetch(cfg.endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "ai", summary }), signal: c.signal });
        clearTimeout(t); const j = await r.json(); return (j && j.text) || "";
      } catch (e) { return ""; }
    }
    async function finish() {
      const btn = $("#sdFin"); btn.disabled = true; btn.textContent = "جاري التحليل...";
      const { model, answers } = run, problems = ($("#sdProb").value || "").trim();
      const an = E.analyze(model, answers, problems);
      const forecast = E.predict(model, an, problems);
      const ai = await aiCall({ kind: "model", model: model.title, types: model.types.map((t, i) => ({ name: t.n, percent: an.pct[i] })),
        latency: an.lat, dual: an.dual.ok ? { same: an.dual.same, shift: an.dual.shift } : null, reliability: an.reliability, problems });
      const total = Math.round((Date.now() - run.t0) / 1000);
      const payload = {
        action: "save", model: model.id, modelTitle: model.title, name: user.name, grade: user.grade || "", school: user.school || "",
        totalSec: total, avgSec: an.lat.avgSec, typeIndex: an.dom + 1, typeName: model.types[an.dom].n,
        typeNames: model.types.map(t => t.n), dist: an.pct,
        details: answers.map(a => `س${a.n} [${a.kind}${a.cls ? "/" + E.CLS_AR[a.cls] : ""}${a.timeout ? "/انتهى الوقت" : ""}]: ${a.text}${a.type >= 0 ? " ← " + model.types[a.type].n : ""} (${a.sec}ث)`).join("\n"),
        problems, result: E.reportText(model, an, problems) + (ai ? `\n\n[تفسير الذكاء الاصطناعي]\n${ai}` : ""),
        reliability: an.reliability, alerts: an.alerts.join("، "),
        latency: `اندفاع ${an.lat.imp} | متزن ${an.lat.bal} | بطيء ${an.lat.slow} | ${an.speedStyle}`,
        dualText: an.dual.ok ? (an.dual.same ? "متطابق" : "مختلف: " + an.dual.shift) : "—", faking: an.faking, forecast, ts: new Date().toISOString()
      };
      const done = doneMap(); done[model.id] = { type: payload.typeName, ts: payload.ts }; LS.set("sd_done", done);
      const res = LS.get("sd_results", {}); res[model.id] = { dom: an.dom, domName: payload.typeName, pct: an.pct, relCode: an.relCode, faking: an.faking }; LS.set("sd_results", res);
      queue(payload);
      resultView(model, an, forecast, ai);
      if (cfg.onFinish) try { cfg.onFinish(payload); } catch (e) {}
      root.dispatchEvent(new CustomEvent("sd:finish", { detail: payload, bubbles: true }));
      const st = await flush(); status(st);
      if (Object.keys(res).length >= 2) pushProfile(res);
    }
    function status(st) {
      const el = $("#sdStatus"); if (!el) return;
      if (!cfg.endpoint) { el.className = "sd-status"; el.textContent = "💾 نتيجتك محفوظة على هذا الجهاز."; }
      else if (st.left === 0) { el.className = "sd-status ok"; el.textContent = "✅ تم إرسال نتيجتك إلى معلمك."; }
      else { el.className = "sd-status err"; el.textContent = "📡 تعذر الإرسال الآن، ستُرسل تلقائياً عند توفر الإنترنت."; }
    }

    function resultView(model, an, forecast, ai) {
      root.setAttribute("data-layout", "story");
      const D = model.types[an.dom], L = an.lat, done = doneMap(), nextM = MODELS.find(m => !done[m.id] && (!lock || m.id === lock));
      const rel = an.relCode === 2 ? "عالٍ ✅" : an.relCode === 1 ? "متوسط — حاول أن تجيب بما تفعله فعلاً" : "منخفض — جرّب إعادة النموذج لاحقاً بهدوء";
      const dualMsg = !an.dual.ok ? "" : an.dual.same ? "إجابتك السريعة والمتأنية على السؤال المزدوج كانت متطابقة، وهذا يدل على وضوح شخصيتك."
        : "اختلفت إجابتك السريعة عن المتأنية، وهذا طبيعي وقد يعني أنك تفكر مرتين قبل أن تقرر.";
      const rows = model.types.map((t, i) => `<div class="sd-row"><span>${esc(t.n)}</span><div class="sd-tr"><i style="background:${COLORS[i]}" data-w="${an.pct[i]}"></i></div><b>${an.pct[i]}%</b></div>`).join("");
      S("result").innerHTML = `<div class="sd-card">
        <div class="sd-hero"><div class="big">${model.icon}</div><p>نتيجتك في «${esc(model.title)}»</p><h3>${esc(D.n)}</h3></div>
        <div class="sd-chips"><span class="sd-chip">وضوح النتيجة: ${an.clarity}</span>${an.pct[an.sec2] >= 25 ? `<span class="sd-chip">النمط الثاني: ${esc(model.types[an.sec2].n)}</span>` : ""}<span class="sd-chip">أسلوبك في الإجابة: ${an.speedStyle}</span></div>
        <div class="sd-dist">${rows}</div>
        <div class="sd-box"><b>🔎 من أنت في هذا النموذج؟</b>${esc(D.d)}</div>
        <div class="sd-box"><b>⏱️ تحليل زمن إجاباتك</b>
          <div class="sd-stats"><div class="sd-stat"><b>${L.imp}</b><span>سريعة جداً</span></div><div class="sd-stat"><b>${L.bal}</b><span>متزنة</span></div><div class="sd-stat"><b>${L.slow}</b><span>بطيئة جداً</span></div></div>
          <p style="margin-top:8px">متوسط زمنك ${L.avgSec} ثانية للسؤال. ${esc(dualMsg)}</p>
          <p>وضوح إجاباتك: ${rel}</p></div>
        <div class="sd-box ai"><b>🔮 توقّع ونصيحة</b>${esc(forecast)}</div>
        ${an.themes.length ? `<div class="sd-box"><b>📝 ما كتبته</b>أشرتَ إلى: ${esc(an.themes.join("، "))}. شكراً لصراحتك.</div>` : ""}
        ${ai ? `<div class="sd-box ai"><b>🤖 تفسير إضافي بالذكاء الاصطناعي</b>${esc(ai).replace(/\n/g, "<br>")}</div>` : ""}
        ${an.alerts.length ? `<div class="sd-box warn"><b>💛 شكراً لأنك كتبت ما يزعجك</b>ما كتبته مهم وسيهتم به معلمك أو المرشد. إن كنت تشعر بالخطر أو الحزن الشديد فتحدث اليوم مع شخص كبير تثق به.</div>` : ""}
        <div id="sdStatus" class="sd-status">⏳ جاري الحفظ...</div>
        <div class="sd-btns">${nextM ? `<button class="sd-btn" id="sdNext">التالي: ${nextM.icon} ${esc(nextM.title)}</button>` : ""}
          ${Object.keys(doneMap()).length >= 2 ? `<button class="sd-btn ghost" id="sdProf">📊 ملفي الشامل</button>` : ""}<button class="sd-btn ghost" id="sdHome">القائمة</button></div></div>`;
      show("result");
      setTimeout(() => S("result").querySelectorAll(".sd-tr i").forEach(x => x.style.width = x.dataset.w + "%"), 80);
      $("#sdHome").addEventListener("click", home);
      const n = $("#sdNext"); if (n) n.addEventListener("click", () => begin(nextM.id));
      const p = $("#sdProf"); if (p) p.addEventListener("click", profile);
    }

    /* ===== الملف الشامل عبر النماذج ===== */
    async function profile() {
      root.setAttribute("data-layout", "story");
      const c = E.cross(LS.get("sd_results", {}));
      const aiText = await aiCall({ kind: "profile", strengths: c.strengths, attention: c.attention, causes: c.causes.map(x => x.title), problems: "" });
      S("profile").innerHTML = `<div class="sd-card"><h2>📊 ملفي الشامل</h2><p>${esc(c.summary)}</p>
        <div class="sd-bar" style="margin:10px 0"><i style="width:${c.done / 26 * 100}%"></i></div>
        <div class="sd-box good"><b>💪 نقاط القوة</b>${c.strengths.length ? `<div class="sd-chips">${c.strengths.map(s => `<span class="sd-chip">${esc(s)}</span>`).join("")}</div>` : "أكمل نماذج أكثر لتظهر."}</div>
        <div class="sd-box warn"><b>🌱 تحتاج انتباهاً</b>${c.attention.length ? `<div class="sd-chips">${c.attention.map(s => `<span class="sd-chip" style="background:#fffbeb;color:#b45309">${esc(s)}</span>`).join("")}</div>` : "لا شيء واضح حتى الآن."}</div>
        ${c.causes.map(x => `<div class="sd-box ai"><b>🧩 ${esc(x.title)}</b>${esc(x.msg)}</div>`).join("") || `<div class="sd-box"><b>🧩 الأسباب الجذرية</b>تظهر عند إكمال نماذج متقاطعة (مثل المنطق + البيت + المعلم).</div>`}
        ${aiText ? `<div class="sd-box ai"><b>🤖 قراءة إضافية بالذكاء الاصطناعي</b>${esc(aiText).replace(/\n/g, "<br>")}</div>` : ""}
        <div class="sd-btns"><button class="sd-btn ghost" id="sdPH">رجوع</button></div></div>`;
      $("#sdPH").addEventListener("click", home); show("profile");
    }
    function pushProfile(res) {
      const c = E.cross(res);
      queue({ action: "profile", name: user.name, grade: user.grade || "", school: user.school || "", done: c.done,
        doneList: Object.keys(res).join(""), strengths: c.strengths.join(" | "), attention: c.attention.join(" | "),
        causes: c.causes.map(x => x.title + ": " + x.msg).join("\n"), summary: c.summary, ts: new Date().toISOString() });
      flush();
    }

    /* ===== الإرسال إلى Google Sheets (مع إعادة المحاولة) ===== */
    let flushing = false;
    function queue(p) { const q = LS.get("sd_queue", []); q.push(p); LS.set("sd_queue", q); }
    async function flush() {
      const q = LS.get("sd_queue", []);
      if (!cfg.endpoint || !q.length || flushing) return { left: q.length };
      flushing = true; const left = [];
      for (const item of q) {
        try { await fetch(cfg.endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(item) }); }
        catch (e) { left.push(item); }
      }
      LS.set("sd_queue", left); flushing = false; return { left: left.length };
    }
    window.addEventListener("online", flush);

    home();
    return { home, profile };
  }

  window.SDQuiz = { mount };
})();
