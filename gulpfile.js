var gulp = require('gulp');
var config = {
    directory: "./",
    js: "js/app.js",
    css: "css/app.css",
    icons: "node_modules/geomicons-open/icons/*.svg"
};
var serve = require('erickmerchant-server');

function build() {

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

function css(){

    var autoprefixer = require('gulp-autoprefixer');
    var uncss = require('gulp-uncss');
    var minifycss = require('gulp-minify-css');
    var glob = require('glob');
    var rework = require('gulp-rework');
    var concat = require('gulp-concat');
    var calc = require('rework-calc');
    var media = require('rework-custom-media');
    var npm = require('rework-npm');
    var vars = require('rework-vars');
    var colors = require('rework-plugin-colors');
    var tap = require('gulp-tap');
    var cheerio = require('gulp-cheerio');

    return gulp.src(config.css)
        .pipe(rework(
            npm(),
            vars(),
            media(),
            calc,
            colors()
        ))
        .pipe(autoprefixer('> 1%', 'last 2 versions'))
        .pipe(concat("index.css"))
        .pipe(uncss({
            html: glob.sync('index.html')
        }))
        .pipe(minifycss())
        .pipe(tap(function(file){

            return gulp.src('index.html')
                .pipe(cheerio(function($){

                    $('head').append('<style type="text/css">'+file.contents+'</style>');
                }))
                .pipe(gulp.dest(config.directory));
        }));
}

function js() {

    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var tap = require('gulp-tap');
    var cheerio = require('gulp-cheerio');
    var browserify = require('gulp-browserify');

    return gulp.src(config.js)
        .pipe(browserify())
        .pipe(concat("index.js"))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(tap(function(file){

            return gulp.src('index.html')
                .pipe(cheerio(function($){

                    $('body').append('<script>'+file.contents+'</script>');
                }))
                .pipe(gulp.dest(config.directory));
        }));
}

function html(){

    var htmlmin = require('gulp-htmlmin');
    var cheerio = require('gulp-cheerio');

    return gulp.src('index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(cheerio(function ($) {

            var uses = [];

            $('use').each(function(){

                uses.push($(this).attr('xlink:href'));
            });

            $('path[id]').each(function(){

                if(uses.indexOf('#'+$(this).attr('id')) < 0) {

                    $(this).replaceWith('');
                }
            })
        }))
        .pipe(gulp.dest(config.directory));
}

function icons() {

    var cheerio = require('gulp-cheerio');
    var concat = require('gulp-concat');
    var footer = require('gulp-footer');
    var header = require('gulp-header');

    return gulp.src(config.icons)
        .pipe(cheerio(function ($) {
            var $path = $('svg').children('path');
            var id = $('svg').attr('id');
            $path.attr('id', id);
            $('svg').replaceWith($path[0]);
        }))
        .pipe(concat('icons.svg'))
        .pipe(header(
            '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'
        ))
        .pipe(footer('</defs></svg>'))
        .pipe(gulp.dest('templates/temp'));
}

gulp.task('default', gulp.series(icons, build, html, gulp.parallel(css, js)));

gulp.task('watch', function() {

    gulp.watch(['css/**/**.css', 'js/**/**.js', 'templates/**/**.html'], 'default');
});

gulp.task('serve', gulp.parallel('default', 'watch', serve(config.directory)));
