'use strict'

const pages = require('../tasks/pages.js')
const icons = require('../tasks/icons.js')
const css = require('../tasks/css.js')
const js = require('../tasks/js.js')
const optimize = require('../tasks/optimize.js')

module.exports = function (app) {
  app.command('update')
    .describe('Build the site once')
    .action(function () {
      return Promise.all([pages(), icons(), css(), js()]).then(optimize)
    })
}
