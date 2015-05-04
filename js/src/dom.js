var Dom = function (selector) {
  this.nodes = [].slice.call(document.querySelectorAll(selector))
}

Dom.prototype = {
  each: function (fn) {
    this.nodes.forEach(function (el) {
      fn.call(el)
    })
  },
  on: function (event, fn) {
    this.each(function () {
      this.addEventListener(event, fn)
    })
  },
  html: function (html) {
    this.each(function () {
      this.innerHTML = html
    })
  },
  add: function (c) {
    this.each(function () {
      this.classList.add(c)
    })
  },
  remove: function (c) {
    this.each(function () {
      this.classList.remove(c)
    })
  }
}

module.exports = function (selector) {
  return new Dom(selector)
}
