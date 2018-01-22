<?php
/**
 * Plugin Manager Notices
 *
 * @version    1.0.2
 * @author     Jason Bobich, Theme Blvd
 * @copyright  2009-2017 Theme Blvd
 * @link       http://mypluginmanager.com
 * @link       http://themeblvd.com
 * @package    Theme_Blvd
 * @subpackage My_Plugin_Manager
 * @license    GPL-2.0+
 */

if ( ! class_exists( 'Theme_Blvd_Plugin_Notices' ) ) {

	/**
	 * Handles important user notices across the
	 * entire admin about suggested plugins.
	 *
	 * @since 1.0.0
	 */
	class Theme_Blvd_Plugin_Notices {

		/**
		 * Any notices that need to be displayed across the
		 * entire admin.
		 *
		 * This is an array of notice slugs like `install`
		 * and `update`.
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		private $notices = array();

		/**
		 * Arguments needed for object.
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		private $args = array();

		/**
		 * Object containing plugin manager.
		 *
		 * @since 1.0.0
		 * @var   My_Plugin_Manager
		 */
		private $manager;

		/**
		 * Object containing all plugin data.
		 *
		 * @since 1.0.0
		 * @var   My_Plugins
		 */
		private $plugins;

		/**
		 * Class constructor.
		 *
		 * @param array                    $args {
		 *     Arguments required for object.
		 *
		 *     @type string $admin_url            URL to plugin manager.
		 *     @type string $package_url          URL to drop-in package.
		 *     @type string $nag_action           Text to lead user to manage suggested plugins.
		 *     @type string $nag_dismiss          Text to dismiss admin notice.
		 *     @type string $nag_update           Text to tell user there are incompatible plugins that need updating.
		 *     @type string $nag_install_single   Text to tell user there is a suggested plugins to install.
		 *     @type string $nag_install_multiple Text to tell user there are suggested plugins to install.
		 * }
		 * @param My_Plugin_Manager $manager Plugin manager object.
		 * @param My_Plugins        $plugins Plugins object.
		 */
		public function __construct( $args, $manager, $plugins ) {

			$this->args = wp_parse_args( $args, array(
				'package_name'         => '',
				'package_url'          => '',
				'admin_url'            => '',
				'nag_action'           => '',
				'nag_dismiss'          => '',
				'nag_update'           => '',
				'nag_install_single'   => '',
				'nag_install_multiple' => '',
			));

			$this->manager = $manager;

			$this->plugins = $plugins;

			// Determine admin-wide notices.
			add_action( 'admin_enqueue_scripts', array( $this, 'set_notices' ) );

			// Print necessary scripts for admin-wide notices.
			add_action( 'admin_enqueue_scripts', array( $this, 'add_assets' ) );

			// Display admin-wide notices.
			add_action( 'admin_notices', array( $this, 'add_notices' ) );

			// Handle notice dismissals through Ajax.
			add_action( 'wp_ajax_plugin-manager-dismiss-notice', array( $this, 'dismiss' ) );

		}

		/**
		 * Sets admin plugin notices, which are seen
		 * throughout the entire admin.
		 *
		 * @since 1.0.0
		 */
		public function set_notices() {

			// DEBUG:
			// delete_user_meta( get_current_user_id(), 'themeblvd-dismiss-plugin-notice_update' );
			// delete_user_meta( get_current_user_id(), 'themeblvd-dismiss-plugin-notice_install' );

			$this->notices = array();

			/*
			 * Because our notices are intended to lead the user to
			 * our admin screen, the notices should show everywhere
			 * except our admin screen.
			 */
			if ( $this->manager->is_admin_screen() ) {
				return;
			}

			$plugins = $this->plugins->get();

			/*
			 * If necessary, add notice to install plugins.
			 *
			 * If the message hasn't been dismissed, this will tell the
			 * user how many suggested plugins have the `not-installed`
			 * status.
			 */
			$to_install = array();

			foreach ( $plugins as $plugin ) {
				if ( 'not-installed' === $plugin['status'] ) {
					$to_install[] = $plugin['slug'];
				}
			}

			if ( $to_install ) {

				/*
				 * For the install notice, we want to use all suggested
				 * plugins, and not just the count of plugins still to
				 * be installed.
				 *
				 * This is so if the user dimisses the notice, they won't
				 * see it again by installing and uninstalling plugins.
				 * However, they will see it if the theme author adds
				 * more suggested plugins.
				 */
				$check = implode( ',', array_keys( $plugins ) ); // All suggested plugins, not just those in $to_install.

				if ( get_user_meta( get_current_user_id(), 'themeblvd-dismiss-plugin-notice_install', true ) !== $check ) {

					$count = count( $to_install );

					if ( 0 === $count || $count >= 2 ) {
						$plural = 'multiple';
					} else {
						$plural = 'single';
					}

					$this->notices['install']['message'] = sprintf(
						$this->args[ 'nag_install_' . $plural ],
						$this->args['package_name'],
						$count
					);

					$this->notices['install']['value'] = $check;

				}
			}

			/*
			 * If necessary, add notice to update plugins.
			 *
			 * If the message hasn't been dismissed, this will tell the
			 * user how many plugins have status `incompatible`.
			 *
			 * For a plugin to be marked incompatible, it must be active
			 * and it's suggested version must be higher than its
			 * installed version.
			 */
			$to_update = array();

			foreach ( $plugins as $plugin ) {
				if ( 'incompatible' === $plugin['status'] ) {
					$to_update[] = $plugin['slug'];
				}
			}

			if ( $to_update ) {

				/*
				 * For the update notice, we want the notice to appear
				 * any time the string of incompatible plugins changes.
				 */
				$check = implode( ',', $to_update );

				if ( get_user_meta( get_current_user_id(), 'themeblvd-dismiss-plugin-notice_update', true ) !== $check ) {

					$this->notices['update']['message'] = sprintf(
						$this->args['nag_update'],
						$this->args['package_name']
					);

					$this->notices['update']['value'] = $check;

				}
			}

		}

		/**
		 * Add any assets needed for plugin notices.
		 *
		 * @since 1.0.0
		 */
		public function add_assets() {

			if ( ! $this->notices ) {
				return;
			}

			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			wp_enqueue_script(
				'themeblvd-plugin-notices',
				esc_url( $this->args['package_url'] . "/assets/js/plugin-notices$suffix.js" ),
				array( 'jquery' )
			);

		}

		/**
		 * Handles admin plugin notices, which are seen
		 * throughout the entire admin.
		 *
		 * @since 1.0.0
		 */
		public function add_notices() {

			if ( $this->notices ) {

				foreach ( $this->notices as $key => $data ) {

					$this->display( $key, $data['value'], $data['message'] );

				}
			}

		}

		/**
		 * Display custom admin notice.
		 *
		 * @since 1.0.0
		 */
		public function display( $key, $value, $message ) {

			$class = 'plugin-manager-notice notice is-dismissible';

			if ( 'update' === $key ) {
				$class .= ' notice-warning';
			} else {
				$class .= ' notice-info';
			}

			$nonce = wp_create_nonce( 'plugin-manager-dismiss-notice_' . $key );

			$action_link = sprintf(
				'<a href="%1$s">%2$s</a>',
				esc_url( $this->args['admin_url'] ),
				esc_html( $this->args['nag_action'] )
			);

			$dismiss_link = sprintf(
				'<a href="%1$s">%2$s</a>',
				esc_url( $this->args['admin_url'] ),
				esc_html( $this->args['nag_dismiss'] )
			);

			?>
			<div id="themeblvd-plugin-<?php echo esc_attr( $key ); ?>-notice" class="<?php echo $class; ?>" data-notice-key="<?php echo esc_attr( $key ); ?>" data-notice-value="<?php echo esc_attr( $value ); ?>" data-security="<?php echo esc_attr( $nonce ); ?>" data-namespace="themeblvd" data-dismiss="<?php echo esc_attr( $this->args['nag_dismiss'] ); ?>">

				<p><?php echo esc_html( $message ); ?></p>

				<p><?php echo $action_link; ?></a></p>

			</div>
			<?php

		}

		/**
		 * Dimiss admin notices via Ajax.
		 *
		 * @since 1.0.0
		 */
		public function dismiss() {

			/*
			 * Check to make sure this action belongs to current
			 * object.
			 *
			 * This may seem a bit weird. - Because of how we generate
			 * the package files for authors, we're keeping the ajax action
			 * generically named `plugin-manager-dismiss-notice`.
			 *
			 * So, in the event multiple instances of our generated objects
			 * have hooked to `wp_ajax_plugin-manager-dismiss-notice`,
			 * we'll double check the namespace to make sure the right
			 * message gets dismissed.
			 */
			if ( empty( $_POST['namespace'] ) || 'themeblvd' !== $_POST['namespace'] ) {
				return;
			}

			check_ajax_referer( 'plugin-manager-dismiss-notice_' . $_POST['notice_key'] );

			if ( ! current_user_can( 'install_plugins' ) ) {
				wp_die();
			}

			if ( ! current_user_can( 'update_plugins' ) ) {
				wp_die();
			}

			update_user_meta(
				get_current_user_id(),
				'themeblvd-dismiss-plugin-notice_' . $_POST['notice_key'],
				$_POST['notice_value']
			);

			wp_die();

		}
	}
}
