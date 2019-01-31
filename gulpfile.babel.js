import critical from "critical";
import babelify from "babelify";
import browserSync from "browser-sync";
import browserify from "browserify";
import buffer from "vinyl-buffer";
import gulp from "gulp";
import plugins from "gulp-load-plugins";
import source from "vinyl-source-stream";
import plumber from "gulp-plumber";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import notify from "gulp-notify";
import npmDist from "gulp-npm-dist";
import replace from "gulp-replace";
import "babel-polyfill";
import autoprefixer from "gulp-autoprefixer";

const newer = require("gulp-newer");
import fs from "fs";
import log from "fancy-log";

const merge = require("merge-stream");
const packConfig = require("./pack-config.json");
const watch = require("gulp-watch");
const concat = require("gulp-concat");
const dom = require("gulp-jsdom");
const cheerio = require("gulp-cheerio");
const htmlPartial = require("gulp-html-partial");
const fileinclude = require("gulp-file-include");
const htmltidy = require("gulp-htmltidy");
const del = require("del");
const vinylPaths = require("vinyl-paths");
const print = require("gulp-print").default;
const async = require("async");
const tap = require("gulp-tap");
const zip = require('gulp-zip');

var runSequence = require("run-sequence");
//gulp.watch = watch;
//const gaze = require('gaze');
const glob = require("glob");

/* ----------------- */
/* Combine HTMLs
/* ----------------- */
/* ----------------- */
/* Copy Index.html from /partials
/* ----------------- */
gulp.task("delete-index-prom", function (done) {
  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let indexFile = "build/" + pack.topic + "-" + pack.unit + "/index.html";

    jsBundleStreams.push(
      gulp
        .src(indexFile)
        .pipe(print(filepath => `delete-index: ${filepath}`))
        .pipe(vinylPaths(del))
    );
  });

  return merge(jsBundleStreams);
});
/* ----------------- */
/* Copy Index.html from /partials
/* ----------------- */
gulp.task("copy-index-prom", function (done) {
  let jsBundleStreams = [];
  packConfig.packs.map(pack => {
    let dir = "build/" + pack.topic + "-" + pack.unit;

    jsBundleStreams.push(
      gulp
        .src("src/partials/index.html")
        //.pipe(newer(dir))
        .pipe(
          plumber({
            errorHandler: onError
          })
        )
        .pipe(print(filepath => `copy-index: ${filepath}`))
        .pipe(gulp.dest(dir))
    );
  });

  return merge(jsBundleStreams);
});
/* ----------------- */
/* build-html-combined
/* ----------------- */
gulp.task("build-html-combined-prom", function (done) {
  let courseName = packConfig.course,
    jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = "build/" + pack.topic + "-" + pack.unit;

    //console.log('build-html-combined ', dir);
    let pageNumber = "";
    let headerTitle, header;

    jsBundleStreams.push(
      gulp
        .src(dir + "/" + courseName + "*.html")

        .pipe(
          tap(function (file) {
            let [filename, folder, ...rest] = file.path.split("/").reverse();
            let myRegexp = /(^.*)-p(.*?)(.html)/g;
            let match = myRegexp.exec(filename);
            pageNumber = match[2] || "0"; // abc
          })
        )
        .pipe(
          cheerio(function ($, file) {
            $("script").replaceWith("");
            $("head").replaceWith("");
            header = header || $("header.true-header").html();
            $("header").replaceWith("");
            $(".nav-bar").replaceWith("");
            $(".-hidden").removeClass("-hidden");
            unWrap($(".wrapper"));
            unWrap($("body"));
            unWrap($("html"));
            let cont = $(".container--layout-1");
            if (cont)
              $(cont)
                .attr("id", "page-" + pageNumber)
                .addClass("hidden");
            let quiz = $(".container--iquiz");
            $(".container--iquiz").each(function () {
              var $this = $(this);
              $(this)
                .attr("id", "question-" + pageNumber)
                .addClass("hidden");
              pageNumber++;
            });

            function unWrap(selector) {
              $(selector).each(function () {
                var $this = $(this);
                $(this)
                  .after($this.contents())
                  .remove();
              });
            }
          })
        )

        .pipe(replace(/<!DOCTYPE html>/g, ""))
        .pipe(print(filepath => `build-html-combined: ${filepath}`))
        .pipe(concat("combined.html"))
        .pipe(
          tap(function (file) {
            file.contents = Buffer.concat([
              new Buffer(
                '<header class="l-header true-header">' + header + "</header>"
              ),
              file.contents
            ]);
          })
        )
        .pipe(gulp.dest(dir + "/"))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("delete-index-prom", function (done) {
  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let indexFile = "build/" + pack.topic + "-" + pack.unit + "/index.html";

    jsBundleStreams.push(
      gulp
        .src(indexFile)
        //.pipe(print(filepath => `delete-index: ${filepath}`))
        .pipe(vinylPaths(del))
    );
  });

  return merge(jsBundleStreams);
});



/* ----------------- */
/* Insert partials
/* ----------------- */
gulp.task("partials-prom", function (done) {
  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = "build/" + pack.topic + "-" + pack.unit;
    let header;

    jsBundleStreams.push(
      gulp
        .src([dir + "/index.html"])
        .pipe(
          fileinclude({
            prefix: "@@",
            basepath: "@file"
          })
        )
        .pipe(
          cheerio(function ($, file) {
            header = $("header");
            $("header").remove();
            sort($(".js-wrapper"));
            $.html();
            $("nav").after(header);
            ///$(".js-wrapper").before(header);

            function sort(main) {
              let [...list] = main.children();
              list
                .sort((a, b) => {
                  let aP = +$(a)
                    .attr("id")
                    .replace("page-", "")
                    .replace("question-", "");
                  let bP = +$(b)
                    .attr("id")
                    .replace("page-", "")
                    .replace("question-", "");
                  return aP > bP ? 1 : -1;
                })
                .map(node => $(main).append(node));
            }
          })
        )
        .pipe(
          htmltidy({
            doctype: "html5",
            hideComments: true,
            wrap: 120,
            indentSpaces: 4,
            indent: true
          })
        )
        //.pipe(print(filepath => `partials: ${filepath}`))
        .pipe(gulp.dest(dir))
    );
  });

  return merge(jsBundleStreams);
});

/* ----------------- */
/* Build Packs
/* ----------------- */
function getDir(pack) {
  let title = pack.title.toLowerCase();
  title = title.replace(/,/g, "");
  title = title.replace(/\s/g, "-");
  let folder = pack.topic + "-" + pack.unit + "-" + title;
  return "packs/" + folder;
}

gulp.task("build-packs-1", () => {
  if (!fs.existsSync("packs"))
    fs.mkdirSync("packs"), console.log("📁  folder created:", "packs");

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);

    // Create pack folder and Contents folder
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir), console.log("📁  folder created:", dir);

    // Add content pack files
    let packSrc = `src/imsmanifest/**`,
      packDest = `${dir}`;
    jsBundleStreams.push(
      gulp
        .src(packSrc)
        .pipe(newer(packDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(packDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-2", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    // Add imsmanifest
    let dir = getDir(pack);

    let manifestSrc = `src/${pack.topic}-${pack.unit}/imsmanifest.xml`,
      manifestDest = `${dir}`;
    jsBundleStreams.push(
      gulp
        .src(manifestSrc)
        .pipe(newer(manifestDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(manifestDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-3", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";

    if (!fs.existsSync(contentDir))
      fs.mkdirSync(contentDir), console.log("📁  folder created:", contentDir);

    // Add CSS from build to to pack if newer
    let cssSrc = `build/css/**`,
      cssDest = `${contentDir}/css`;

    if (!fs.existsSync(cssDest))
      fs.mkdirSync(cssDest), console.log("📁  folder created:", cssDest);

    jsBundleStreams.push(
      gulp
        .src(cssSrc)
        //.pipe(newer(cssDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(cssDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-4", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    // Add JS from build to to pack if newer
    let jsSrc = `build/js/**`,
      jsDest = `${contentDir}/js`;
    jsBundleStreams.push(
      gulp
        .src(jsSrc)
        //.pipe(newer(jsDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(jsDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-5", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    // Add Libs from build to to pack if newer
    let libSrc = `build/libs/**`,
      libDest = `${contentDir}/libs`;
    jsBundleStreams.push(
      gulp
        .src(libSrc)
        .pipe(newer(libDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(libDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-6", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    // Add Libs from build to to pack if newer
    let venSrc = `build/vendor/**`,
      venDest = `${contentDir}/vendor`;
    jsBundleStreams.push(
      gulp
        .src(venSrc)
        .pipe(newer(venDest))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(venDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-7", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    // Add Images from build to to pack if newer
    let imgSrc = `build/images/${pack.topic}-${pack.unit}/**`,
      imgDest = `${contentDir}/images/${pack.topic}-${pack.unit}`;
    jsBundleStreams.push(
      gulp
        .src(imgSrc)
        //.pipe(newer(imgDest))
        .pipe(plumber({ errorHandler: onError }))
        //.pipe(imagemin())
        .pipe(gulp.dest(imgDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-8", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    let navSrc = `build/images/_nav/**/*`,
      navDest = `${contentDir}/images/_nav`;
    jsBundleStreams.push(
      gulp
        .src(navSrc)
        //.pipe(newer(navDest))
        .pipe(plumber({ errorHandler: onError }))
        //.pipe(imagemin())
        .pipe(gulp.dest(navDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-9", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    let shapesSrc = `build/images/_shapes/**`,
      shapesDest = `${contentDir}/images/_shapes`;
    jsBundleStreams.push(
      gulp
        .src(shapesSrc)
        //.pipe(newer(shapesDest))
        .pipe(plumber({ errorHandler: onError }))
        //.pipe(imagemin())
        .pipe(gulp.dest(shapesDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-10", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    let iquizSrc = `build/${pack.topic}-${pack.unit}/iquiz_assets/**`,
      iquizDest = `${contentDir}/iquiz_assets`;
    jsBundleStreams.push(
      gulp
        .src(iquizSrc)
        //.pipe(newer(iquizDest))
        .pipe(plumber({ errorHandler: onError }))
        //.pipe(imagemin())
        .pipe(gulp.dest(iquizDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-11", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let contentDir = dir + "/content";
    // Add HTML from build to to pack if newer
    // TODO update build paths
    let htmlSrc = `build/${pack.topic}-${pack.unit}/index.html`,
      htmlDest = `${contentDir}`;
    jsBundleStreams.push(
      gulp
        .src(htmlSrc)
        .pipe(newer(htmlDest))
        .pipe(replace(/"\.\.\/vendor\//g, '"./vendor/'))
        .pipe(replace(/"\.\.\/libs\//g, '"./libs/'))
        .pipe(replace(/"\.\.\/css\//g, '"./css/'))
        .pipe(replace(/"\.\.\/images\//g, '"./images/'))
        .pipe(replace(/"\.\.\/js\//g, '"./js/'))
        .pipe(
          replace(
            /<title>[\W\w\s\n\r]*<\/title>/g,
            `<title>${packConfig.course} | ${pack.title}</title>`
          )
        )
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest(htmlDest))
    );
  });

  return merge(jsBundleStreams);
});

gulp.task("build-packs-12", () => {

  let jsBundleStreams = [];

  packConfig.packs.map(pack => {
    let dir = getDir(pack);
    let folder = dir.replace('packs/', '');
    jsBundleStreams.push(
      gulp.src(`${dir}/**/*`)
        .pipe(zip(`${folder}.zip`))
        .pipe(gulp.dest('packs/zips'))
    );
  });

  return merge(jsBundleStreams);
});






/* ----------------- */
/* Libs
/* ----------------- */
gulp.task("libs", function () {
  gulp
    .src(npmDist(), { base: "./node_modules" })
    .pipe(gulp.dest("./build/libs"));
});

/* ----------------- */
/* Fonts
/* ----------------- */
gulp.task("fonts", () => {
  // Copy vendor files
  gulp
    .src("src/scss/fonts/*")
    .pipe(newer('build/css/fonts'))
    .pipe(
      plumber({
        errorHandler: onError
      })
    )
    .pipe(gulp.dest("build/css/fonts"));
  //.pipe(notify({ message: 'Images task complete' }));
});

/* ----------------- */
/* Vendor JS
/* ----------------- */
gulp.task("vendor", () => {
  // Copy vendor files
  gulp
    .src("src/vendor/**")
    .pipe(newer('build/vendor'))
    .pipe(
      plumber({
        errorHandler: onError
      })
    )
    .pipe(gulp.dest("build/vendor"));
  //.pipe(notify({ message: 'Images task complete' }));
});

/* ----------------- */
/* QUIZ assets
/* ----------------- */
gulp.task("quiz", function (done) {
  glob("./app/main-**.js", function (err, files) {
    if (err) {
      done(err);
      return;
    }

    var tasks = files.map(function (entry) {
      return browserify({ entries: [entry] })
        .bundle()
        .pipe(source(entry))
        .pipe(
          rename({
            extname: ".bundle.js"
          })
        )
        .pipe(gulp.dest("./dist"));
    });
    // Only call done when merged stream has ended
    es.merge(tasks).on("end", done);
  });
});

// Gulp plumber error handler
var onError = function (err) {
  console.log(err);
};

/* ----------------- */
/* Images
/* ----------------- */
gulp.task("images", () => {
  var imgSrc = "./src/images/**/*",
    imgDst = "./build/images/";

  return (
    gulp
      .src(imgSrc)
      .pipe(newer(imgDst))
      .pipe(
        plumber({
          errorHandler: onError
        })
      )
      //.pipe(changed(imgDst))
      //.pipe(imagemin())
      .pipe(gulp.dest(imgDst))
    //.pipe(notify({ message: "Images task complete" }))
  );
});

/* ----------------- */
/* Styles
/* ----------------- */
gulp.task("styles", () => {
  return gulp
    .src("./src/scss/**/styles.scss")
    .pipe(plugins().sourcemaps.init())
    .pipe(
      plugins()
        .sass()
        .on("error", plugins().sass.logError)
    )
    .pipe(concat("style.css")) // this is what was missing
    .pipe(autoprefixer({ grid: true, browsers: ["last 4 versions"] }))
    .pipe(plugins().sourcemaps.write())
    .pipe(gulp.dest("./build/css/"))
    //.pipe(gulp.dest("../Infuze-Quiz/_temp/build/css/"))
    //.pipe(notify({ message: "styles task complete" }))
    .pipe(browserSync.stream());
});
/* ----------------- */
/* FOLDERS
/* ----------------- */
gulp.task("folders", () => {
  return (
    gulp
      .src(["src/**/**", "!src/partials/**", "!src/imsmanifest/**"])
      .pipe(newer("build"))
      .pipe(gulp.dest("build"))
      .pipe(browserSync.stream())
  );
});
/* ----------------- */
/* HTML
/* ----------------- */
gulp.task("html", () => {
  const search = "./src/**/*admin-l3*.html";
  const files = glob.sync(search);
  console.log(">>> HTML Page Count", files.length);

  return (
    gulp
      .src("./src/**/*.{html, json}")
      .pipe(newer("build"))
      .pipe(replace(/\.\.\/\.\.\/node_modules(.*)\/(.*).js/g, "../libs$1/$2.js"))
      .pipe(replace(/src="\.\.\/js\/app.js"/g, 'src="../js/bundle.js"'))
      .pipe(replace(/href="\.\.\/scss\/(.*)\.scss"/g, 'href="../css/$1.css"'))

      /*.pipe(critical.stream({
            'base': 'build/',
            'inline': true,
            'extract': true,
            'minify': true,
            'css': ['./build/css/style.css']
        }))*/
      .pipe(gulp.dest("build"))
      .pipe(browserSync.stream())
  );
});
/* ----------------- */
/* JSON
/* ----------------- */
gulp.task("json", () => {
  return gulp
    .src("src/**/*.json")
    .pipe(newer("build"))
    .pipe(gulp.dest("build"))
    .pipe(browserSync.stream());
});

/* ----------------- */
/* Cssmin
/* ----------------- */
gulp.task("cssmin", () => {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(
      plugins()
        .sass({
          outputStyle: "compressed"
        })
        .on("error", plugins().sass.logError)
    )
    .pipe(gulp.dest("./build/css/"));
});

/* ----------------- */
/* Scripts
/* ----------------- */
gulp.task("scripts", () => {
  return browserify({
    entries: ["./src/js/app.js"],
    debug: true,
    transform: [
      babelify.configure({
        presets: ["env", "react"]
      })
    ]
  })
    .bundle()
    .on("error", function () {
      var args = Array.prototype.slice.call(arguments);

      plugins()
        .notify.onError({
          title: "Compile Error",
          message: "<%= error.message %>"
        })
        .apply(this, args);

      this.emit("end");
    })
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(plugins().sourcemaps.init({ loadMaps: true }))
    .pipe(plugins().sourcemaps.write("."))
    .pipe(gulp.dest("./build/js/"))
    .pipe(browserSync.stream());
});

/* ----------------- */
/* Jsmin
/* ----------------- */
gulp.task("jsmin", () => {
  var envs = plugins().env.set({
    NODE_ENV: "production"
  });

  return browserify({
    entries: ["./src/js/app.js"],
    debug: false,
    transform: [
      babelify.configure({
        presets: ["env", "react"]
      })
    ]
  })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(envs)
    .pipe(buffer())
    .pipe(plugins().uglify())
    .pipe(envs.reset)
    .pipe(gulp.dest("./build/js/"));
});

/* ----------------- */
/* Taks
/* ----------------- */

gulp.task(
  "dev",
  ["scripts", "styles", "images", "html", "json", "combine", "libs"],
  () => {
    browserSync({
      server: {
        baseDir: "build/"
      },
      port: 3032,
      //startPath: "/t3-u2/index.html",
      startPath: "/t10-u1/index.html",
      snippetOptions: {
        rule: {
          match: /<\/body>/i,
          fn: snippet => snippet
        }
      }
    });

    gulp
      .watch("src/scss/**/*.scss", ["styles"])
      .on("change", browserSync.reload);
    gulp.watch("src/js/**/*.js", ["scripts"]);
    gulp.watch("src/quiz/**/*.js", ["quiz", browserSync.reload]);
    gulp.watch(["src/images/**/*", "!src/images/_supplied/*"], ["images"]);
    gulp.watch("src/**/*.html", ["combine", browserSync.reload]);
    gulp.watch("src/**/*.json", ["json", browserSync.reload]);
  }
);

gulp.task("default", ["dev"]);

gulp.task("build", [
  "folders",
  "html",
  "json",
  "images",
  "jsmin",
  "libs",
  "vendor",
  "fonts"
]);

gulp.task("combine", function (callback) {
  runSequence(
    "html",
    "delete-index-prom",
    "copy-index-prom",
    "build-html-combined-prom",
    "partials-prom",
    callback
  );
});

gulp.task("packs", function (callback) {
  runSequence(
    "build-packs-1",
    "build-packs-2",
    "build-packs-3",
    "build-packs-4",
    "build-packs-5",
    "build-packs-6",
    "build-packs-7",
    "build-packs-8",
    "build-packs-9",
    "build-packs-10",
    "build-packs-11",
    "build-packs-12",
    callback
  );
});

