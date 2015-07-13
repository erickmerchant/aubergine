function Dom (selector) {
  this.nodes = [].slice.call(document.querySelectorAll(selector))
}

function wrap (method) {
  return function () {
    var args = [].slice.call(arguments)

    this.nodes.forEach(function (el) {
      method.apply(el, args)
    })
  }
}

Dom.prototype = {
  on: wrap(function (event, fn) {
    this.addEventListener(event, fn)
  }),
  html: wrap(function (html) {
    this.innerHTML = html
  }),
  add: wrap(function (c) {
    this.classList.add(c)
  }),
  remove: wrap(function (c) {
    this.classList.remove(c)
  })
}

module.exports = function (selector) {
  return new Dom(selector)
}
