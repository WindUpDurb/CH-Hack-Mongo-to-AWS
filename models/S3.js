"use strict";

var AWS = require("aws-sdk");
var path = require("path");

var s3 = new AWS.S3();

var fs = require("fs");

var fileName = "fileToUpload.js";
var bucketName = "template-test-test";
var urlBase = "https://s3-us-west-1.amazonaws.com/";
var async = require("async");


var aws_s3 = {};
//to upload a file to the AWS bucket:


aws_s3.storeOn = function (dataToStore, callback) {
    console.log("data to store: ", dataToStore);
    let fileName = dataToStore.originalname.split(".")[0];
    let key;
    let params = {
        Bucket: bucketName,
        Key: key || fileName,
        ACL: "public-read",
        Body: dataToStore.buffer
    };
    s3.upload(params, function (error, results) {
        if (error) return callback(error);
        console.log("Results back: ", results);
        //execute Database interaction here:
        //create database document
        // let mongooseDocumentToCreate = results;
        // mongooseDocumentToCreate.fileName = dataToStore.originalName
        callback(null, results);
    });
};

aws_s3.storeMultipleOn = function (dataToStore, callback) {


    async.forEachOf(dataToStore, function (file, index, callback2) {

        let key = `someofdatfiles${index}`;
        let params = {
            Bucket: "DahBucket/otherBucket/fuckItBucket",
            Key: key,
            ACL: "public-read",
            Body: file.buffer
        };
        console.log("each file:", file.buffer);
        console.log("i: ", index);

        s3.upload(params, function (error, result) {
            callback2()
        });
    }, function (error) {
        if (error) return callback(error);
        callback(null)
    });
};

aws_s3.createBucket = function (newBucketData, callback) {
    var params = {
        Bucket: "DahBucket/littleBucket"

    };

    s3.createBucket(params, function (error, data) {
        if (error) return callback(error);
        callback(error);
    })
};

aws_s3.getBucketList = function (bucketName, callback) {
    let params = {
        Bucket: "DahBucket"

    };
    s3.listObjects(params, function (error, data) {
        if (error) return callback(error);
        console.log("data: ", data.contents)
        callback(null, data);
    });
};

aws_s3.getFrom = function (dataToFetch, callback) {
    let params = {
        Bucket: bucketName,
        Key: dataToFetch.key
    };

    s3.getObject(params, function (error, data) {
        if (error) return callback(error);
        var dataToReturn = data.Body.toString("utf-8");
        callback(null, dataToReturn);
    });
};

module.exports = aws_s3;












