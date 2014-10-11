'use strict';

var gulp = require('gulp');
var argh = require('argh');

gulp.task('watch', ['default'], function () {

    gulp.watch('base/**', ['base']);
    gulp.watch('assets/js/**/**.js', ['js']);
    gulp.watch('bower_components/geomicons-open/**/**.svg', ['icons-append']);

    if (!argh.argv.dev) {

        gulp.watch('assets/css/**/**.css', ['css-minify']);
        gulp.watch('templates/**/**.html', ['html-minify', 'css-minify']);

    } else {

        gulp.watch('assets/css/**/**.css', ['css']);
        gulp.watch('templates/**/**.html', ['html']);
    }
});
