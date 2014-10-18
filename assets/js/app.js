/*! app.js */
+function(){

    var moment = require('moment');
    var pnglib = require('pnglib');
    var onecolor = require('onecolor');
    var cache = $.cache('chrono');
    var cached_color = cache.get('color');
    var end = 0;
    var state = 0;
    var message = '';
    var timeoutID = null;
    var $output = $('output');
    var $title = $('title');
    var $body = $('body');
    var notifications_supported = ('Notification' in window && 'permission' in window.Notification && 'requestPermission' in window.Notification);

    function get_data_uri(width, height) {

        var png = new pnglib(width, height, 256);
        var theme = onecolor(cached_color);
        var background = png.color(theme.red()*255, theme.green()*255, theme.blue()*255, 255);

        return 'data:image/png;base64,'+png.getBase64();
    }

    function go() {

        if(state) {

            var diff = end.diff(moment(), 'seconds');

            var seconds = parseInt(diff % 60);

            var minutes = parseInt(diff / 60);

            if(diff > 0) {

                $output.val(format(minutes) + ':' + format(seconds));
                $title.text(format(minutes) + ':' + format(seconds));

                timeoutID = setTimeout(go, 500);
            }
            else {

                notify(message);

                reset();
            }
        }
    }

    function reset() {

        state = 0;

        $output.val('00:00');
        $title.text('00:00');

        timeoutID && clearTimeout(timeoutID);
    }

    function format(int) {

        int = String(int);

        return int >= 10 ? int : '0' + int;
    }

    function notify(message) {

        if (notifications_supported && Notification.permission === "granted") {

            var notification = new Notification(message, {
                icon: get_data_uri(200, 200)
            });

            notification.onclick = function(){
                window.focus();
            };
        }
    }

    function change_color(color) {

        $body.css('background', color);

        var favicon = $('#favicon');

        var link = '<link href="'+get_data_uri(16, 16)+'" rel="shortcut icon" type="image/x-icon" id="favicon">';

        if(favicon.length) {

            favicon.replaceWith(link);
        }
    }

    $(document).on('click', '#controls button', function(){

        var el = $(this);

        reset();

        // $('button').attr('disabled', true);

        state = 1;

        end = moment().add(el.data('interval'), 'minute');

        message = el.data('message');

        go();
    });

    $(document).on('change', '#colors [type="radio"]', function(){

        var color = $(this).val();

        cache.set('color', color);

        cached_color = color;

        change_color(color);
    });

    $(document).on('mouseenter', 'button', function(){

        $(this).css('color', cached_color);
    });

    $(document).on('mouseleave', 'button', function(){

        $(this).css('color', '');
    });

    if (notifications_supported && (!Notification.permission || Notification.permission !== 'denied')) {

        Notification.requestPermission(function (permission) {

            if (!('permission' in Notification)) {

                Notification.permission = permission;
            }
        });
    }

    if(cached_color) {

        // $('#colors [checked]').get(0).checked = false;

        $('#colors [value="'+cached_color+'"]').each(function(){

            this.checked = true;
        });

        change_color(cached_color);
    }
}();
