/*
 * Build Data
 *
 * The following variables are used to generate
 * the build.
 *
 * The default values you see below are how we
 * integrate this script into Theme Blvd themes.
 *
 * If you're using a cloned version of this repo,
 * to generate an instance for your theme or plugin,
 * you'll want to change the values below.
 *
 * Or, you can also generate a custom instance for
 * your theme or plugin at mypluginmanager.com.
 */

/**
 * Context of how you're using the script.
 *
 * Value should be equal to one of the following:
 * 1. `theme` - Using with standard theme.
 * 2. `child-theme` - Using with child theme.
 * 3. `plugin` - Using with plugin.
 *
 * @var {string}
 */
const usage = 'theme';

/**
 * Name of your theme or plugin.
 *
 * This should match the name in your theme's style.css
 * or the name in your main plugin file.
 *
 * @var {string}
 */
const name = 'Theme Blvd';

/**
 * Namespace value you're using for your PHP functions,
 * like `themeblvd` or `theme_blvd`
 *
 * @var {string}
 */
const namespace = 'themeblvd';

/**
 * Text domain slug your plugin or theme uses, like
 * `themeblvd` or `theme-blvd`.
 *
 * This is the slug used for your WordPress localization.
 * It usually matches the name of your theme or plugin's
 * directory.
 *
 * Note: What's up with the weird '@@text-domain' default
 * value? -- In the Theme Blvd WordPress framework we have
 * a build system that replaces that value throughout all
 * framework PHP code with the proper value cooresponding
 * to the current theme.
 *
 * @var {string}
 */
const textDomain = '@@text-domain';

module.exports = { usage, name, namespace, textDomain };
