'use strict'

const vinylFS = require('vinyl-fs')
const rename = require('gulp-rename')

module.exports = function icons () {
  return new Promise(function (resolve, reject) {
    vinylFS.src('node_modules/geomicons-open/dist/geomicons.svg')
      .pipe(rename('icons.svg'))
      .pipe(vinylFS.dest('./'))
      .once('end', resolve)
      .on('error', reject)
  })
}
