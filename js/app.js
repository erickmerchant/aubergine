var dom = require('./src/dom.js');
var notify = require('./src/notify.js');
var end = 0;
var state = 0;
var message = '';
var timeoutID = null;
var output = dom('title, h1');
var icon = './noticon.png';
var notification;

function go() {

    if(state) {

        var diff = Math.round((end - Date.now()) / 1000);

        if(diff > 0) {

            output.html(format(diff));

            timeoutID = setTimeout(go, 100);
        }
        else {

            notification = notify(message, icon);

            reset();
        }
    }
}

function reset() {

    state = 0;

    output.html(format(0));

    if(timeoutID) {

        clearTimeout(timeoutID);
    }
}

function format(diff) {

    return [diff / 60, diff % 60]
        .map(Math.floor)
        .map(function(int){

            if(int >= 10) {

                return int
            }

            return '0' + int;
        })
        .join(':');
}

dom('button').on('click', function(){

    reset();

    if(notification) {

        notification.close();
    }

    notification = null;

    state = 1;

    end = Date.now() + (this.getAttribute('data-interval') * 60000);

    message = this.getAttribute('data-message');

    go();
});

notify.grant();
