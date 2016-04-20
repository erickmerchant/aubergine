'use strict'

const chokidar = require('chokidar')
const fs = require('fs')
const browserify = require('browserify')
const streamToPromise = require('stream-to-promise')
const collapser = require('bundle-collapser/plugin')

function js () {
  var bundleFs = fs.createWriteStream('app.js')
  var bundle = browserify({
    plugin: [collapser]
  })

  bundle.add('js/app.js')
  bundle.bundle().pipe(bundleFs)

  return streamToPromise(bundle)
}

js.watch = function () {
  return js().then(function () {
    chokidar.watch('js/**/*.js', {ignoreInitial: true}).on('all', function () {
      js().catch(console.error)
    })

    return true
  })
}

module.exports = js
