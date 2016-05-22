"use strict";

var express = require("express");
var router = express.Router();

router.use("/s3", require("./s3"));

module.exports = router;