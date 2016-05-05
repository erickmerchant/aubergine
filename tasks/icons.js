'use strict'

const fs = require('fs-extra')
const path = require('path')
const thenify = require('thenify')
const chokidar = require('chokidar')
const fsCopy = thenify(fs.copy)

function icons (dest) {
  return fsCopy('node_modules/geomicons-open/dist/geomicons.svg', path.join(dest, 'icons.svg'), {clobber: true})
}

icons.watch = function (dest) {
  return icons(dest).then(function () {
    chokidar.watch('node_modules/geomicons-open/dist/geomicons.svg', {ignoreInitial: true}).on('all', function () {
      icons().catch(console.error)
    })

    return true
  })
}

module.exports = icons
