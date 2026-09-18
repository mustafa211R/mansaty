// ============================================================
// search.js — منطق البحث والفلترة وعرض الفيديوهات
// منصة طالب
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lessonsContainer");
  const searchBox = document.getElementById("searchBox");
  const subjectFilter = document.getElementById("subjectFilter");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");

  // ---------- استخراج الصورة المصغرة من رابط يوتيوب ----------
  function getYoutubeThumbnail(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "../logo.jfif";
  }

  // ---------- تعبئة فلتر المواد تلقائياً ----------
  function populateSubjects() {
    const subjects = [...new Set(lessons.map(l => l.subject))].sort();
    subjectFilter.innerHTML = `<option value="">كل المواد</option>`;
    subjects.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      subjectFilter.appendChild(opt);
    });
  }

  // ---------- عرض البطاقات ----------
  function displayLessons(list) {
    container.innerHTML = "";

    if (resultsCount) {
      resultsCount.textContent = `${list.length} فيديو`;
    }

    if (list.length === 0) {
      if (emptyState) emptyState.style.display = "flex";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    list.forEach((lesson, index) => {
      const card = document.createElement("a");
      card.href = `watch.html?id=${lesson.id}`;
      card.className = "lesson-card ripple animate-card";
      card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;

      card.innerHTML = `
        <div class="thumb-wrapper">
          <img src="${getYoutubeThumbnail(lesson.link)}"
               alt="${lesson.name}"
               class="thumb-img"
               loading="lazy">
          <div class="play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div class="card-body">
          <div class="card-badge">${lesson.subject}</div>
          <h3 class="card-title">${lesson.name}</h3>
          <p class="card-teacher">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${lesson.teacher}
          </p>
          <p class="card-date">${lesson.date}</p>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // ---------- الفلترة ----------
  function filterLessons() {
    const q = searchBox.value.trim().toLowerCase();
    const subj = subjectFilter.value;

    const filtered = lessons.filter(l => {
      const matchQ = !q ||
        l.name.toLowerCase().includes(q) ||
        l.teacher.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q);
      const matchSubj = !subj || l.subject === subj;
      return matchQ && matchSubj;
    });

    displayLessons(filtered);
  }

  // ---------- الأحداث ----------
  searchBox.addEventListener("input", filterLessons);
  subjectFilter.addEventListener("change", filterLessons);

  // ---------- التشغيل الأولي ----------
  populateSubjects();
  displayLessons(lessons);
});