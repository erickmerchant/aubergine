
var tasks = require('gulp-tasks');

tasks.config({
    build_directory: "./",
    date_formats: ["YYYY-MM-DD"],
    js_files: [
        "js/ender.min.js",
        "js/app.js"
    ],
    css_files: [
        "css/app.css"
    ],
    icon_files: [
        "node_modules/geomicons-open/icons/home.svg",
        "node_modules/geomicons-open/icons/twitter.svg",
        "node_modules/geomicons-open/icons/github.svg",
        "node_modules/geomicons-open/icons/check.svg"
    ],
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

        site.route('/').use(push({
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
    }
});

tasks();
