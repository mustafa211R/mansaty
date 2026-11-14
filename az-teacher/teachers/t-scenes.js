/* المشاهد الصفية الإسقاطية (Projective Visual Scenarios) — رسوم SVG محايدة مضمّنة بلا أي اعتماد على الشبكة.
   المشاهد عمداً غامضة: لا نص فيها ولا تعبيرات وجه، ليُسقط المعلم تفسيره عليها. */
(function () {
  const C = { ink: "#1b2f4b", slate: "#5b6b82", mist: "#cfd8e3", ivory: "#f6f2e8", sand: "#e4dac0", gold: "#b08d3c", board: "#24443d", chalk: "#f2f2ee", sky: "#d3e5f2", skin: "#d9b99b", hair: "#3b3b3b", wood: "#bfa77a", night: "#16233a", lamp: "#f3d98a" };
  const wrap = (inner, label) => `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet"><rect width="480" height="270" fill="${C.ivory}"/>${inner}</svg>`;
  const front = (x, y, s = 1, col = C.ink, legs = true) => `<g transform="translate(${x} ${y}) scale(${s})">${legs ? `<rect x="-8" y="0" width="6" height="26" fill="${C.slate}"/><rect x="2" y="0" width="6" height="26" fill="${C.slate}"/>` : ""}<circle cx="0" cy="-34" r="9" fill="${C.skin}"/><path d="M-12 0 v-18 a12 12 0 0 1 24 0 v18 z" fill="${col}"/></g>`;
  const back = (x, y, s = 1, col = C.slate) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-22" r="9" fill="${C.hair}"/><path d="M-13 0 v-8 a13 13 0 0 1 26 0 v8 z" fill="${col}"/></g>`;
  const dot = (x, y, col = C.ink, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
  const desk = (x, y, w = 40, h = 22, rot = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${C.wood}" stroke="${C.slate}" stroke-width="1" transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"/>`;
  const scribble = (x, y, w, n, col = C.chalk) => { let s = ""; for (let i = 0; i < n; i++) { const yy = y + i * 14; let d = `M${x} ${yy}`; for (let k = 0; k < w; k += 16) d += ` q4 -7 8 0 t8 0`; s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.6" opacity=".85"/>`; } return s; };

  const S = {
    /* طالب ينظر من النافذة والسبورة مزدحمة بالمعادلات */
    window() {
      return wrap(`<rect y="220" width="480" height="50" fill="${C.sand}"/>
        <rect x="20" y="28" width="236" height="126" rx="4" fill="${C.board}" stroke="${C.wood}" stroke-width="5"/>${scribble(34, 52, 200, 7)}
        <rect x="336" y="30" width="118" height="108" rx="3" fill="${C.sky}" stroke="${C.slate}" stroke-width="4"/><path d="M395 30v108M336 84h118" stroke="${C.slate}" stroke-width="3"/><circle cx="372" cy="62" r="16" fill="#a8c4a0"/><rect x="369" y="70" width="6" height="22" fill="#7d6a4c"/>
        ${front(284, 150, 1, C.ink)}<path d="M268 120 l-18 -12" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
        ${[70, 130, 190].map(x => back(x, 232, 1)).join("")}${[100, 160].map(x => back(x, 258, 1)).join("")}
        ${desk(60, 236, 60, 14)}${desk(120, 236, 60, 14)}
        ${back(380, 220, 1, C.ink)}<path d="M386 200 L402 150" stroke="${C.gold}" stroke-width="2" stroke-dasharray="4 4"/>`, "مشهد صفي");
    },
    /* طالب يرفع يده في آخر الصف والمعلم يواجه السبورة */
    hand() {
      return wrap(`<rect y="220" width="480" height="50" fill="${C.sand}"/>
        <rect x="24" y="24" width="300" height="130" rx="4" fill="${C.board}" stroke="${C.wood}" stroke-width="5"/>${scribble(40, 48, 250, 6)}
        <g transform="translate(350 154)"><rect x="-8" y="0" width="6" height="26" fill="${C.slate}"/><rect x="2" y="0" width="6" height="26" fill="${C.slate}"/><circle cx="0" cy="-34" r="9" fill="${C.hair}"/><path d="M-12 0 v-18 a12 12 0 0 1 24 0 v18 z" fill="${C.ink}"/><path d="M-10 -14 L-40 -50" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>
        ${[60, 120, 180, 240].map(x => back(x, 218, 0.8)).join("")}${[60, 120, 180, 240].map(x => desk(x - 22, 224, 44, 10)).join("")}
        ${[90, 150, 210].map(x => back(x, 258, 0.9)).join("")}
        <g><circle cx="410" cy="226" r="9" fill="${C.hair}"/><path d="M397 252 v-8 a13 13 0 0 1 26 0 v8 z" fill="${C.gold}"/><path d="M420 240 L436 198" stroke="${C.gold}" stroke-width="6" stroke-linecap="round"/><circle cx="437" cy="193" r="6" fill="${C.skin}"/></g>`, "مشهد صفي");
    },
    /* مقاعد في صفوف منتظمة ومعلم أمام الصف */
    rows() {
      let g = "";
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const x = 70 + c * 70, y = 100 + r * 55; g += desk(x, y + 10, 46, 22) + dot(x + 23, y + 6, C.ink, 7); }
      return wrap(`<rect x="10" y="10" width="460" height="250" rx="6" fill="#faf8f1" stroke="${C.mist}"/><rect x="170" y="20" width="140" height="10" rx="2" fill="${C.board}"/>
        ${dot(240, 55, C.gold, 9)}<path d="M240 64 v12" stroke="${C.gold}" stroke-width="3"/>${g}`, "مشهد صفي من الأعلى");
    },
    /* مجموعات تعاونية والمعلم يتنقل بينها */
    circles() {
      const cl = [[110, 90], [370, 90], [110, 200], [370, 200]]; let g = "";
      cl.forEach(([cx, cy]) => { g += `<circle cx="${cx}" cy="${cy}" r="24" fill="${C.wood}" stroke="${C.slate}"/>`; [[-36, 0], [36, 0], [0, -36], [0, 36]].forEach(([dx, dy]) => g += dot(cx + dx, cy + dy, "#4a78a8")); });
      return wrap(`<rect x="10" y="10" width="460" height="250" rx="6" fill="#faf8f1" stroke="${C.mist}"/>${g}
        <path d="M110 140 C 180 150, 250 130, 370 140 S 250 200, 150 160" fill="none" stroke="${C.gold}" stroke-width="2.5" stroke-dasharray="6 6"/>${dot(240, 140, C.gold, 9)}`, "مشهد صفي من الأعلى");
    },
    /* صف يعمّه الصخب والمعلم يرفع ذراعيه */
    mess() {
      const pts = [[70, 90, 20], [150, 60, -30], [260, 100, 10], [380, 70, -15], [90, 180, -20], [200, 200, 35], [320, 170, -5], [410, 200, 25]]; let g = "";
      pts.forEach(([x, y, r]) => { g += desk(x, y, 44, 22, r) + dot(x + 22, y - 10, "#4a78a8"); g += `<path d="M${x + 38} ${y - 20} q6 -8 12 0 t12 0" fill="none" stroke="${C.slate}" stroke-width="1.6"/>`; });
      return wrap(`<rect x="10" y="10" width="460" height="250" rx="6" fill="#faf8f1" stroke="${C.mist}"/>
        ${[[110, 140], [300, 130], [230, 230], [440, 130]].map(([x, y]) => `<rect x="${x}" y="${y}" width="22" height="16" fill="#fff" stroke="${C.mist}" transform="rotate(${x % 40} ${x} ${y})"/>`).join("")}${g}
        <g>${dot(240, 140, C.gold, 10)}<path d="M240 140 l-22 -26 M240 140 l22 -26" stroke="${C.gold}" stroke-width="4" stroke-linecap="round"/></g>`, "مشهد صفي من الأعلى");
    },
    /* طالب يحل على السبورة والمعلم يقف جانباً */
    board() {
      return wrap(`<rect y="220" width="480" height="50" fill="${C.sand}"/>
        <rect x="24" y="26" width="300" height="140" rx="4" fill="${C.board}" stroke="${C.wood}" stroke-width="5"/>${scribble(40, 52, 140, 3)}<path d="M200 60 q30 10 60 -10 t40 20" fill="none" stroke="${C.chalk}" stroke-width="2" stroke-dasharray="3 5"/>
        <g transform="translate(220 168)"><rect x="-8" y="0" width="6" height="26" fill="${C.slate}"/><rect x="2" y="0" width="6" height="26" fill="${C.slate}"/><circle cx="0" cy="-34" r="9" fill="${C.skin}"/><path d="M-12 0 v-18 a12 12 0 0 1 24 0 v18 z" fill="#4a78a8"/><path d="M8 -14 L30 -50" stroke="#4a78a8" stroke-width="5" stroke-linecap="round"/></g>
        ${front(380, 166, 1, C.ink)}<path d="M366 144 h28" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
        ${[70, 130, 190, 250].map(x => back(x, 236, 0.9)).join("")}`, "مشهد صفي");
    },
    /* معلم متأخر في الليل مع كومة دفاتر */
    tired() {
      return wrap(`<rect width="480" height="270" fill="${C.night}"/>
        <rect x="320" y="30" width="120" height="100" rx="3" fill="#0e1a2e" stroke="${C.slate}" stroke-width="4"/><circle cx="400" cy="68" r="14" fill="#f4eed2"/><circle cx="406" cy="64" r="12" fill="#0e1a2e"/>
        <rect y="200" width="480" height="70" fill="#2a3448"/><rect x="60" y="190" width="300" height="14" rx="3" fill="${C.wood}"/>
        <path d="M110 190 l-24 -50 h60 z" fill="${C.lamp}" opacity=".25"/><path d="M118 190 v-40 l-28 -22 h40" fill="none" stroke="${C.lamp}" stroke-width="3"/><circle cx="96" cy="128" r="6" fill="${C.lamp}"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${230 + (i % 2) * 4}" y="${176 - i * 11}" width="70" height="10" fill="${i % 2 ? "#e9e2cf" : "#cfc7ae"}" stroke="${C.slate}" stroke-width=".6"/>`).join("")}
        <g transform="translate(160 188)"><path d="M-14 0 v-20 a14 14 0 0 1 28 0 v20 z" fill="${C.slate}"/><circle cx="0" cy="-36" r="10" fill="${C.skin}"/><path d="M-9 -26 q-14 6 -16 22" stroke="${C.skin}" stroke-width="5" fill="none" stroke-linecap="round"/></g>
        <circle cx="60" cy="60" r="26" fill="#f6f2e8" stroke="${C.slate}" stroke-width="3"/><path d="M60 60 v-16 M60 60 l12 10" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`, "مشهد مسائي");
    },
    /* طريقان إلى الهدف نفسه: مباشر بعلامات، ومتعرج بإشارات توقف */
    roads() {
      return wrap(`<rect x="10" y="10" width="460" height="250" rx="6" fill="#faf8f1" stroke="${C.mist}"/>
        <path d="M60 220 L400 70" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><path d="M60 220 L400 70" stroke="${C.ivory}" stroke-width="2" stroke-dasharray="10 10"/>
        ${[0.25, 0.5, 0.75].map(t => dot(60 + 340 * t, 220 - 150 * t, C.gold, 6)).join("")}
        <path d="M60 220 C 120 250, 180 120, 240 190 S 330 90, 400 70" fill="none" stroke="${C.slate}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 9"/>
        ${[[150, 200], [250, 170], [330, 120]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="#a64b4b" transform="rotate(45 ${x} ${y})"/>`).join("")}
        <path d="M400 70 v-34" stroke="${C.ink}" stroke-width="3"/><path d="M400 36 l30 10 l-30 10 z" fill="${C.gold}"/>${front(60, 214, .7, "#4a78a8", false)}`, "مشهد رمزي");
    },
    /* لقاء بين معلم وولي أمر وبينهما ورقة */
    meeting() {
      return wrap(`<rect y="210" width="480" height="60" fill="${C.sand}"/>
        <rect x="90" y="150" width="300" height="14" rx="3" fill="${C.wood}"/><rect x="120" y="164" width="8" height="46" fill="${C.wood}"/><rect x="352" y="164" width="8" height="46" fill="${C.wood}"/>
        <rect x="210" y="140" width="60" height="12" fill="#fff" stroke="${C.slate}" transform="rotate(-4 240 146)"/>${[0, 1, 2].map(i => `<path d="M218 ${143 + i * 3} h40" stroke="${C.mist}" stroke-width="1" transform="rotate(-4 240 146)"/>`).join("")}
        ${front(150, 150, 1.15, C.ink, false)}${front(330, 150, 1.15, "#4a78a8", false)}`, "مشهد لقاء");
    }
  };

  window.TScenes = { svg: key => (S[key] || S.window)(), keys: Object.keys(S),
    desc: { window: "سبورة مزدحمة بالمعادلات، ومعلم يشرح، وطالب في الصف الخلفي ينظر من النافذة", hand: "معلم يواجه السبورة، وطالب في آخر الصف يرفع يده", rows: "مقاعد في صفوف منتظمة ومعلم أمام الصف", circles: "طلاب في مجموعات صغيرة ومعلم يتنقل بينها", mess: "مقاعد مبعثرة وأوراق وأصوات عالية ومعلم يرفع ذراعيه", board: "طالب يحل مسألة على السبورة ومعلم يقف جانباً", tired: "معلم متأخر في الليل أمام كومة دفاتر ومصباح", roads: "طريقان إلى الهدف نفسه: مستقيم بعلامات، ومتعرج بإشارات توقف", meeting: "معلم وولي أمر يجلسان وبينهما ورقة" } };
})();
