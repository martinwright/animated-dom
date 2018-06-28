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

/* ----------------- */
/* Development
/* ----------------- */

gulp.task('development', ['scripts', 'styles', 'images', 'html'], () => {
    browserSync({
        'server': {
            baseDir: "build/"
        },
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
gulp.task('libs', function() {
    gulp.src(npmDist(), {base:'./node_modules'})
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
var onError = function(err) {
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