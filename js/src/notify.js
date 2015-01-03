var supported = ('Notification' in window && 'permission' in window.Notification && 'requestPermission' in window.Notification);

function notify(message, icon) {

    if (supported && Notification.permission === "granted") {

        var notification = new Notification(message, {
            icon: icon
        });

        notification.onclick = function(){
            window.focus();
        };
    }
}

notify.grant = function() {

    if (supported && (!window.Notification.permission || window.Notification.permission !== 'denied')) {

        window.Notification.requestPermission(function (permission) {

            if (!('permission' in window.Notification)) {

                window.Notification.permission = permission;
            }
        });
    }
}

module.exports = notify;
