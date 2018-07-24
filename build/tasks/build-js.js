const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('../../webpack.config');

function buildJs(script) {
  const entry = path.resolve(__dirname, '../../src') + `/assets/js/plugin-${script}.js`;

  return gulp
    .src(entry) // For Gulp reference only, actual entry file pulled from Webpack config.
    .pipe(webpackStream(webpackConfig({ entry, script }), webpack))
    .pipe(gulp.dest('../dist')); // Replaces path in typical Webpack output object.
}

module.exports = buildJs;
