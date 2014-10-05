/*! app.js */
+function(){

    var moment = require('moment');
    var cache = $.cache('chrono')

    var chrono = {
            end: 0,
            state: 0,
            message: ''
        }
    ;

    var timeoutID = null;

    var outputEl = $('[name=output]');

    $('#controls button').on('click', function(){

        var el = $(this);

        reset();

        // $('button').attr('disabled', true);

        chrono.state = 1;

        chrono.end = moment().add(el.data('interval'), 'minute');

        chrono.message = el.data('message');

        go();
    });

    function go() {

        if(chrono.state) {

            var diff = chrono.end.diff(moment(), 'seconds');

            var seconds = parseInt(diff % 60);

            var minutes = parseInt(diff / 60);

            if(diff > 0) {

                outputEl.val(format(minutes) + ':' + format(seconds));

                timeoutID = setTimeout(go, 500);
            }
            else {

                notify(chrono.message);

                reset();
            }
        }
    }

    function reset() {

        // $('button').attr('disabled', false);

        chrono.state = 0;

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
                // icon: './eggplant.png'
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

    $('#colors [type="radio"]').on('change', function(){

        var color = $(this).val();

        cache.set('color', color);

        $('body').css('background', color);
    });

    var color = cache.get('color');

    if(color) {

        $('#colors [value="'+color+'"]').get(0).checked = true;

        $('body').css('background', color);
    }

    // window.chrono = chrono;
}();
