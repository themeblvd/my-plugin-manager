const gulp = require('gulp');
const replace = require('gulp-replace');
const replaceName = require('gulp-replace-name');
const { classPrefix, classFilePrefix } = require('../utils');
const { usage, name, namespace, textDomain } = require('../../build-config');

function buildPhp() {
  const menuSlug = {
    find: usage === 'plugin' ? 'themes.php' : '',
    replace: usage === 'plugin' ? 'plugins.php' : ''
  };

  const addMenu = {
    find: usage === 'plugin' ? 'add_theme_page(' : '',
    replace: usage === 'plugin' ? "add_submenu_page(\n\t\t\t\t$this->args['parent_slug']," : ''
  };

  return gulp
    .src('../src/*.php')
    .pipe(replace('my-text-domain', textDomain))
    .pipe(replace('my_namespace', namespace))
    .pipe(replace('_My', classPrefix(name)))
    .pipe(replace(menuSlug.find, menuSlug.replace))
    .pipe(replace(addMenu.find, addMenu.replace))
    .pipe(replace('class-my-', classFilePrefix(name)))
    .pipe(replaceName(/class-my-/g, classFilePrefix(name)))
    .pipe(gulp.dest('../dist/plugin-manager'));
}

module.exports = buildPhp;
