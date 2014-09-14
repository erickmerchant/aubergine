/*! site.js */
+function(){

    var moment = require('moment');

    var aubergine = {
            end: 0,
            state: 0,
            message: ''
        }
    ;

    var timeoutID = null;

    var outputEl = $('[name=output]');

    $('button').on('click', function(){

        var el = $(this);

        reset();

        // $('button').attr('disabled', true);

        aubergine.state = 1;

        aubergine.end = moment().add(el.data('interval'), 'minute');

        aubergine.message = el.data('message');

        go();
    });

    function go() {

        if(aubergine.state) {

            var diff = aubergine.end.diff(moment(), 'seconds');

            var seconds = parseInt(diff % 60);

            var minutes = parseInt(diff / 60);

            if(diff > 0) {

                outputEl.val(format(minutes) + ':' + format(seconds));

                timeoutID = setTimeout(go, 500);
            }
            else {

                notify(aubergine.message);

                reset();
            }
        }
    }

    function reset() {

        // $('button').attr('disabled', false);

        aubergine.state = 0;

        outputEl.val('00:00');

        timeoutID && clearTimeout(timeoutID);
    }

    function format(int) {

        int = new String(int);

        return int >= 10 ? int : '0' + int;
    }

    function notify(message) {

        if (Notification.permission === "granted") {

            new Notification(message, {
                icon: './eggplant.png'
            });
        }
    }

    if (!("Notification" in window)) {

        Notification.permission = 'denied';
    }
    else {

        if (!Notification.permission || Notification.permission !== 'denied') {

            Notification.requestPermission(function (permission) {

                if (!('permission' in Notification)) {

                    Notification.permission = permission;
                }
            });
        }
    }

    // window.aubergine = aubergine;
}();
