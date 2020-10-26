"use strict";

var autoprefixer = require("autoprefixer");
var del = require("del");
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var server = require("browser-sync").create();
var sourcemap = require("gulp-sourcemaps");
var svgstore = require("gulp-svgstore");

gulp.task("clean", function () {
  return del("build");
})

gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2,eot,svg}",
    "src/assets/**",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"))
})

gulp.task("css", function () {
  return gulp.src("src/styles/index.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/styles/**/*.scss", gulp.series("css"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

gulp.task("sprite", function () {
  return gulp.src("src/assets/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
  }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/assets/images"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html",
));

gulp.task("start", gulp.series("build", "server"));