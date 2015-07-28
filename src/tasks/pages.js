'use strict'

const atlatl = require('atlatl')
const render = require('static-engine-render')
const read = require('static-engine-read')
const engine = require('static-engine')
const cson = require('cson-parser')

module.exports = function pages () {
  const loader = atlatl('./templates/')
  const renderer = function (name) {
    return function (page, done) {
      loader(name, page, done)
    }
  }

  return engine([
    read('./content/index.cson'),
    function (pages, done) {
      done(null, [cson.parse(pages[0].content)])
    },
    render('./index.html', renderer('index'))
  ])
}
