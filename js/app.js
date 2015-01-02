/*! app.js */
+function(){

    var end = 0;
    var state = 0;
    var message = '';
    var timeoutID = null;
    var output = document.querySelectorAll('output')[0];
    var title = document.querySelectorAll('title')[0];
    var buttons = document.querySelectorAll('button');
    var notifications_supported = ('Notification' in window && 'permission' in window.Notification && 'requestPermission' in window.Notification);

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

                output.value = formatted;
                title.innerHTML = formatted;

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

        output.value = '00:00';
        title.innerHTML = '00:00';

        timeoutID && clearTimeout(timeoutID);
    }

    function format(int) {

        int = String(int);

        return int >= 10 ? int : '0' + int;
    }

    function notify(message) {

        if (notifications_supported && Notification.permission === "granted") {

            var notification = new Notification(message, {
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFKElEQVR4Xu3VsRHDMAwEQbFqlm83YDm49Fc5Aix4o3Pv/Tw+AgR+ChyBeBkE3gUE4nUQ+CMgEM+DgEC8AQJNwB+kuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQh8ASFq3vhU70CkAAAAAElFTkSuQmCC'
            });

            notification.onclick = function(){
                window.focus();
            };
        }
    }

    for(var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener('click', function(){

            reset();

            state = 1;

            end = Date.now() + (this.dataset.interval * 60000);

            message = this.dataset.message;

            go();
        });
    }

    if (notifications_supported && (!Notification.permission || Notification.permission !== 'denied')) {

        Notification.requestPermission(function (permission) {

            if (!('permission' in Notification)) {

                Notification.permission = permission;
            }
        });
    }
}();
