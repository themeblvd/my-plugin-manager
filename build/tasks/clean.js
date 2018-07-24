const gulp = require('gulp');
const del = require('del');

function clean() {
  return del(['../dist/*', '!../dist/README.md'], { force: true });
}

module.exports = clean;
