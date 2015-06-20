#!/usr/bin/env node
'use strict'

const directory = './'
const sergeant = require('sergeant')
const chalk = require('chalk')
const vinylFS = require('vinyl-fs')
const fs = require('fs')
const app = sergeant({ description: 'CMS for chrono' })
const defaultSeries = sergeant.series(pages, icons, minifyHTML, css, js)

app.command('update', { description: 'Build the site once' }, defaultSeries)

app.command('watch', { description: 'Build the site then watch for changes. Run a server' }, sergeant.parallel(defaultSeries, watch, serve))

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

function css (done) {
  const cssnext = require('cssnext')
  const cheerio = require('gulp-cheerio')
  const postcss = require('postcss')
  const Smallector = require('smallector')
  const byebye = require('css-byebye')
  const nano = require('cssnano')
  const pseudosRegex = /\:?(\:[a-z-]+)/g

  fs.readFile('css/app.css', 'utf-8', function (err, css) {
    if (err) {
      done(err)
    }

    css = cssnext(
      css, {
        from: 'css/app.css',
        features: {
          customProperties: {
            strict: false
          },
          rem: false,
          pseudoElements: false,
          colorRgba: false
        }
      }
    )

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

        output = new Smallector(postcss(byebye({ rulesToRemove: unused })).process(css).css, { compress: true })

        $('[class]').each(function () {
          var classes = $(this).attr('class').split(' ')

          classes.forEach(function (v, k) {
            if (output.map[v]) {
              classes[k] = output.map[v]
            } else {
              delete classes[k]
            }
          })

          $(this).attr('class', classes.join(' ') || null)
        })

        ignore.forEach(function (v) {
          if (output.map[v.substr(1)]) {
            output.compiled = output.compiled.replace(new RegExp('\\.' + output.map[v.substr(1)] + '([^\\w-])', 'g'), v + '$1')
          }
        })

        output = postcss(nano()).process(output.compiled).css

        $('head').append(`<style type="text/css">${ output }</style>`)
      }))
      .pipe(vinylFS.dest(directory))
      .on('end', function () {
        done()
      })
  })
}

function js (done) {
  const browserify = require('browserify')
  const uglify = require('uglify-js')
  const collapse = require('bundle-collapser/plugin')
  const cheerio = require('gulp-cheerio')
  const bundler = browserify({debug: false})

  bundler.add('js/app.js')

  bundler.plugin(collapse)

  bundler.bundle(function (err, js) {
    if (err) {
      done(err)
    } else {
      js = js.toString()

      js = uglify.minify(js, {fromString: true, mangle: true}).code

      vinylFS.src('./index.html')
        .pipe(cheerio(function ($) {
          $('body').append('<script>' + js + '</script>')
        }))
        .pipe(vinylFS.dest(directory))
        .on('end', done)
    }
  })
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
