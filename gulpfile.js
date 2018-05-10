var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
// function clean() {
//   // You can use multiple globbing patterns as you would with `gulp.src`,
//   // for example if you are using del 2.0 or above, return its promise
//   return del([ 'assets' ]);
// }

/*
 * Define our tasks using plain functions
 */


function clean() {
  return console.log('Clean task');
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
// exports.styles = styles;
// exports.scripts = scripts;
// exports.watch = watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
// var build = gulp.series(clean, gulp.parallel(styles, scripts));
var build = gulp.series(clean);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);