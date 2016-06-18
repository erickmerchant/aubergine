'use strict'

const sergeant = require('sergeant')
const assert = require('assert')
const chalk = require('chalk')
const thenify = require('thenify')
const mkdirp = thenify(require('mkdirp'))
const app = sergeant().describe('Build CLI for chrono')
const base = require('./tasks/base.js')
const pages = require('./tasks/pages.js')
const icons = require('./tasks/icons.js')
const css = require('./tasks/css.js')
const js = require('./tasks/js.js')
const optimize = require('./tasks/optimize.js')
const serve = require('./tasks/serve.js')

app.command('update')
.describe('Build the site once')
.parameter('destination', 'where to build everything')
.action(function (args) {
  assert.ok(args.get('destination'), 'you must provide a destination')
  assert.equal(typeof args.get('destination'), 'string', 'destination must be a string')

  var dest = args.get('destination')

  return Promise.all([
    mkdirp(dest),
    base(dest),
    pages(dest),
    icons(dest),
    css(dest),
    js(dest)
  ]).then(optimize(dest))
})

app.command('watch')
.describe('Build the site then watch for changes. Run a server')
.parameter('destination', 'where to build everything')
.action(function (args) {
  assert.ok(args.get('destination'), 'you must provide a destination')
  assert.equal(typeof args.get('destination'), 'string', 'destination must be a string')

  var dest = args.get('destination')

  return Promise.all([
    mkdirp(dest),
    base.watch(dest),
    css.watch(dest),
    js.watch(dest),
    pages.watch(dest),
    icons.watch(dest)
  ])
  .then(serve(dest))
})

app.run().catch(function (err) {
  console.error(chalk.red(err.message))
})
