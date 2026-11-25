class Student {
  #sub1;
  #sub2;
  #sub3;
  #attendance;

  constructor(name, sub1, sub2, sub3, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("من فضلك أدخل اسم الطالب.");
    }
    this.name = name.trim();
    this.sub1 = sub1;
    this.sub2 = sub2;
    this.sub3 = sub3;
    this.attendance = attendance;
  }

  #checkScoreOrAttendance(val, label) {
    if (val === "" || val === null || val === undefined) {
      throw new Error(`حقل ${label} لا يمكن أن يكون فارغاً.`);
    }
    const num = Number(val);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      throw new Error(`قيمة ${label} يجب أن تكون رقماً بين 0 و 100.`);
    }
    return num;
  }

  set sub1(val) { this.#sub1 = this.#checkScoreOrAttendance(val, "المادة 1"); }
  get sub1() { return this.#sub1; }

  set sub2(val) { this.#sub2 = this.#checkScoreOrAttendance(val, "المادة 2"); }
  get sub2() { return this.#sub2; }

  set sub3(val) { this.#sub3 = this.#checkScoreOrAttendance(val, "المادة 3"); }
  get sub3() { return this.#sub3; }

  set attendance(val) { this.#attendance = this.#checkScoreOrAttendance(val, "نسبة الحضور"); }
  get attendance() { return this.#attendance; }

  getAverage() {
    return (this.#sub1 + this.#sub2 + this.#sub3) / 3;
  }
}

const studentsList = [];

const studentNameInput = document.getElementById("studentName");
const sub1Input = document.getElementById("sub1");
const sub2Input = document.getElementById("sub2");
const sub3Input = document.getElementById("sub3");
const attendanceInput = document.getElementById("attendance");

const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

addBtn.onclick = function () {
  errorBox.classList.add("d-none");
  errorBox.textContent = "";

  try {
    const student = new Student(
      studentNameInput.value,
      sub1Input.value,
      sub2Input.value,
      sub3Input.value,
      attendanceInput.value
    );

    studentsList.push(student);

    studentsBox.innerHTML += `
      <div class="border-bottom py-2 d-flex justify-content-between">
        <span><strong>${student.name}</strong> — حضور: ${student.attendance}%</span>
        <span>المتوسط: ${student.getAverage().toFixed(2)}</span>
      </div>
    `;

    studentNameInput.value = "";
    sub1Input.value = "";
    sub2Input.value = "";
    sub3Input.value = "";
    attendanceInput.value = "";
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("d-none");
  }
};

mercyBtn.onclick = function () {
  const struggling = studentsList.filter((st) => {
    const avg = st.getAverage();
    return avg >= 40 && avg <= 49;
  });

  if (struggling.length === 0) {
    reportBox.innerHTML = `<p class="text-muted mb-0">لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49).</p>`;
    return;
  }

  const withMercy = struggling.map((st) => ({
    name: st.name,
    newAvg: st.getAverage() + 5,
  }));

  const totalNewAvg = withMercy.reduce((acc, item) => acc + item.newAvg, 0);
  const overallAvg = (totalNewAvg / withMercy.length).toFixed(2);

  const namesHtml = withMercy.map((item) => `<li>${item.name} (${item.newAvg.toFixed(2)})</li>`).join("");

  reportBox.innerHTML = `
    <p><strong>عدد الطلاب المتعثرين:</strong> ${withMercy.length}</p>
    <p><strong>أسماء الطلاب:</strong></p>
    <ul>${namesHtml}</ul>
    <p class="mb-0"><strong>المتوسط العام بعد الرأفة:</strong> ${overallAvg}</p>
  `;
};