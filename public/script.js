document
  .getElementById("resultsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetchResults();
  });

document.getElementById("rollNoInput").addEventListener("keyup",function (e){
    document.getElementById("rollNoInput").value=document.getElementById("rollNoInput").value.toUpperCase();
})

function fetchResults() {
  var rollNo = document.getElementById("rollNoInput").value;
  var apiUrl = `/fetch_results?rollNo=${rollNo}`;
  var resultContainer = document.getElementById("resultContainer");
  // Display loading indicator
  resultContainer.innerHTML =  `<div class="loading">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayResults(data);
    })
    .catch((error) => {
      console.error("Error fetching results:", error);
      displayError("Failed to fetch results. Please try again later.");
    });
}

function displayResults(data) {
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ""; // Clear previous results

  if (!data || !data.Details || !data.Results) {
    displayError("No results found.");
    return;
  }

  // Display loading indicator
  resultContainer.innerHTML =  `<div class="loading">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`;

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
            grade=`<span id="red">F</span>`;
            totalBacklogs++;
          }
          if (grade === "Ab") {
            grade=`<span id="red">Ab</span>`;
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

    // Calculate SGPA (average CGPA)
    const cgpa = data.Results.Total;

    // Display SGPA and backlogs
    resultHTML += `<div id="flex"><h3>CGPA:&nbsp;<span id="total">${cgpa}</span></h3><h3>Backlogs:&nbsp;<span id="total">${totalBacklogs}</span></h3></div>`;

    resultContainer.innerHTML = detailsHTML + resultHTML;
  }, 2000); // Simulating loading delay of 2 seconds
}

function displayError(message) {
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `<div style="color: red;">${message}</div>`;
}
