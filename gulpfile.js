var gulp = require('gulp'),
  connect = require('gulp-connect'),
  less = require('gulp-less'),
  autoprefixer = require('gulp-autoprefixer'),
  minify = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  uglify = require('gulp-uglify');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

function newWebsite() {
  mkdirp('www', function() {
    fs.writeFile("www/index.html", "Hey there!");
  });
  mkdirp('www/assets');
  mkdirp('www/assets/css');
  mkdirp('www/assets/img');
  mkdirp('www/assets/js', function() {
    fs.writeFile("www/assets/js/master.js", "//Hey there!");
  });
  mkdirp('www/assets/less', function() {
    fs.writeFile("www/assets/less/master.less", "Hey there!");
  });
}

gulp.task('new', newWebsite);

gulp.task('connect', function() {
  connect.server({
    root: 'www',
    port: 1337,
    livereload: true
  });
});

gulp.task('less', function() {
  return gulp.src('./www/assets/less/**/*.less')
    .pipe(less())
    .on('error', handleError)
    .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minify({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./www/assets/css'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  return gulp.src('./www/**/*.html')
    .pipe(connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src('./www/assets/js/**/*.js')
    .pipe(concat('master.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./www/assets/js'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./www/assets/less/*.less', ['less']);
  gulp.watch('./www/*.html', ['html']);
  gulp.watch('./www/assets/js/**/*.js', ['scripts']);
});

gulp.task('default', ['connect', 'watch']);
// gulp.task('new', ['mkdirs', 'default']);
