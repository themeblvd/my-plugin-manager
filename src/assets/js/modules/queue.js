import { l10n } from './vars';
import { setCurrentAction, installPlugin, updatePlugin, deletePlugin, refreshRow } from './actions';

/**
 * Queue of plugins to bulk process.
 *
 * @since 1.0.0
 *
 * @type {array}
 */
const queue = [];

/**
 * When performing bulk actions, this will provide a way to
 * iterate through the queue of plugins synchronously to
 * take action on.
 *
 * @since 1.0.0
 */
const processQueue = () => {
  if (!queue.length) {
    return;
  }

  const current = queue[0];
  const action = current.action;
  const $row = current.row;

  queue.shift();

  if ('install-selected' === action) {
    $row
      .addClass('updating-message')
      .find('.row-actions')
      .text(l10n.installing);

    setCurrentAction('install-plugin');

    if ('third-party' === $row.data('source')) {
      /*
       * We can only install plugins from wordpress.org.
       * So, we'll just bypass to refreshing the row
       * with an error message.
       */
      refreshRow({
        slug: current.slug,
        plugin: current.plugin,
        errorMessage: l10n.thirdParty,
        errorLevel: 'warning'
      });
    } else {
      installPlugin({
        slug: current.slug
      });
    }
  } else if ('update-selected' === action) {
    $row
      .addClass('updating-message')
      .find('.row-actions')
      .text(l10n.updating);

    setCurrentAction('update-plugin');

    if ('not-installed' === $row.data('status')) {
      /*
       * We can't update a plugin that's not installed. So,
       * we'll just bypass to refreshing the row with an
       * error message.
       */
      refreshRow({
        slug: current.slug,
        plugin: current.plugin,
        errorMessage: l10n.notInstalled,
        errorLevel: 'warning'
      });
    } else {
      updatePlugin({
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
      refreshRow({
        slug: current.slug,
        plugin: current.plugin
      });
    } else {
      $row
        .addClass('updating-message')
        .find('.row-actions')
        .text(l10n.deleting);

      setCurrentAction('delete-plugin');

      deletePlugin({
        slug: current.slug,
        plugin: current.plugin
      });
    }
  }
};

/**
 * Exports
 */
export { queue, processQueue };
