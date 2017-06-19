const notify = require('./notify.js')()
let timeoutID, notification

module.exports = function (dispatch) {
  return function (val, message) {
    return function () {
      if (timeoutID) {
        clearTimeout(timeoutID)
      }

      if (notification) {
        notification
        .then(function (notification) { notification.close() })
        .catch(function (e) { console.error(e) })
      }

      const end = Date.now() + val + 1000

      dispatch(val)

      timeoutID = setTimeout(cycle, 100)

      function cycle () {
        const diff = end - Date.now()

        dispatch(diff)

        if (diff > 1000) {
          timeoutID = setTimeout(cycle, 100)
        } else {
          notification = notify(message)
        }
      }
    }
  }
}
