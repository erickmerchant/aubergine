'use strict'

const thenify = require('thenify')
const fs = require('fs')
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

function css () {
  return fsReadFile('css/app.css', 'utf-8')
  .then(function (css) {
    return postcss(postcssPlugins).process(css, {
      from: 'css/app.css',
      to: 'app.css'
    }).then(function (output) {
      return fsWriteFile('app.css', output.css)
    })
  })
}

css.watch = function () {
  return css().then(function () {
    chokidar.watch('css/**/*.css', {ignoreInitial: true}).on('all', function () {
      css().catch(console.error)
    })

    return true
  })
}

module.exports = css
