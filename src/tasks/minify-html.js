'use strict'

const htmlmin = require('gulp-htmlmin')
const vinylFS = require('vinyl-fs')

module.exports = function minifyHTML () {
  return vinylFS.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(vinylFS.dest('./'))
}
