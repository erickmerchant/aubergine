
var tasks = require('gulp-tasks');
var Promise = require('es6-promise').Promise;

tasks({
    directory: "./",
    single: true,
    js: [
        "temp/ender.min.js",
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

        page = render('/index.html', nunjucks('index.html'));

        return page([{}]);
    }
});
