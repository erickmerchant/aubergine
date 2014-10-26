'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var uncss = require('gulp-uncss');
var minifycss = require('gulp-minify-css');
var glob = require('glob');
var rework = require('gulp-rework');
var css_files = require('./settings.json').css_files;
var concat = require('gulp-concat');
var calc = require('rework-calc');
var media = require('rework-custom-media');
var npm = require('rework-npm');
var vars = require('rework-vars');
var colors = require('rework-plugin-colors');
var argv = require('argh').argv;
var stream_to_promise = require('stream-to-promise');

gulp.task('css', (argv.dev ? [] : ['html']), function (cb) {

    var stream = gulp.src(css_files)
        .pipe(rework(
            npm(),
            vars(),
            media(),
            calc,
            colors()
        ))
        .pipe(autoprefixer('> 1%', 'last 2 versions'))
        .pipe(concat("app.css"))
        .pipe(gulp.dest('./'));

    stream_to_promise(stream).then(function(){

        if(argv.dev) {

            cb();
        }
        else {

            var ignore = [
                /\.token.*/,
                /\.style.*/,
                /\.namespace.*/,
                /code\[class\*\=\"language\-\"\]/,
                /pre\[class\*="language-"\]/
            ];

            var stream = gulp.src('app.css')
                .pipe(uncss({
                    html: ['index.html'],
                    ignore: ignore
                }))
                .pipe(minifycss())
                .pipe(gulp.dest('./'));

            stream_to_promise(stream).then(function() { cb(); });
        }
    });
});
