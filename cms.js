#!/usr/bin/env node
'use strict'

const directory = './'
const sergeant = require('sergeant')
const bach = require('./bach-extended.js')
const vinylFS = require('vinyl-fs')
const defaultSeries = bach.series(bach.parallel(bach.series(pages, icons, minifyHTML), css, js), shortenSelectors, insertCSS, insertJS)
const app = sergeant('CMS for chrono')

app.command('update', { description: 'Build the site once' }, defaultSeries)

app.command('watch', { description: 'Build the site then watch for changes. Run a server' }, bach.parallel(defaultSeries, watch, serve))

app.run()

function pages () {
  const swig = require('swig')
  const render = require('static-engine-render')
  const read = require('static-engine-read')
  const engine = require('static-engine')
  const cson = require('cson-parser')

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

function css () {
  const cssnext = require('gulp-cssnext')
  const csso = require('gulp-csso')

  return vinylFS.src('css/app.css')
    .pipe(cssnext({
      features: {
        customProperties: {
          strict: false
        },
        rem: false,
        pseudoElements: false,
        colorRgba: false
      }
    }))
    .pipe(csso())
    .pipe(vinylFS.dest(directory))
}

function js (done) {
  const uglify = require('gulp-uglify')
  const tap = require('gulp-tap')
  const vinylFS = require('vinyl-fs')
  const browserify = require('browserify')
  const source = require('vinyl-source-stream')
  const buffer = require('vinyl-buffer')
  const collapse = require('bundle-collapser/plugin')
  const bundler = browserify({
    entries: './js/app.js',
    debug: false
  })

  bundler
    .plugin(collapse)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(tap(function (file) {
      file.contents = new Buffer('!function(window, document, Math, Date){ ' + file.contents + ' }(window, document, Math, Date)')
    }))
    .pipe(uglify())
    .pipe(vinylFS.dest(directory))
    .on('end', done)
}

function minifyHTML () {
  const htmlmin = require('gulp-htmlmin')

  return vinylFS.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(vinylFS.dest(directory))
}

function icons (done) {
  const cheerio = require('gulp-cheerio')
  const geomicons = require('geomicons-open/paths')

  vinylFS.src('./index.html')
    .pipe(cheerio(function ($) {
      const defs = new Set()

      $('use').each(function () {
        const href = $(this).attr('xlink:href')
        const id = href.substring(1)

        if ($(`use[xlink\\:href="${ href }"]`).length > 1) {
          defs.add(id)
        } else {
          $(this).replaceWith(`<path d="${ geomicons[id] }"/>`)
        }
      })

      if (defs.size) {
        let paths = []

        for (let id of defs) {
          paths.push(`<path d="${ geomicons[id] }" id="${ id }"/>`)
        }

        $('body').append(`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>${ paths.join('') }</defs></svg>`)
      }
    }))
    .pipe(vinylFS.dest(directory))
    .on('end', done)
}

function shortenSelectors () {
  const vinylFS = require('vinyl-fs')
  const selectors = require('gulp-selectors')

  return vinylFS.src(['./index.html', './app.css'])
    .pipe(selectors.run(undefined, {ids: '*', classes: ['flash']}))
    .pipe(vinylFS.dest(directory))
}

function insertCSS (done) {
  const cheerio = require('gulp-cheerio')
  const fs = require('fs')
  const postcss = require('postcss')
  const byebye = require('css-byebye')
  const discardEmpty = require('postcss-discard-empty')
  const minifySelectors = require('postcss-minify-selectors')
  const mergeRules = require('postcss-merge-rules')
  const pseudosRegex = /\:?(\:[a-z-]+)/g
  const del = require('del')

  fs.readFile('./app.css', 'utf-8', function (err, css) {
    if (err) {
      done(err)
    }

    vinylFS.src('./index.html')
      .pipe(cheerio(function ($) {
        const parsed = postcss.parse(css)
        var unused = []
        var ignore = ['.flash']
        var output

        function trav (nodes) {
          nodes.forEach(function (node) {
            if (node.type !== 'atrule' || !node.name.endsWith('frames')) {
              if (node.selector) {
                node.selector
                  .split(',')
                  .map(function (selector) {
                    return selector.trim()
                  })
                  .forEach(function (selector) {
                    var _selector = selector.replace(pseudosRegex, function (selector, pseudo) {
                      return pseudo === ':not' ? selector : ''
                    })

                    try {
                      if (_selector && ignore.indexOf(_selector) < 0 && !$(_selector).length) {
                        unused.push(selector)
                      }
                    } catch (e) {
                      console.error(_selector)
                    }
                  })
              }

              if (node.nodes) {
                trav(node.nodes)
              }
            }
          })
        }

        trav(parsed.nodes)

        output = byebye.process(css, { rulesToRemove: unused })

        output = postcss(discardEmpty(), minifySelectors(), mergeRules()).process(output).css

        $('head').append(`<style type="text/css">${ output }</style>`)
      }))
      .pipe(vinylFS.dest(directory))
      .on('end', function () {
        del(['./app.css'], done)
      })
  })
}

function insertJS (done) {
  const cheerio = require('gulp-cheerio')
  const fs = require('fs')
  const del = require('del')

  fs.readFile('./bundle.js', 'utf-8', function (err, js) {
    if (err) {
      done(err)
    }

    vinylFS.src('./index.html')
      .pipe(cheerio(function ($) {
        $('body').append('<script>' + js + '</script>')
      }))
      .pipe(vinylFS.dest(directory))
      .on('end', function () {
        del(['./bundle.js'], done)
      })
  })
}

function serve (done) {
  const express = require('express')
  const _static = require('express-static')
  const logger = require('express-log')

  const app = express()

  app.use(logger())

  app.use(_static(directory))

  app.use(function (req, res, next) {
    res.redirect('/')
  })

  app.listen(8088, function () {
    console.log('server is running at %s', this.address().port)
  })

  done()
}

function watch () {
  vinylFS.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html', 'content/**/*.cson'], defaultSeries)
}
