#!/usr/bin/env node
'use strict'

const sergeant = require('sergeant')
const app = sergeant().describe('CMS for chrono')
const commands = ['update', 'watch']

commands.forEach(function (command) {
  require('./src/commands/' + command + '.js')(app)
})

app.run()
