'use strict'

const sgt = require('sergeant')
const pages = require('../tasks/pages.js')
const icons = require('../tasks/icons.js')
const minifyHTML = require('../tasks/minify-html.js')
const css = require('../tasks/css.js')
const js = require('../tasks/js.js')

module.exports = function (app) {
  app.command('update', { description: 'Build the site once' }, sgt.series(pages, icons, minifyHTML, css, js))
}
