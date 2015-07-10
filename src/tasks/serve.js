'use strict'

const express = require('express')
const _static = require('express-static')
const logger = require('express-log')
const portfinder = require('portfinder')

module.exports = function serve (done) {
  portfinder.getPort(function (err, port) {
    if (err) {
      done(err)
    } else {
      const app = express()

      app.use(logger())

      app.use(_static('./'))

      app.use(function (req, res, next) {
        res.redirect('/')
      })

      app.listen(port, function () {
        console.log('server is running at %s', port)
      })

      done()
    }
  })
}
