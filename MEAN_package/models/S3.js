"use strict";

let fs = require("fs");
let path = require("path");
let async = require("async");

let AWS = require("aws-sdk");
let s3 = new AWS.S3();
let bucketName = "the-first-bucket-s3";
let urlBase = "https://s3-us-west-2.amazonaws.com/";
let S3 = {};

//to upload a file to the AWS bucket:

S3.uploadFile = (dataToStore, cb) => {
  let key = dataToStore.originalname.split(".")[0];
  let params = {
    Bucket: bucketName,
    Key: key,
    ACL: "public-read",
    Body: dataToStore.buffer
  };
  s3.upload(params, (err, result) => {
    err ? cb(err) : cb(null, result);
  });
};

S3.downloadFile = (dataToFetch, cb) => {
  let params = {
    Bucket: bucketName,
    Key: dataToFetch.key
  };
  s3.getObject(params, (err, data) => {
    if(err) return cb(err);
    let dataToReturn = data.Body.toString("utf-8");
    cb(null, dataToReturn);
  });
};

S3.uploadMultiple = (dataToStore, cb) => {
  async.forEachOf(dataToStore, (file, index, cb2) => {

    let key = `someofdatfiles${index}`;
    let params = {
      Bucket: "DahBucket/otherBucket/fuckItBucket",
      Key: key,
      ACL: "public-read",
      Body: file.buffer
    };
    console.log("each file:", file.buffer);
    console.log("i: ", index);

    s3.upload(params, (err, result) =>{
      cb2()
    });
  }, err => {
    err ? cb(err) : cb(null);
  });
};

S3.createBucket = (newBucketData, cb) =>{
  let params = {
    Bucket: "DahBucket/littleBucket"
  };
  s3.createBucket(params, (err, data) =>{
    err ? cb(err) : cb(null, data);
  });
};

S3.getBucketList = (bucketName, cb) => {
  let params = {
    Bucket: "DahBucket"
  };
  s3.listObjects(params, (err, data)  =>{
  err ? cb(err) : cb(null, data);
  });
};

module.exports = S3;
