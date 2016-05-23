"use strict";

let express = require("express");
let router = express.Router();
let multer = require("multer");
let S3 = require("../models/S3");
let upload = multer({ storage: multer.memoryStorage()});

router.post("/addToBucket", upload.single("newFile"), (req, res) =>{
  S3.uploadFile(req.file, (err) => {
    res.status(err ? 400 : 200).send(err || {SUCCESS : "Stored!"});
    res.redirect("/")
  });
});

router.put("/getFromBucket", (req, res) =>{
  S3.downloadFile(req.body, res.handle);
});

router.post("/uploadMultiple", upload.array("newFiles"), (req, res) =>{
  S3.uploadMultiple(req.files, res.handle);
});

router.post("/createBucket", (req, res) =>{
  S3.createBucket("someData", res.handle);
});

router.put("/getBucketList", (req, res) =>{
  s3.getBucketList(req.body, res.handle);
});



module.exports = router;
