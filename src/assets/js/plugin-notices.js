(function( $ ) {

	"use strict";

	$( document ).ready( function( $ ) {

		var $notice = $( '.plugin-manager-notice' );

		$notice.find( '.notice-dismiss' ).each( function() {

			var $el = $( this );

			$el.attr( 'title', $el.closest( '.notice' ).data( 'dismiss' ) );

		} );

		$notice.on( 'click', '.notice-dismiss', function() {

			var $notice = $( this ).closest( '.notice' );

			var args = {
				_ajax_nonce: $notice.data( 'security' ),
				action: 'plugin-manager-dismiss-notice',
				namespace: $notice.data( 'namespace' ),
				notice_key: $notice.data( 'notice-key' ),
				notice_value: $notice.data( 'notice-value' )
			};

			$.post( ajaxurl, args );

		} );

	});

})( jQuery );
