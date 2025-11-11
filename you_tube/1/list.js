// بيانات الدروس بصيغة JSON
const lessons = [
  {
    id: 1,
    name: "مقدمة في الحاسوب",
    teacher: "الأستاذ أحمد علي",
    link: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    date: "2025-11-10"
  },
  {
    id: 2,
    name: "أساسيات البرمجة",
    teacher: "الأستاذ مصطفى حيم فندي",
    link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    date: "2025-11-09"
  },
  {
    id: 3,
    name: "مدخل إلى الذكاء الاصطناعي",
    teacher: "الأستاذة سارة علي",
    link: "https://www.youtube.com/watch?v=abc123xyz",
    date: "2025-11-08"
  }
];

// مرجع للعناصر
const lessonsContainer = document.getElementById("lessonsContainer");
const searchBox = document.getElementById("searchBox");

// دالة لجلب صورة مصغرة من يوتيوب تلقائيًا
function getYoutubeThumbnail(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "default.jpg";
}

// عرض الدروس
function displayLessons(filteredLessons) {
  lessonsContainer.innerHTML = "";

  filteredLessons.forEach(lesson => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl";

    card.innerHTML = `
      <div class="flex items-center">
        <img src="${getYoutubeThumbnail(lesson.link)}" alt="${lesson.name}" class="w-32 h-24 object-cover rounded-r-2xl">
        <div class="p-4 flex-1">
          <h2 class="text-lg font-bold text-gray-800 mb-1">${lesson.name}</h2>
          <p class="text-gray-600 text-sm">${lesson.teacher}</p>
          <p class="text-gray-400 text-xs mt-1">${lesson.date}</p>
          <a href="watch.html?link=${encodeURIComponent(lesson.link)}"
             class="inline-block mt-3 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full hover:scale-105 transition">
             مشاهدة
          </a>
        </div>
      </div>
    `;
    lessonsContainer.appendChild(card);
  });
}

// البحث والفلترة
searchBox.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = lessons.filter(
    l => l.name.toLowerCase().includes(q) || l.teacher.toLowerCase().includes(q)
  );
  displayLessons(filtered);
});

// تشغيل أولي
displayLessons(lessons);
