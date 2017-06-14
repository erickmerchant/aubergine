module.exports = function () {
  return function (message) {
    if (window.Notification != null) {
      window.Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
          const notification = new window.Notification(message)

          notification.onclick = function () {
            window.focus()
          }

          return notification
        }

        return Promise.reject(new Error('denied'))
      })
      .catch(function (e) {
        console.error(e)
      })
    }
  }
}
