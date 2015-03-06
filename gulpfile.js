'use strict';

const directory = "./";
var gulp = require('gulp');

function pages() {

    var nunjucks = require('static-engine-renderer-nunjucks');
    var render = require('static-engine-render');
    var one = require('static-engine-one');
    var engine = require('static-engine');
    var page;

    nunjucks.configure('./templates/', {
        autoescape: true
    });

    return engine(one, render('./index.html', nunjucks('index.html')));
}

function css(){

    var autoprefixer = require('gulp-autoprefixer');
    var uncss = require('gulp-uncss');
    var csso = require('gulp-csso');
    var glob = require('glob');
    var rework = require('gulp-rework');
    var concat = require('gulp-concat');
    var calc = require('rework-calc');
    var media = require('rework-custom-media');
    var npm = require('rework-npm');
    var vars = require('rework-vars');
    var colors = require('rework-plugin-colors');
    var cheerio = require('gulp-cheerio');

    return gulp.src("./css/app.css")
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
        .pipe(csso())
        .pipe(gulp.dest(directory));
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
        entries: "./js/app.js",
        debug: false
    });

    return bundler
        .plugin(collapse)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(tap(function(file){

            file.contents = new Buffer('!function(window, document){ ' + file.contents + '; }(window, document);');
        }))
        .pipe(uglify())
        .pipe(tap(function(file){

            return gulp.src('index.html')
                .pipe(cheerio(function($){

                    $('body').append('<script>'+file.contents+'</script>');
                }))
                .pipe(gulp.dest(directory));
        }));
}

function optimize(){

    var htmlmin = require('gulp-htmlmin');

    return gulp.src('index.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(directory));
}

function icons() {

    var cheerio = require('gulp-cheerio');
    var fs = require('fs');

    return gulp.src('./index.html')
        .pipe(cheerio(function($){

            var defs = new Set();
            var href;
            var id;
            var paths;
            var get_path = function(id) {

                return fs.readFileSync('./node_modules/geomicons-open/src/paths/'+id+'.d', {encoding:'utf8'}).split("\n").join('');
            };

            $('use').each(function(){

                href = $(this).attr('xlink:href');
                id = href.substring(1);

                if($('use[xlink\\:href="'+href+'"]').length > 1) {

                    defs.add(id);
                }
                else {

                    $(this).replaceWith('<path d="' + get_path(id) + '"/>');
                }
            });

            if(defs.size) {

                paths = [];

                for(id of defs) {

                    paths.push('<path d="' + get_path(id) + '" id="' + id + '"/>');
                }

                $('body').append('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'+paths.join('')+'</defs></svg>')
            }
        }))
        .pipe(gulp.dest(directory));
}

function selectors() {

    var gs = require('gulp-selectors');

    return gulp.src(['index.css', 'index.html'])
        .pipe(gs.run())
        .pipe(gulp.dest(directory));
}

function combine() {

    var path = require('path');
    var tap = require('gulp-tap');
    var cheerio = require('gulp-cheerio');

    return gulp.src('index.css')
        .pipe(tap(function(file){

            gulp.src('index.html')
                .pipe(cheerio(function($){

                    $('head').append('<style type="text/css">'+file.contents+'</style>');

                }))
                .pipe(gulp.dest(directory));
        }));
}

function serve(done){

    var express = require('express');
    var _static = require('express-static');
    var logger = require('express-log');

    var app = express();

    app.use(logger());

    app.use(_static(directory));

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

gulp.task('default', gulp.series( pages, optimize, icons, js, css, selectors, combine ) );

gulp.task('dev', gulp.parallel('default', watch, serve));
