'use strict'

const express = require('express')
const _static = require('express-static')
const logger = require('express-log')

module.exports = function serve (done) {

  const app = express()

  app.use(logger())

  app.use(_static('./'))

  app.use(function (req, res, next) {
    res.redirect('/')
  })

  app.listen(8088, function () {
    console.log('server is running at %s', this.address().port)
  })

  done()
}
