"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");

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

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/styles/**/*.scss", gulp.series("css"));
  gulp.watch("src/*.html").on("change", server.reload);
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

gulp.task("clean", function () {
  return del("build");
})

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "html"
));

gulp.task("start", gulp.series("build", "server"));