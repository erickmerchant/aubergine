const notify = require('./notify.js')()
const geomicons = require('geomicons-open')
const framework = require('@erickmerchant/framework')
const html = require('yo-yo')
const diff = html.update
const target = document.querySelector('body')

framework({target, store, component, diff})(({dispatch}) => { dispatch(0) })

function store (state = 0, val) {
  if (val != null) {
    state = val
  }

  return state
}

let timeoutID, notification

function component ({state, dispatch, next}) {
  return html`
  <body class="flex flex-column center background-dark-gray white full-view-height">
    <div class="flex items-center flex-auto">
      <form class="max-width-3 mx-auto col-12">
        <h1 class="h00 h00-responsive animated ${state <= 0 ? 'flash' : ''}">${format(state)}</h1>
        <div class="col col-12 sm-col-4 h3 p2">
          <button class="btn white border rounded col-12 p2" type="button" onclick=${set(25 * 60000, 'Take a break!')}>Work</button>
        </div>
        <div class="col col-12 sm-col-4 h3 p2">
          <button class="btn white border rounded col-12 p2" type="button" onclick=${set(5 * 60000, 'Back to work!')}>Break</button>
        </div>
        <div class="col col-12 sm-col-4 h3 p2">
          <button class="btn white border rounded col-12 p2" type="button" onclick=${set(0, 'Cancelled')}>Reset</button>
        </div>
        <div class="col col-12 sm-col-12">
          <h2>
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path d="${geomicons.paths.clock}" />
            </svg>
            Chrono
          </h2>
        </div>
      </form>
    </div>
    <footer class="clearfix muted h6 m1" role="contentinfo">
      <span class="p2 inline-block">© Erick Merchant, 2017</span>
      <a class="btn white p2" href="https://github.com/erickmerchant/chrono">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="${geomicons.paths.github}" />
        </svg>
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
        notification.then(function (notification) { notification.close() })
      }

      const end = Date.now() + val

      dispatch(val)

      timeoutID = setTimeout(go, 100)

      function go () {
        const diff = end - Date.now()

        dispatch(diff)

        if (diff > 0) {
          timeoutID = setTimeout(go, 100)
        } else {
          notification = notify(message)
        }
      }
    }
  }
}

function format (diff) {
  if (diff < 0) diff = 0

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
