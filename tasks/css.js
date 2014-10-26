'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var uncss = require('gulp-uncss');
var minifycss = require('gulp-minify-css');
var tap = require('gulp-tap');
var glob = require('glob');
var rework = require('gulp-rework');
var css_files = require('./settings.json').css_files;
var concat = require('gulp-concat');
var calc = require('rework-calc');
var media = require('rework-custom-media');
var npm = require('rework-npm');
var vars = require('rework-vars');
var colors = require('rework-plugin-colors');
var argh = require('argh');

gulp.task('css', (argh.argv.dev ? [] : ['html']), function (cb) {

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
        .pipe(gulp.dest('./'))
        .pipe(tap(function(){

            if(argh.argv.dev) {

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

                gulp.src('app.css')
                    .pipe(uncss({
                        html: ['index.html'],
                        ignore: ignore
                    }))
                    .pipe(minifycss())
                    .pipe(gulp.dest('./'))
                    .pipe(tap(function () {
                        cb();
                    }));
            }
        }));
});
