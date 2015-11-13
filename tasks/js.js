'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const browserify = require('browserify')
const uglify = require('uglify-js')
const collapse = require('bundle-collapser/plugin')
const bundler = browserify({debug: false})

function js () {
  return new Promise(function (resolve, reject) {
    bundler.add('js/app.js')

    bundler.plugin(collapse)

    bundler.bundle(function (err, js) {
      if (err) {
        reject(err)
      } else {
        js = uglify.minify(js.toString(), {fromString: true, mangle: true}).code

        fs.writeFile('./app.js', js, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
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
