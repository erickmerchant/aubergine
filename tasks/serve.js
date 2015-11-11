'use strict'

const express = require('express')
const _static = require('express-static')
const morgan = require('morgan')
const portfinder = require('portfinder')

module.exports = function serve () {
  return new Promise(function (resolve, reject) {
    portfinder.getPort(function (err, port) {
      if (err) {
        resolve(err)
      } else {
        const app = express()

        app.use(morgan('dev'))

        app.use(_static('./'))

        app.use(function (req, res, next) {
          res.redirect('/')
        })

        app.listen(port, function () {
          console.log('server is running at %s', port)
        })

        resolve()
      }
    })
  })
}
