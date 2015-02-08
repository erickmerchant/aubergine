var gulp = require('gulp');
var config = {
    directory: "./",
    js: "./js/app.js",
    css: "./css/app.css",
    icons: "node_modules/geomicons-open/icons/*.svg"
};

function pages() {

    var nunjucks = require('static-engine-renderer-nunjucks');
    var render = require('static-engine-render');
    var one = require('static-engine-one');
    var engine = require('static-engine');
    var page;

    nunjucks.configure('./templates/', {
        autoescape: true
    });

    render.configure('./');

    return engine(one, render('temp/index.html', nunjucks('index.html')));
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
            html: glob.sync('temp/index.html')
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('temp/'));
}

function js() {

    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var tap = require('gulp-tap');
    var cheerio = require('gulp-cheerio');
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var collapse = require('bundle-collapser/plugin');
    var bundler = browserify({
        entries: config.js,
        debug: false
    });

    return bundler
        .plugin(collapse)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(tap(function(file){

            return gulp.src('temp/index.html')
                .pipe(cheerio(function($){

                    $('body').append('<script>'+file.contents+'</script>');
                }))
                .pipe(gulp.dest('temp/'));
        }));
}

function optimize(){

    var htmlmin = require('gulp-htmlmin');

    return gulp.src('temp/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('temp/'));
}

function icons() {

    var cheerio = require('gulp-cheerio');
    var concat = require('gulp-concat');
    var tap = require('gulp-tap');

    return gulp.src(config.icons)
    .pipe(concat('icons.svg'))
    .pipe(tap(function(file){

        return gulp.src('temp/index.html')
        .pipe(cheerio(function($){

            var defs = $('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'+file.contents+'</defs></svg>');

            $('body').append(defs);

            $('use').each(function(){

                $(this).replaceWith($('svg' + $(this).attr('xlink:href') + ' path').clone());
            });

            defs.remove();
        }))
        .pipe(gulp.dest('temp/'));
    }));
}

function selectors() {

    var gs = require('gulp-selectors');

    return gulp.src(['temp/index.css', 'temp/index.html'])
        .pipe(gs.run())
        .pipe(gulp.dest('temp/'));
}

function combine() {

    var path = require('path');
    var tap = require('gulp-tap');
    var cheerio = require('gulp-cheerio');

    return gulp.src('temp/index.css')
        .pipe(tap(function(file){

            gulp.src('temp/index.html')
                .pipe(cheerio(function($){

                    $('head').append('<style type="text/css">'+file.contents+'</style>');

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

    var server = app.listen(8088, function(){
        console.log('server is running at %s', server.address().port);
    });

    done();
}

function watch() {

    gulp.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html'], 'default');
}

gulp.task('default', gulp.series( pages, optimize, icons, js, css, selectors, combine) );

gulp.task('dev', gulp.parallel('default', watch, serve));
