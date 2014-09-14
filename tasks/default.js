'use strict';

var gulp = require('gulp');
var argh = require('argh');

var default_task_deps = ['html', 'icons-append', 'css', 'js'];

if (!argh.argv.dev) {

    default_task_deps.push('html-minify', 'css-minify');
}

gulp.task('default', default_task_deps);
