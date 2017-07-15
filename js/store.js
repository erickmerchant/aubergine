const notify = require('./notify.js')()
let timeoutID, notification

// assert.equal(typeof val, 'number')

module.exports = function (seed) {
  seed(0)

  return function (commit, val, message) {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    if (notification) {
      notification
      .then(function (notification) { notification.close() })
      .catch(function (e) { console.error(e) })
    }

    const end = Date.now() + val + 1000

    commit(() => val)

    timeoutID = setTimeout(cycle, 100)

    function cycle () {
      const diff = end - Date.now()

      commit(() => diff)

      if (diff > 1000) {
        timeoutID = setTimeout(cycle, 100)
      } else {
        notification = notify(message)
      }
    }
  }
}
