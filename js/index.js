const framework = require('@erickmerchant/framework')
const diff = require('nanomorph')
const component = require('./component')
const target = document.querySelector('body')

framework({target, store, component, diff})(({dispatch}) => { dispatch(0) })

function store (state = 0, val) {
  if (val != null) {
    state = val
  }

  return state
}