/*! app.js */
+function(){

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

    function get_data_uri(size) {

        var canvas = document.createElement('canvas');

        var context = canvas.getContext('2d');

        canvas.width = size;

        canvas.height = size;

        context.fillStyle = cached_color;

        context.fillRect(0, 0, size, size);

        return canvas.toDataURL();
    }

    function go() {

        if(state) {

            var diff = (end - Date.now()) / 1000;
            var seconds;
            var minutes;
            var formatted;

            if(diff > 0) {

                seconds = format(parseInt(diff % 60));
                minutes = format(parseInt(diff / 60));
                formatted = minutes + ':' + seconds;

                $output.val(formatted);
                $title.text(formatted);

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
                icon: get_data_uri(200)
            });

            notification.onclick = function(){
                window.focus();
            };
        }
    }

    $(document).on('click', 'button', function(){

        var el = $(this);

        reset();

        // $('button').attr('disabled', true);

        state = 1;

        end = Date.now() + (el.data('interval') * 60000);

        message = el.data('message');

        go();
    });

    $(document).on('click', '[type="radio"]', function(){

        var color = $(this).val();

        cache.set('color', color);

        cached_color = color;

        $body.css('background', color);

        var favicon = $('#favicon');

        var link = '<link href="'+get_data_uri(16)+'" rel="shortcut icon" type="image/x-icon" id="favicon">';

        if(favicon.length) {

            favicon.replaceWith(link);
        }

        this.checked = true;
    });

    if (notifications_supported && (!Notification.permission || Notification.permission !== 'denied')) {

        Notification.requestPermission(function (permission) {

            if (!('permission' in Notification)) {

                Notification.permission = permission;
            }
        });
    }

    if(cached_color) {

        $('[value="'+cached_color+'"]').trigger('click');
    }
}();
