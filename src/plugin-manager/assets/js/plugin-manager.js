( function( $, wp ) {

	if ( 'undefined' === typeof wp ) {
		return;
	}

	if ( 'undefined' === typeof wp.updates ) {
		return;
	}

	var $document = $( document );

	/**
	 * The Plugin Manger object.
	 *
	 * @since 1.0.0
	 *
	 * @type {object}
	 */
	var pluginManager = {};

	/**
	 * Localized strings from WordPress's updates
	 * script, merged with any added by the
	 * plugin manager.
	 *
	 * @since 1.0.0
	 *
	 * @type {object}
	 */
	pluginManager.l10n = $.extend( pluginManagerSettings, wp.updates.l10n );

	/**
	 * Current action being processed.
	 *
	 * @since 1.0.0
	 *
	 * @type {string}
	 */
	pluginManager.currentAction = null;

	/**
	 * Keep track of the current namespace.
	 *
	 * @since 1.0.0
	 *
	 * @type {string}
	 */
	pluginManager.namespace = null;

	/**
	 * Queue of plugins to bulk process.
	 *
	 * @since 1.0.0
	 *
	 * @type {array}
	 */
	pluginManager.queue = [];

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
	pluginManager.installPlugin = function( args ) {

		args = _.extend( {
			success: pluginManager.refreshRow,
			error: pluginManager.refreshRow
		}, args );

		$document.trigger( 'wp-plugin-installing', args );

		return wp.updates.ajax( 'install-plugin', args );

	}

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
	pluginManager.updatePlugin = function( args ) {

		args = _.extend( {
			success: pluginManager.refreshRow,
			error: pluginManager.refreshRow
		}, args );

		$document.trigger( 'wp-plugin-updating', args );

		return wp.updates.ajax( 'update-plugin', args );

	}

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
	pluginManager.deletePlugin = function( args ) {

		args = _.extend( {
			success: pluginManager.refreshRow,
			error: pluginManager.refreshRow
		}, args );

		$document.trigger( 'wp-plugin-deleting', args );

		return wp.updates.ajax( 'delete-plugin', args );

	}

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
	pluginManager.refreshRow = function( response ) {

		var args = {
			_ajax_nonce: wp.updates.ajaxNonce,
			action: 'plugin-manager-row-refresh',
			prev_action: pluginManager.currentAction,
			slug: response.slug,
			namespace: pluginManager.namespace,
			error: null,
			error_level: 'error' // `error` or `warning`
		};

		// Handle error message
		if ( response.errorMessage ) {

			if ( 'update-plugin' === args.prev_action && response.debug ) {
				args.error = response.debug[0]; // More helpful message.
				args.error_level = 'warning';
			} else {
				args.error = response.errorMessage;
			}

			if ( response.errorLevel ) {
				args.error_level = response.errorLevel;
			}

		}

		var $old_row = $( 'tr[data-slug="' + args.slug + '"]' );

		// Refresh row from plugin manager.
		$.post( ajaxurl, args, function( response ) {

			$( '#setting-error-plugin-manager-error' ).remove(); // Remove any lingering notices in page header, from previously finished actions.

			$( '.' + args.slug + '-notice' ).remove(); // Remove notice on current row, if exists.

			$( 'tr[data-slug="' + args.slug + '"]' ).replaceWith( response );

			var $new_row = $( 'tr[data-slug="' + args.slug + '"]' );

			if ( $new_row.hasClass( 'ajax-success' ) ) {

				setTimeout( function() {

					$new_row.removeClass( 'install-success update-success delete-success' );

				}, 200 );

			}

			// Clear current action.
			pluginManager.currentAction = null;

			// Continue processing any bulk actions, if they exist.
			pluginManager.processQueue();

		} );

	};

	/**
	 * When performing bulk actions, this will provide a way to
	 * iterate through the queue of plugins synchronously to
	 * take action on.
	 *
	 * @since 1.0.0
	 */
	pluginManager.processQueue = function() {

		if ( ! pluginManager.queue.length ) {
			return;
		}

		var current = pluginManager.queue[0],
			action  = current.action,
			$row    = current.row;

		pluginManager.queue.shift();

		if ( 'install-selected' === action ) {

			$row
				.addClass( 'updating-message' )
				.find( '.row-actions' )
				.text( pluginManager.l10n.installing );

			pluginManager.currentAction = 'install-plugin';

			if ( 'third-party' === $row.data( 'source' ) ) {

				/*
				 * We can only install plugins from wordpress.org.
				 * So, we'll just bypass to refreshing the row
				 * with an error message.
				 */
				pluginManager.refreshRow( {
					slug: current.slug,
					plugin: current.plugin,
					errorMessage: pluginManager.l10n.thirdParty,
					errorLevel: 'warning'
				} );

			} else {

				pluginManager.installPlugin( {
					slug: current.slug
				} );

			}

		} else if ( 'update-selected' === action ) {

			$row
				.addClass( 'updating-message' )
				.find( '.row-actions' )
				.text( pluginManager.l10n.updating );

			pluginManager.currentAction = 'update-plugin';

			if ( 'not-installed' === $row.data( 'status' ) ) {

				/*
				 * We can't update a plugin that's not installed. So,
				 * we'll just bypass to refreshing the row with an
				 * error message.
				 */
				pluginManager.refreshRow( {
					slug: current.slug,
					plugin: current.plugin,
					errorMessage: pluginManager.l10n.notInstalled,
					errorLevel: 'warning'
				} );

			} else {

				pluginManager.updatePlugin( {
					slug: current.slug,
					plugin: current.plugin
				} );

			}

		} else if ( 'delete-selected' === action ) {

			if ( 'not-installed' == $row.data( 'status' ) ) {

				/*
				 * If we're deleting a plugin that's not actually
				 * installed, we'll just refresh the row to clear
				 * any previous notices. No error message needed.
				 *
				 * Note: By not setting pluginManager.currentAction,
				 * there's no visual success or error animation
				 * added to the refreshed row.
				 */
				pluginManager.refreshRow( {
					slug: current.slug,
					plugin: current.plugin
				} );

			} else {

				$row
					.addClass( 'updating-message' )
					.find( '.row-actions' )
					.text( pluginManager.l10n.deleting );

				pluginManager.currentAction = 'delete-plugin';

				pluginManager.deletePlugin( {
					slug: current.slug,
					plugin: current.plugin
				} );

			}

		}

	}

	$document.ready( function( $ ) {

		var $page = $( '#suggested-plugins' );

		pluginManager.namespace = $page.find( 'form' ).data( 'namespace' );

		/**
		 * Handles installing a plugin from clicking `.install-now`
		 * link.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event} event Event interface.
		 */
		$page.on( 'click', '.install-now', function( event ) {

			event.preventDefault();

			var $link = $( event.target ),
				$row  = $link.closest( 'tr' );

			if ( $row.hasClass( 'updating-message' ) ) {
				return;
			}

			$row
				.addClass( 'updating-message' )
				.find( '.row-actions' )
				.text( pluginManager.l10n.installing );

			pluginManager.currentAction = 'install-plugin';

			pluginManager.installPlugin( {
				slug: $row.data( 'slug' )
			} );

		} );

		/**
		 * Handles updating a plugin from clicking `.update-now`
		 * link.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event} event Event interface.
		 */
		$page.on( 'click', '.update-now', function( event ) {

			event.preventDefault();

			var $link = $( event.target ),
				$row  = $link.closest( 'tr' );

			if ( $row.hasClass( 'updating-message' ) ) {
				return;
			}

			$row
				.addClass( 'updating-message' )
				.find( '.row-actions' )
				.text( pluginManager.l10n.updating );

			pluginManager.currentAction = 'update-plugin';

			pluginManager.updatePlugin( {
				slug: $row.data( 'slug' ),
				plugin: $row.data( 'plugin' )
			} );

		} );

		/**
		 * Handles installing a plugin from clicking `.delete-now`
		 * link.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event} event Event interface.
		 */
		$page.on( 'click', '.delete-now', function( event ) {

			event.preventDefault();

			var $link = $( event.target ),
				$row  = $link.closest( 'tr' );

			if ( $row.hasClass( 'updating-message' ) ) {
				return;
			}

			if ( ! window.confirm( wp.updates.l10n.aysDeleteUninstall.replace( '%s', $row.find( '.plugin-title strong' ).text() ) ) ) {
				return;
			}

			$row
				.addClass( 'updating-message' )
				.find( '.row-actions' )
				.text( pluginManager.l10n.deleting );

			pluginManager.currentAction = 'delete-plugin';

			pluginManager.deletePlugin( {
				slug: $row.data( 'slug' ),
				plugin: $row.data( 'plugin' )
			} );

		} );

		/**
		 * Handles the submission of the Bulk Actions.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event} event Event interface.
		 */
		$page.on( 'click', '#do-action-top, #do-action-bottom', function( event ) {

			event.preventDefault();

			var $button = $( this ),
				action  = $button.prev( 'select' ).val(),
				$form   = $button.closest( 'form' );

			if ( 'activate-selected' == action || 'deactivate-selected' == action ) {
				$form.submit();
				return;
			}

			$form.find( 'input[name="checked[]"]:checked' ).each( function () {

				var $checkbox = $( this ),
					$row = $checkbox.closest( 'tr' );

				pluginManager.queue.push({
					row: $row,
					slug: $checkbox.val(),
					plugin: $row.data( 'plugin' ),
					action: action
				} );

			} );

			$form.find( 'input[type="checkbox"]' ).attr( 'checked', false );

			$form.find( 'select' ).val( '-1' );

			pluginManager.processQueue();

		} );

	} );

})( jQuery, window.wp );
