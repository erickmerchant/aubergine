'use strict'

const vinylFS = require('vinyl-fs')
const browserify = require('browserify')
const uglify = require('uglify-js')
const collapse = require('bundle-collapser/plugin')
const cheerio = require('gulp-cheerio')
const bundler = browserify({debug: false})

module.exports = function js (done) {
  bundler.add('js/app.js')

  bundler.plugin(collapse)

  bundler.bundle(function (err, js) {
    if (err) {
      done(err)
    } else {
      js = js.toString()

      js = uglify.minify(js, {fromString: true, mangle: true}).code

      vinylFS.src('./index.html')
        .pipe(cheerio(function ($) {
          $('body').append('<script>' + js + '</script>')
        }))
        .pipe(vinylFS.dest('./'))
        .on('end', done)
    }
  })
}
