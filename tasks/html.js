'use strict';

var gulp = require('gulp');
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
var stream_to_promise = require('stream-to-promise');

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

            var stream = gulp.src('index.html')
                .pipe(htmlmin({
                    collapseWhitespace: true
                }))
                .pipe(gulp.dest('./'));

            stream_to_promise(stream).then(function(){ cb(); });
        }
    });
});
