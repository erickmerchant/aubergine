'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var engine = require('static-engine');
var push = function (literal) {

    return function (pages, next) {

        pages.push(literal);

        next(pages);
    };
};
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var argv = require('argh').argv;
var tap = require('gulp-tap');

nunjucks.configure('./templates/', {
    autoescape: true
});

gulp.task('html', ['icons'], function (cb) {

    var site = engine('./', nunjucks.render);

    site.route('/').use(push({
        controls: {
            'Work': {'interval': 25, 'message': 'Take a break!'},
            'Break': {'interval': 5, 'message': 'Back to work!'}
        },
        colors: [
            '#AAAAAA',
            '#FF851B',
            '#2ECC40',
            '#0074D9',
            '#F012BE'
        ]
    })).render('index.html');

    site.build().then(function(){

        if(argv.dev) {

            cb();
        }
        else {

            gulp.src('index.html')
                .pipe(htmlmin({
                    collapseWhitespace: true
                }))
                .pipe(gulp.dest('./'))
                .pipe(tap(function () {
                    cb();
                }));
        }
    });
});
