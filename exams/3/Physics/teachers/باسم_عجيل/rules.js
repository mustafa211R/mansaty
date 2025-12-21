// Test Settings
const rules = {
  passingScore: 5, // Minimum score to pass
  totalTime: 10, // Time in minutes
  helpThreshold: 4, // Score after which the help button appears
  name_teacher: 'باسم عجيل', // Teacher's name
  subject: 'Physics', // Subject name
  signature_image: "uploads/tec.jpg" // Signature image link
};

// ✅ Function to save rules in localStorage
function saveRules() {
  localStorage.setItem("rules", JSON.stringify(rules));
}

// ✅ Check on page load: Only save rules if they don't already exist.
(function initializeRules() {
  if (!localStorage.getItem("rules")) {
    saveRules();
    console.log("✅ Rules saved in localStorage for the first time.");
  } else {
    console.log("ℹ️ Rules already exist in localStorage.");
  }
})();

