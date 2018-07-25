import $ from 'jquery';
import { updates } from 'wp';
import { namespace } from '../../../build-config';
import { $document, l10n } from './modules/vars';
import { queue, processQueue } from './modules/queue';
import {
  setCurrentAction,
  installPlugin,
  updatePlugin,
  deletePlugin,
  refreshRow
} from './modules/actions';

$document.ready($ => {
  const $page = $('#suggested-plugins');

  /**
   * Handles installing a plugin from clicking `.install-now`
   * link.
   *
   * @since 1.0.0
   *
   * @param {Event} event Event interface.
   */
  $page.on('click', '.install-now', function(event) {
    event.preventDefault();

    const $link = $(event.target);
    const $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    $row
      .addClass('updating-message')
      .find('.row-actions')
      .text(l10n.installing);

    setCurrentAction('install-plugin');

    installPlugin({
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
  $page.on('click', '.update-now', function(event) {
    event.preventDefault();

    const $link = $(event.target);
    const $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    $row
      .addClass('updating-message')
      .find('.row-actions')
      .text(l10n.updating);

    setCurrentAction('update-plugin');

    updatePlugin({
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
  $page.on('click', '.delete-now', function(event) {
    event.preventDefault();

    const $link = $(event.target);
    const $row = $link.closest('tr');

    if ($row.hasClass('updating-message')) {
      return;
    }

    if (
      !window.confirm(
        updates.l10n.aysDeleteUninstall.replace('%s', $row.find('.plugin-title strong').text())
      )
    ) {
      return;
    }

    $row
      .addClass('updating-message')
      .find('.row-actions')
      .text(l10n.deleting);

    setCurrentAction('delete-plugin');

    deletePlugin({
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
  $page.on('click', '#do-action-top, #do-action-bottom', function(event) {
    event.preventDefault();

    const $button = $(this);
    const action = $button.prev('select').val();
    const $form = $button.closest('form');

    if ('activate-selected' == action || 'deactivate-selected' == action) {
      $form.submit();
      return;
    }

    $form.find('input[name="checked[]"]:checked').each(function() {
      const $checkbox = $(this);
      const $row = $checkbox.closest('tr');

      queue.push({
        row: $row,
        slug: $checkbox.val(),
        plugin: $row.data('plugin'),
        action: action
      });
    });

    $form.find('input[type="checkbox"]').attr('checked', false);

    $form.find('select').val('-1');

    processQueue();
  });
});
