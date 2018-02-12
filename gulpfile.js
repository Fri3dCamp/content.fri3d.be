var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var rename = require("gulp-rename");
var watch = require("gulp-watch");

gulp.task('default', function() {
    gulp.src(['fri3d/static/less/*.less'])
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest('fri3d/static/css'))
});

gulp.task('dev', function() {
    gulp.src(['fri3d/static/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('fri3d/static/css'))
});

gulp.task('remote', function() {
    gulp.src(['fri3d/static/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('fri3d/static/css'))
        .pipe(gulp.dest('../be.fri3d.content.staging/ui/static/css'))
});

gulp.task('stream', function () {
    // Endless stream mode
    gulp.watch(['fri3d/static/less/*.less'], ['dev']);
    gulp.watch(['fri3d/static/less/includes/*.less'], ['dev']);
});
