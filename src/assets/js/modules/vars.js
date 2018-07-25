import $ from 'jquery';
import { updates } from 'wp';
import settings from 'settings';

/**
 * Cache the jQuery document.
 *
 * @since 1.0.0
 *
 * @type {object}
 */
export const $document = $(document);

/**
 * Localized strings from WordPress's updates
 * script, merged with any added by the
 * plugin manager.
 *
 * @since 1.0.0
 *
 * @type {object}
 */
export const l10n = $.extend(settings, updates.l10n);
