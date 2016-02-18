/*
Copyright (c) 2016 Gigaleet. All rights reserved.
*/

// Include Gulp & tools we'll use
var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
var del           = require('del');
var runSequence   = require('run-sequence');
var autoprefixer  = require('gulp-autoprefixer');
var newer         = require('gulp-newer');
var sourcemaps    = require('gulp-sourcemaps');
var sass          = require('gulp-sass');
var size          = require('gulp-size');
var gulpif        = require('gulp-if');
var uncss         = require('gulp-uncss');
var useref        = require('gulp-useref');
var cssnano       = require('gulp-cssnano');
var htmlmin		  = require('gulp-htmlmin');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var eslint        = require('gulp-eslint');
var imagemin      = require('gulp-imagemin');
var cache         = require('gulp-cache');


// Lint JavaScript
gulp.task('lint', function() {
  gulp.src('app/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(!browserSync.active, eslint.failOnError()))
});

// Optimize images
gulp.task('images', function() {
  gulp.src('app/images/**/*')
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(size({title: 'images'}))
});

// Copy all files at the root level (app)
gulp.task('copy', function() {
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe(size({title: 'copy'}))
});

// Compile and prefix stylesheets
gulp.task('styles', function() {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
  return gulp.src([
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
  .pipe(newer('.tmp/styles'))
  .pipe(sourcemaps.init())
  .pipe(sass({
    precision: 10
  }).on('error', sass.logError))
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(gulp.dest('.tmp/styles'))
  .pipe(gulpif('*.css', cssnano()))
  .pipe(size({title: 'styles'}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/styles'));
});

// Concatenate and minify JavaScript.
gulp.task('scripts', function() {
    gulp.src([
      './app/scripts/**/*.js'
      // List all other scripts
    ])
      .pipe(newer('.tmp/scripts'))
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe(concat('main.min.js'))
      .pipe(uglify({preserveComments: 'some'}))
      .pipe(size({title: 'scripts'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
});

// Scan HTML for assets and optimize
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(useref({searchPath: '{.tmp,app}'}))
    .pipe(gulpif('*.css', uncss({
      html: [
        'app/index.html'
      ],
      ignore: []
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe(gulpif('*.css', cssnano()))
    // Minify any HTML
    .pipe(gulpif('*.html', htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe(gulpif('*.html', size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean up output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes and reload
gulp.task('serve', ['scripts', 'styles'], function() {
  browserSync({
    notify: false,
    logPrefix: 'GDK',
    server: ['.tmp', 'app'],
    port: 3000
  });
  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts']);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'GDK',
    server: 'dist',
    port: 3001
  })
});

// Default Task - Build production files
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'html', 'scripts', 'images', 'copy'],
    cb
  )
);