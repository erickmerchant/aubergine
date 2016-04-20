(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dom = require(2)
var notify = require(3)
var end = 0
var state = 0
var message = ''
var timeoutID = null
var output = dom('h1')
var icon = './noticon.png'
var notification

function go () {
  var diff

  if (state) {
    diff = Math.round((end - Date.now()) / 1000)

    if (diff > 0) {
      output.html(format(diff))
      timeoutID = setTimeout(go, 100)
    } else {
      notification = notify(message, icon)
      output.add('flash')
      reset()
    }
  }
}

function reset () {
  state = 0

  output.html(format(0))

  if (timeoutID) {
    clearTimeout(timeoutID)
  }
}

function format (diff) {
  return [diff / 60, diff % 60]
    .map(Math.floor)
    .map(function (int) {
      if (int >= 10) {
        return int
      }
      return '0' + int
    })
    .join(':')
}

dom('button').on('click', function () {
  var data = this.dataset

  output.remove('flash')
  reset()

  if (notification) {
    notification.close()
  }

  notification = null

  state = 1

  end = Date.now() + (data.interval * 60000)

  message = data.message

  go()

  this.focus()
})

notify.grant()

},{"2":2,"3":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var Notification = ('Notification' in window) ? window.Notification : {}

function permission () {
  if ('permission' in Notification) {
    return Notification.permission
  }

  return ''
}

function notify (message, icon) {
  if (permission() === 'granted') {
    var notification = new Notification(message, {
      icon: icon
    })

    notification.onclick = function () {
      window.focus()
    }

    return notification
  }
}

notify.grant = function () {
  if ('requestPermission' in Notification && permission() !== 'denied') {
    Notification.requestPermission(function (permission) {
      Notification.permission = permission
    })
  }
}

module.exports = notify

},{}]},{},[1]);
