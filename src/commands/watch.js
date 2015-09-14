'use strict'

const vinylFS = require('vinyl-fs')
const pages = require('../tasks/pages.js')
const icons = require('../tasks/icons.js')
const css = require('../tasks/css.js')
const js = require('../tasks/js.js')
const serve = require('../tasks/serve.js')

module.exports = function (app) {
  app.command('watch')
    .describe('Build the site then watch for changes. Run a server')
    .action(function () {
      vinylFS.watch('css/**/*.css', css)
      vinylFS.watch('js/**/*.js', js)
      vinylFS.watch(['templates/**/*.html', '!templates/compiled/*.html', 'content/**/*.md', 'content/**/*.cson'], pages)

      return Promise.all([
        css(),
        js(),
        pages(),
        icons()
      ])
      .then(serve)
    })
}
