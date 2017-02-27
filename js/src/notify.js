var Notification = ('Notification' in window) ? window.Notification : {}

function permission () {
  if ('permission' in Notification) {
    return Notification.permission
  }

  return ''
}

function notify (message) {
  if (permission() === 'granted') {
    var notification = new Notification(message)

    notification.onclick = function () {
      window.focus()
    }

    return notification
  }
}

notify.grant = function () {
  if ('requestPermission' in Notification && permission() !== 'denied') {
    Notification.requestPermission(function (permission) {
      Notification.permission = permission
    })
  }
}

module.exports = notify
