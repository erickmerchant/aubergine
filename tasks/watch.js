'use strict';

var gulp = require('gulp');

gulp.task('watch', ['default'], function () {

    gulp.watch('base/**', ['base']);
    gulp.watch('js/**/**.js', ['js']);
    gulp.watch('css/**/**.css', ['css']);
    gulp.watch('templates/**/**.html', ['html']);
});
