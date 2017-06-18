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
  const click = require('./click.js')(dispatch)

  return html`
  <body class="flex column border-box items-center background-dark-gray white min-height-100vh">
    <div class="flex items-center justify-center auto full-width">
      <form class="margin-horizontal-auto full-width max-width-50rem center">
        <h1 class="animated ${state <= 0 ? 'flash' : ''}">${format(state)}</h1>
        <div class="flex row mobile-column justify-center wrap auto">
          ${buttons.map((button) => html`
          <div class="margin-2 auto">
            <button class="button white full-width padding-2 margin-horizontal-1 background-dark-gray white" type="button" onclick=${click(button.time, button.message)}>${button.title}</button>
          </div>`)}
        </div>
        <div class="full-width">
          <h2>
            ${icon('clock')}
            Chrono
          </h2>
        </div>
      </form>
    </div>
    <footer class="margin-1 center typesize-small" role="contentinfo">
      <span class="inline-block padding-2">© Erick Merchant, 2017</span>
      <span class="inline-block padding-2">
        <a class="white" href="https://github.com/erickmerchant/chrono">
          ${icon('github')}
          View Source
        </a>
      </span>
    </footer>
  </body>
  `
}

function icon (key) {
  return html`
  <svg class="icon" viewBox="0 0 32 32">
    <path d="${icons[key]}">
  </svg>`
}

function format (diff) {
  if (diff <= 0) diff = 0
  else diff += 999

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
