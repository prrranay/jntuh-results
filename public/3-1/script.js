const results = [];
const roll = {
  "21s11a0567": 0,
  "21s11a0568": 1,
  "21s11a0569": 2,
  "21s11a0570": 3,
  "21s11a0571": 4,
  "21s11a0572": 5,
  "21s11a0573": 6,
  "21s11a0574": 7,
  "21s11a0575": 8,
  "21s11a0576": 9,
  "21s11a0577": 10,
  "21s11a0578": 11,
  "21s11a0580": 12,
  "21s11a0581": 13,
  "21s11a0582": 14,
  "21s11a0583": 15,
  "21s11a0584": 16,
  "21s11a0585": 17,
  "21s11a0586": 18,
  "21s11a0587": 19,
  "21s11a0588": 20,
  "21s11a0589": 21,
  "21s11a0590": 22,
  "21s11a0591": 23,
  "21s11a0592": 24,
  "21s11a0593": 25,
  "21s11a0594": 26,
  "21s11a0595": 27,
  "21s11a0596": 28,
  "21s11a0597": 29,
  "21s11a0599": 30,
  "21s11a05a0": 31,
  "21s11a05a1": 32,
  "21s11a05a2": 33,
  "21s11a05a3": 34,
  "21s11a05a4": 35,
  "21s11a05a5": 36,
  "21s11a05a6": 37,
  "21s11a05a7": 38,
  "21s11a05a8": 39,
  "21s11a05a9": 40,
  "21s11a05b0": 41,
  "21s11a05b1": 42,
  "21s11a05b2": 43,
  "21s11a05b3": 44,
  "21s11a05b4": 45,
  "21s11a05b5": 46,
  "21s11a05b6": 47,
  "21s11a05b7": 48,
  "21s11a05b8": 49,
  "21s11a05b9": 50,
  "21s11a05c0": 51,
  "21s11a05c1": 52,
  "21s11a05c2": 53,
  "21s11a05c3": 54,
  "21s11a05c4": 55,
  "21s11a05c5": 56,
  "21s11a05c6": 57,
  "21s11a05c8": 58,
  "21s11a05c9": 59,
  "21s11a05d0": 60,
  "22s15a0508": 61,
  "22s15a0509": 62,
  "22s15a0510": 63,
  "22s15a0511": 64,
  "22s15a0512": 65,
  "22s15a0513": 66,
  "22s15a0514": 67,
};
document
  .getElementById("resultsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.querySelector(".input-data").style.display = "none";
    fetchResults();
  });
let display = false;
document.querySelector(".ham-links").addEventListener("click", function (e) {
  if (display) {
    document.querySelector(".nav-links-ham").style.display = "none";
    document.getElementById("ham").src = "/assets/ham.svg";
    display = false;
  } else {
    document.querySelector(".nav-links-ham").style.display = "flex";
    document.getElementById("ham").src = "/assets/cross.svg";
    display = true;
  }
});

document.getElementById("rollNoInput").addEventListener("keyup", function (e) {
  document.getElementById("rollNoInput").value = document
    .getElementById("rollNoInput")
    .value.toUpperCase();
});

function fetchResults() {
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `<div class="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>`;
  var rollNo = document.getElementById("rollNoInput").value;
  if (rollNo.length != 10) {
    displayError("Invalid Roll Number please try again!");
    return;
  }
  let data = results[roll[rollNo.toLowerCase()]];
  displayResults(data);
}

function displayResults(data) {
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ""; // Clear previous results
  console.log(data);

  // Display loading indicator
  resultContainer.innerHTML = `<div class="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    </div>`;

  if (!data || !data.Details || !data.Results) {
    displayError("No results found.");
    return;
  }
  // Fetching results
  setTimeout(function () {
    // Display student details
    var detailsHTML = `<h2>Student Details</h2>
      <table><tr><th>Name</th><th>Roll Number</th><th>College Code</th><th>Father's Name</th></tr>
      <td>${data.Details.NAME}</td><td>${data.Details.Roll_No}</td><td>${data.Details.COLLEGE_CODE}</td><td>${data.Details.FATHER_NAME}</td></tr></table>`;

    // Display fetched results
    var resultHTML = "<h2>Results</h2>";
    var totalCGPA = 0;
    var totalSemesters = 0;
    var totalBacklogs = 0;

    for (const semester in data.Results) {
      if (semester === "Total") {
        continue; // Skip iterating over "Total" key
      }

      const semesterData = data.Results[semester];
      if (!semesterData || Object.keys(semesterData).length === 0) {
        continue; // Skip if no valid subjects found for the semester
      }

      totalSemesters++;

      resultHTML += `<h3>Semester ${semester}</h3>`;
      resultHTML +=
        "<table><tr><th>Subject Code</th><th>Subject Name</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>Credits</th></tr>";

      for (const subjectCode in semesterData) {
        const subject = semesterData[subjectCode];
        if (
          subject.subject_code &&
          subject.subject_name &&
          subject.subject_internal &&
          subject.subject_external &&
          subject.subject_grade &&
          subject.subject_credits
        ) {
          let grade = subject.subject_grade;
          if (grade === "F") {
            grade = `<span id="red">F</span>`;
            totalBacklogs++;
          }
          if (grade === "Ab") {
            grade = `<span id="red">Ab</span>`;
            totalBacklogs++;
          }
          resultHTML += `<tr><td>${subject.subject_code}</td><td>${subject.subject_name}</td><td>${subject.subject_internal}</td><td>${subject.subject_external}</td><td>${subject.subject_total}</td><td>${grade}</td><td>${subject.subject_credits}</td></tr>`;
        }
      }

      const semesterSGPA = parseFloat(semesterData.CGPA);
      if (!isNaN(semesterSGPA)) {
        totalCGPA += semesterSGPA;
        resultHTML += `<tr><td colspan="7">SGPA: ${semesterSGPA}</td></tr>`;
      } else {
        resultHTML += `<tr><td colspan="7">SGPA: -</td></tr>`;
      }

      resultHTML += "</table>";
    }

    // Display SGPA and backlogs
    resultHTML += `<div class="flex"><h3>Backlogs:&nbsp;<span id="total">${totalBacklogs}</span></h3></div>`;
    resultHTML +=
      '<div class="printContainer"><button class="btn" onClick="window.print()" id="print">Download Results</button></div>';
    resultContainer.innerHTML = detailsHTML + resultHTML;
  }, 500); // Simulating loading delay of 2 seconds
}

function displayError(message) {
  setTimeout(function () {
    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = `
    <div class="flex flex-col" >
    <div class="error">${message}</div>
    <div><img src="assets/error.png" alt=".."></div>
    </div>`;
  }, 500); // Simulating loading delay of 2 seconds
}
