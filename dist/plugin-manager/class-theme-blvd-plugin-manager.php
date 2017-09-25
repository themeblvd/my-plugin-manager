<?php
/**
 * Plugin Manager Interface
 *
 * This is drop-in directory that can be added to
 * themes or plugins, to help suggest and manage
 * other plugin dependencies.
 *
 * Please make MY plugin manager YOUR plugin
 * manager, by generating your own custom implemenation
 * at http://mypluginmanager.com.
 *
 * And when running YOUR plugin manager, you'll include
 * just this file. The class contained here will take
 * care of including other required classes and
 * instantiating their objects. See more about class
 * in docs below.
 *
 * @version    1.0.1
 * @author     Jason Bobich, Theme Blvd
 * @copyright  2009-2017 Theme Blvd
 * @link       http://mypluginmanager.com
 * @link       http://themeblvd.com
 * @package    Theme_Blvd
 * @subpackage My_Plugin_Manager
 * @license    GPL-2.0+
 */

if ( ! class_exists( 'Theme_Blvd_Plugin_Manager' ) ) {

	/**
	 * Plugin manager class.
	 *
	 * This class is responsible for the following:
	 *
	 * 1. Sets up the admin page up to manage the
	 * plugins recommended by the package.
	 *
	 * 2. Handles installation, updating, activating,
	 * and deactivating of suggested plugins, using
	 * primary built-in WordPress functionality.
	 *
	 * 3. Includes the Theme_Blvd_Plugins class and instantiates
	 * the object for holding suggested plugins.
	 *
	 * 4. Includes the Theme_Blvd_Plugin_Notices class and
	 * instantiates the object to display notices to the
	 * user across all admin pages, EXCEPT the one we
	 * added by Theme_Blvd_Plugin_Manager.
	 *
	 * 5. Adds link to our admin page from the standard
	 * `Plugins` screen.
	 *
	 * 6. Adds link to our admin page from the
	 * `Plugins > Add New` screen.
	 *
	 * @since 1.0.0
	 */
	class Theme_Blvd_Plugin_Manager {

		/**
		 * Optional class options.
		 *
		 * @since 1.0.0
		 * @see set_args()
		 * @var array
		 */
		private $args = array();

		/**
		 * Information for package where drop-in is contained.
		 *
		 * @since 1.0.0
		 * @see   set_package()
		 * @var   array
		 */
		private $package;

		/**
		 * Formatted plugins object.
		 *
		 * @since 1.0.0
		 * @var   My_Plugins
		 */
		private $plugins = array();

		/**
		 * Admin screen base ID to match against
		 * get_current_screen().
		 *
		 * @since 1.0.0
		 * @var   string
		 */
		private $admin_screen_base;

		/**
		 * Class constructor.
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugins Initial, unformatted suggested plugins.
		 * @param array $args {
		 *     Optional. Overriding class options.
		 *
		 *     @type string $page_title     Title for admin page.
		 *     @type string $views_title    Title used for subtle link on Plugins page.
		 *     @type string $extended_title A more descriptive title.
		 *     @type string $tab_title      Title for plugin installer tab.
		 *     @type string $menu_title     Title for admin sidebar menu.
		 *     @type string $menu_slug      Slug used for admin page URL.
		 *     @type string $capability     User capability for accessing admin page.
		 * }
		 */
		public function __construct( $plugins, $args = array() ) {

			/*
			 * Temporarily store $args before set_args().
			 *
			 * We need the raw data for set_package(), even
			 * though it's not all formatted yet.
			 */
			$this->args = $args;

			/*
			 * Setup an array of information for the package.
			 *
			 * This information also includes figuring the URL and
			 * path to the drop-in directory, which is needs to happen
			 * before any files or assets are included.
			 */
			$this->set_package();

			// Setup plugins object.
			$this->set_plugins( $plugins );

			// Merge optional arguments with defaults.
			$this->set_args( $args );

			// Setup admin-wide plugin notices.
			$this->set_notices();

			// Add the admin page to manage plugins.
			add_action( 'admin_menu', array( $this, 'add_page' ) );

			// Add the admin page to manage plugins.
			add_action( 'admin_enqueue_scripts', array( $this, 'add_assets' ) );

			// Adds a link to our admin page, from the Installed Plugins screen.
			add_filter( 'views_plugins', array( $this, 'add_plugins_view' ) );

			// Adds a link to our admin page, from Plugin Install screen.
			add_filter( 'views_plugin-install', array( $this, 'add_install_view' ) );

			// Hook Ajax requests.
			add_action( 'wp_ajax_plugin-manager-row-refresh', array( $this, 'row_refresh' ) );

			// Hook non-Ajax requests.
			add_action( 'current_screen', array( $this, 'request' ) );

		}

		/**
		 * Sets an array of information for the current package
		 * containing the drop-in directory.
		 *
		 * By default, the package info is generated, assuming
		 * this class exists within a parent theme.
		 *
		 * For child themes: Pass in `$args['child_theme'] = true`
		 * when instantiating object.
		 *
		 * For plugins: Pass in `$args['plugin_file'] = __FILE__`
		 * when instantiating object.
		 *
		 * @since 1.0.0
		 */
		private function set_package() {

			$this->package = array(
				'directory' => dirname( __FILE__ ),
			);

			if ( ! empty( $this->args['plugin_file'] ) ) {

				/*
				 * Setup package info when drop-in is included
				 * within plugin.
				 */
				$plugin_file = $this->args['plugin_file'];

				$plugin_slug = explode( '/', plugin_basename( $plugin_file ) );

				$this->package['slug'] = $plugin_slug[0];

				$plugin = get_file_data( $plugin_file, array(
					'Name' => 'Plugin Name'
				), 'plugin' );

				$this->package['name'] = $plugin['Name'];

				/*
				 * Dynamically set the URI and file path to the
				 * drop-in directory within the plugin.
				 *
				 * This allows the plugin author to place the drop-in
				 * directory anywhere within their theme.
				 */
				$plugin_dir = plugin_dir_path( $plugin_file );

				$dropin_path = str_replace( $plugin_dir, '', $this->package['directory'] );

				$this->package['url'] = plugin_dir_url( $plugin_file ) . untrailingslashit( $dropin_path );

			} else {

				/*
				 * Setup package info when drop-in is included
				 * within theme.
				 */
				if ( ! empty( $this->args['child_theme'] ) ) {
					$theme = wp_get_theme( get_stylesheet() );
				} else {
					$theme = wp_get_theme( get_template() );
				}

				$this->package['slug'] = $theme->get_stylesheet();

				$this->package['name'] = $theme->get( 'Name' );

				/*
				 * Dynamically set the URI and file path to the
				 * drop-in directory within the theme.
				 *
				 * This allows the theme author to place the drop-in
				 * directory anywhere within their theme.
				 */
				$theme_dir = $theme->get_stylesheet_directory();

				$dropin_path = str_replace( $theme_dir, '', $this->package['directory'] );

				$this->package['url'] = $theme->get_stylesheet_directory_uri() . untrailingslashit( $dropin_path );

			}

		}

		/**
		 * Setup plugins object.
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugins Initial, unformatted plugins passed to plugin manager.
		 */
		private function set_plugins( $plugins ) {

			/**
			 * Include Theme_Blvd_Plugins class to store
			 * plugin data.
			 */
			require_once( $this->package['directory'] . '/class-theme-blvd-plugins.php' );

			// Setup plugins.
			$this->plugins = new Theme_Blvd_Plugins( $plugins, $this );

		}

		/**
		 * Set and format any arguments passed in, to override
		 * defaults.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args {
		 *     Any argument overrides passed to the class.
		 *
		 *     @type string $page_title           Title of plugin manager page.
		 *     @type string $views_title          Text for link to the plugin manager admin page, which gets inserted at WordPress's main Plugins admin screen. Set to `false` to disable.
		 *     @type string $tab_title            Text for link to the plugin manager admin page, which gets inserted at WordPress's Install Plugins admin screen. Set to `false` to disable.
		 *     @type string $extended_title       An extended title that gets used in the title tags of links generated from both `$views_title` and `$tab_title`.
		 *     @type string $menu_title           Title of plugin manager menu item.
		 *     @type string $parent_slug          Parent url slug for plugin manager admin page.
		 *     @type string $menu_slug            URL slug for the plugin manager admin page.
		 *     @type string $capability           WordPress user capability for plugin manager admin page.
		 *     @type string $nag_action           Text of the link, which leads the user to the plugin manager admin page.
		 *     @type string $nag_dimiss           Screen reader text to dismiss plugin manager nags.
		 *     @type string $nag_update           Message to tell users not all plugins are compatible.
		 *     @type string $nag_install_single   Message to install suggested plugins, if only one exists.
		 *     @type string $nag_install_multiple Message to install suggested plugins.
		 *     @type bool   $child_theme          Whether implementing from a child theme. Required if implementing from a child theme.
		 *     @type string $plugin_file          Absolute path to project plugin's main file. Required if implementing from a plugin.
		 * }
		 */
		private function set_args( $args = array() ) {

			$this->args = wp_parse_args( $args, array(
				'page_title'           => __( 'Suggested Plugins', '@@text-domain' ),
				// translators: 1: name of theme
				'views_title'          => sprintf( __( 'Suggested by %s', '@@text-domain' ), $this->package['name'] ),
				// translators: 1: name of theme
				'tab_title'            => sprintf( __( 'Suggested by %s', '@@text-domain' ), $this->package['name'] ),
				// translators: 1: name of theme
				'extended_title'       => sprintf( __( 'Suggested Plugins by %s', '@@text-domain' ), $this->package['name'] ),
				'menu_title'           => '', // Takes on page_title, when left blank.
				'parent_slug'          => 'themes.php',
				'menu_slug'            => 'suggested-plugins',
				'capability'           => 'install_plugins',
				'nag_action'           => __( 'Manage suggested plugins', '@@text-domain' ),
				'nag_dismiss'          => __( 'Dismiss this notice', '@@text-domain' ),
				// translators: 1: name of theme
				'nag_update'           => __( 'Not all of your active, suggested plugins are compatible with %s.', '@@text-domain' ),
				// translators: 1: name of theme, 2: number of suggested plugins
				'nag_install_single'   => __( '%1$s suggests installing %2$s plugin.', '@@text-domain' ),
				// translators: 1: name of theme, 2: number of suggested plugins
				'nag_install_multiple' => __( '%1$s suggests installing %2$s plugins.', '@@text-domain' ),
				'child_theme'          => false,
				'plugin_file'          => '',
			));

			if ( ! $this->args['menu_title'] ) {
				$this->args['menu_title'] = $this->args['page_title'];
			}

		}

		/**
		 * Setup admin-wide notices regarding suggested
		 * plugins.
		 *
		 * @since 1.0.0
		 */
		private function set_notices() {

			/**
			 * Include Theme_Blvd_Plugin_Notices class to setup
			 * and display admin-wide notices, if they're needed.
			 */
			require_once( $this->package['directory'] . '/class-theme-blvd-plugin-notices.php' );

			// Setup notices.
			$args = array(
				'package_name'         => $this->package['name'],
				'package_url'          => $this->package['url'],
				'admin_url'            => $this->get_admin_url(),
				'nag_action'           => $this->args['nag_action'],
				'nag_dismiss'          => $this->args['nag_dismiss'],
				'nag_update'           => $this->args['nag_update'],
				'nag_install_single'   => $this->args['nag_install_single'],
				'nag_install_multiple' => $this->args['nag_install_multiple'],
			);

			$notices = new Theme_Blvd_Plugin_Notices( $args, $this, $this->plugins );

		}

		/**
		 * Add the suggsted plugin admin page to manage
		 * plugins.
		 *
		 * @since 1.0.0
		 */
		public function add_page() {

			$this->admin_screen_base = add_theme_page(
				$this->args['page_title'],
				$this->args['menu_title'],
				$this->args['capability'],
				$this->args['menu_slug'],
				array( $this, 'display_page' )
			);

		}

		/**
		 * Add any CSS or JavaScript to plugin manager
		 * admin page.
		 *
		 * @since 1.0.0
		 */
		public function add_assets() {

			/*
			 * The plugin-manager .js and .css files should only
			 * be included on our specific admin page for managing
			 * plugins.
			 */
			if ( ! $this->is_admin_screen() ) {
				return;
			}

			$suffix = SCRIPT_DEBUG ? '' : '.min';

			wp_enqueue_script( 'updates' );

			wp_enqueue_script(
				'themeblvd-plugin-manager',
				esc_url( $this->package['url'] . "/assets/js/plugin-manager$suffix.js" ),
				array( 'jquery', 'updates' )
			);

			wp_localize_script(
				'themeblvd-plugin-manager',
				'pluginManagerSettings',
				array(
					'thirdParty'   => __( 'Only plugins from wordpress.org can be installed directly here.', '@@text-domain' ),
					'notInstalled' => __( 'Plugin update skipped because it is not installed.', '@@text-domain' ),
				)
			);

			wp_enqueue_style(
				'themeblvd-plugin-manager',
				esc_url( $this->package['url'] . "/assets/css/plugin-manager$suffix.css" )
			);

		}

		/**
		 * Display the suggsted plugin admin page to
		 * manage plugins.
		 *
		 * @since 1.0.0
		 */
		public function display_page() {

			$plugins = $this->plugins->get();

			settings_errors( 'plugin-manager' );

			?>
			<div id="suggested-plugins" class="wrap">

				<h1><?php echo esc_html( $this->args['page_title'] ); ?></h1>

				<?php if ( $plugins ) : ?>

					<form method="post" id="bulk-action-form" data-namespace="themeblvd">

						<?php $this->display_table_nav( 'top' ); ?>

						<table class="wp-list-table plugins widefat">

							<?php $this->display_table_header( 'thead' ); ?>

							<tbody id="the-list" data-wp-lists="list:plugin">

								<?php foreach ( $plugins as $plugin ) : ?>

									<?php $this->display_table_row( $plugin ); ?>

								<?php endforeach; ?>

							</tbody>

							<?php $this->display_table_header( 'tfoot' ); ?>

						</table>

						<?php $this->display_table_nav( 'bottom' ); ?>

					</form>

				<?php else : ?>

					<p><?php esc_html_e( 'No suggested plugins given.', '@@text-domain' ); ?></p>

				<?php endif; ?>

			</div><!-- .wrap -->
			<?php
		}

		/**
		 * Display the table navigation for selecting
		 * a bulk action.
		 *
		 * @since 1.0.0
		 *
		 * @param string $which Which location, `top` or `bottom`.
		 */
		private function display_table_nav( $which ) {

			$actions = array(
				'install-selected'    => __( 'Install', '@@text-domain' ),
				'activate-selected'   => __( 'Activate', '@@text-domain' ),
				'deactivate-selected' => __( 'Deactivate', '@@text-domain' ),
				'update-selected'     => __( 'Update', '@@text-domain' ),
				'delete-selected'     => __( 'Delete', '@@text-domain' ),
			);

			if ( 'top' === $which ) {
				wp_nonce_field( 'bulk-plugins' );
			}

			?>
			<div class="tablenav">
				<div class="actions bulkactions">

					<label for="bulk-action-selector-<?php echo esc_attr( $which ); ?>" class="screen-reader-text">
						<?php esc_html_e( 'Select bulk action', '@@text-domain' ); ?>
					</label>

					<select name="action-<?php echo $which; ?>" id="bulk-action-selector-<?php echo esc_attr( $which ); ?>">

						<option value="-1"><?php esc_html_e( 'Bulk Actions', '@@text-domain' ); ?></option>

						<?php foreach ( $actions as $name => $title ) : ?>

							<option value="<?php echo $name; ?>"><?php echo $title; ?></option>

						<?php endforeach; ?>

					</select>

					<?php
					submit_button( __( 'Apply', '@@text-domain' ), 'action', '', false,
						array(
							'id' => "do-action-$which",
						)
					);
					?>

				</div>
			</div>
			<?php
		}

		/**
		 * Display the plugin manager table header
		 * and footers.
		 *
		 * @since 1.0.0
		 *
		 * @param string $tag HTML tag, `tfoot` or `thead`.
		 */
		private function display_table_header( $tag ) {

			$id = 'tfoot' === $tag ? '2' : '1';

			?>
			<<?php echo $tag; ?>>

				<tr>

					<td id="cb" class="manage-column column-cb check-column">
						<label class="screen-reader-text" for="cb-select-all-<?php echo $id; ?>">
							<?php esc_html_e( 'Select All', '@@text-domain' ); ?>
						</label>
						<input id="cb-select-all-<?php echo $id; ?>" type="checkbox">
					</td>

					<th scope="col" class="manage-column column-name column-primary">
						<?php esc_html_e( 'Plugin', '@@text-domain' ); ?>
					</th>

					<th scope="col" class="manage-column column-compatible-version">
						<?php esc_html_e( 'Compatible Version', '@@text-domain' ); ?>
					</th>

					<th scope="col" class="manage-column column-installed-version">
						<?php esc_html_e( 'Installed Version', '@@text-domain' ); ?>
					</th>

					<th scope="col" class="manage-column column-status">
						<?php esc_html_e( 'Status', '@@text-domain' ); ?>
					</th>

				</tr>

			</<?php echo $tag; ?>>
			<?php

		}

		/**
		 * Display each of the plugin manager's table
		 * rows.
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugin Plugin data.
		 */
		private function display_table_row( $plugin ) {

			$class = array( $plugin['status'] );

			if ( 'not-installed' === $plugin['status'] ) {
				$class[] = 'inactive'; // Better implements default WP_Plugin_Table styling.
			}

			if ( 'incompatible' === $plugin['status'] ) {
				$class[] = 'active'; // Better implements default WP_Plugin_Table styling.
			}

			if ( ! empty( $plugin['row-class'] ) ) {
				$class = array_merge( $class, $plugin['row-class'] );
			}

			$class = implode( ' ', $class );

			?>
			<tr class="<?php echo esc_attr( $class ); ?>" data-slug="<?php echo esc_attr( $plugin['slug'] ); ?>" data-plugin="<?php echo esc_attr( $plugin['file'] ); ?>" data-status="<?php echo esc_attr( $plugin['status'] ); ?>" data-source="<?php echo esc_attr( $this->get_plugin_source( $plugin ) ); ?>">

				<th scope="row" class="check-column">
					<label class="screen-reader-text" for="">
						<?php
						/* translators: 1: placeholder is name of plugin */
						printf( __( 'Select %s', '@@text-domain' ), $plugin['name'] );
						?>
					</label>
					<input type="checkbox" name="checked[]" value="<?php echo $plugin['slug']; ?>">
				</th>

				<td class="plugin-title column-primary">

					<?php if ( $plugin['name'] ) : ?>
						<strong><?php echo esc_html( $plugin['name'] ); ?></strong>
					<?php endif; ?>

					<div class="row-actions visible">
						<?php $this->display_actions( $plugin ); ?>
					</div>

				</td>

				<td class="column-suggested-version">
					<?php if ( isset( $plugin['version'] ) ) : ?>
						<?php echo esc_html( $plugin['version'] ); ?>
					<?php endif; ?>
				</td>

				<td class="column-installed-version">
					<?php if ( $plugin['current_version'] ) : ?>
						<?php echo esc_html( $plugin['current_version'] ); ?>
					<?php else : ?>
						<?php esc_html_e( 'Not Installed', '@@text-domain' ); ?>
					<?php endif; ?>
				</td>

				<td class="column-status">
					<?php $this->display_status( $plugin ); ?>
				</td>

			</tr>

			<?php if ( ! empty( $plugin['notice'] ) ) : ?>

				<tr class="<?php echo esc_attr( $class ); ?> row-notice <?php echo esc_attr( $plugin['slug'] ); ?>-notice">

					<td colspan="5" class="plugin-update">
						<div class="update-message notice inline notice-alt <?php echo esc_attr( $plugin['notice']['class'] ); ?>">
							<p><?php echo wp_unslash( $plugin['notice']['message'] ); ?></p>
						</div>
					</td>

				</tr>

			<?php endif; ?>

			<?php

		}

		/**
		 * Display plugin actions, like to view details,
		 * install, active, delete, etc.
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugin Plugin data.
		 */
		private function display_actions( $plugin ) {

			$is_wp = false !== strpos( $plugin['url'], 'wordpress.org' );

			$actions = array();

			/*
			 * Add "Details" link.
			 *
			 * Add link to view details of plugin on wordpress.org,
			 * or if installed but doesn't exist on wordpress.org,
			 * link them to the external plugin URL.
			 */
			if ( $is_wp || 'not-installed' !== $plugin['status'] ) {

				$actions['details'] = array(
					'url'    => $plugin['url'],
					'text'   => __( 'Details', '@@text-domain' ),
					// translators: 1: name of plugin
					'label'  => sprintf( __( 'More Information about %s', '@@text-domain' ), $plugin['name'] ),
					'target' => '_blank',
					'nonce'  => null,
				);

				/*
				if ( $is_wp ) {
					$actions['details']['target'] = '_self';
					$actions['details']['class'] = 'thickbox open-plugin-details-modal';
				}
				*/
			}

			/*
			 * Add "Install" or "Get Plugin" link.
			 *
			 * "Install" - If the plugin isn't installed and it's
			 * located in the wordpress.org repo, give the user
			 * an install link.
			 *
			 * "Get Plugin" - For a plugin not installed from
			 * another source, give them an external URL to get
			 * the plugin.
			 */
			if ( 'not-installed' === $plugin['status'] ) {

				if ( $is_wp ) {

					/*
					 * This URL is a fallback for when JavaScript is broken
					 * or disabled. It will lead to /wp-admin/update.php and
					 * trigger default action of install a plugin.
					 */
					$url = add_query_arg(
						array(
							'action'   => 'install-plugin',
							'plugin'   => urlencode( $plugin['slug'] ),
							'_wpnonce' => wp_create_nonce( 'install-plugin_' . $plugin['slug'] ), // Formatted for WP's update.php.
						),
						self_admin_url( 'update.php' )
					);

					$actions['install'] = array(
						'url'    => $url,
						'text'   => __( 'Install', '@@text-domain' ),
						// translators: 1: name of plugin
						'label'  => sprintf( __( 'Install %s', '@@text-domain' ), $plugin['name'] ),
						'target' => '_self',
						'nonce'  => null, // No nonce needed, using wp.updates.ajaxNonce.
					);

				} else {

					$actions['install'] = array(
						'url'    => $plugin['url'],
						'text'   => __( 'Get Plugin', '@@text-domain' ),
						// translators: 1: name of plugin
						'label'  => sprintf( __( 'Install %s', '@@text-domain' ), $plugin['name'] ),
						'target' => '_blank',
						'nonce'  => null,
					);

				}
			}

			// Add "Activate" or "Deactivate" link.
			if ( 'inactive' === $plugin['status'] ) {

				$url = add_query_arg(
					array(
						'action'   => 'activate',
						'plugin'   => urlencode( $plugin['slug'] ),
						'_wpnonce' => wp_create_nonce( 'plugin-request_' . $plugin['file'] ),
					),
					$this->get_admin_url()
				);

				$actions['activate'] = array(
					'url'    => $url,
					'text'   => __( 'Activate', '@@text-domain' ),
					// translators: 1: name of plugin
					'label'  => sprintf( __( 'Activate %s', '@@text-domain' ), $plugin['name'] ),
					'target' => '_self',
				);

			} elseif ( 'active' === $plugin['status'] || 'incompatible' === $plugin['status'] ) {

				$url = add_query_arg(
					array(
						'action'   => 'deactivate',
						'plugin'   => urlencode( $plugin['slug'] ),
						'_wpnonce' => wp_create_nonce( 'plugin-request_' . $plugin['file'] ),
					),
					$this->get_admin_url()
				);

				$actions['deactivate'] = array(
					'url'    => $url,
					'text'   => __( 'Deactivate', '@@text-domain' ),
					// translators: 1: name of plugin
					'label'  => sprintf( __( 'Deactivate %s', '@@text-domain' ), $plugin['name'] ),
					'target' => '_self',
					'nonce'  => wp_create_nonce( 'plugin-activation_' . $plugin['slug'] ),
				);

			}

			// Add "Delete" link.
			if ( 'inactive' === $plugin['status'] ) {

				/*
				 * This URL is a fallback for when JavaScript is broken
				 * or disabled. It will lead to /wp-admin/plugins.php and
				 * trigger default action of deleting a plugin.
				 */
				$url = add_query_arg(
					array(
						'action'        => 'delete-selected',
						'verify-delete' => '1',
						'checked[]'     => urlencode( $plugin['file'] ),
						'_wpnonce'      => wp_create_nonce( 'bulk-plugins' ), // Formatted for plugins.php
					),
					self_admin_url( 'plugins.php' )
				);

				$actions['delete'] = array(
					'url'    => $url,
					'text'   => __( 'Delete', '@@text-domain' ),
					// translators: 1: name of plugin
					'label'  => sprintf( __( 'Delete %s', '@@text-domain' ), $plugin['name'] ),
					'target' => '_self',
					'nonce'  => wp_create_nonce( 'delete-plugin_' . $plugin['slug'] ),
				);

			}

			// Add "Update to version {version}" link or "Plugin is up-to-date" message.
			if ( $plugin['update'] ) {

				/*
				 * This URL is a fallback for when JavaScript is broken
				 * or disabled. It will lead to /wp-admin/update.php and
				 * trigger default action of updating a plugin.
				 */
				$url = add_query_arg(
					array(
						'action'   => 'upgrade-plugin',
						'plugin'   => urlencode( $plugin['file'] ),
						'_wpnonce' => wp_create_nonce( 'upgrade-plugin_' . $plugin['file'] ), // Formatted for update.php
					),
					self_admin_url( 'update.php' )
				);

				$actions['update'] = array(
					'url'    => $url,
					'text'   => sprintf(
						// translators: 1: new version of plugin
						__( 'Update to %s', '@@text-domain' ),
						$plugin['new_version']
					),
					'label'  => sprintf(
						// translators: 1: name of plugin, 2: new version of plugin
						__( 'Update %1$s to version %2$s', '@@text-domain' ),
						$plugin['name'],
						$plugin['new_version']
					),
					'target' => '_self',
					'nonce'  => null, // No nonce needed, using wp.updates.ajaxNonce.
				);

			} elseif ( 'not-installed' !== $plugin['status'] ) {

				$actions['update'] = array(
					'text' => __( 'Plugin is up-to-date', '@@text-domain' ),
				);

			}

			// Build $output from $actions array data.
			$output = array();

			foreach ( $actions as $key => $action ) {

				if ( ! empty( $action['url'] ) ) {

					$class = '';

					if ( false !== strpos( $action['url'], get_site_url() ) ) {
						$class = $key . '-now';
					}

					if ( ! empty( $action['class'] ) ) {
						 $class .= ' ' . $action['class'];
					}

					$item = sprintf(
						'<span class="has-link %s"><a href="%s" class="edit %s" aria-label="%s" target="%s">%s</a></span>',
						$key,
						esc_url( $action['url'] ),
						esc_attr( $class ),
						esc_attr( $action['label'] ),
						esc_attr( $action['target'] ),
						esc_html( $action['text'] )
					);

					if ( ! empty( $action['nonce'] ) ) {

						$item = str_replace(
							'href',
							sprintf( 'data-ajax-nonce="%s" href', $action['nonce'] ),
							$item
						);

					}
				} else {

					$item = sprintf(
						'<span class="no-link %s">%s</span>',
						$key,
						esc_html( $action['text'] )
					);

				}

				$output[] = $item;

			}

			echo implode( ' | ', $output );

		}

		/**
		 * Display the status of a plugin.
		 *
		 * For more on how status is determined see docs
		 * for set_plugins() method.
		 *
		 * @since 1.0.0
		 *
		 * @param array $plugin Plugin data.
		 */
		private function display_status( $plugin ) {

			switch ( $plugin['status'] ) {
				case 'active':
					esc_html_e( 'Active', '@@text-domain' );
					break;

				case 'incompatible':
					esc_html_e( 'Incompatible', '@@text-domain' );
					break;

				case 'inactive':
					esc_html_e( 'Installed', '@@text-domain' );
					break;

				default:
					esc_html_e( 'Not Installed', '@@text-domain' );
			}

		}

		/**
		 * Adds a link to Plugins screen that links
		 * to our plugin manager admin page.
		 *
		 * @since 1.0.0
		 */
		public function add_plugins_view( $views ) {

			if ( ! $this->args['views_title'] ) {
				return $views;
			}

			$plugins = $this->plugins->get();

			if ( $plugins ) {

				$views['suggested'] = sprintf(
					"<a href='%s' title='%s'>%s <span class='count'>(%d)</span></a>",
					esc_url( $this->get_admin_url() ),
					esc_html( $this->args['extended_title'] ),
					esc_html( $this->args['views_title'] ),
					count( $plugins )
				);

			}

			return $views;

		}

		/**
		 * Add tab to Plugin Installer screen that links
		 * to our plugin manager admin page.
		 *
		 * @since 1.0.0
		 */
		public function add_install_view( $tabs ) {

			if ( ! $this->args['tab_title'] ) {
				return $tabs;
			}

			if ( $this->plugins->get() ) {

				$tabs['suggested-by-theme'] = sprintf(
					"<a href='%s' title='%s'>%s</a>",
					esc_url( $this->get_admin_url() ),
					esc_html( $this->args['extended_title'] ),
					esc_html( $this->args['tab_title'] )
				);

			}

			return $tabs;

		}

		/**
		 * Get the URL to the admin page to manage plugins.
		 *
		 * @since 1.0.0
		 *
		 * @return string URL to plugin-manager admin page.
		 */
		public function get_admin_url() {

			return add_query_arg(
				'page',
				$this->args['menu_slug'],
				admin_url( $this->args['parent_slug'] )
			);

		}

		/**
		 * Get source to display for a plugin.
		 *
		 * @since 1.0.0
		 *
		 * @param  array  $plugin Plugin data.
		 * @return string         Plugin source, `wordpress.org` or `third-party`.
		 */
		public function get_plugin_source( $plugin ) {

			if ( false === strpos( $plugin['url'], 'wordpress.org' ) ) {
				return 'third-party';
			}

			return 'wordpress.org';

		}

		/**
		 * Check whether we're currently on the plugin
		 * manager admin page or not.
		 *
		 * @since 1.0.0
		 *
		 * @return bool If plugin-manager admin page.
		 */
		public function is_admin_screen() {

			$screen = get_current_screen();

			if ( $screen && $this->admin_screen_base === $screen->base ) {
				return true;
			}

			return false;

		}

		/**
		 * Handle Ajax request when a plugin's status has
		 * changed and its table row needs to be refreshed.
		 *
		 * @since 1.0.0
		 */
		public function row_refresh() {

			/*
			 * Check to make sure this action belongs to current
			 * object.
			 *
			 * This may seem a bit weird. - Because of how we generate
			 * the package files for authors, we're keeping the ajax action
			 * generically named `plugin-manager-row-refresh`.
			 *
			 * So, in the event multiple instances of our generated objects
			 * have hooked to `wp_ajax_plugin-manager-row-refresh`,
			 * we'll double check the namespace to make sure the right
			 * object is used.
			 */
			if ( empty( $_POST['namespace'] ) || 'themeblvd' !== $_POST['namespace'] ) {
				return;
			}

			check_ajax_referer( 'updates' );

			if ( ! $this->plugins->is_set() ) {
				$this->plugins->set();
			}

			$plugin = $this->plugins->get( $_POST['slug'] );

			if ( $plugin ) {

				if ( ! empty( $_POST['error'] ) ) {

					$plugin['notice'] = array(
						'class'   => 'notice-' . $_POST['error_level'],
						'message' => $_POST['error'],
					);

					$plugin['row-class'] = array( 'row-has-notice' );

				} else {

					$plugin['row-class'] = array( 'ajax-success' );

					if ( ! empty( $_POST['prev_action'] ) ) {

						$action_slug = str_replace( '-plugin', '', $_POST['prev_action'] );

						$plugin['row-class'][] = $action_slug . '-success';

					}
				}

				$this->display_table_row( $plugin );

			}

			wp_die();

		}

		/**
		 * Handles any non-Ajax request.
		 *
		 * We use this for activating and deactivating plugins
		 * because these actions require that the WordPress
		 * admin is refreshed. So handling them through Ajax
		 * is a bit unnecessary.
		 *
		 * This method handles both the activation and
		 * deactivation processes, along with error message
		 * handling and success message on redirect.
		 *
		 * Also, single plugin and bulk processing is supported.
		 *
		 * @since 1.0.0
		 */
		public function request() {

			global $_REQUEST;

			// Do nothing if this isn't our admin screen.
			if ( ! $this->is_admin_screen() ) {
				return;
			}

			// Check for bulk actions.
			$do_bulk = false;

			if ( isset( $_REQUEST['action-top'] ) || isset( $_REQUEST['action-bottom'] ) ) {

				$do_bulk = true;

				if ( ! empty( $_REQUEST['action-top'] ) && -1 != $_REQUEST['action-top'] ) {

					$_REQUEST['action'] = $_REQUEST['action-top'];

				} elseif ( ! empty( $_REQUEST['action-bottom'] ) && -1 != $_REQUEST['action-bottom'] ) {

					$_REQUEST['action'] = $_REQUEST['action-bottom'];

				}
			}

			if ( empty( $_REQUEST['action'] ) ) {
				return;
			}

			$_SERVER['REQUEST_URI'] = remove_query_arg(
				array(
					'action',
					'success',
					'_error_nonce',
				),
				$_SERVER['REQUEST_URI']
			);

			/*
			 * If this was a redirect from a successful activate
			 * or deactivate action, we'll just add a success
			 * message and then return.
			 */
			if ( isset( $_REQUEST['success'] ) ) {

				$message = '';

				if ( 'activate' === $_REQUEST['action'] ) {

					$message = __( 'Plugin activated.', '@@text-domain' );

				} elseif ( 'activate-selected' === $_REQUEST['action'] ) {

					$num = $_REQUEST['success'];

					$message = sprintf(
						// translators: 1: number of plugins activated without error
						_n(
							'%s plugin activated successfully.',
							'%s plugins activated successfully.',
							$num,
							'@@text-domain'
						),
						$num
					);

				} elseif ( 'deactivate' === $_REQUEST['action'] ) {

					$message = __( 'Plugin deactivated.', '@@text-domain' );

				} elseif ( 'deactivate-selected' === $_REQUEST['action'] ) {

					$message = __( 'Plugins deactivated.', '@@text-domain' );

				}

				if ( $message ) {

					add_settings_error(
						'plugin-manager',
						'plugin-manager-error',
						$message,
						'updated'
					);

				}

				return;

			}

			// Get all plugin data.
			$plugins_data = $this->plugins->get();

			/*
			 * Perform error checking, to see if we have everything
			 * to get started activating or deactivating plugins.
			 */
			$error = '';

			if ( $do_bulk && empty( $_REQUEST['checked'] ) ) {

				$error = __( 'No plugins were selected.', '@@text-domain' );

			} elseif ( ! $do_bulk && empty( $_REQUEST['plugin'] ) ) {

				$error = __( 'No plugin slug was given.', '@@text-domain' );

			} elseif ( ! current_user_can( 'update_plugins' ) ) {

				$error = __( 'Sorry, you are not allowed to update plugins for this site.', '@@text-domain' );

			} elseif ( ! $do_bulk && empty( $plugins_data[ $_REQUEST['plugin'] ] ) ) {

				$error = sprintf(
					// translators: 1: slug of plugin being activated
					__( 'The plugin %s doesn\'t exist within the plugin manager\'s registered plugins.', '@@text-domain' ),
					$_REQUEST['plugin']
				);

			}

			/*
			 * If no errors were found above, we can begin activating
			 * or deactivating plugins.
			 */
			if ( ! $error ) {

				$success = 0; // Count of how many successful plugins activated on bulk.

				$redirect = add_query_arg(
					array(
						'action'  => $_REQUEST['action'],
						'success' => 1,
					),
					$this->get_admin_url()
				);

				if ( $do_bulk ) {

					$plugins = array();

					foreach ( $_REQUEST['checked'] as $slug ) {

						if ( ! empty( $plugins_data[ $slug ] ) ) {

							$plugins[ $slug ] = $plugins_data[ $slug ];

						}
					}

					if ( ! $plugins ) {
						$error = __( 'No valid plugins given for bulk action.', '@@text-domain' );
					}
				} else {

					$plugin = $plugins_data[ $_REQUEST['plugin'] ];

				}

				// Perform action.
				if ( 'activate' === $_REQUEST['action'] ) {

					$result = activate_plugin( $plugin['file'], $redirect );

				} elseif ( 'activate-selected' === $_REQUEST['action'] ) {

					foreach ( $plugins as $plugin ) {

						$result = activate_plugin( $plugin['file'] );

						if ( ! is_wp_error( $result ) ) {
							$success++;
						}
					}

					if ( $success ) { // At least one plugin needed to be successful.

						$redirect = add_query_arg( 'success', $success, $redirect );

						wp_redirect( $redirect );

					} else {

						$error = __( 'None of the selected plugins could be activated. Make sure they are installed.', '@@text-domain' );

					}
				} elseif ( 'deactivate' === $_REQUEST['action'] || 'deactivate-selected' === $_REQUEST['action'] ) {

					$deactivate = array();

					if ( $do_bulk ) {

						foreach ( $plugins as $plugin ) {
							$deactivate[] = trailingslashit( WP_PLUGIN_DIR ) . $plugin['file'];
						}
					} else {

						$deactivate[] = trailingslashit( WP_PLUGIN_DIR ) . $plugin['file'];

					}

					$result = deactivate_plugins( $deactivate );

					if ( ! is_wp_error( $result ) ) {
						wp_redirect( $redirect );
					}
				}

				if ( ! $error && is_wp_error( $result ) ) {
					$error = $result->get_error_message();
				}
			}

			/*
			 * If an error was found at any point, we can queue it to
			 * display.
			 *
			 * Otherwise, if an activation or deactivation were successful,
			 * the user would have already been redirected by this point.
			 */
			if ( $error ) {

				add_settings_error(
					'plugin-manager',
					'plugin-manager-error',
					$error,
					'error'
				);

			}

		}
	}
}
