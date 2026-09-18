// تحميل بيانات الطالب من localStorage أو تهيئة جديدة
let studentInfo = JSON.parse(localStorage.getItem("studentInfo")) || {
  name: "",
  currentScore: 0,
  totalScore: 0,
  timeTaken: 0,
  date: "",
  rating: ""
};

// حفظ فوري في localStorage
function saveStudentInfo() {
  localStorage.setItem("studentInfo", JSON.stringify(studentInfo));
}

// تحديثات البيانات مع الحفظ
function setStudentName(name) {
  studentInfo.name = name;
  saveStudentInfo();
}

function updateScore(score) {
  studentInfo.currentScore = score;
  saveStudentInfo();
}

function setTotalScore(total) {
  studentInfo.totalScore = total;
  saveStudentInfo();
}

function setTimeTaken(minutes) {
  studentInfo.timeTaken = minutes;
  saveStudentInfo();
}

function setCompletionDate(dateStr) {
  studentInfo.date = dateStr;
  saveStudentInfo();
}

function setRating(ratingStr) {
  studentInfo.rating = ratingStr;
  saveStudentInfo();
}

function clearStudentInfo() {
  localStorage.removeItem("studentInfo");
  studentInfo = {
    name: "",
    currentScore: 0,
    totalScore: 0,
    timeTaken: 0,
    date: "",
    rating: ""
  };
}
