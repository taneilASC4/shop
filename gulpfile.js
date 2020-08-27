//Requires
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');

//Vars
var dist = 'dist';
var jsFile = 'angular-reservation.js';
var minJsFile = 'angular-reservation.min.js';
var minCssFile = 'angular-reservation.min.css';

//Generates templates
gulp.task('templates', function () {
  return gulp.src('src/templates/*.html')
    .pipe(templateCache(jsFile, {module: 'hm.reservation'}))
    .pipe(gulp.dest(dist));
});

//Generates angular-reservation.js
gulp.task('concat-js', ['templates'], function () {
  	gulp.src(['src/js/**/*.js', dist + '/' + jsFile])
  	.pipe(concat(jsFile))
  	.pipe(gulp.dest(dist))
});

//Generates angular-reservation.min.js
gulp.task('concat-uglify-js', ['templates'], function () {
  	gulp.src(['src/js/**/*.js', dist + '/' + jsFile])
  	.pipe(concat(minJsFile))
  	.pipe(uglify())
  	.pipe(gulp.dest(dist))
});

//Generates angular-reservation.min.css
gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat(minCssFile))
    .pipe(gulp.dest(dist));
});

//Configure watch to execute build task on source changes
gulp.task('watch', function() {
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['concat-js', 'concat-uglify-js', 'minify-css']);
gulp.task('build', ['default']);



//originak gulpfile
"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  return merge(bootstrap, jquery);
}

// Watch files
function watchFiles() {
  gulp.watch("./**/*.css", browserSyncReload);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
