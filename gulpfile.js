'use strict'

const directory = './'
const gulp = require('gulp')
const defaultSeries = gulp.series(pages, minifyHTML, icons, js, css, shortenSelectors, insertCSS)

gulp.task('default', defaultSeries)

gulp.task('dev', gulp.parallel(defaultSeries, watch, serve))

function pages () {
  const swig = require('swig')
  const render = require('static-engine-render')
  const content = require('static-engine-content')
  const engine = require('static-engine')
  const cson = require('cson-parser')

  swig.setDefaults({ cache: false })

  return engine([
    content('./content/index.cson'),
    function (pages, done) {
      done(null, [cson.parse(pages[0].content)])
    },
    render('./index.html', function (page, done) {
      swig.renderFile('./templates/index.html', page, done)
    })
  ])
}

function css () {
  const autoprefixer = require('gulp-autoprefixer')
  const uncss = require('gulp-uncss')
  const csso = require('gulp-csso')
  const rework = require('gulp-rework')
  const concat = require('gulp-concat')
  const calc = require('rework-calc')
  const media = require('rework-custom-media')
  const npm = require('rework-npm')
  const vars = require('rework-vars')
  const color = require('rework-color-function')

  return gulp.src('./css/app.css')
    .pipe(rework(
      npm(),
      vars(),
      media(),
      calc,
      color
    ))
    .pipe(autoprefixer({ browsers: ['> 5%', 'last 2 versions'] }))
    .pipe(concat('index.css'))
    .pipe(uncss({
      html: ['index.html']
    }))
    .pipe(csso())
    .pipe(gulp.dest(directory))
}

function js () {
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

  return bundler
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
      const defs = new Set()

      gulp.src('./index.html')
        .pipe(cheerio(function ($) {
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

function shortenSelectors () {
  const selectors = require('gulp-selectors')

  return gulp.src(['index.css', 'index.html'])
    .pipe(selectors.run())
    .pipe(gulp.dest(directory))
}

function insertCSS () {
  const tap = require('gulp-tap')
  const cheerio = require('gulp-cheerio')

  return gulp.src('index.css')
    .pipe(tap(function (file) {
      gulp.src('index.html')
        .pipe(cheerio(function ($) {
          $('head').append('<style type="text/css">' + file.contents + '</style>')
        }))
        .pipe(gulp.dest(directory))
    }))
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
