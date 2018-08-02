const notify = require('./notify.js')
const html = require('nanohtml')
const raw = require('nanohtml/raw')
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

  return html`<body class="flex column items-center justify-center background-white black border-box">
    <main class="width-full margin-x-auto mobile-max-width-1 desktop-max-width-2 align-center">
      <h1 class="animated ${state.value <= 0 ? 'flash' : ''}">${format(state.value)}</h1>
      <div class="grid desktop-auto-flow-column mobile-auto-flow-row gap-2 margin-x-2">
        ${buttons.map(button)}
      </div>
      <div class="width-full">
        <h2 class="">
          ${icon('clock')} Chrono
        </h2>
      </div>
    </main>
    <footer class="margin-1 align-center font-size-6 black" role="contentinfo">
      <span class="inline-block padding-2">${raw('&copy;')} ${(new Date()).getFullYear()} Erick Merchant</span>
      <span class="inline-block padding-2">
        <a class="black" href="https://github.com/erickmerchant/chrono">
          ${icon('github')} View Source
        </a>
      </span>
    </footer>
  </body>`

  function button (button) {
    return html`<div>
      <button class="border-radius border-black bold width-full padding-2 background-white black hover-background-black hover-white" type="button" onclick=${() => dispatch('set', button.time, button.message)}>${button.title}</button>
    </div>`
  }
}

function icon (key) {
  return html`<svg class="icon" viewBox="0 0 32 32">
    <path d="${icons[key]}" />
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
