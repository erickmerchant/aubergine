var supported = ('Notification' in window && 'permission' in Notification && 'requestPermission' in Notification);

function notify(message, icon) {

    if (supported && Notification.permission === "granted") {

        var notification = new Notification(message, {
            icon: icon
        });

        notification.onclick = function(){
            window.focus();
        };

        return notification;
    }
}

notify.grant = function() {

    if (supported && Notification.permission !== 'denied') {

        Notification.requestPermission(function (permission) {

            Notification.permission = permission;
        });
    }
};

module.exports = notify;
