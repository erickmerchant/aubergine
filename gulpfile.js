'use strict'

const directory = './'
const gulp = require('gulp')
const defaultSeries = gulp.series(gulp.parallel(gulp.series(pages, icons, minifyHTML, js), css), insertCSS)

gulp.task('default', defaultSeries)

gulp.task('dev', gulp.parallel(defaultSeries, watch, serve))

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
  const concat = require('gulp-concat')
  const csso = require('gulp-csso')

  return gulp.src('css/app.css')
    .pipe(cssnext({
      features: {
        customProperties: {
          strict: false
        },
        rem: false,
        pseudoElements: false,
        colorRgba: false
      },
      browsers: ['> 5%', 'last 2 versions']
    }))
    .pipe(concat('index.css'))
    .pipe(csso())
    .pipe(gulp.dest(directory))
}

function js (done) {
  const uglify = require('gulp-uglify')
  const tap = require('gulp-tap')
  const cheerio = require('gulp-cheerio')
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
    .pipe(tap(function (file) {
      return gulp.src('index.html')
        .pipe(cheerio(function ($) {
          $('body').append('<script>' + file.contents + '</script>')
        }))
        .pipe(gulp.dest(directory))
        .on('end', done)
    }))
}

function minifyHTML () {
  const htmlmin = require('gulp-htmlmin')

  return gulp.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(directory))
}

function icons (done) {
  const cheerio = require('gulp-cheerio')
  const fs = require('fs')
  const path = require('path')
  const glob = require('glob')

  glob('./node_modules/geomicons-open/src/paths/*.d', function (err, files) {
    if (err) {
      done(err)
    }

    files = files.map(function (file) {
      return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf-8', function (err, content) {
          if (err) {
            reject(err)
          } else {
            resolve([path.basename(file, '.d'), content.split('\n').join('')])
          }
        })
      })
    })

    Promise.all(files).then(function (keyVals) {
      const map = new Map(keyVals)

      gulp.src('./index.html')
        .pipe(cheerio(function ($) {
          const defs = new Set()

          $('use').each(function () {
            const href = $(this).attr('xlink:href')
            const id = href.substring(1)

            if ($('use[xlink\\:href="' + href + '"]').length > 1) {
              defs.add(id)
            } else {
              $(this).replaceWith('<path d="' + map.get(id) + '"/>')
            }
          })

          if (defs.size) {
            let paths = []

            for (let id of defs) {
              paths.push('<path d="' + map.get(id) + '" id="' + id + '"/>')
            }

            $('body').append('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' + paths.join('') + '</defs></svg>')
          }
        }))
        .pipe(gulp.dest(directory))
        .on('end', done)
    })
    .catch(done)
  })
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

  fs.readFile('./index.css', 'utf-8', function (err, css) {
    if (err) {
      done(err)
    }

    gulp.src('./index.html')
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
      .pipe(gulp.dest(directory))
      .on('end', function () {
        del(['./index.css'], done)
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
  gulp.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html', 'content/**/*.cson'], defaultSeries)
}
