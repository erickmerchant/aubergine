
var tasks = require('gulp-tasks');

tasks.config({
    directory: "./",
    js: [
        "js/ender.min.js",
        "js/app.js"
    ],
    css: [
        "css/app.css"
    ],
    icons: "node_modules/geomicons-open/icons/*.svg",
    build: function () {

        var nunjucks = require('nunjucks');
        var engine = require('static-engine');
        var site = engine('./', nunjucks.render);
        var push = function (literal) {

            return function (pages, next) {

                pages.push(literal);

                next(pages);
            };
        };

        nunjucks.configure('./templates/', {
            autoescape: true
        });

        site.route('index.html').use(push({
            controls: {
                'Work': {'interval': 25, 'message': 'Take a break!'},
                'Break': {'interval': 5, 'message': 'Back to work!'}
            },
            colors: [
                '#AAAAAA',
                '#FF851B',
                '#2ECC40',
                '#0074D9',
                '#F012BE'
            ]
        })).render('index.html');

        return site.build();
    },
    before: function(cb) {

        var ender = require('ender');

        ender.exec('ender build qwery bonzo bean kizzy --output js/ender', cb);
    }
});

tasks();
