/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = wp;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
 * @type {string}
 */
var usage = 'theme';

/**
 * Name of your theme or plugin.
 *
 * This should match the name in your theme's style.css
 * or the name in your main plugin file.
 *
 * @type {string}
 */
var name = 'Theme Blvd';

/**
 * Namespace value you're using for your PHP functions,
 * like `themeblvd` or `theme_blvd`
 *
 * @type {string}
 */
var namespace = 'themeblvd';

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
 * @type {string}
 */
var textDomain = '@@text-domain';

module.exports = { usage: usage, name: name, namespace: namespace, textDomain: textDomain };

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = pluginManagerSettings;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_);

// EXTERNAL MODULE: external "wp"
var external_wp_ = __webpack_require__(1);

// EXTERNAL MODULE: .-config.js
var _config = __webpack_require__(2);

// EXTERNAL MODULE: external "pluginManagerSettings"
var external_pluginManagerSettings_ = __webpack_require__(3);
var external_pluginManagerSettings_default = /*#__PURE__*/__webpack_require__.n(external_pluginManagerSettings_);

// CONCATENATED MODULE: ../src/assets/js/modules/vars.js




/**
 * Cache the jQuery document.
 *
 * @since 1.0.0
 *
 * @type {object}
 */
var $document = external_jQuery_default()(document);

/**
 * Localized strings from WordPress's updates
 * script, merged with any added by the
 * plugin manager.
 *
 * @since 1.0.0
 *
 * @type {object}
 */
var l10n = external_jQuery_default.a.extend(external_pluginManagerSettings_default.a, external_wp_["updates"].l10n);
// CONCATENATED MODULE: ../src/assets/js/modules/actions.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };







/**
 * Keep track of the current action
 * taking place.
 *
 * @type {string}
 */
var currentAction = null;

/**
 * Set the current action.
 *
 * @param {string} action Action slug or null.
 */
var setCurrentAction = function setCurrentAction(action) {
  currentAction = action;
};

/**
 * Get the current action.
 *
 * @return {string} Current action.
 */
var getCurrentAction = function getCurrentAction() {
  return currentAction;
};

/**
 * Sends an Ajax request to the server to install a plugin.
 *
 * @since 1.0.0
 *
 * @param  {object}      args         Arguments.
 * @param  {string}      args.slug    Plugin slug.
 * @param  {refreshRow=} args.success Optional. Success callback.
 * @param  {refreshRow=} args.error   Optional. Error callback.
 * @return {$.promise}                A jQuery promise that represents the request,
 *                                    decorated with an abort() method.
 */
var actions_installPlugin = function installPlugin(args) {
  args = _extends({}, args, {
    success: actions_refreshRow,
    error: actions_refreshRow
  });

  $document.trigger('wp-plugin-installing', args);

  return external_wp_["updates"].ajax('install-plugin', args);
};

/**
 * Sends an Ajax request to the server to update a plugin.
 *
 * @since 1.0.0
 *
 * @param  {object}      args         Arguments.
 * @param  {string}      args.plugin  Plugin basename.
 * @param  {string}      args.slug    Plugin slug.
 * @param  {refreshRow=} args.success Optional. Success callback.
 * @param  {refreshRow=} args.error   Optional. Error callback.
 * @return {$.promise}                A jQuery promise that represents the request,
 *                                    decorated with an abort() method.
 */
var actions_updatePlugin = function updatePlugin(args) {
  args = _extends({}, args, {
    success: actions_refreshRow,
    error: actions_refreshRow
  });

  $document.trigger('wp-plugin-updating', args);

  return external_wp_["updates"].ajax('update-plugin', args);
};

/**
 * Sends an Ajax request to the server to delete a plugin.
 *
 * @since 1.0.0
 *
 * @param  {object}      args         Arguments.
 * @param  {string}      args.plugin  Plugin basename.
 * @param  {string}      args.slug    Plugin slug.
 * @param  {refreshRow=} args.success Optional. Success callback.
 * @param  {refreshRow=} args.error   Optional. Error callback.
 * @return {$.promise}                A jQuery promise that represents the request,
 *                                    decorated with an abort() method.
 */
var actions_deletePlugin = function deletePlugin(args) {
  args = _extends({}, args, {
    success: actions_refreshRow,
    error: actions_refreshRow
  });

  $document.trigger('wp-plugin-deleting', args);

  return external_wp_["updates"].ajax('delete-plugin', args);
};

/**
 * If the state of a plugin has been succesfully changed, refresh
 * its table row in the UI. This includes handling success or error.
 *
 * @since 1.0.0
 *
 * @param {object} response             Response from the server.
 * @param {string} response.slug        Slug of the plugin that was deleted.
 * @param {string} response.plugin      Base name of the plugin that was deleted (only 'delete-plugin').
 * @param {string} response.pluginName  Name of the plugin that was deleted.
 * @param {string} response.activateUrl URL to activate the just installed plugin (only 'install-plugin').
 * @param {string} response.oldVersion  Old version of the plugin (only 'update-plugin').
 * @param {string} response.newVersion  New version of the plugin (only 'update-plugin').
 */
var actions_refreshRow = function refreshRow(response) {
  var args = {
    _ajax_nonce: external_wp_["updates"].ajaxNonce,
    action: _config["namespace"] + '-row-refresh',
    prev_action: getCurrentAction(),
    slug: response.slug,
    namespace: _config["namespace"],
    error: null,
    error_level: 'error' // `error` or `warning`
  };

  // Handle error message
  if (response.errorMessage) {
    if ('update-plugin' === args.prev_action && response.debug) {
      args.error = response.debug[0]; // More helpful message.
      args.error_level = 'warning';
    } else {
      args.error = response.errorMessage;
    }

    if (response.errorLevel) {
      args.error_level = response.errorLevel;
    }
  }

  var $old_row = external_jQuery_default()('tr[data-slug="' + args.slug + '"]');

  // Refresh row from plugin manager.
  external_jQuery_default.a.post(ajaxurl, args, function (response) {
    external_jQuery_default()('#setting-error-plugin-manager-error').remove(); // Remove any lingering notices in page header, from previously finished actions.

    external_jQuery_default()('.' + args.slug + '-notice').remove(); // Remove notice on current row, if exists.

    external_jQuery_default()('tr[data-slug="' + args.slug + '"]').replaceWith(response);

    var $new_row = external_jQuery_default()('tr[data-slug="' + args.slug + '"]');

    if ($new_row.hasClass('ajax-success')) {
      setTimeout(function () {
        $new_row.removeClass('install-success update-success delete-success');
      }, 200);
    }

    // Clear current action.
    setCurrentAction(null);

    // Continue processing any bulk actions, if they exist.
    queue_processQueue();
  });
};

/**
 * Exports
 */

// CONCATENATED MODULE: ../src/assets/js/modules/queue.js



/**
 * Queue of plugins to bulk process.
 *
 * @since 1.0.0
 *
 * @type {array}
 */
var queue = [];

/**
 * When performing bulk actions, this will provide a way to
 * iterate through the queue of plugins synchronously to
 * take action on.
 *
 * @since 1.0.0
 */
var queue_processQueue = function processQueue() {
  if (!queue.length) {
    return;
  }

  var current = queue[0];
  var action = current.action;
  var $row = current.row;

  queue.shift();

  if ('install-selected' === action) {
    $row.addClass('updating-message').find('.row-actions').text(l10n.installing);

    setCurrentAction('install-plugin');

    if ('third-party' === $row.data('source')) {
      /*
       * We can only install plugins from wordpress.org.
       * So, we'll just bypass to refreshing the row
       * with an error message.
       */
      actions_refreshRow({
        slug: current.slug,
        plugin: current.plugin,
        errorMessage: l10n.thirdParty,
        errorLevel: 'warning'
      });
    } else {
      actions_installPlugin({
        slug: current.slug
      });
    }
  } else if ('update-selected' === action) {
    $row.addClass('updating-message').find('.row-actions').text(l10n.updating);

    setCurrentAction('update-plugin');

    if ('not-installed' === $row.data('status')) {
      /*
       * We can't update a plugin that's not installed. So,
       * we'll just bypass to refreshing the row with an
       * error message.
       */
      actions_refreshRow({
        slug: current.slug,
        plugin: current.plugin,
        errorMessage: l10n.notInstalled,
        errorLevel: 'warning'
      });
    } else {
      actions_updatePlugin({
        slug: current.slug,
        plugin: current.plugin
      });
    }
  } else if ('delete-selected' === action) {
    if ('not-installed' == $row.data('status')) {
      /*
       * If we're deleting a plugin that's not actually
       * installed, we'll just refresh the row to clear
       * any previous notices. No error message needed.
       *
       * Note: By not setting currentAction,
       * there's no visual success or error animation
       * added to the refreshed row.
       */
      actions_refreshRow({
        slug: current.slug,
        plugin: current.plugin
      });
    } else {
      $row.addClass('updating-message').find('.row-actions').text(l10n.deleting);

      setCurrentAction('delete-plugin');

      actions_deletePlugin({
        slug: current.slug,
        plugin: current.plugin
      });
    }
  }
};

/**
 * Exports
 */

// CONCATENATED MODULE: ../src/assets/js/plugin-manager.js







$document.ready(function ($) {
  var $page = $('#suggested-plugins');

  /**
   * Handles installing a plugin from clicking `.install-now`
   * link.
   *
   * @since 1.0.0
   *
   * @param {Event} event Event interface.
   */
  $page.on('click', '.install-now', function (event) {
    event.preventDefault();

    var $link = $(event.target);
    var $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    $row.addClass('updating-message').find('.row-actions').text(l10n.installing);

    setCurrentAction('install-plugin');

    actions_installPlugin({
      slug: $row.data('slug')
    });
  });

  /**
   * Handles updating a plugin from clicking `.update-now`
   * link.
   *
   * @since 1.0.0
   *
   * @param {Event} event Event interface.
   */
  $page.on('click', '.update-now', function (event) {
    event.preventDefault();

    var $link = $(event.target);
    var $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    $row.addClass('updating-message').find('.row-actions').text(l10n.updating);

    setCurrentAction('update-plugin');

    actions_updatePlugin({
      slug: $row.data('slug'),
      plugin: $row.data('plugin')
    });
  });

  /**
   * Handles installing a plugin from clicking `.delete-now`
   * link.
   *
   * @since 1.0.0
   *
   * @param {Event} event Event interface.
   */
  $page.on('click', '.delete-now', function (event) {
    event.preventDefault();

    var $link = $(event.target);
    var $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    if (!window.confirm(external_wp_["updates"].l10n.aysDeleteUninstall.replace('%s', $row.find('.plugin-title strong').text()))) {
      return;
    }

    $row.addClass('updating-message').find('.row-actions').text(l10n.deleting);

    setCurrentAction('delete-plugin');

    actions_deletePlugin({
      slug: $row.data('slug'),
      plugin: $row.data('plugin')
    });
  });

  /**
   * Handles the submission of the Bulk Actions.
   *
   * @since 1.0.0
   *
   * @param {Event} event Event interface.
   */
  $page.on('click', '#do-action-top, #do-action-bottom', function (event) {
    event.preventDefault();

    var $button = $(this);
    var action = $button.prev('select').val();
    var $form = $button.closest('form');

    if ('activate-selected' == action || 'deactivate-selected' == action) {
      $form.submit();
      return;
    }

    $form.find('input[name="checked[]"]:checked').each(function () {
      var $checkbox = $(this);
      var $row = $checkbox.closest('tr');

      queue.push({
        row: $row,
        slug: $checkbox.val(),
        plugin: $row.data('plugin'),
        action: action
      });
    });

    $form.find('input[type="checkbox"]').attr('checked', false);

    $form.find('select').val('-1');

    queue_processQueue();
  });
});

/***/ })
/******/ ]);