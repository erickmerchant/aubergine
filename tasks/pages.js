'use strict'

const atlatl = require('atlatl')
const render = require('static-engine-render')
const read = require('static-engine-read')
const engine = require('static-engine')
const cson = require('cson-parser')
const chokidar = require('chokidar')
const path = require('path')

function pages (dest) {
  const templates = atlatl()
  const renderer = function (name) {
    return function (page, done) {
      templates('./templates/' + name).then(function (template) {
        done(null, template.render(page))
      })
      .catch(done)
    }
  }

  return engine([
    read('./content/index.cson'),
    function (pages, done) {
      done(null, [cson.parse(pages[0].content)])
    },
    render(path.join(dest, 'index.html'), renderer('index.html'))
  ])
}

pages.watch = function (dest) {
  return pages(dest).then(function () {
    chokidar.watch(['templates/**/*.html', '!templates/compiled/*.html', 'content/**/*.md', 'content/**/*.cson'], {ignoreInitial: true}).on('all', function () {
      pages(dest).catch(console.error)
    })

    return true
  })
}

module.exports = pages
