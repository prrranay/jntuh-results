var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/2-1", (req, res) => {
  res.render("2-1");
});
router.get("/2-2", (req, res) => {
  res.render("2-2");
});

module.exports = router;
