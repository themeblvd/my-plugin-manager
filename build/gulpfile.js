const gulp = require('gulp');
const buildJs = require('./tasks/build-js');

gulp.task('clean', require('./tasks/clean'));

gulp.task('build-php', require('./tasks/build-php'));

gulp.task('build-css', require('./tasks/build-css'));

gulp.task('build-js-notices', () => buildJs('notices'));

gulp.task('build-js-manager', () => buildJs('manager'));

gulp.task('build-js', ['build-js-notices', 'build-js-manager']);

gulp.task('default', ['clean', 'build-php', 'build-css', 'build-js']);
