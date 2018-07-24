const gulp = require('gulp');
const replace = require('gulp-replace');
const replaceName = require('gulp-replace-name');
const { usage, theme, namespace, i18n } = require('../example');

function buildPhp() {
  let classPrefix = theme.replace(/ /gi, '_');
  let classFilePrefix = classPrefix.toLowerCase().replace(/_/gi, '-');

  let findMenuSlug = '';
  let replaceMenuSlug = '';
  let findAddMenu = '';
  let replaceAddMenu = '';

  if (usage === 'plugin') {
    findMenuSlug = 'themes.php';
    replaceMenuSlug = 'plugins.php';
    findAddMenu = 'add_theme_page(';
    replaceAddMenu = "add_submenu_page(\n\t\t\t\t$this->args['parent_slug'],";
  }

  return gulp
    .src('../src/*.php')
    .pipe(replace('my-text-domain', i18n))
    .pipe(replace('my_namespace', namespace))
    .pipe(replace('_My', classPrefix))
    .pipe(replace(findMenuSlug, replaceMenuSlug))
    .pipe(replace(findAddMenu, replaceAddMenu))
    .pipe(replace('class-my-', 'class-' + classFilePrefix + '-'))
    .pipe(replaceName(/class-my-/g, 'class-' + classFilePrefix + '-'))
    .pipe(gulp.dest('../dist/plugin-manager'));
}

module.exports = buildPhp;
