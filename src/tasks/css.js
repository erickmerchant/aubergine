'use strict'

const fs = require('fs')
const cssnext = require('cssnext')

module.exports = function css () {
  return new Promise(function (resolve, reject) {
    fs.readFile('css/app.css', 'utf-8', function (err, css) {
      if (err) {
        reject(err)
      }

      css = cssnext(
        css, {
          from: 'css/app.css',
          features: {
            customProperties: {
              strict: false
            },
            rem: false,
            pseudoElements: false,
            colorRgba: false
          }
        }
      )

      fs.writeFile('./app.css', css, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}
