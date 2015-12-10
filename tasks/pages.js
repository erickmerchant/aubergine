'use strict'

const atlatl = require('atlatl')
const render = require('static-engine-render')
const read = require('static-engine-read')
const engine = require('static-engine')
const cson = require('cson-parser')
const chokidar = require('chokidar')

function pages () {
  const templates = atlatl('./templates/')
  const renderer = function (name) {
    return function (page, done) {
      templates(name).then(function (template) {
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
  return pages().then(function () {
    chokidar.watch(['templates/**/*.html', '!templates/compiled/*.html', 'content/**/*.md', 'content/**/*.cson'], {ignoreInitial: true}).on('all', function () {
      pages().catch(console.error)
    })

    return true
  })
}

module.exports = pages
