'use strict'

const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const streamToPromise = require('stream-to-promise')
const collapser = require('bundle-collapser/plugin')

function js (dest) {
  var bundleFs = fs.createWriteStream(path.join(dest, 'app.js'))
  var bundle = browserify({
    plugin: [collapser]
  })

  bundle.add('js/app.js')
  bundle.bundle().pipe(bundleFs)

  return streamToPromise(bundle)
}

js.watch = function (dest) {
  return js(dest).then(function () {
    chokidar.watch('js/**/*.js', {ignoreInitial: true}).on('all', function () {
      js().catch(console.error)
    })

    return true
  })
}

module.exports = js
