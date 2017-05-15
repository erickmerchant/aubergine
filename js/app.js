const notify = require('./notify.js')()
const icons = {
  github: require('geomicons-open/src/github'),
  clock: require('geomicons-open/src/clock')
}
const framework = require('@erickmerchant/framework')
const html = require('bel')
const diff = require('nanomorph')
const target = document.querySelector('body')

framework({target, store, component, diff})(({dispatch}) => { dispatch(0) })

function store (state = 0, val) {
  if (val != null) {
    state = val
  }

  return state
}

let timeoutID, notification
const buttons = [
  {
    time: 25 * 60000,
    message: 'Take a break!',
    title: 'Work'
  },
  {
    time: 5 * 60000,
    message: 'Back to work!',
    title: 'Break'
  },
  {
    time: 0,
    message: 'Cancelled',
    title: 'Reset'
  }
]

function component ({state, dispatch, next}) {
  return html`
  <body class="flex column items-center background-dark-gray white min-height-100vh">
    <div class="flex items-center justify-center auto width-3">
      <form class="margin-horizontal-auto width-2 center">
        <h1 class="desktop-font-size-6vw animated ${state <= 0 ? 'flash' : ''}">${format(state)}</h1>
        <div class="flex row mobile-column justify-center wrap auto">
          ${buttons.map((button) => html`
          <div class="margin-2 auto">
            <button class="button white width-3 padding-2 background-dark-gray white" type="button" onclick=${set(button.time, button.message)}>${button.title}</button>
          </div>`)}
        </div>
        <div class="width-3">
          <h2>
            ${icon('clock')}
            Chrono
          </h2>
        </div>
      </form>
    </div>
    <footer class="margin-1 center" role="contentinfo">
      <span class="inline-block padding-2">© Erick Merchant, 2017</span>
      <a class="inline-block white padding-2" href="https://github.com/erickmerchant/chrono">
        ${icon('github')}
        View Source
      </a>
    </footer>
  </body>
  `

  function set (val, message) {
    return function (e) {
      if (timeoutID) {
        clearTimeout(timeoutID)
      }

      if (notification) {
        notification
        .then(function (notification) { notification.close() })
        .catch(function (e) { console.error(e) })
      }

      const end = Date.now() + val

      dispatch(val)

      timeoutID = setTimeout(cycle, 100)

      function cycle () {
        const diff = end - Date.now()

        dispatch(diff)

        if (diff > 0) {
          timeoutID = setTimeout(cycle, 100)
        } else {
          notification = notify(message)
        }
      }
    }
  }
}

function icon (key) {
  return html`
  <svg class="icon" viewBox="0 0 32 32">
    <path d="${icons[key]}">
  </svg>`
}

function format (diff) {
  if (diff <= 0) diff = 0
  else diff += 999.999

  diff /= 1000

  const parts = [diff / 60, diff % 60]
    .map((int) => Math.floor(int))
    .map(function (int) {
      if (int >= 10) {
        return int
      }

      return '0' + int
    })

  if (parts[1] === 60) {
    parts[1] = '00'
  }

  return parts.join(':')
}
