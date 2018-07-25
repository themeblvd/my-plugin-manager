const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const { classPrefix, classFilePrefix } = require('../utils');
const { usage, name, namespace, textDomain } = require('../../build-config');

function buildExample() {
  gulp
    .src(`../src/example-${usage}.txt`)
    .pipe(replace('{{name}}', name))
    .pipe(replace('{{text-domain}}', textDomain))
    .pipe(replace('{{my}}', namespace))
    .pipe(replace('{{My}}', classPrefix(name)))
    .pipe(replace('{{class-my-}}', classFilePrefix(name)))
    .pipe(rename('example.php'))
    .pipe(gulp.dest('../dist'));
}

module.exports = buildExample;
