'use strict'

const chokidar = require('chokidar')
const webpack = require('webpack')

function js () {
  return new Promise(function (resolve, reject) {
    webpack({
      context: __dirname + '/js/',
      entry: 'app.js',
      output: {
        path: './',
        filename: 'app.js'
      }
    }, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
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
