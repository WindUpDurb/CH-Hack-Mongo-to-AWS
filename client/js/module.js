"use strict";

var app = angular.module("nameOfApp", ["ui.router", "ngFileUpload"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/"
        })


    $urlRouterProvider.otherwise("/");
});