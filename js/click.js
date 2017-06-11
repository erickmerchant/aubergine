const notify = require('./notify.js')()
let timeoutID, notification

module.exports = function (dispatch) {
  return function (val, message) {
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
