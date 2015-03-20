'use strict';

const directory = "./";
var gulp = require('gulp');

gulp.task('default', gulp.series( pages, minifyHTML, icons, js, css, shortenSelectors, insertCSS ) );

gulp.task('dev', gulp.parallel('default', watch, serve));

function pages() {

    var swig = require('swig');
    var render = require('static-engine-render');
    var content = require('static-engine-content');
    var engine = require('static-engine');
    var cson = require('cson-parser');

    swig.setDefaults({ cache: false });

    return engine(
        content('./content/index.cson'),
        function (pages, done) {

            done(null, [cson.parse(pages[0].content)]);
        },
        render('./index.html', function(page, done) {

            swig.renderFile('./templates/index.html', page, done);
        })
    );
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
    var color = require('rework-color-function');
    var cheerio = require('gulp-cheerio');

    return gulp.src("./css/app.css")
        .pipe(rework(
            npm(),
            vars(),
            media(),
            calc,
            color
        ))
        .pipe(autoprefixer('> 5%', 'last 2 versions'))
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

function minifyHTML(){

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
            var getPath = function(id) {

                return fs.readFileSync('./node_modules/geomicons-open/src/paths/'+id+'.d', {encoding:'utf8'}).split("\n").join('');
            };

            $('use').each(function(){

                href = $(this).attr('xlink:href');
                id = href.substring(1);

                if($('use[xlink\\:href="'+href+'"]').length > 1) {

                    defs.add(id);
                }
                else {

                    $(this).replaceWith('<path d="' + getPath(id) + '"/>');
                }
            });

            if(defs.size) {

                paths = [];

                for(id of defs) {

                    paths.push('<path d="' + getPath(id) + '" id="' + id + '"/>');
                }

                $('body').append('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'+paths.join('')+'</defs></svg>')
            }
        }))
        .pipe(gulp.dest(directory));
}

function shortenSelectors() {

    var selectors = require('gulp-selectors');

    return gulp.src(['index.css', 'index.html'])
        .pipe(selectors.run())
        .pipe(gulp.dest(directory));
}

function insertCSS() {

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

    gulp.watch(['css/**/*.css', 'js/**/*.js', 'templates/**/*.html', 'content/**/*.cson'], 'default');
}
