'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var engine = require('static-engine');
var push = engine.plugins.push;
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

nunjucks.configure('./templates/', {
    autoescape: true
});

gulp.task('html', function (cb) {

    var site = engine.site('./', nunjucks.render);

    site.route('/').render('index.html');

    return site.build();
});

gulp.task('html-minify', ['html', 'icons-append'], function () {

    var stream = gulp.src('index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./'));

    return stream;
});
