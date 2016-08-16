var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var sassOptions = {
  includePaths: [
    'node_modules'
  ]
};

gulp.task('styles', function() {
  gulp
    .src('client/styles/**/*.scss')
    .pipe( sourcemaps.init() )
    .pipe( sass(sassOptions) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('client/styles/') )
});

gulp.task('default', ['styles'], () => {
  gulp.watch('./client/styles/**/*.scss', ['styles']);
});
