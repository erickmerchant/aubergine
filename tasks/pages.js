'use strict'

const atlatl = require('atlatl')('./templates/')
const render = require('static-engine-render')
const read = require('static-engine-read')
const engine = require('static-engine')
const cson = require('cson-parser')
const chokidar = require('chokidar')

function pages () {
  const renderer = function (name) {
    return function (page, done) {
      atlatl(name).then(function (template) {
        done(null, template(page))
      })
      .catch(done)
    }
  }

  return engine([
    read('./content/index.cson'),
    function (pages, done) {
      done(null, [cson.parse(pages[0].content)])
    },
    render('./index.html', renderer('index.html'))
  ])
}

pages.watch = function () {
  chokidar.watch(['templates/**/*.html', '!templates/compiled/*.html', 'content/**/*.md', 'content/**/*.cson']).on('all', function () {
    pages()
  })

  return pages()
}

module.exports = pages
