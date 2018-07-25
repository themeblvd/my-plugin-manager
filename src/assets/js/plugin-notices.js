import $ from 'jquery';
import { namespace } from '../../../build-config';

$(document).ready($ => {
  const $notice = $('.plugin-manager-notice');

  $notice.find('.notice-dismiss').each(function() {
    const $el = $(this);
    $el.attr('title', $el.closest('.notice').data('dismiss'));
  });

  $notice.on('click', '.notice-dismiss', function() {
    const args = {
      _ajax_nonce: $notice.data('security'),
      action: `${namespace}-dismiss-notice`,
      namespace: $notice.data('namespace'),
      notice_key: $notice.data('notice-key'),
      notice_value: $notice.data('notice-value')
    };

    $.post(ajaxurl, args);
  });
});
