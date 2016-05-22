"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");

gulp.task("default", ["build", "watch"]);

gulp.task("watch", ["watch.js", "watch.css"]);

gulp.task("build", ["js", "css"]);

gulp.task("watch.js", function () {
    return gulp.watch("./client/js/**/*.js", ["js"])
});

gulp.task("js", function () {
    return gulp.src("./client/js/**/*.js")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat("concat.js"))
        .pipe(gulp.dest("./public/js"))
});

gulp.task("watch.css", function () {
    return gulp.watch("./client/scss/**", ["css"]);
});

gulp.task("css", function () {
    return gulp.src("./client/scss/**/")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./public/css"));
});
