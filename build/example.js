/*
 * Example Data
 *
 * The following values are used to generate
 * the example usage in the `/dist` directory.
 *
 * If you're using a cloned version of this repo,
 * to generate an instance for your theme or plugin,
 * you'll want to change the values below.
 *
 * Note: You can also generate a custom instance for
 * your theme or plugin at mypluginmanager.com.
 */

// Context of how you're using the script.
const usage = 'theme'; // `theme`, `child-theme` or `plugin`

// Name of your theme or plugin.
const theme = 'Theme Blvd';

// Namespace value you're using for your PHP functions,
// like `themeblvd` or `theme_blvd`
const namespace = 'themeblvd';

// Text domain slug your plugin or theme uses, like
// `themeblvd` or `theme-blvd`.
const i18n = '@@text-domain';

module.exports = { usage, theme, namespace, i18n };
