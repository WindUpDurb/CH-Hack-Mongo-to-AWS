"use strict";

var app = angular.module("nameOfApp");

app.controller("mainController", function ($scope, Upload, $http) {
    console.log("Main Controller");

    $scope.submitFile = function () {
        Upload.upload({
            url: "/api/s3/addToBucket",
            data: { newFile: $scope.file }
        })
            .then(function (response) {
                console.log("Response: ", response);
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    };

    $scope.submitMultipleFiles = function () {
        console.log("Files: ", $scope.newFiles);
        console.log("Files0: ", $scope.newFiles[0]);
        console.log("Files1: ", $scope.newFiles[1]);
        Upload.upload({
            url: "/api/s3/addMultipleToBucket",
            arrayKey: "",
            data: {
                newFiles: $scope.newFiles
            }
        })
            .then(function (response) {
                console.log("Response: ", response);
             })
            .catch(function (error) {
                console.log("Error: ", error);
            });

    };


    $scope.retrieveFile = function () {

        $http.put("/api/s3/getFromBucket", $scope.fileToRetrieve)
            .then(function (response) {
                console.log("Response: ", response.data);
                $scope.fileReceived = response.data;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    };


});