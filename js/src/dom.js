var eventHandlers = {}

function addEventListener (event, selector, handler) {
  if (!eventHandlers[event]) {
    eventHandlers[event] = []

    document.addEventListener(event, function (e) {
      eventHandlers[event].forEach(function (el) {
        if (e.target.matches(el.selector)) {
          el.handler.call(e.target, e)
        }
      })
    })
  }

  eventHandlers[event].push({
    selector: selector,
    handler: handler
  })
}

function Dom (selector) {
  this.nodes = [].slice.call(document.querySelectorAll(selector))

  this.selector = selector
}

Dom.prototype = {
  on: function (event, handler) {
    addEventListener(event, this.selector, handler)
  },
  html: function (html) {
    this.nodes.forEach(function (el) {
      el.innerHTML = html
    })
  },
  add: function (c) {
    this.nodes.forEach(function (el) {
      el.classList.add(c)
    })
  },
  remove: function (c) {
    c = c.split(/\s+/)

    this.nodes.forEach(function (el) {
      el.classList.remove(c)
    })
  }
}

module.exports = function (selector) {
  return new Dom(selector)
}
