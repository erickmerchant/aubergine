'use strict'

const fs = require('fs-extra')
const thenify = require('thenify')
const chokidar = require('chokidar')
const fsCopy = thenify(fs.copy)

function icons () {
  return fsCopy('node_modules/geomicons-open/dist/geomicons.svg', './icons.svg', {clobber: true})
}

icons.watch = function () {
  return icons().then(function () {
    chokidar.watch('node_modules/geomicons-open/dist/geomicons.svg', {ignoreInitial: true}).on('all', function () {
      icons().catch(console.error)
    })

    return true
  })
}

module.exports = icons
