//? plugins list ---------------------------------------------------------------

const { src, watch, parallel, series, dest } = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const jsMinify = require("gulp-js-minify");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const autoprefixer = require("gulp-autoprefixer");
const imgMin = require("gulp-imagemin");

//? starting live server -------------------------------------------------------

function startServer() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

//? reload page -----------------------------------------------------------------

function pageReload() {
  return browserSync.reload();
}

//? watch files changes ---------------------------------------------------------

function watcher() {
  watch("*.html").on("change", pageReload);
  watch("./src/js/*.js").on("change", parallel(scripts));
  watch("./src/scss/*.scss").on("change", parallel(styles));
  watch("./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}").on(
    "change",
    parallel(images)
  );
}

//? clear dist folder ------------------------------------------------------------

function clear() {
  return src("dist/**/*", { read: false }).pipe(clean());
}

//? transforms scss files to one minified css ------------------------------------

function styles() {
  return src("./src/scss/styles.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      cleanCSS({ compatibility: "ie8", debug: true }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(autoprefixer())
    .pipe(concat("styles.min.css"))
    .pipe(sourcemaps.write())
    .pipe(dest("./dist"))
    .pipe(browserSync.reload({ stream: true }));
}

//? transforms js files to one minified js ---------------------------------------

function scripts() {
  return src("./src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.min.js"))
    .pipe(jsMinify())
    .pipe(sourcemaps.write())
    .pipe(dest("./dist/js"))
    .pipe(browserSync.reload({ stream: true }));
}

//? compact image files to dist folder -------------------------------------------

function images() {
  return src("./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}")
    .pipe(imgMin())
    .pipe(dest("./dist/img"))
    .on("end", browserSync.reload);
}

//? create tasks for gulp --------------------------------------------------------

exports.default = exports.dev = parallel(
  startServer,
  watcher,
  series(styles, scripts, images)
);
exports.build = series(clear, styles, scripts, images);

exports.clear = clear;
