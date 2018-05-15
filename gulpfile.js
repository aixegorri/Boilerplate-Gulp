/**
 * Gulp Packages
 */
var autoprefixer = require('gulp-autoprefixer');
var beeper		 = require('beeper');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cached');
var concat       = require('gulp-concat');
var config       = require('./config.json');
var cssminifiy   = require('gulp-clean-css');
var del          = require('del');
var gulp         = require('gulp');
var gulpif 		 = require('gulp-if');
var imagemin 	 = require('gulp-imagemin')
var mergeMq 	 = require('gulp-merge-media-queries');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var processhtml	 = require('gulp-processhtml');
var reload       = browserSync.reload;
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var stylelint    = require('gulp-stylelint');
var uglify       = require('gulp-uglify');





// > Activar o desactivar stylelint en la tarea CSS
const lintcss = false;





// > Manage task's errors
var onError = function (err) {
	beeper()
	console.log(err);
};





// > Delete Dist folder
gulp.task('clean', del.bind(null, ['dist']));





// > Copy Fonts
gulp.task('fonts', function() {
	return gulp.src(config.fonts.src)
		.pipe(gulp.dest(config.fonts.dest))
		.pipe(notify({message: '> FONTS OK', onLast: true}));
});





// > Copy Images
gulp.task('images', function () {
	return gulp.src(config.images.src)
		.pipe(gulp.dest(config.images.dest))
		.pipe(notify({message: '> IMAGES OK', onLast: true}));
});





// > Minify Images
gulp.task('images-min', function () {
	return gulp.src(config.images.src)
		.pipe(imagemin())
		.pipe(gulp.dest(config.images.dest))
		.pipe(notify({message: '> IMAGES MIN OK', onLast: true}));
});





// > Copy Vendor JS (Jquery, Modernizr..)
gulp.task('vendor-js', function () {
	return gulp.src(config.vendorJS.src)
		.pipe(gulp.dest(config.vendorJS.dest))
		.pipe(notify({message: '> VENDOR JS OK', onLast: true}));
});





// > Copy Statics
gulp.task('statics', function () {
	return gulp.src(config.statics.src)
		.pipe(gulp.dest(config.statics.dest))
		.pipe(notify({message: '> STATICS OK', onLast: true}));
});





// > Process .HTML files into 'dist' folder
gulp.task('docs', function(cb) {
	return gulp.src(config.docs.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(cache('docsCache'))
		.pipe(gulp.dest(config.docs.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: '> HTML OK', onLast: true}));
});






// > Minify .HTML files into 'dist' folder
gulp.task('docs-min', function(cb) {
	return gulp.src(config.docs.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(processhtml())
		.pipe(gulp.dest(config.docs.dest))
		.pipe(notify({message: '> HTML MIN OK', onLast: true}));
});





// > Process SASS/SCSS files to generate final CSS files in 'dist' folder
gulp.task('styles', function(cb) {
	return gulp.src(config.styles.src)
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error on CSS'
			})
		}))
		.pipe(gulpif(
			lintcss, stylelint({
				reporters: [{
					formatter: 'string',
					console: true
				}]
			})
		))
		.pipe(sass({
			outputStyle: 'expanded',
		}))
		.pipe(mergeMq({
			log: true
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





// > Process SASS/SCSS files to generate final minified CSS files in 'dist' folder
gulp.task('styles-min', function(cb) {
	return gulp.src(config.styles.src)
		.pipe(plumber({
			errorHandler: notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error on CSS'
			})
		}))
		.pipe(sass({
			outputStyle: 'expanded',
		}))
		.pipe(mergeMq({
			log: true
		}))
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10'
			],
			cascade: false
		}))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(cssminifiy())
		.pipe(rename({ suffix: '.min' }))
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





// > Force a browser page reload
gulp.task('bs-reload', function () {
	browserSync.reload();
});





// > Build 'dist' folder
gulp.task('build',
	gulp.series('clean', 'styles',
		gulp.parallel('fonts', 'images', 'vendor-js', 'statics', 'docs', 'plugins', 'scripts')
	)
);





// > Create a development server with BrowserSync & watch files
gulp.task('work', function() {
	browserSync.init({
		server : {
			baseDir: "dist"
		},
		ghostMode: false,
		online: true
	})
	gulp.watch(config.watch.images, gulp.series('images', 'bs-reload')) // Fix
	gulp.watch(config.watch.vendorJS, gulp.series('vendor-js', 'bs-reload'))
	gulp.watch(config.watch.statics, gulp.series('statics'))
	gulp.watch(config.watch.styles, gulp.series('styles'))
	gulp.watch(config.watch.scripts, gulp.parallel('scripts', 'plugins'))
	gulp.watch(config.watch.docs, gulp.series('docs'))
});





// > Hey! Ho! Let's code!
gulp.task('default',
	gulp.series('build', 'work')
);





// > Build production-ready 'dist' folder
gulp.task('deploy',
	gulp.series('clean', 'styles-min',
		gulp.parallel('fonts', 'images-min', 'vendor-js', 'statics', 'docs-min', 'plugins-clean', 'scripts-min')
	)
);





// > Check CSS Code
gulp.task('css-lint', function(){
	return gulp.src(config.watch.styles)
		.pipe(stylelint({
			reporters: [{
				formatter: 'string', 
				console: true
			}]
		}))
});
