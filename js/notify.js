module.exports = function (message) {
  if (window.Notification != null) {
    window.Notification.requestPermission().then(function (result) {
      if (result === 'granted') {
        const notification = new window.Notification(message)

        notification.onclick = function () {
          window.focus()
        }
      }
    })
      .catch(function (e) {
        console.error(e)
      })
  }
}
