/*
*	Swill Boilerplate v3.0.0beta
*	https://github.com/tiagoporto/swill-boilerplate
*	Copyright (c) 2014-2015 Tiago Porto (http://tiagoporto.com)
*	Released under the MIT license
*/

'use strict';

//************************* Load dependencies ****************************//
var		   gulp = require('gulp'),
   autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
		  cache = require('gulp-cached'),
		 concat = require('gulp-concat'),
		   csso = require('gulp-csso'),
			del = require('del'),
		 gulpif = require('gulp-if'),
	   imagemin = require('gulp-imagemin'),
		 jshint = require('gulp-jshint'),
		  merge = require('merge-stream'),
	 minifyHTML = require('gulp-minify-html'),
		 notify = require('gulp-notify'),
		plumber = require('gulp-plumber'),
		replace = require('gulp-replace'),
		 rename = require('gulp-rename'),
		   sass = require('gulp-ruby-sass'),
	   sequence = require('run-sequence'),
	spritesmith = require('gulp.spritesmith'),
	  svgSprite = require('gulp-svg-sprite'),
		stylish = require('jshint-stylish'),
		 uglify = require('gulp-uglify'),
		 useref = require('gulp-useref'),
			zip = require('gulp-zip'),

//***************************** Path configs *****************************//
	basePaths = {
		   src: 'src/',
		  dest: 'www/',
		 build: 'build/',

		images: {
			 src: 'images/',
			dest: 'img/' // If change this directory remember to modify
							// the variable $image-path in
							// 'src/stylesheets/helpers/_variables.styl'
		},

		sprite: {
			bitmap: 'sprite/',
			   svg: 'svg-sprite/'
		},

		scripts: {
			 src: 'scripts/',
			dest: 'js/'
		},

		styles: {
			 src: 'stylesheets/',
			dest: 'css/'
		}
	},

	paths = {
		images: {
			  src: basePaths.src + basePaths.images.src ,
			 dest: basePaths.dest + basePaths.images.dest,
			build: basePaths.build + basePaths.images.src
		},

		sprite: {
			  bitmap: basePaths.src + basePaths.images.src + basePaths.sprite.bitmap,
			 svg: basePaths.src + basePaths.images.src + basePaths.sprite.svg
		},

		scripts: {
			  src: basePaths.src + basePaths.scripts.src,
			 dest: basePaths.dest + basePaths.scripts.dest,
			build: basePaths.build + basePaths.scripts.dest
		},

		styles: {
			  src: basePaths.src + basePaths.styles.src,
			 dest: basePaths.dest + basePaths.styles.dest,
			build: basePaths.build + basePaths.styles.dest
		}
	},

//************************ browserSync config ***************************//

	browserSyncConfig = {
		notify: false,
		port: 80,
		logPrefix: 'BrowserSync',
		// To use with dinamic files
		// proxy: 'localhost/swill-boilerplate/public/'
		server: {
			baseDir: basePaths.dest
		}
	};

//******************************** Tasks *********************************//

// Generate Bitmap Sprite
gulp.task('bitmap-sprite', function () {
	var sprite = gulp.src(paths.sprite.bitmap + '**/*.png')
					.pipe(
						spritesmith({
							imgName: 'sprite.png',
							cssName: '_sprite.styl',
							imgPath: '../' + basePaths.images.dest + 'sprite.png',
							padding: 2,
							algorithm: 'top-down'
						})
					);

	sprite.img
		.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dest));
	sprite.css
		.pipe(gulp.dest(paths.styles.src + 'helpers'))
		.pipe(notify({message: 'Sprite task complete'}));

	return sprite;
});

// Generate SVG Sprite
gulp.task('svg-sprite', function() {
	return gulp.src(paths.sprite.svg + '*.svg')
				.pipe(plumber())
				.pipe(svgSprite({
					shape : {
						spacing : {
							padding : 2
						}
					},
					mode : {
						css : {
							dest : './',
							sprite: '../' + basePaths.images. dest + 'svg-sprite.svg',
							layout: 'vertical',
							bust : false,
							render : {
								scss : {dest: '../../' + paths.styles.src + 'helpers/_svg-sprite.scss'}
							}
						}
					}
				}))
				.pipe(gulp.dest(paths.images.dest));
});

// Optimize Images
gulp.task('images', function () {
	return gulp.src([
				paths.images.src + '**/*.{bmp,gif,jpg,jpeg,png,svg}',
				'!' + paths.sprite.bitmap + '**/*',
				'!' + paths.sprite.svg + '**/*'
			])
			.pipe(cache('imagemin'))
			.pipe(imagemin({optimizationLevel: 5, progressive: true}))
			.pipe(gulp.dest(paths.images.dest))
			.pipe(notify({message: 'Images task complete', onLast: true}));
});

// Concatenate Sass Mixins and Functions
gulp.task('sass-helpers', function () {
	   var mixins = gulp.src(paths.styles.src + 'helpers/mixins/*.scss')
						.pipe(concat('_mixins.scss'))
						.pipe(gulp.dest(paths.styles.src + 'helpers'));

	var functions = gulp.src(paths.styles.src + 'helpers/functions/*.scss')
						.pipe(concat('_functions.scss'))
						.pipe(gulp.dest(paths.styles.src + 'helpers'));

	return merge(mixins, functions);
});

// Compile and Prefix Sass Styles
gulp.task('sass', function () {
	return	sass(paths.styles.src + 'ionic.app.scss', {precision: 3, style: 'expanded'})
				.pipe(autoprefixer({
					browsers: ['ie_mob >= 10', 'Firefox > 24', 'last 2 Chrome versions', 'safari >= 6', 'opera >= 24', 'ios >= 6',  'android >= 4', 'bb >= 10']
				}))
				.on('error', function (err) {
					console.error('Error', err.message);
				})
				.pipe(gulp.dest(paths.styles.dest))
				.pipe(csso())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.styles.dest))
				.pipe(notify({message: 'Styles task complete', onLast: true}));

});

// Concatenate and Minify Main Scripts
gulp.task('scripts', function () {
	var script = gulp.src([
						paths.scripts.src + 'app.js',
						paths.scripts.src + 'controllers.js',
						paths.scripts.src + 'services.js'
					])
					.pipe(plumber())
					.pipe(jshint())
					.pipe(jshint.reporter('jshint-stylish'))
					.pipe(concat('main.js'))
					.pipe(gulp.dest(paths.scripts.dest))
					.pipe(rename({suffix: '.min'}))
					.pipe(uglify(
					// Required to minify angularjs scripts
					{mangle: false}
					))
					.pipe(gulp.dest(paths.scripts.dest));

	var copy = gulp.src(basePaths.src + 'lib/ionic/js/ionic.bundle.min.js')
					.pipe(gulp.dest(paths.scripts.dest));
});

// Copy Files to Build
gulp.task('copy', function () {
	var assets   =  useref.assets();

	// Minify and Copy HTML
	var  html    =   gulp.src(basePaths.dest + '**/*.html')
						.pipe(assets)
						.pipe(gulpif('*.js', uglify(
							// Required to minify angularjs scripts
							{mangle: false}
						)))
						.pipe(gulpif('*.css', csso()))
						.pipe(assets.restore())
						.pipe(useref())
						.pipe(gulpif('*.html', minifyHTML({spare:true, empty: true})))
						.pipe(gulp.dest(basePaths.build));

	// Copy All Other files except HTML, CSS e JS Files
	var allFiles =	gulp.src([
							'config.xml',
							basePaths.dest + '**/*',
							'!' + paths.styles.dest + '**/*',
							'!' + paths.scripts.dest + '**/*',
							'!' + basePaths.dest + '**/*.html'
						], {dot: true})
						.pipe(gulp.dest(basePaths.build));

	var resources =	gulp.src([
							'resources/**/*',
							'!resources/splash.psd',
							'!resources/android/icon.png',
							'!resources/ios/icon.png',
							'!resources/wp8/icon.png',
						], {dot: true})
						.pipe(gulp.dest(basePaths.build + 'resources'));

	return merge(html, allFiles, resources);
});

gulp.task('zip', function() {
	return gulp.src('build/**/*', {dot: true})
			.pipe(zip('phonegap.zip'))
			.pipe(gulp.dest('./'));
});

//*************************** Utility Tasks ******************************//

// Clean Directories
gulp.task('clean', function (cb) {
	del([
			basePaths.build,
			paths.styles.dest,
			paths.scripts.dest,
			paths.images.dest + '**/*',
			'!' + paths.images.dest + 'copyright{,**/*{,**/*}}',
			'!' + paths.images.dest + 'logos{,**/*{,**/*}}'
		], cb)
});

// Watch
gulp.task('watch', function () {

	// Watch .bmp .gif .jpg .jpeg .png and .svg files
	gulp.watch([paths.images.src + '**/*.{bmp,gif,jpg,jpeg,png,svg}', '!' + paths.sprite.bitmap + '**/*', '!' + paths.sprite.svg + '**/*'], ['images']);

	// Watch bitmap sprite files
	gulp.watch(paths.sprite.bitmap + '**/*.{png,jpg,gif}', ['bitmap-sprite']);

	// Watch svg sprite files
	gulp.watch(paths.sprite.svg + '**/*.svg', ['svg-sprite', 'sass']);

	// Watch .js files
	gulp.watch([paths.scripts.src + '**/*.js'], ['scripts']);

	// Watch .sass and .scss files
	gulp.watch([paths.styles.src + '**/*.{sass,scss}', '!' + paths.styles.src + 'helpers/mixins/*.{sass,scss}', '!' + paths.styles.src + 'helpers/functions/*.{sass,scss}'], ['sass']);

	// Watch .sass and .scss Helpers and Functions files
	gulp.watch([paths.styles.src + 'helpers/mixins/*.{sass,scss}', paths.styles.src + 'helpers/functions/*.{sass,scss}'], ['sass-helpers']);

	//Watch .html and .php Files
	gulp.watch(basePaths.dest + '**/*.html');
});

//***************************** Main Tasks *******************************//

// Compile, watch and serve project
gulp.task('default', ['clean'], function (cb) {
	sequence(['images', 'bitmap-sprite', 'svg-sprite', 'sass-helpers'], 'sass', 'scripts', 'watch',  cb);
});

// Compile project
gulp.task('compile', ['clean'], function (cb) {
	sequence(['images', 'bitmap-sprite', 'svg-sprite', 'sass-helpers'], 'sass', 'scripts', cb);
});

// Build Project
gulp.task('build', ['clean'], function (cb) {
	sequence(['images', 'bitmap-sprite', 'svg-sprite'], 'scripts', 'sass-helpers', 'sass', 'copy', 'zip', cb);
});

// Build and serve Builded Project
gulp.task('build:serve', ['build'], function (cb) {
	browserSync(browserSyncConfig);
});
