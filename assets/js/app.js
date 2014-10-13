/*! app.js */
+function(){

    var moment = require('moment');
    var pnglib = require('pnglib');
    var onecolor = require('onecolor');
    var cache = $.cache('chrono');
    var cached_color = cache.get('color');
    var theme;
    var end = 0;
    var state = 0;
    var message = '';
    var timeoutID = null;

    function get_data_uri(width, height) {

        var p = new pnglib(width, height, 256); // construcor takes height, weight and color-depth
        var background = p.color(theme.red()*255, theme.green()*255, theme.blue()*255, 255); // set the background transparent

        return 'data:image/png;base64,'+p.getBase64();
    }

    function go() {

        if(state) {

            var diff = end.diff(moment(), 'seconds');

            var seconds = parseInt(diff % 60);

            var minutes = parseInt(diff / 60);

            if(diff > 0) {

                $('[name=output]').val(format(minutes) + ':' + format(seconds));
                $('title').text(format(minutes) + ':' + format(seconds));

                timeoutID = setTimeout(go, 500);
            }
            else {

                notify(message);

                reset();
            }
        }
    }

    function reset() {

        // $('button').attr('disabled', false);

        state = 0;

        $('[name=output]').val('00:00');
        $('title').text('00:00');

        timeoutID && clearTimeout(timeoutID);
    }

    function format(int) {

        int = String(int);

        return int >= 10 ? int : '0' + int;
    }

    function notify(message) {

        if (Notification.permission === "granted") {

            var notification = new Notification(message, {
                icon: get_data_uri(200, 200)
            });

            notification.onclick = function(){
                window.focus();
            };
        }
    }

    function change_color(color) {

        $('body').css('background', color);
        $('button').hover(
            function(){ $(this).css('color', color); },
            function(){ $(this).css('color', ''); }
        );

        theme = onecolor(color);

        var favicon = $('#favicon');

        var link = '<link href="'+get_data_uri(16, 16)+'" rel="shortcut icon" type="image/x-icon" id="favicon">';

        if(favicon.length) {

            favicon.replaceWith(link);
        }
        else {

            $('head').append(link);
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

        change_color(color);
    });

    if (!('Notification' in window && 'permission' in window.Notification && 'requestPermission' in window.Notification)) {

        Notification = { permission: 'denied' };
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

    if(cached_color) {

        $('#colors [checked]').get(0).checked = false;

        if($('#colors [value="'+cached_color+'"]').length) {

            $('#colors [value="'+cached_color+'"]').get(0).checked = true;
        }

        change_color(cached_color);
    }
}();
