const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserslist = require('../browserslist');
const minifycss = require('gulp-clean-css');
const rename = require('gulp-rename');

function buildCss() {
  return gulp
    .src('../src/assets/scss/plugin-manager.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: browserslist }))
    .pipe(gulp.dest('../dist/plugin-manager/assets/css'))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('../dist/plugin-manager/assets/css'));
}

module.exports = buildCss;
