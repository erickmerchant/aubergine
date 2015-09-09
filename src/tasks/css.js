'use strict'

const fs = require('fs')
const vinylFS = require('vinyl-fs')
const cssnext = require('cssnext')
const cheerio = require('gulp-cheerio')
const postcss = require('postcss')
const Smallector = require('smallector')
const byebye = require('css-byebye')
const nano = require('cssnano')
const pseudosRegex = /\:?(\:[a-z-]+)/g

module.exports = function css (done) {
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
      .pipe(cheerio(function ($, file, done) {
        const parsed = postcss.parse(css)
        const unused = []
        const ignore = ['.flash']
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

                    if (_selector && ignore.indexOf(_selector) < 0 && !$(_selector).length) {
                      unused.push(selector)
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

          classes = classes.map(function (v, k) {
            if (output.map[v]) {
              return output.map[v]
            }
          })

          $(this).attr('class', classes.join(' ') || null)
        })

        ignore.forEach(function (v) {
          if (output.map[v.substr(1)]) {
            output.compiled = output.compiled.replace(new RegExp('\\.' + output.map[v.substr(1)] + '([^\\w-])', 'g'), v + '$1')
          }
        })

        postcss([nano()]).process(output.compiled).then(function (output) {
          $('head').append(`<style type="text/css">${ output.css }</style>`)

          done()
        })
      }))
      .pipe(vinylFS.dest('./'))
      .on('end', function () {
        done()
      })
  })
}
