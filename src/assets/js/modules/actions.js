import $ from 'jquery';
import { updates } from 'wp';
import { namespace } from '../../../../build-config';
import { $document } from './vars';
import { processQueue } from './queue';

/**
 * Keep track of the current action
 * taking place.
 *
 * @type {string}
 */
let currentAction = null;

/**
 * Set the current action.
 *
 * @param {string} action Action slug or null.
 */
const setCurrentAction = action => {
  currentAction = action;
};

/**
 * Get the current action.
 *
 * @return {string} Current action.
 */
const getCurrentAction = () => {
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
const installPlugin = args => {
  args = {
    ...args,
    success: refreshRow,
    error: refreshRow
  };

  $document.trigger('wp-plugin-installing', args);

  return updates.ajax('install-plugin', args);
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
const updatePlugin = args => {
  args = {
    ...args,
    success: refreshRow,
    error: refreshRow
  };

  $document.trigger('wp-plugin-updating', args);

  return updates.ajax('update-plugin', args);
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
const deletePlugin = args => {
  args = {
    ...args,
    success: refreshRow,
    error: refreshRow
  };

  $document.trigger('wp-plugin-deleting', args);

  return updates.ajax('delete-plugin', args);
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
const refreshRow = response => {
  const args = {
    _ajax_nonce: updates.ajaxNonce,
    action: `${namespace}-row-refresh`,
    prev_action: getCurrentAction(),
    slug: response.slug,
    namespace: namespace,
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

  const $old_row = $('tr[data-slug="' + args.slug + '"]');

  // Refresh row from plugin manager.
  $.post(ajaxurl, args, response => {
    $('#setting-error-plugin-manager-error').remove(); // Remove any lingering notices in page header, from previously finished actions.

    $('.' + args.slug + '-notice').remove(); // Remove notice on current row, if exists.

    $('tr[data-slug="' + args.slug + '"]').replaceWith(response);

    const $new_row = $('tr[data-slug="' + args.slug + '"]');

    if ($new_row.hasClass('ajax-success')) {
      setTimeout(() => {
        $new_row.removeClass('install-success update-success delete-success');
      }, 200);
    }

    // Clear current action.
    setCurrentAction(null);

    // Continue processing any bulk actions, if they exist.
    processQueue();
  });
};

/**
 * Exports
 */
export {
  setCurrentAction,
  getCurrentAction,
  installPlugin,
  updatePlugin,
  deletePlugin,
  refreshRow
};
