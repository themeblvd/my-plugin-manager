<?php
/**
 * Plugin Formatting and Storage
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

if ( ! class_exists( 'Theme_Blvd_Plugins' ) ) {

	/**
	 * Handles formatting and storing suggested
	 * plugins.
	 *
	 * @since 1.0.0
	 */
	class Theme_Blvd_Plugins {

		/**
		 * All initial, unformatted plugins.
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		private $pre_plugins = array();

		/**
		 * All formatted suggested plugins.
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		private $plugins = array();

		/**
		 * Plugin manager object.
		 *
		 * @since 1.0.0
		 * @var   My_Plugin_Manager
		 */
		private $manager;

		/**
		 * Class constructor.
		 *
		 * @param array             $pre_plugins Suggested plugins to format.
		 * @param My_Plugin_Manager $manager     Plugin manager object.
		 */
		public function __construct( $pre_plugins, $manager ) {

			$this->pre_plugins = $pre_plugins;

			$this->manager = $manager;

			/*
			 * Setup plugins. The formatting for this must get
			 * hooked later in the WordPress loading process to
			 * make use of /wp-admin/includes/plugin.php.
			 */
			add_action( 'current_screen', array( $this, 'set' ) );

		}

		/**
		 * Consistently format plugins and add some
		 * helpful info.
		 *
		 * @since 1.0.0
		 */
		public function set() {

			/*
			 * If we're loading our admin screen, we can refresh
			 * the WordPress plugin update cache to show the
			 * latest results.
			 */
			if ( $this->manager->is_admin_screen() ) {
				wp_update_plugins();
			}

			/*
			 * Get all currently installed plugins, that exist
			 * from suggested plugin list, including which have
			 * updates ready to install.
			 */
			$installed = $this->get_installed();

			/*
			 * Loop through passed in plugins, looking for matches
			 * with installed plugins, and store results to $plugins.
			 */
			foreach ( $this->pre_plugins as $plugin ) {

				$info = array();

				if ( array_key_exists( $plugin['slug'], $installed ) ) {
					$info = $installed[ $plugin['slug'] ];
				}

				$this->add( $plugin, $info );

			}

			// Alphabatize plugins by slug.
			ksort( $this->plugins );

		}

		/**
		 * Check if plugins have been setup and formatted.
		 *
		 * @since 1.0.0
		 *
		 * @return bool If $plugins has been properly setup.
		 */
		public function is_set() {

			if ( $this->plugins ) {
				return true;
			}

			return false;

		}

		/**
		 * Format and store plugin to $this->plugins.
		 *
		 * The "status" of a plugin can be one of the following:
		 *
		 * 1. `not-installed` It's simply not installed.
		 * 2. `inactive`      Installed, but not activated yet.
		 * 3. `incompatible`  Activated, but installed version is less than suggested version.
		 * 4. `active`        Installed, activated and compatible.
		 *
		 * Note: The `incompatible` status will only be applied
		 * if the current version is less than the suggsted version;
		 * it will NOT be applied simply because WordPress says
		 * the plugin has an update available.
		 *
		 * The final stored plugin data will be an array formatted,
		 * as follows.
		 *
		 * $plugin {
		 *     @type string $name            Name of plugin, like `My Plugin`.
		 *     @type string $slug            Slug of plugin, like `my-plugin`.
		 *     @type string $url             URL to plugin website, ONLY if not on wordpress.org.
		 *     @type string $version         Suggested plugin version, like `2.0+`.
		 *     @type string $current_version Current installed version of plugin.
		 *     @type string $new_version     Latest available version of plugin.
		 *     @type string $file            Plugin file, like `my-plugin/my-plugin.php`.
		 *     @type string $status          Plugin status key (see above).
		 *     @type bool   $update          Whether WordPress says the plugin has an update available.
		 *     @type array  $notice {
		 *          Optional. Notice for plugin, if needed.
		 *
		 *          @type string $message Message for notice.
		 *          @type string $class   CSS class(es) for notice.
		 *     }
		 * }
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugin {
		 *     Plugin info from initial object creation.
		 *
		 *     @type string $name    Name of plugin, like `My Plugin`.
		 *     @type string $slug    Slug of plugin, like `my-plugin`.
		 *     @type string $url     URL to plugin website, ONLY if not on wordpress.org.
		 *     @type string $version Suggested plugin version, like `2.0+`.
		 * }
		 * @param array $info {
		 *     Optional. Plugin info from WP, if installed.
		 *
		 *     @type string $file            Location of plugin file.
		 *     @type string $current_version Current installed version.
		 *     @type string $new_version     Newest version available.
		 *     @type bool   $is_active       Whether plugin is active.
		 * }
		 */
		public function add( $plugin, $info = null ) {

			// Merge initial plugin data with data abstract.
			$plugin = array_merge( array(
				'name'            => null,
				'slug'            => null,
				'url'             => null,
				'version'         => null,
				'current_version' => null,
				'new_version'     => null,
				'file'            => null,
				'status'          => 'not-installed',
				'update'          => false,
				'notice'          => '',
			), $plugin );

			/*
			 * If installed data is null, it means it hasn't been
			 * attempted to be retrieved. If it has been retrieved
			 * but was empty (i.e plugin isn't' installed), then
			 * an empty array should be passed for $info.
			 */
			if ( null === $info ) {

				$installed = $this->get_installed();

				if ( array_key_exists( $plugin['slug'], $installed ) ) {
					$info = $installed[ $plugin['slug'] ];
				}
			}

			/*
			 * At this point, if $info is empty the plugin status
			 * shall remain as 'not-installed' and the following
			 * setup will be skipped.
			 */
			if ( $info ) {

				// Add plugin file location.
				if ( ! empty( $info['file'] ) ) {
					$plugin['file'] = $info['file'];
				}

				// Add currently installed version.
				if ( ! empty( $info['current_version'] ) ) {
					$plugin['current_version'] = $info['current_version'];
				}

				// Add latest available version to check against current.
				if ( ! empty( $info['new_version'] ) ) {
					$plugin['new_version'] = $info['new_version'];
				}

				// Set plugin status.
				if ( ! empty( $info['is_active'] ) ) {

					if ( version_compare( $plugin['version'], $plugin['current_version'], '>' ) ) {
						$plugin['status'] = 'incompatible';
					} else {
						$plugin['status'] = 'active';
					}
				} else {

					$plugin['status'] = 'inactive';

				}

				// Add plugin notice for available update.
				if ( version_compare( $plugin['new_version'], $plugin['current_version'], '>' ) ) {

					$plugin['update'] = true;

				}
			}

			if ( ! $plugin['url'] ) {

				$plugin['url'] = 'https://wordpress.org/plugins/' . $plugin['slug'];

			}

			// Store final, formatted plugin.
			$this->plugins[ $plugin['slug'] ] = $plugin;

		}

		/**
		 * Get data for a plugin, or data for all plugins.
		 *
		 * @since 1.0.0
		 *
		 * @param  string     $slug Optional. Slug of plugin to retrieve data for. Leave empty for all plugins.
		 * @return array|bool       Data for all plugins, data for single plugin, or `false` if single plugin doesn't exist.
		 */
		public function get( $slug = '' ) {

			if ( ! $slug ) {
				return $this->plugins;
			}

			if ( isset( $this->plugins[ $slug ] ) ) {
				return $this->plugins[ $slug ];
			}

			return false;

		}

		/**
		 * Match installed plugins from WordPress against
		 * our suggested plugins, to return information
		 * for our suggested plugins, wnich are currently
		 * installed.
		 *
		 * @since 1.0.0
		 *
		 * @return array $installed Installed plugin that are suggested.
		 */
		public function get_installed() {

			// Create array of our suggested plugin slugs.
			$slugs = array();

			foreach ( $this->pre_plugins as $plugin ) {
				$slugs[] = $plugin['slug'];
			}

			// Gather installed plugins from our suggested plugins.
			$installed = array();

			$plugins = get_plugins();

			foreach ( $plugins as $key => $plugin ) {

				$data = get_plugin_data( WP_PLUGIN_DIR . '/' . $key );

				$slug = dirname( plugin_basename( $key ) );

				if ( ! in_array( $slug, $slugs ) ) {
					continue;
				}

				$installed[ $slug ] = array(
					'slug'            => $slug,
					'file'            => $key,
					'current_version' => $data['Version'],
					'new_version'     => $data['Version'],
					'is_active'       => is_plugin_active( $key ),
				);

			}

			// Determine which of those installed plugins have an update.
			$plugin_updates = get_site_transient( 'update_plugins' );

			if ( isset( $plugin_updates->response ) ) {

				foreach ( $plugin_updates->response as $plugin ) {

					if ( ! in_array( $plugin->slug, $slugs ) ) {
						continue;
					}

					$installed[ $plugin->slug ]['new_version'] = $plugin->new_version;

				}
			}

			return $installed;

		}

	}
}
