'use strict'

const swig = require('swig')
const render = require('static-engine-render')
const read = require('static-engine-read')
const engine = require('static-engine')
const cson = require('cson-parser')

module.exports = function pages () {
  swig.setDefaults({ cache: false })

  return engine([
    read('./content/index.cson'),
    function (pages, done) {
      done(null, [cson.parse(pages[0].content)])
    },
    render('./index.html', function (page, done) {
      swig.renderFile('./templates/index.html', page, done)
    })
  ])
}
