// config.js
document.addEventListener("DOMContentLoaded", () => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUgLNGhOaKsinIMKXpQY5Kff_oSplWZgFie1Sc4OP4J3Xjz-iI5yl4hIYBpRIeam8-/exec"; // <-- ضع رابط السكربت هنا

  const birthdateInput = document.getElementById("birthdate");
  const usernameField = document.getElementById("username");
  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");

  // توليد حرف إنجليزي عشوائي كبير
  function randomUpperChar() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

  // توليد اسم المستخدم من تاريخ الميلاد + حرف عشوائي
  birthdateInput.addEventListener("change", () => {
    const dateValueRaw = birthdateInput.value || "";
    const dateValue = dateValueRaw.replace(/-/g, ""); // مثال: 2007-12-12 -> 20071212
    if (dateValue.length === 8) {
      usernameField.value = `${dateValue}${randomUpperChar()}`;
    } else {
      usernameField.value = "";
    }
  });

  // تحقق من كلمة المرور وارسال النموذج
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const isValid =
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password);

    if (!isValid) {
      passwordError.classList.remove("hidden");
      return;
    }
    passwordError.classList.add("hidden");

    const data = {
      fullname: document.getElementById("fullname").value.trim(),
      address: document.getElementById("address").value.trim(),
      birthdate: birthdateInput.value,
      schoolName: document.getElementById("schoolName").value.trim(),
      schoolType: document.getElementById("schoolType").value,
      schoolAddress: document.getElementById("schoolAddress").value.trim(),
      username: usernameField.value,
      password: password // ⚠️ لاحقًا يمكن تشفيرها قبل الحفظ
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      alert(`✅ تم إنشاء الحساب بنجاح!\nاسم المستخدم: ${data.username}`);
      form.reset();
      usernameField.value = "";
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("❌ حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.");
    }
  });
});
