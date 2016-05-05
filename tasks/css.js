'use strict'

const thenify = require('thenify')
const fs = require('fs')
const path = require('path')
const fsReadFile = thenify(fs.readFile)
const fsWriteFile = thenify(fs.writeFile)
const chokidar = require('chokidar')
const postcss = require('postcss')
const postcssPlugins = [
  require('postcss-import')(),
  require('postcss-custom-media')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')(),
  require('autoprefixer')
]

function css (dest) {
  return fsReadFile('css/app.css', 'utf-8')
  .then(function (css) {
    return postcss(postcssPlugins).process(css, {
      from: 'css/app.css',
      to: path.join(dest, 'app.css')
    }).then(function (output) {
      return fsWriteFile(path.join(dest, 'app.css'), output.css)
    })
  })
}

css.watch = function (dest) {
  return css(dest).then(function () {
    chokidar.watch('css/**/*.css', {ignoreInitial: true}).on('all', function () {
      css().catch(console.error)
    })

    return true
  })
}

module.exports = css
