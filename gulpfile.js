
var tasks = require('gulp-tasks');
var Promise = require('es6-promise').Promise;

tasks({
    directory: "./",
    single: true,
    js: [
        "js/ender.min.js",
        "js/app.js"
    ],
    css: [
        "css/app.css"
    ],
    icons: "node_modules/geomicons-open/icons/*.svg",
    build: function () {

        var nunjucks = require('static-engine-renderer-nunjucks');
        var render = require('static-engine-render');
        var page;

        nunjucks.configure('./templates/', {
            autoescape: true
        });

        render.configure('./');

        page = render('index.html', nunjucks('index.html'));

        return page([{

                controls: {
                    'Work': {
                        'interval': 25,
                        'message': 'Take a break!'
                    },
                    'Break': {
                        'interval': 5,
                        'message': 'Back to work!'
                    }
                },
                colors: [
                    '#AAAAAA',
                    '#FF851B',
                    '#2ECC40',
                    '#0074D9',
                    '#F012BE'
                ]
            }
        ]);
    },
    before: function(cb) {

        var exec = require('child_process').exec;

        exec('ender build qwery bonzo bean kizzy --output js/ender', function (err, stdout, stderr) {

            if (err !== null) cb(err);
            else
                cb();
        });
    }
});
