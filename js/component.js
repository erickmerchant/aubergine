const notify = require('./notify.js')
const html = require('bel')
const raw = require('bel/raw')
const icons = {
  github: require('geomicons-open/src/github'),
  clock: require('geomicons-open/src/clock')
}
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
  <body class="flex column items-center justify-center background-dark-gray white">
    <main class="full-width margin-horizontal-auto max-width align-center">
      <h1 class="animated ${state.value <= 0 ? 'flash' : ''} text-shadow">${format(state.value)}</h1>
      <div class="grid desktop-auto-flow-column mobile-auto-flow-row gap-2 margin-horizontal-2">
        ${buttons.map(button)}
      </div>
      <div class="full-width">
        <h2 class="text-shadow">
          ${icon('clock')} Chrono
        </h2>
      </div>
    </main>
    <footer class="margin-1 align-center font-size-small text-shadow" role="contentinfo">
      <span class="inline-block padding-2">${raw('&copy;')} Erick Merchant, 2017</span>
      <span class="inline-block padding-2">
        <a class="white" href="https://github.com/erickmerchant/chrono">
          ${icon('github')} View Source
        </a>
      </span>
    </footer>
  </body>`

  function button (button) {
    return html`<div>
      <button class="border-radius border bold full-width padding-2 background-gray white box-shadow text-shadow" type="button" onclick=${() => dispatch(button.time, button.message)}>${button.title}</button>
    </div>`
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
