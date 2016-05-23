"use strict";


var fs = require("fs");
var path = require("path");

var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var async = require("async");

var filendir = require("filendir");

//for dmg file
var appdmg = require('appdmg');



var coreInMongo = require("./awsInMongo");

var pathToCore = path.join(__dirname, "../CorePackage");

var masterObject = {
    //an array of file paths to iterate over
    CORE_package : getFiles(pathToCore)
};

console.log("master object: ", masterObject);
console.log("CorePackage.length: ", masterObject.CORE_package.length)


function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            let toSplitWith = "/home/david/Code/CH-Hack/CorePackage/";
            files_.push(name.split(toSplitWith)[1]);
        }
    }
    return files_;
}


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
        fs.readFile(path.join(__dirname, `../CorePackage/${packageToGet[index]}`), function (error, data) {
            let dataBuffer = data;
            let key = packageToGet[index];
            let params = {
                Bucket: "i-hope-it-works",
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



toAWS.retrieveAllFrom = function (filePackage, callback) {
    let packageToRetrieve;
    if (filePackage === "CorePackage") {
        packageToRetrieve = "CorePackage";
    }
    //to store the contents of each file
    //which will be returned at the conclusion
    let packageContentsArray = {};

    coreInMongo.find({}, function (error, listOfFiles) {
        if (error) return callback(error);
        console.log("list: ", listOfFiles);

        async.forEachOf(listOfFiles, function (file, index, callback2) {
            let params = {
                Bucket: file.Bucket,
                Key: file.Key
            };
            s3.getObject(params, function (error, downloadedFile) {
                if (error) return callback2(error);
                var bufferedData = downloadedFile.Body.toString("utf-8");
                packageContentsArray[file.Key] = bufferedData;
                console.log("bufferedData: ", bufferedData);
                callback2(null, bufferedData);
            });
        }, function (error) {
            if (error) return callback(error);
            //return the object containing the package
           // callback(error, packageContentsArray);
            async.forEachOf(packageContentsArray, function(value, key, callback) {

                filendir.wa("CorePackageOutput/" + key, value, function(err) {
                    if (!err) {
                        console.log('File written!')
                    }
                })

            }, function(error) {
                if (error) return callback(error);
                
                createDMG();
                
                callback(null)
            });

        })
    });
};


var createDMG = function ( ) {
    var ee = appdmg({
        source: './dmgSettings.json',
        target: path.join(__dirname, "./MEAN_Package.dmg")
    });


    ee.on('progress', function (info) {
        console.log(info);
        // info.current is the current step
        // info.total is the total number of steps
        // info.type is on of 'step-begin', 'step-end'

        // 'step-begin'
        // info.title is the title of the current step

        // 'step-end'
        // info.status is one of 'ok', 'skip', 'fail'

    });

    ee.on('finish', function () {
        // There now is a `test.dmg` file
    });

    ee.on('error', function (err) {
        // An error occurred
    });
};






/*
async.forEachOf(myArray, function(path, index, callback) {

    filendir.wa(path, 'content', function(err) {
        if (!err) {
            console.log('File written!')
        }
    })

}, function(error) {
    if (error) return callback(error);
    callback(null)
});*/


module.exports = toAWS;