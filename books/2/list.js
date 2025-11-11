// بيانات الكتب بصيغة JSON
const books = [
  {
    id: 1,
    name: "مبادئ الحاسوب",
    teacher: "الأستاذ أحمد علي",
    file: "uploads/pdf-test.pdf",
    date: "2025-11-10",
    cover: "https://img.freepik.com/free-vector/open-book-concept-illustration_114360-4527.jpg"
  },
  {
    id: 2,
    name: "أساسيات البرمجة",
    teacher: "الأستاذ مصطفى حيم فندي",
    file: "uploads/programming_fundamentals.pdf",
    date: "2025-11-09",
    cover: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1673.jpg"
  },
  {
    id: 3,
    name: "مدخل إلى الذكاء الاصطناعي",
    teacher: "الأستاذة سارة علي",
    file: "uploads/ai_intro.pdf",
    date: "2025-11-08",
    cover: "https://img.freepik.com/free-vector/artificial-intelligence-illustration_114360-3916.jpg"
  }
];

// المراجع
const booksContainer = document.getElementById("booksContainer");
const searchBox = document.getElementById("searchBox");

// عرض الكتب
function displayBooks(filteredBooks) {
  booksContainer.innerHTML = "";

  filteredBooks.forEach(book => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center";

    card.innerHTML = `
      <img src="${book.cover}" alt="${book.name}" class="w-28 h-28 object-cover rounded-r-2xl">
      <div class="p-4 flex-1">
        <h2 class="text-lg font-bold text-gray-800 mb-1">${book.name}</h2>
        <p class="text-gray-600 text-sm">${book.teacher}</p>
        <p class="text-gray-400 text-xs mt-1">${book.date}</p>
        <div class="flex gap-3 mt-3">
          <a href="reader.html?file=${encodeURIComponent(book.file)}"
             class="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full hover:scale-105 transition">
             <i data-lucide="book-open" class="w-4 h-4"></i> قراءة
          </a>
          <a href="${book.file}" download
             class="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition">
             <i data-lucide="download" class="w-4 h-4"></i> تحميل
          </a>
        </div>
      </div>
    `;

    booksContainer.appendChild(card);
  });

  lucide.createIcons();
}

// البحث والفلترة
searchBox.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = books.filter(
    b => b.name.toLowerCase().includes(q) || b.teacher.toLowerCase().includes(q)
  );
  displayBooks(filtered);
});

// تشغيل أولي
displayBooks(books);
