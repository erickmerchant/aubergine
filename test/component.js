const component = require('../js/component.js')
const snapshot = require('assert-snapshot')
const tape = require('tape')

tape('js/component.js - state 300000', function (t) {
  const str = component({state: 300000}).toString()

  snapshot(t, str)

  t.end()
})

tape('js/component.js - state 1500000', function (t) {
  const str = component({state: 1500000}).toString()

  snapshot(t, str)

  t.end()
})

tape('js/component.js - state 0', function (t) {
  const str = component({state: 0}).toString()

  snapshot(t, str)

  t.end()
})
