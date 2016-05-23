'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var annotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['js', 'css']);

gulp.task('watch', ['watch.js', 'watch.css', 'watch.lint']);

gulp.task('serve', function() {
    nodemon({
        ignore:['client', 'public', 'Gulpfile.js']
    });
});

gulp.task('watch.lint', function() {
    return gulp.watch('./**/*.js', ['lint'])
});

gulp.task('lint', function() {
    return gulp.src([
        './**/*.js',
        '!app.js',
        '!bundle.js',
        '!Gulpfile.js',
        '!./routes/**/*.js',
        '!./models/**/*.js',
        '!./node_modules/**/*.js',
        '!./public/bower_components/**/*.js'
        ])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
});
///////////JAVASCRIPT //////////

gulp.task('watch.js', function() {
    return gulp.watch('./client/js/**/**/*.js', ['js'])
});

gulp.task('js', function() {
    return gulp.src('./client/js/**/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(babel({presets: ['es2015'] }))
        .pipe(annotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js'));
});

///////  CSS ///////////


gulp.task('css', ['clean.css'], function() {
    return gulp.src('./client/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/scss'));
});

gulp.task('watch.css', function() {
    return gulp.watch('./client/scss/**', ['css'])
});

gulp.task('clean.css', function() {
    return del(['./public/css']);
});
