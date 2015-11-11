'use strict'

const sergeant = require('sergeant')
const app = sergeant().describe('CMS for chrono')
const pages = require('./tasks/pages.js')
const icons = require('./tasks/icons.js')
const css = require('./tasks/css.js')
const js = require('./tasks/js.js')
const optimize = require('./tasks/optimize.js')
const serve = require('./tasks/serve.js')

app.command('update')
.describe('Build the site once')
.action(function () {
  return Promise.all([pages(), icons(), css(), js()]).then(optimize)
})

app.command('watch')
.describe('Build the site then watch for changes. Run a server')
.action(function () {
  return Promise.all([
    css.watch(),
    js.watch(),
    pages.watch(),
    icons.watch()
  ])
  .then(serve)
})

app.run()
