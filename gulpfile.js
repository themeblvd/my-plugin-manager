var gulp 	    = require('gulp'),
	clean	    = require('gulp-clean'),
	replace     = require('gulp-replace'),
	replaceName = require('gulp-replace-name');

/**
 * Variables used to generate custom
 * distribution package.
 */
var usage      = 'theme',      // `theme`, `child-theme` or `plugin`
	themeName  = 'Theme Blvd', // Should be registered theme or plugin name.
	namespace  = 'themeblvd',  // like `themeblvd` or `theme_blvd`
	textDomain = 'themeblvd';  // like `themeblvd` or `theme-blvd`

/**
 * Empty out distribution before compiling
 * everything.
 */
gulp.task('clean', function() {

	return gulp.src('dist/plugin-manager/*', {read: false})
        .pipe(clean());

});

/**
 * Copy static assets.
 */
gulp.task('copy', ['clean'], function() {

	return gulp.src('src/plugin-manager/assets/**')
    	.pipe(gulp.dest('dist/plugin-manager/assets'));

});

/**
 * Render the PHP files.
 */
gulp.task('render-php-files', ['copy'], function() {

	var classPrefix     = themeName.replace(/ /gi, '_'),
		classFilePrefix = classPrefix.toLowerCase(),
		classFilePrefix = classFilePrefix.replace(/_/gi, '-'),
		findMenuSlug    = '',
		replaceMenuSlug = '',
		findAddMenu     = '',
		replaceAddMenu  = '';

	if ( usage === 'plugin' ) {

		findMenuSlug    = 'themes.php';
		replaceMenuSlug = 'plugins.php';

		findAddMenu     = 'add_theme_page(';
		replaceAddMenu  = "add_submenu_page(\n\t\t\t\t\$this->args['parent_slug'],";

	}

	return gulp.src('src/plugin-manager/*.php')
		.pipe(replace('my-text-domain', textDomain))
		.pipe(replace('my_namespace', namespace))
		.pipe(replace('_My', classPrefix))
		.pipe(replace(findMenuSlug, replaceMenuSlug))
		.pipe(replace(findAddMenu, replaceAddMenu))
		.pipe(replace('class-my-', 'class-' + classFilePrefix + '-'))
		.pipe(replaceName(/class-my-/g, 'class-' + classFilePrefix + '-'))
    	.pipe(gulp.dest('dist/plugin-manager'));

});

/**
 * Serve all distrubtion tasks.
 */
gulp.task('serve', ['render-php-files'], function() {
	return;
});
