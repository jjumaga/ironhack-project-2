const express = require("express");
const router = new express.Router(); //what is this
const UserModel = require("./../models/Users");

router.get("/", function (req, res) {
  res.render("index");
});

module.exports = router;
