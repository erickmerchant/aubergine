const framework = require('@erickmerchant/framework')
const diff = require('yo-yo').update
const store = require('./store')
const component = require('./component')
const target = document.querySelector('body')

framework({target, store, component, diff})()
