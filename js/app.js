/*! app.js */
var data_uri = require('./src/data-uri.js');
var $$ = require('./src/dom.js');
var notify = require('./src/notify.js');

$$('head').append('<link href="'+data_uri(200, '#777')+'" rel="shortcut icon" type="image/png">');

+function(win){

    var end = 0;
    var state = 0;
    var message = '';
    var timeoutID = null;
    var output;
    var buttons;
    var head;
    var icon = data_uri(200, '#777');

    buttons = $$('button');
    output = $$('title, output');

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

                output.html(formatted);

                timeoutID = setTimeout(go, 500);
            }
            else {

                notify(message, icon);

                reset();
            }
        }
    }

    function reset() {

        state = 0;

        output.html('00:00');

        timeoutID && clearTimeout(timeoutID);
    }

    function format(int) {

        int = String(int);

        return int >= 10 ? int : '0' + int;
    }

    buttons.on('click', function(){

        reset();

        state = 1;

        end = Date.now() + (this.getAttribute('data-interval') * 60000);

        message = this.getAttribute('data-message');

        go();
    });

    notify.grant();

}(window);
