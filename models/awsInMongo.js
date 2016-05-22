"use strict";

var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
    Key: { type: String, required: true },
    Bucket: { type: String, required: true}
});


fileSchema.statics.createMongoEntry = function (fileData, callback) {
    console.log("Up in here");
    CorePackage.create(fileData, function (error, savedDocument) {
        if (error) return callback(error);
        callback(null, savedDocument);
    });
};

fileSchema.statics.retrieveFileData = function (toRetrieve, callback) {
    CorePackage.find({ key: toRetrieve.key }, function (error, fileData) {
        if (error) return callback(error);
        callback(null, fileData);
    });
};



var CorePackage = mongoose.model("CorePackage", fileSchema);
//new models for API packages

module.exports = CorePackage;