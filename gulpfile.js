/**
 * Gulp Packages
 */
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cached');
var combineMq    = require('gulp-combine-mq');
var concat       = require('gulp-concat');
var config       = require('./config.json');
var cssminifiy   = require('gulp-clean-css');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var reload       = browserSync.reload;
var rename       = require('gulp-rename');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');





// > Manage task's errors
var onError = function (err) {
	gutil.beep();
	console.log(err);
};





// > Copy Fonts
gulp.task('fonts', function () {
	return gulp.src(config.fonts.src)
		.pipe(gulp.dest(config.fonts.dest))
		.pipe(notify({message: '> Fonts OK', onLast: true}));
});





// > Copy Images
gulp.task('images', function () {
	return gulp.src(config.images.src)
		.pipe(gulp.dest(config.images.dest))
		.pipe(notify({message: '> Images OK', onLast: true}));
});





// > Copy Vendor JS (Jquery, Modernizr..)
gulp.task('vendor-js', function () {
	return gulp.src(config.vendorJS.src)
		.pipe(gulp.dest(config.vendorJS.dest))
		.pipe(notify({message: '> Vendor JS OK', onLast: true}));
});





// > Copy Statics
gulp.task('statics', function () {
	return gulp.src(config.statics.src)
		.pipe(gulp.dest(config.statics.dest))
		.pipe(notify({message: '> Statics OK', onLast: true}));
});





// > Process .HTML files into 'dist' folder
gulp.task( 'docs' , function(cb) {
	return gulp.src(config.docs.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(cache('docsCache'))
		.pipe(gulp.dest(config.docs.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: '> HTML OK', onLast: true}));
});





// > Process SASS/SCSS files to generate final css files in 'dist' folder
gulp.task( 'styles' , function(cb) {
	return gulp.src(config.styles.src)
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass({
			outputStyle: 'extended',
		}))
		.pipe(combineMq({
			beautify: true
		}))
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10'
			],
			cascade: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: '> CSS OK', onLast: true}));
});





// > Process SASS/SCSS files to generate final css files in 'dist' folder
gulp.task( 'styles-min' , function(cb) {
	return gulp.src(config.styles.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass({
			outputStyle: 'compressed',
		}))
		.pipe(combineMq({
			beautify: false
		}))
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10'
			],
			cascade: false
		}))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(notify({message: '> CSS MIN OK', onLast: true}));
});





// > Process plugins into a single JS file inside 'assets/js' folder
gulp.task('plugins', function(){
	return gulp.src(config.plugins.src) // CHECK FILES PATH ORDER !
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('plugins.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.plugins.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: 'PLUGINS OK', onLast: true}));
});





// > Process plugins into a single JS file inside 'assets/js' folder without sourcemaps
gulp.task('plugins-clean', function(){
	return gulp.src(config.plugins.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest(config.plugins.dest))
		.pipe(notify({message: 'PLUGINS CLEAN OK', onLast: true}));
});





// > Process JS scripts into a single JS file inside 'assets/js' folder
gulp.task('scripts', function(){
	return gulp.src(config.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('main.js'))
		//.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: 'JS OK', onLast: true}));
});





// > Process JS scripts into a single minified JS file inside 'assets/js' folder
gulp.task('scripts-min', function(){
	return gulp.src(config.scripts.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(notify({message: 'JS MIN OK', onLast: true}));
});





// > Create a development server with BrowserSync
gulp.task('go', ['default'], function () {
	browserSync.init({
		server : {
			baseDir: "dist"
		},
		ghostMode: false,
		online: true
	});
	gulp.watch(config.watch.images, ['bs-reload', ['images']]);
	gulp.watch(config.watch.vendorJS, ['bs-reload', ['vendor-js']]);
	gulp.watch(config.watch.humansTXT, ['humansTXT']);
	gulp.watch(config.watch.styles, ['styles']);
	gulp.watch(config.watch.scripts, ['scripts', 'plugins']);
	gulp.watch(config.watch.docs, ['docs']);
});





// > Force a browser page reload - CHECK
gulp.task('bs-reload', function () {
	browserSync.reload();
});





// > Generate 'dist' folder
gulp.task('default', ['clean'], function (cb) {
	runSequence('styles', ['fonts', 'images', 'vendor-js', 'statics', 'docs', 'plugins', 'scripts'], cb);
});





// > Generate production-ready 'dist' folder
gulp.task('deploy', ['clean'], function (cb) {
	runSequence('styles-min', ['fonts', 'images', 'vendor-js', 'statics', 'docs', 'plugins-clean', 'scripts-min'], cb);
});




// > Delete Public folder
gulp.task('clean', del.bind(null, ['dist']));
