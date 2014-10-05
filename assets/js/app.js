/*! app.js */
+function(){

    var moment = require('moment');
    var pnglib = require('pnglib')
    var onecolor = require('onecolor');
    var cache = $.cache('chrono');

    var chrono = {
            end: 0,
            state: 0,
            message: '',
            color: null,
            getImg: function(width, height) {

                var p = new pnglib(width, height, 256); // construcor takes height, weight and color-depth
                var background = p.color(chrono.color.red()*255, chrono.color.green()*255, chrono.color.blue()*255, 255); // set the background transparent

                return 'data:image/png;base64,'+p.getBase64();
            }
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

            new Notification("Chrono: \n" + message, {
                icon: chrono.getImg(200, 200)
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

    function changeColor(color) {

        $('body').css('background', color);

        chrono.color = onecolor(color);

        var favicon = $('#favicon');

        var link = '<link href="'+chrono.getImg(16, 16)+'" rel="shortcut icon" type="image/x-icon" id="favicon">';

        if(favicon.length) {

            favicon.replaceWith(link);
        }
        else {
            $('head').append(link);
        }
    }

    $('#colors [type="radio"]').on('change', function(){

        var color = $(this).val();

        cache.set('color', color);

        changeColor(color);
    });

    var color = cache.get('color');

    if(color) {

        $('#colors [value="'+color+'"]').get(0).checked = true;

        changeColor(color);
    }

    // window.chrono = chrono;
}();
