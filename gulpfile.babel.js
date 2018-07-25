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

/* ----------------- */
/* Development
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
        let htmlSrc = `build/${courseName}_${pack.topic}-${pack.unit}-*.html`,
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
/* Development
/* ----------------- */
gulp.task('development', ['scripts', 'styles', 'images', 'html'], () => {
    browserSync({
        'server': {
            baseDir: "build/"
        },
        startPath: "/t1-u1/business-admin-l3_t1-u1-p1.html",
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
gulp.task('pack', ['build-packs']);