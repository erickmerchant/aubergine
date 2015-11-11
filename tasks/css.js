'use strict'

const thenify = require('thenify')
const fs = require('fs')
const fsReadFile = thenify(fs.readFile)
const fsWriteFile = thenify(fs.writeFile)
const chokidar = require('chokidar')
const cssnext = require('cssnext')

function css () {
  return fsReadFile('css/app.css', 'utf-8')
  .then(function (css) {
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

    return fsWriteFile('./app.css', css)
  })
}

css.watch = function () {
  chokidar.watch('css/**/*.css').on('all', function () {
    css()
  })

  return css()
}

module.exports = css
