const assert = require('assert')
const framework = require('@erickmerchant/framework')
const diff = require('yo-yo').update
const component = require('./component')
const target = document.querySelector('body')

framework({target, store, component, diff})(({dispatch}) => { dispatch(0) })

function store (state = 0, val) {
  if (val != null) {
    assert.equal(typeof val, 'number')

    state = val
  }

  return state
}
