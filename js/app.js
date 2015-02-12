var $$ = require('./src/dom.js');
var notify = require('./src/notify.js');
var end = 0;
var state = 0;
var message = '';
var timeoutID = null;
var output = $$('title, h1');
var icon = './noticon.png';

function go(previous) {

    if(state) {

        var diff = (end - Date.now()) / 1000;
        var formatted;

        if(diff > 0) {

            formatted = format(diff / 60) + ':' + format(diff % 60);

            (!previous || previous !== formatted) && output.html(formatted);

            timeoutID = setTimeout(go, 500, formatted);
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

    int = "" + parseInt(int);

    return int >= 10 ? int : '0' + int;
}

$$('button').on('click', function(){

    reset();

    state = 1;

    end = Date.now() + (this.getAttribute('data-interval') * 60000);

    message = this.getAttribute('data-message');

    go();
});

notify.grant();
