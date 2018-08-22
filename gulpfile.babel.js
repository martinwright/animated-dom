import critical from 'critical';
import babelify from 'babelify';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import source from 'vinyl-source-stream';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import notify from 'gulp-notify';
import npmDist from 'gulp-npm-dist';
import replace from 'gulp-replace';
import "babel-polyfill";
import autoprefixer from 'gulp-autoprefixer';

const newer = require('gulp-newer');
import fs from 'fs';

const merge = require('merge-stream');
const packConfig = require('./pack-config.json');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const dom = require("gulp-jsdom");
const cheerio = require('gulp-cheerio');
const htmlPartial = require('gulp-html-partial');
const fileinclude = require('gulp-file-include');
const htmltidy = require('gulp-htmltidy');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const print = require('gulp-print').default;
const async = require('async');
const tap = require('gulp-tap');
var runSequence = require('run-sequence');
//gulp.watch = watch;
//const gaze = require('gaze');





/* ----------------- */
/* Combine HTMLs
/* ----------------- */
gulp.task('build-html-combined', function (done) {

    let tasks = [],
        courseName = packConfig.course;
    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        //console.log('build-html-combined ', dir);

        let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
        "DATE:20091201T220000\r\nSUMMARY:Dad's birthday".match(/^SUMMARY\:(.*)$/gm)


        tasks.push(function () {
                //let tmp = config[i];
                return function (callback) {

                    gulp.src(dir + '/' + courseName + '*.html')

                        .pipe(cheerio(function ($, file) {
                            // Each file will be run through cheerio and each corresponding `$` will be passed here.
                            // `file` is the gulp file object
                            // Make all h1 tags uppercase
                            $('script').replaceWith('');
                            $('head').replaceWith('');
                            $('.header').replaceWith('');
                            $('.nav-bar').replaceWith('');
                            unWrap($('.wrapper'));
                            unWrap($('body'));
                            unWrap($('html'));
                            $.html();

                            function unWrap(selector) {
                                $(selector).each(function () {
                                    var $this = $(this);
                                    $(this).after($this.contents()).remove();
                                });
                            }
                        }))

                        .pipe(replace(/<!DOCTYPE html>/g, ''))
                        //.pipe(print(filepath => `build-html-combined: ${filepath}`))
                        .pipe(concat('combined.html'))
                        .pipe(gulp.dest(dir + '/'))
                        .on("end", callback);
                }
            }()
        );

    });

    async.parallel(tasks, done);

});


gulp.task('build-html-combined-prom', function (done) {

    let courseName = packConfig.course,
        jsBundleStreams = [];

    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        //console.log('build-html-combined ', dir);
        let pageNumber = '';

        jsBundleStreams.push(
            gulp.src(dir + '/' + courseName + '*.html')

                .pipe(tap(function(file) {
                    //console.log('###### file.path ', file.path);
                    let [filename, folder, ...rest] = file.path.split('/').reverse();
                    //let regex = /-p(.*).html$/g;
                    //var arr = regex.exec(filename);
                    //pageNumber = filename.match(/-p(.*).html$/g)[0]


                    //let myString = "something format_abc";
                    let myRegexp = /(^.*)-p(.*?)(.html)/g;
                    let match = myRegexp.exec(filename);
                    //console.log('build-html-combined match '+filename + ' : ' + match[2]);
                    pageNumber = match[2] || '0'; // abc


                }))
                .pipe(cheerio(function ($, file) {
                    // Each file will be run through cheerio and each corresponding `$` will be passed here.
                    // `file` is the gulp file object
                    // Make all h1 tags uppercase
                    //console.log('pageNumber ', pageNumber);
                    $('script').replaceWith('');
                    $('head').replaceWith('');
                    $('.header').replaceWith('');
                    $('.nav-bar').replaceWith('');
                    $('.-hidden').removeClass('-hidden')
                    unWrap($('.wrapper'));
                    unWrap($('body'));
                    unWrap($('html'));
                    $('.container--layout-1').attr('id', 'page-'+pageNumber).addClass('hidden');
                    $('article').attr('id', 'article-'+pageNumber).html();
                    $.html();

                    function unWrap(selector) {
                        $(selector).each(function () {
                            var $this = $(this);
                            $(this).after($this.contents()).remove();
                        });
                    }
                }))

                .pipe(replace(/<!DOCTYPE html>/g, ''))
                //.pipe(print(filepath => `build-html-combined: ${filepath}`))
                .pipe(concat('combined.html'))
                .pipe(gulp.dest(dir + '/'))
        );
    });

    return merge(jsBundleStreams);

});


gulp.task('delete-index', function (done) {

    let tasks = [];
    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        //console.log('build-html-combined ', dir);

        let indexFile = 'build/' + pack.topic + '-' + pack.unit + '/index.html';
        tasks.push(function () {
                //let tmp = config[i];

                return function (callback) {
                    gulp.src(indexFile)
                        //.pipe(print(filepath => `delete-index: ${filepath}`))
                        .pipe(vinylPaths(del))
                        .on("end", callback);
                }
            }()
        );
    });
    async.parallel(tasks, done);
});


gulp.task('delete-index-prom', function (done) {

    let jsBundleStreams = [];

    packConfig.packs.map(pack => {
        let indexFile = 'build/' + pack.topic + '-' + pack.unit + '/index.html';

        jsBundleStreams.push(
            gulp.src(indexFile)
                //.pipe(print(filepath => `delete-index: ${filepath}`))
                .pipe(vinylPaths(del))
        );
    });

    return merge(jsBundleStreams);
});




/* ----------------- */
/* Copy Index.html from /partials
/* ----------------- */
gulp.task('copy-index', function (done) {

    let tasks = [];

    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        tasks.push(function () {
                return function (callback) {
                    gulp.src('src/partials/index.html')
                    //.pipe(newer(dir))
                        .pipe(plumber({
                            errorHandler: onError
                        }))
                        //.pipe(print(filepath => `copy-index: ${dir}`))
                        .pipe(gulp.dest(dir))
                        .on("end", callback);
                }
            }()
        );
    });
    async.parallel(tasks, done);
});

gulp.task('copy-index-prom', function (done) {

    let jsBundleStreams = [];
    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        jsBundleStreams.push(
            gulp.src('src/partials/index.html')
            //.pipe(newer(dir))
                .pipe(plumber({
                    errorHandler: onError
                }))
                //.pipe(print(filepath => `copy-index: ${filepath}`))
                .pipe(gulp.dest(dir))
        );
    });

    return merge(jsBundleStreams);
});

/* ----------------- */
/* Insert partials
/* ----------------- */
gulp.task('partials', function (done) {

    let tasks = [];

    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        tasks.push(function () {
                //let tmp = config[i];

                return function (callback) {
                    gulp.src([dir + '/index.html'])
                        .pipe(fileinclude({
                            prefix: '@@',
                            basepath: '@file'
                        }))
                        .pipe(htmltidy({
                            doctype: 'html5',
                            hideComments: true,
                            wrap: 100,
                            indentSpaces: 4,
                            indent: true
                        }))
                        .pipe(print(filepath => `partials: ${filepath}`))
                        .pipe(gulp.dest(dir))
                        .on("end", callback);
                }
            }()
        );
    });
    async.parallel(tasks, done);
});
gulp.task('partials-prom', function (done) {

    let jsBundleStreams = [];

    packConfig.packs.map(pack => {
        let dir = 'build/' + pack.topic + '-' + pack.unit;

        jsBundleStreams.push(
            gulp.src([dir + '/index.html'])
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .pipe(cheerio(function ($, file) {

                    sort($('.wrapper'));

                    function sort(main) {
                        [].map.call( main.children, Object ).sort( function ( a, b ) {
                            return +a.id.match( /\d+/ ) - +b.id.match( /\d+/ );
                        }).forEach( function ( elem ) {
                            main.appendChild( elem );
                        });
                    }
                }))
                .pipe(htmltidy({
                    doctype: 'html5',
                    hideComments: true,
                    wrap: 120,
                    indentSpaces: 4,
                    indent: true
                }))
                //.pipe(print(filepath => `partials: ${filepath}`))
                .pipe(gulp.dest(dir))
        );
    });

    return merge(jsBundleStreams);
});


/* ----------------- */
/* Build Packs
/* ----------------- */
gulp.task('build-packs', () => {

    if (!fs.existsSync('packs'))
        fs.mkdirSync('packs'),
            console.log('📁  folder created:', 'packs');

    let jsBundleStreams = [],
        courseName = packConfig.course;

    packConfig.packs.map(pack => {

        // set pack folder name
        let dir = pack.title.toLowerCase();
        dir = dir.replace(/,/g, '');
        dir = dir.replace(/\s/g, '-');
        dir = 'packs/' + pack.topic + '-' + pack.unit + '-' + dir;
        //console.log('📁  dir:', dir);

        // Create pack folder and Contents folder
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir),
                console.log('📁  folder created:', dir);
        dir = dir + '/Contents';
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir),
                console.log('📁  folder created:', dir);

        // Add CSS from build to to pack if newer
        let cssSrc = `build/css/**`,
            cssDest = `${dir}/css`;
        jsBundleStreams.push(gulp.src(cssSrc)
            .pipe(newer(cssDest))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulp.dest(cssDest))
            .pipe(notify({message: `js copy task complete`})));

        // Add JS from build to to pack if newer
        let jsSrc = `build/js/**`,
            jsDest = `${dir}/js`;
        jsBundleStreams.push(gulp.src(jsSrc)
            .pipe(newer(jsDest))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulp.dest(jsDest))
            .pipe(notify({message: `js copy ${pack} task complete`})));

        // Add Libs from build to to pack if newer
        let libSrc = `build/libs/**`,
            libDest = `${dir}/libs`;
        jsBundleStreams.push(gulp.src(libSrc)
            .pipe(newer(libDest))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulp.dest(libDest))
            .pipe(notify({message: `libs copy ${pack} task complete`})));

        // Add Images from build to to pack if newer
        let imgSrc = `build/images/${pack.topic}-${pack.unit}/**`,
            imgDest = `${dir}/images/${pack.topic}-${pack.unit}`;
        jsBundleStreams.push(gulp.src(imgSrc)
            .pipe(newer(imgDest))
            .pipe(plumber({errorHandler: onError}))
            .pipe(imagemin())
            .pipe(gulp.dest(imgDest))
            .pipe(notify({message: `imgs copy ${pack} task complete`})));

        // Add HTML from build to to pack if newer
        // TODO update build paths
        let htmlSrc = `build/${courseName}_${pack.topic}-${pack.unit}-*.{html, json}`,
            htmlDest = `${dir}`;
        jsBundleStreams.push(gulp.src(htmlSrc)
            .pipe(newer(htmlDest))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulp.dest(htmlDest))
            .pipe(notify({message: `html copy task complete`})));

    });

    return merge(jsBundleStreams);

});

/* ----------------- */
/* Pack Libs
/* ----------------- */
gulp.task('pack-libs', () => {
    // Copy folders
    for (let i = 1; i <= 32; i++) {
        gulp.src('build/libs/**')
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(gulp.dest(`packs/unit-${i}/libs`))
            .pipe(notify({message: `Libs copy unit-${i}/libs complete`}))
        /*.pipe(gulp.src('build/js/!**'))
        .pipe(gulp.dest(`packs/unit-${i}/js`))
        .pipe(notify({message: `Libs copy unit-${i}/js complete`}));*/
    }
});




/* ----------------- */
/* Libs
/* ----------------- */
gulp.task('libs', function () {
    gulp.src(npmDist(), {base: './node_modules'})
        .pipe(gulp.dest('./build/libs'));
});

/* ----------------- */
/* Fonts
/* ----------------- */
gulp.task('fonts', () => {
    // Copy vendor files
    gulp.src('src/scss/fonts/*')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest('build/css/fonts'))
        .pipe(notify({message: 'Images task complete'}));
});

/* ----------------- */
/* Vendor JS
/* ----------------- */
gulp.task('vendor', () => {
    // Copy vendor files
    gulp.src('src/vendor/**')
    //.pipe(newer('build/vendor'))
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest('build/vendor'))
        .pipe(notify({message: 'Images task complete'}));
});

/* ----------------- */
/* Scripts
/* ----------------- */
gulp.task('scripts', () => {
    return browserify({
        'entries': ['./src/js/app.js'],
        'debug': true,
        'transform': [
            babelify.configure({
                'presets': ['env', 'react']
            })
        ]
    })
        .bundle()
        .on('error', function () {
            var args = Array.prototype.slice.call(arguments);

            plugins().notify.onError({
                'title': 'Compile Error',
                'message': '<%= error.message %>'
            }).apply(this, args);

            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(plugins().sourcemaps.init({'loadMaps': true}))
        .pipe(plugins().sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());

});


// Gulp plumber error handler
var onError = function (err) {
    console.log(err);
}


/* ----------------- */
/* Images
/* ----------------- */
gulp.task('images', () => {
    var imgSrc = './src/images/**/*',
        imgDst = './build/images/';

    return gulp.src(imgSrc)
        .pipe(newer(imgDst))
        .pipe(plumber({
            errorHandler: onError
        }))
        //.pipe(changed(imgDst))
        //.pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(notify({message: 'Images task complete'}));
});

/* ----------------- */
/* Styles
/* ----------------- */
gulp.task('styles', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plugins().sourcemaps.init())
        .pipe(plugins().sass().on('error', plugins().sass.logError))
        .pipe(autoprefixer())
        .pipe(plugins().sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(notify({message: 'styles task complete'}))
        .pipe(browserSync.stream());
});

/* ----------------- */
/* HTML
/* ----------------- */
gulp.task('html', () => {
    return gulp.src('src/**/*.{html, json}')
        .pipe(newer('build'))
        .pipe(replace(/\.\.\/\.\.\/node_modules(.*)\/(.*).js/g, '../libs$1/$2.js'))
        .pipe(replace(/src="\.\.\/js\/app.js"/g, 'src="../js\/bundle.js"'))
        .pipe(replace(/href="\.\.\/scss\/(.*)\.scss"/g, 'href="../css/$1.css"'))

        /*.pipe(critical.stream({
            'base': 'build/',
            'inline': true,
            'extract': true,
            'minify': true,
            'css': ['./build/css/style.css']
        }))*/
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});
/* ----------------- */
/* JSON
/* ----------------- */
gulp.task('json', () => {
    return gulp.src('src/**/*.json')
        .pipe(newer('build'))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});


/* ----------------- */
/* Cssmin
/* ----------------- */
gulp.task('cssmin', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plugins().sass({
            'outputStyle': 'compressed'
        }).on('error', plugins().sass.logError))
        .pipe(gulp.dest('./build/css/'));
});


/* ----------------- */
/* Jsmin
/* ----------------- */
gulp.task('jsmin', () => {
    var envs = plugins().env.set({
        'NODE_ENV': 'production'
    });

    return browserify({
        'entries': ['./src/js/app.js'],
        'debug': false,
        'transform': [
            babelify.configure({
                'presets': ['env', 'react']
            })
        ]
    })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(envs)
        .pipe(buffer())
        .pipe(plugins().uglify())
        .pipe(envs.reset)
        .pipe(gulp.dest('./build/js/'));
});


/* ----------------- */
/* Taks
/* ----------------- */

gulp.task('development', ['scripts', 'styles', 'images', 'html', 'json', 'combine'], () => {
    browserSync({
        'server': {
            baseDir: "build/"
        },
        startPath: "/t10-u1/index.html",
        'snippetOptions': {
            'rule': {
                'match': /<\/body>/i,
                'fn': (snippet) => snippet
            }
        }
    });

    gulp.watch('src/scss/**/*.scss', ['styles']).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch(['src/images/**/*', '!src/images/_supplied/*'], ['images']);
    gulp.watch('src/**/*.html', ['combine', browserSync.reload]);
    gulp.watch('src/**/*.json', ['json', browserSync.reload]);
});


gulp.task('combine', function(callback) {
    runSequence('html', 'delete-index-prom', 'copy-index-prom', 'build-html-combined-prom', 'partials-prom', callback);
});

gulp.task('default', ['development']);
gulp.task('deploy', ['html', 'json', 'images', 'jsmin', 'libs', 'vendor', 'fonts']);
gulp.task('pack', ['build-packs']);
//gulp.task('combine', ['delete-index', 'copy-index', 'build-html-combined', 'partials']);
