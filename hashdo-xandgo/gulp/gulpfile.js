var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')();

var AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'last 5 chrome versions',
  'safari >= 5',
  'ios >= 6',
  'android >= 2',
  'ff >= 30',
  'opera >= 22',
  'ie >= 8',
  'ie_mob >= 10'
];

gulp.task('less-survey-modal', function (done) {
  gulp.src('../less/survey.modal.less')
    .pipe(plugins.less({
      compress: true
    }))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('../less/'));

  done && done();
});