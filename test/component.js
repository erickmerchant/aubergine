const component = require('../js/component.js')
const snapshot = require('assert-snapshot')
const tape = require('tape')

tape('js/component.js - state 600', function (t) {
  const str = component({state: 600000}).toString()

  snapshot(t, str)

  t.end()
})

tape('js/component.js - state 60', function (t) {
  const str = component({state: 6000}).toString()

  snapshot(t, str)

  t.end()
})

tape('js/component.js - state 30', function (t) {
  const str = component({state: 30000}).toString()

  snapshot(t, str)

  t.end()
})

tape('js/component.js - state 0', function (t) {
  const str = component({state: 0}).toString()

  snapshot(t, str)

  t.end()
})
