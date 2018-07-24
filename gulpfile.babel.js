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


let packs = [];
for (let i = 1; i <= 32; i++) {
    packs.push(i);
}
/* ----------------- */
/* Development
/* ----------------- */


gulp.task('unit-folders', () => {
    let folders = [];
    for (let i = 1; i <= 32; i++) {
        folders.push('packs/unit-' + i + '/');
    }
    if (!fs.existsSync('packs'))
        fs.mkdirSync('packs'),
            console.log('📁  folder created:', 'packs');

    folders.forEach(dir => {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir),
                console.log('📁  folder created:', dir);
    });

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
/* Pack JS
/* ----------------- */
gulp.task('pack-js', () => {

        let copyCSS = packs.map(pack => {
            let cssSrc = `build/css/**`,
                cssDest = `packs/unit-${pack}/css`;
            return gulp.src(cssSrc)
                .pipe(newer(cssDest))
                .pipe(plumber({errorHandler: onError}))
                .pipe(gulp.dest(cssDest))
                .pipe(notify({message: `js copy ${pack} task complete`}))
        });

        let copyJS = packs.map(pack => {
            let jsSrc = `build/js/**`,
                jsDest = `packs/unit-${pack}/js`;
            return gulp.src(jsSrc)
                .pipe(newer(jsDest))
                .pipe(plumber({errorHandler: onError}))
                .pipe(gulp.dest(jsDest))
                .pipe(notify({message: `js copy ${pack} task complete`}))
        });
        let copyLibs = packs.map(pack => {
            let libSrc = `build/libs/**`,
                libDest = `packs/unit-${pack}/libs`;
            return gulp.src(libSrc)
                .pipe(newer(libDest))
                .pipe(plumber({errorHandler: onError}))
                .pipe(gulp.dest(libDest))
                .pipe(notify({message: `libs copy ${pack} task complete`}))
        });
        let copyImgs = packs.map(pack => {
            let imgSrc = `build/images/u${pack}/**`,
                imgDest = `packs/unit-${pack}/images/u${pack}`;
            return gulp.src(imgSrc)
                .pipe(newer(imgDest))
                .pipe(plumber({errorHandler: onError}))
                .pipe(imagemin())
                .pipe(gulp.dest(imgDest))
                .pipe(notify({message: `imgs copy ${pack} task complete`}))
        });
        return merge(copyJS, copyLibs, copyImgs, copyCSS);

        /*for (let key in packs) {
            (function (key) {
                /!*gulp.task(key, function() {
                    return gulp.src(jsFiles[key])
                        .pipe(jshint())
                        .pipe(uglify())
                        .pipe(concat(key + '.js'))  // <- HERE
                        .pipe(gulp.dest('public/js'));
                });*!/

                gulp.src('build/js/!**')
                    .pipe(plumber({
                        errorHandler: onError
                    }))
                    .pipe(gulp.dest(`packs/unit-${key}/js`))
                    .pipe(notify({message: `JS copy ${key} task complete`}));

            })(key);
        }*/


    }
);


gulp.task('development', ['scripts', 'styles', 'images', 'html'], () => {
    browserSync({
        'server': {
            baseDir: "build/"
        },
        startPath: "/unit-1.html",
        'snippetOptions': {
            'rule': {
                'match': /<\/body>/i,
                'fn': (snippet) => snippet
            }
        }
    });

    gulp.watch('./src/scss/**/*.scss', ['styles']).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/*.html', ['html'], browserSync.reload);
});


// Copy dependencies to ./build/libs/
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
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(changed(imgDst))
        .pipe(imagemin())
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
    return gulp.src('src/**/*.html')
        .pipe(replace(/\.\.\/node_modules(.*)\/(.*).js/g, './libs$1/$2.js'))
        .pipe(replace(/src="js\/app.js"/g, 'src="js\/bundle.js"'))
        .pipe(replace(/href="\.\/scss\/(.*)\.scss"/g, 'href="./css/$1.css"'))
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

gulp.task('default', ['development']);
gulp.task('deploy', ['html', 'images', 'jsmin', 'libs', 'vendor', 'fonts']);
gulp.task('pack', ['unit-folders', 'pack-js']);