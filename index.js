const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  res.redirect("index.html");
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/fetch_results", async (req, res) => {
  const { rollNo } = req.query;
  const fetchModule = await import("node-fetch");
  const fetch = fetchModule.default;

  const apiUrl = `https://jntuhresults.up.railway.app/api/academicresult?htno=${rollNo}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching results:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch results. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
