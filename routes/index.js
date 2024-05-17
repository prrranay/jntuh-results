var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("index",{title:"Academic"});
});
router.get("/2-1", (req, res) => {
  res.render("2-1",{title:"2-1"});
});
router.get("/2-2", (req, res) => {
  res.render("2-2",{title:"2-2"});
});
router.get("/3-1", (req, res) => {
  res.render("3-1",{title:"3-1"});
});

module.exports = router;
