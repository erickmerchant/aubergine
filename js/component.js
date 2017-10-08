const notify = require('./notify.js')
const icons = {
  github: require('geomicons-open/src/github'),
  clock: require('geomicons-open/src/clock')
}
const html = require('bel')
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

module.exports = function ({state, dispatch, next}) {
  next(function () {
    if (state.message) {
      notify(state.message)
    }
  })

  return html`
  <body class="flex column items-center background-dark-gray white">
    <div class="flex items-center justify-center auto full-width">
      <div class="margin-horizontal-auto full-width max-width align-center">
        <h1 class="animated ${state.value <= 0 ? 'flash' : ''} text-shadow">${format(state.value)}</h1>
        <div class="flex row mobile-column justify-center wrap auto">
          ${buttons.map((button) => html`
          <div class="mobile-margin-horizontal-4 flex auto">
            <button class="border-radius border bold full-width padding-2 margin-horizontal-1 margin-vertical-1 background-gray white box-shadow text-shadow" type="button" onclick=${() => dispatch(button.time, button.message)}>${button.title}</button>
          </div>`)}
        </div>
        <div class="full-width">
          <h2 class="text-shadow">
            ${icon('clock')} Chrono
          </h2>
        </div>
      </div>
    </div>
    <footer class="margin-1 align-center font-size-small text-shadow" role="contentinfo">
      <span class="inline-block padding-2">© Erick Merchant, 2017</span>
      <span class="inline-block padding-2">
        <a class="white" href="https://github.com/erickmerchant/chrono">
          ${icon('github')} View Source
        </a>
      </span>
    </footer>
  </body>`
}

function icon (key) {
  return html`
  <svg class="icon" viewBox="0 0 32 32">
    <path d="${icons[key]}">
  </svg>`
}

function format (diff) {
  if (diff <= 0) diff = 0

  diff /= 1000

  const parts = [diff / 60, diff % 60]
  .map((int) => Math.floor(int))
  .map(function (int) {
    if (int >= 10) {
      return int
    }

    return '0' + int
  })

  return parts.join(':')
}
