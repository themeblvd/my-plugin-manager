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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _build_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _build_config__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_build_config__WEBPACK_IMPORTED_MODULE_1__);



jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).ready(function ($) {
  var $notice = $('.plugin-manager-notice');

  $notice.find('.notice-dismiss').each(function () {
    var $el = $(this);
    $el.attr('title', $el.closest('.notice').data('dismiss'));
  });

  $notice.on('click', '.notice-dismiss', function () {
    var args = {
      _ajax_nonce: $notice.data('security'),
      action: _build_config__WEBPACK_IMPORTED_MODULE_1__["namespace"] + '-dismiss-notice',
      namespace: $notice.data('namespace'),
      notice_key: $notice.data('notice-key'),
      notice_value: $notice.data('notice-value')
    };

    $.post(ajaxurl, args);
  });
});

/***/ })
/******/ ]);