#!/usr/bin/env node
'use strict'

const sgt = require('sergeant')
const app = sgt({ description: 'CMS for chrono' })
const commands = ['update', 'watch']

commands.forEach(function (command) {
  require('./src/commands/' + command + '.js')(app)
})

app.run()
