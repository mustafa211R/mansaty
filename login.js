// login.js
document.addEventListener("DOMContentLoaded", () => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaSPu3x9Ui2H-Y4h_5Dkv-x98a9TiJSwa8MAsmeJtMBQ1wPvcYt1r8zYG-0Cf6vXED/exec"; // ضع هنا رابطك بعد النشر
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    // جهز الـ URL مع الترميز
    const url = `${SCRIPT_URL}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        // credentials: 'omit' // افتراضي omit في أغلب الحالات
      });

      // تحقق من وجود الاستجابة
      if (!res.ok) {
        // إن returned 200 لكن fetch رمى خطأ سابقًا، نتحقق من الحالة
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "success") {
        alert("✅ تسجيل الدخول ناجح");
        // تخزين بيانات بسيطة في localStorage
        localStorage.setItem("fullname", data.fullname || "");
        localStorage.setItem("schoolName", data.schoolName || "");
        localStorage.setItem("schoolType", data.schoolType || "");
        localStorage.setItem("schoolAddress", data.schoolAddress || "");
        // انتقل للصفحة الرئيسية
        window.location.href = "index.html";
      } else {
        alert("❌ " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("حدث خطأ أثناء الاتصال بالخادم.\nتحقق من نشر الـ Web App و السماح بالوصول للعامة (Anyone, even anonymous).");
    }
  });
});
