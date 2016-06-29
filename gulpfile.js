var gulp = require('gulp');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var unprefix = require('postcss-unprefix');
var autoprefixer = require('autoprefixer');
var notify = require("gulp-notify");

gulp.task('connect', function() {
    connect.server({
        root: ['.'],
        livereload: true,
        fallback: 'index.html'
    });
});

gulp.task('reload-html', function() {
    gulp.src('index.html')
        .pipe(connect.reload())
        .pipe(notify("Html reloaded : <%= file.relative %> !"));
});

gulp.task('less', function () {
  return gulp.src('./assets/less/**/*.less')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(less())
    .pipe(less().on('error', function(err) {
        notify(err.message);
        this.emit('end');
    }))
    .pipe(postcss([
        unprefix,
        autoprefixer({
            browsers: ['last 3 version']
        })
    ]))
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'))
    .pipe(notify("Less compiled : <%= file.relative %> !"))
    .pipe(connect.reload());
});

gulp.task('watch-html', function() {
  gulp.watch('**/*.html', ['reload-html']);
});

gulp.task('watch-less', function() {
  gulp.watch('**/*.less', ['less']);
});

gulp.task('default', ['less','connect', 'watch-html', 'watch-less']);
