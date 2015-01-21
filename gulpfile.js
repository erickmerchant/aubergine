var gulp = require('gulp');
var config = {
    directory: "./",
    js: "js/app.js",
    css: "css/app.css",
    icons: "node_modules/geomicons-open/icons/*.svg"
};

function pages() {

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

function optimize(){

    var htmlmin = require('gulp-htmlmin');

    return gulp.src('index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.directory));
}

function icons() {

    var cheerio = require('gulp-cheerio');
    var concat = require('gulp-concat');
    var tap = require('gulp-tap');

    return gulp.src(config.icons)
    .pipe(concat('icons.svg'))
    .pipe(tap(function(file){

        return gulp.src('index.html')
        .pipe(cheerio(function($){

            var defs = $('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'+file.contents+'</defs></svg>');

            $('body').append(defs);

            $('use').each(function(){

                $(this).replaceWith($('svg' + $(this).attr('xlink:href') + ' path').clone());
            });

            defs.remove();
        }))
        .pipe(gulp.dest(config.directory));
    }));
}

function serve(done){

    var express = require('express');
    var static = require('express-static');
    var logger = require('express-log');

    var app = express();

    app.use(logger());

    app.use(static(config.directory));

    app.use(function(req, res, next){

        res.redirect('/');
    });

    var server = app.listen(8080, function(){
        console.log('server is running at %s', server.address().port);
    });

    done();
}

function watch() {

    gulp.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html'], 'default');
}

gulp.task('default', gulp.series(pages, optimize, icons, gulp.parallel(css, js)));

gulp.task('dev', gulp.parallel('default', watch, serve));
