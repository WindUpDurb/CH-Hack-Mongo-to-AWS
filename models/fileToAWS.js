"use strict";


var fs = require("fs");
var path = require("path");

var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var async = require("async");


var coreInMongo = require("./awsInMongo");

var testFile = "fileToUpload.js";

var masterObject = {
    //an array of file paths to iterate over
    CORE_package : ["../fileToUpload.js", "../anotherFile.js"]
};


var toAWS = {};


//single file upload
toAWS.uploadFile = function (callback) {
    fs.readFile(path.join(__dirname, masterObject.CORE_package[1]), function (error, data) {
        let dataBuffer = data;
        let key = masterObject.CORE_package[0].split("../")[1];
        let params = {
            Bucket: "corebucket-test-test",
            Key: key,
            ACL: "public-read",
            Body: dataBuffer
        };
        console.log(params)
        s3.upload(params, function (error, awsResults) {
            if (error) return callback(error);
            console.log("Results back: ", awsResults);
            //execute Database interaction here:
            //create database document
            coreInMongo.createMongoEntry(awsResults, function (error, mongoEntry) {
                if (error) return callback(error);
                callback(null, awsResults, mongoEntry)
            });
        });
    });
};


//working multi-file upload
toAWS.uploadFiles = function (filePackage, callback) {
    let packageToGet;
    if (filePackage === "CorePackage") {
        packageToGet = masterObject.CORE_package;
    }

    async.forEachOf(packageToGet, function (file, index, callback2) {

        //the second for path.join() will either be file or what is below
        fs.readFile(path.join(__dirname, packageToGet[index]), function (error, data) {
            let dataBuffer = data;
            let key = packageToGet[index].split("../")[1];
            let params = {
                Bucket: "corebucket-test-test",
                Key: key,
                ACL: "public-read",
                Body: dataBuffer
            };
            console.log(params);
            s3.upload(params, function (error, awsResults) {
                if (error) return callback(error);
                console.log("Results back: ", awsResults);
                //execute Database interaction here:
                //create database document
                coreInMongo.createMongoEntry(awsResults, function (error, mongoEntry) {
                    console.log("Error: ", error);
                    console.log("MongoEntry: ", mongoEntry)
                    if (error) return callback(error);
                    //see what happens if we remove this callback
                    //see also what happens if we revert back to just callback
                    //instead of callback2
                    callback2(null, awsResults, mongoEntry)
                });
            });
        });

    }, function (error) {
        if (error) return callback(error);
        callback(error)
    });
};



toAWS.retrieveAllFrom = function (master_object, filePackage, callback) {
    if (filePackage === "CorePackage") {
        coreInMongo.find({}, function (error, listOfFile) {
            if (error) return callback(error);
            callback(listOfFile);
        })
    }
};

/*toAWS.retrieveAllFrom(masterObject, "CorePackage", function (error, list) {
    if (error) console.log(error);
    console.log("Here")
    console.log("list: ", list);
});*/

module.exports = toAWS;