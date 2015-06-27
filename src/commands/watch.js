'use strict'

const sgt = require('sergeant')
const vinylFS = require('vinyl-fs')
const pages = require('../tasks/pages.js')
const icons = require('../tasks/icons.js')
const minifyHTML = require('../tasks/minify-html.js')
const css = require('../tasks/css.js')
const js = require('../tasks/js.js')
const serve = require('../tasks/serve.js')

module.exports = function (app) {
  app.command('watch', { description: 'Build the site then watch for changes. Run a server' }, watch)
}

function watch (options, done) {
  vinylFS.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html', 'content/**/*.cson'], function () {
    sgt.series(pages, icons, minifyHTML, css, js)(options, function () { })
  })

  sgt.parallel(sgt.series(pages, icons, minifyHTML, css, js), serve)(options, done)
}
