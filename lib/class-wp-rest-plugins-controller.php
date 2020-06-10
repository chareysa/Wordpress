<?php
/**
 * Start: Include for phase 2
 * Block Directory REST API: WP_REST_Plugins_Controller class
 *
 * @since   6.5.0
 * @package gutenberg
 */

/**
 * Core class to access plugins via the REST API.
 *
 * @since 5.5.0
 *
 * @see   WP_REST_Controller
 */
class WP_REST_Plugins_Controller extends WP_REST_Controller {

	const PATTERN = '[^.\/]+(?:\/[^.\/]+)?';

	/**
	 * Plugins controller constructor.
	 *
	 * @since 5.5.0
	 */
	public function __construct() {
		$this->namespace = '__experimental';
		$this->rest_base = 'plugins';
	}

	/**
	 * Registers the routes for the plugins controller.
	 *
	 * @since 5.5.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => array(
						'slug'   => array(
							'type'        => 'string',
							'required'    => true,
							'description' => __( 'WordPress.org plugin directory slug.', 'gutenberg' ),
						),
						'status' => array(
							'description' => __( 'The plugin activation status.', 'gutenberg' ),
							'type'        => 'string',
							'enum'        => is_multisite() ? array( 'inactive', 'active', 'network-active' ) : array( 'inactive', 'active' ),
							'default'     => 'inactive',
						),
					),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<plugin>' . self::PATTERN . ')',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
				'args'   => array(
					'context' => $this->get_context_param( array( 'default' => 'view' ) ),
					'plugin'  => array(
						'type'              => 'string',
						'pattern'           => self::PATTERN,
						'validate_callback' => static function ( $file ) {
							if ( ! is_string( $file ) || ! preg_match( '/' . self::PATTERN . '/u', $file ) ) {
								return false;
							}

							$validated = validate_file( plugin_basename( $file ) );

							return 0 === $validated;
						},
						'sanitize_callback' => static function ( $file ) {
							return plugin_basename( sanitize_text_field( $file . '.php' ) );
						},
					),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Checks if a given request has access to get plugins.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_view_plugins',
				__( 'Sorry, you are not allowed to manage plugins for this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Retrieves a collection of plugins.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		$plugins = array();

		foreach ( get_plugins() as $file => $data ) {
			if ( is_wp_error( $this->check_read_permission( $file ) ) ) {
				continue;
			}

			$data['_file'] = $file;
			$plugins[]     = $this->prepare_response_for_collection( $this->prepare_item_for_response( $data, $request ) );
		}

		return new WP_REST_Response( $plugins );
	}

	/**
	 * Checks if a given request has access to get a specific plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_view_plugin',
				__( 'Sorry, you are not allowed to manage plugins for this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$can_read = $this->check_read_permission( $request['plugin'] );

		if ( is_wp_error( $can_read ) ) {
			return $can_read;
		}

		return true;
	}

	/**
	 * Retrieves one plugin from the site.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		$data = $this->get_plugin_data( $request['plugin'] );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return $this->prepare_item_for_response( $data, $request );
	}

	/**
	 * Checks if the given plugin can be viewed by the current user.
	 *
	 * On multisite, this hides non-active network only plugins if the user does not have permission
	 * to manage network plugins.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin The plugin file to check.
	 * @return true|WP_Error True if can read, a WP_Error instance otherwise.
	 */
	protected function check_read_permission( $plugin ) {
		if ( ! $this->is_plugin_installed( $plugin ) ) {
			return new WP_Error( 'rest_plugin_not_found', __( 'Plugin not found.', 'gutenberg' ), array( 'status' => 404 ) );
		}

		if ( ! is_multisite() ) {
			return true;
		}

		if ( ! is_network_only_plugin( $plugin ) || is_plugin_active( $plugin ) || current_user_can( 'manage_network_plugins' ) ) {
			return true;
		}

		return new WP_Error(
			'rest_cannot_view_plugin',
			__( 'Sorry, you are not allowed to manage this plugin.', 'gutenberg' ),
			array( 'status' => rest_authorization_required_code() )
		);
	}

	/**
	 * Checks if a given request has access to upload plugins.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_install_plugin',
				__( 'Sorry, you are not allowed to install plugins on this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		if ( 'inactive' !== $request['status'] && ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_activate_plugin',
				__( 'Sorry, you are not allowed to activate plugins.', 'gutenberg' ),
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		return true;
	}

	/**
	 * Uploads a plugin and optionally activates it.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

		$slug = $request['slug'];

		// Verify filesystem is accessible first.
		$filesystem_available = $this->is_filesystem_available();
		if ( is_wp_error( $filesystem_available ) ) {
			return $filesystem_available;
		}

		$api = plugins_api(
			'plugin_information',
			array(
				'slug'   => $slug,
				'fields' => array(
					'sections' => false,
				),
			)
		);

		if ( is_wp_error( $api ) ) {
			if ( false !== strpos( $api->get_error_message(), 'Plugin not found.' ) ) {
				$api->add_data( array( 'status' => 404 ) );
			} else {
				$api->add_data( array( 'status' => 500 ) );
			}

			return $api;
		}

		$skin     = new WP_Ajax_Upgrader_Skin();
		$upgrader = new Plugin_Upgrader( $skin );

		$result = $upgrader->install( $api->download_link );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// This should be the same as $result above.
		if ( is_wp_error( $skin->result ) ) {
			return $skin->result;
		}

		if ( $skin->get_errors()->has_errors() ) {
			return $skin->get_errors();
		}

		if ( is_null( $result ) ) {
			global $wp_filesystem;
			// Pass through the error from WP_Filesystem if one was raised.
			if ( $wp_filesystem instanceof WP_Filesystem_Base && is_wp_error( $wp_filesystem->errors ) && $wp_filesystem->errors->has_errors() ) {
				return new WP_Error( 'unable_to_connect_to_filesystem', $wp_filesystem->errors->get_error_message(), array( 'status' => 500 ) );
			}

			return new WP_Error( 'unable_to_connect_to_filesystem', __( 'Unable to connect to the filesystem. Please confirm your credentials.', 'gutenberg' ), array( 'status' => 500 ) );
		}

		$file = $upgrader->plugin_info();

		if ( ! $file ) {
			return new WP_Error( 'unable_to_determine_installed_plugin', __( 'Unable to determine what plugin was installed.', 'gutenberg' ), array( 'status' => 500 ) );
		}

		if ( 'inactive' !== $request['status'] ) {
			$can_change_status = $this->plugin_status_permission_check( $file, $request['status'], 'inactive' );

			if ( is_wp_error( $can_change_status ) ) {
				return $can_change_status;
			}

			$changed_status = $this->handle_plugin_status( $file, $request['status'], 'inactive' );

			if ( is_wp_error( $changed_status ) ) {
				return $changed_status;
			}
		}

		$path          = WP_PLUGIN_DIR . '/' . $file;
		$data          = get_plugin_data( $path, false, false );
		$data['_file'] = $file;

		$response = $this->prepare_item_for_response( $data, $request );
		$response->set_status( 201 );
		$response->header( 'Location', rest_url( sprintf( '%s/%s/%s', $this->namespace, $this->rest_base, substr( $file, 0, - 4 ) ) ) );

		return $response;
	}

	/**
	 * Checks if a given request has access to update a specific plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_manage_plugins',
				__( 'Sorry, you are not allowed to manage plugins for this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$can_read = $this->check_read_permission( $request['plugin'] );

		if ( is_wp_error( $can_read ) ) {
			return $can_read;
		}

		$status = $this->get_plugin_status( $request['plugin'] );

		if ( $request['status'] && $status !== $request['status'] ) {
			$can_change_status = $this->plugin_status_permission_check( $request['plugin'], $request['status'], $status );

			if ( is_wp_error( $can_change_status ) ) {
				return $can_change_status;
			}
		}

		return true;
	}

	/**
	 * Updates one plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		$data = $this->get_plugin_data( $request['plugin'] );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$status = $this->get_plugin_status( $request['plugin'] );

		if ( $request['status'] && $status !== $request['status'] ) {
			$handled = $this->handle_plugin_status( $request['plugin'], $request['status'], $status );

			if ( is_wp_error( $handled ) ) {
				return $handled;
			}
		}

		$this->update_additional_fields_for_object( $data, $request );

		$request['context'] = 'edit';

		return $this->prepare_item_for_response( $data, $request );
	}

	/**
	 * Checks if a given request has access to delete a specific plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_manage_plugins',
				__( 'Sorry, you are not allowed to manage plugins for this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		if ( ! current_user_can( 'delete_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_manage_plugins',
				__( 'Sorry, you are not allowed to delete plugins for this site.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$can_read = $this->check_read_permission( $request['plugin'] );

		if ( is_wp_error( $can_read ) ) {
			return $can_read;
		}

		return true;
	}

	/**
	 * Deletes one plugin from the site.
	 *
	 * @since 5.5.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		$data = $this->get_plugin_data( $request['plugin'] );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		if ( is_plugin_active( $request['plugin'] ) ) {
			return new WP_Error(
				'rest_cannot_delete_active_plugin',
				__( 'Cannot delete an active plugin. Please deactivate it first.', 'gutenberg' ),
				array( 'status' => 400 )
			);
		}

		$filesystem_available = $this->is_filesystem_available();
		if ( is_wp_error( $filesystem_available ) ) {
			return $filesystem_available;
		}

		$prepared = $this->prepare_item_for_response( $data, $request );
		$deleted  = delete_plugins( array( $request['plugin'] ) );

		if ( is_wp_error( $deleted ) ) {
			return $deleted;
		}

		return new WP_REST_Response(
			array(
				'deleted'  => true,
				'previous' => $prepared->get_data(),
			)
		);
	}

	/**
	 * Prepares the plugin for the REST response.
	 *
	 * @since 5.5.0
	 *
	 * @param mixed           $item    Unmarked up and untranslated plugin data from {@see get_plugin_data()}.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function prepare_item_for_response( $item, $request ) {
		$item   = _get_plugin_data_markup_translate( $item['_file'], $item, false );
		$marked = _get_plugin_data_markup_translate( $item['_file'], $item, true, false );

		$data = array(
			'plugin'       => $item['_file'],
			'status'       => $this->get_plugin_status( $item['_file'] ),
			'name'         => $item['Name'],
			'plugin_uri'   => $item['PluginURI'],
			'author'       => $item['Author'],
			'author_uri'   => $item['AuthorURI'],
			'description'  => array(
				'raw'      => $item['Description'],
				'rendered' => $marked['Description'],
			),
			'version'      => $item['Version'],
			'network_only' => $item['Network'],
			'requires_wp'  => $item['RequiresWP'],
			'requires_php' => $item['RequiresPHP'],
			'text_domain'  => $item['TextDomain'],
		);

		$data = $this->add_additional_fields_to_object( $data, $request );

		$response = new WP_REST_Response( $data );
		$response->add_links( $this->prepare_links( $item ) );

		return $response;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @since 5.5.0
	 *
	 * @param array $item The plugin item.
	 * @return array[]
	 */
	protected function prepare_links( $item ) {
		return array(
			'self' => array(
				'href' => rest_url( sprintf( '%s/%s/%s', $this->namespace, $this->rest_base, substr( $item['_file'], 0, - 4 ) ) ),
			),
		);
	}

	/**
	 * Gets the plugin header data for a plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin The plugin file to get data for.
	 * @return array|WP_Error The plugin data, or a WP_Error if the plugin is not installed.
	 */
	protected function get_plugin_data( $plugin ) {
		$plugins = get_plugins();

		if ( ! isset( $plugins[ $plugin ] ) ) {
			return new WP_Error( 'rest_plugin_not_found', __( 'Plugin not found.', 'gutenberg' ), array( 'status' => 404 ) );
		}

		$data          = $plugins[ $plugin ];
		$data['_file'] = $plugin;

		return $data;
	}

	/**
	 * Get's the activation status for a plugin.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin The plugin file to check.
	 * @return string Either 'network-active', 'active' or 'inactive'.
	 */
	protected function get_plugin_status( $plugin ) {
		if ( is_plugin_active_for_network( $plugin ) ) {
			return 'network-active';
		}

		if ( is_plugin_active( $plugin ) ) {
			return 'active';
		}

		return 'inactive';
	}

	/**
	 * Handle updating a plugin's status.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin         The plugin file to update.
	 * @param string $new_status     The plugin's new status.
	 * @param string $current_status The plugin's current status.
	 *
	 * @return true|WP_Error
	 */
	protected function plugin_status_permission_check( $plugin, $new_status, $current_status ) {
		if ( is_multisite() && ( 'network-active' === $current_status || 'network-active' === $new_status ) && ! current_user_can( 'manage_network_plugins' ) ) {
			return new WP_Error(
				'rest_cannot_manage_network_plugins',
				__( 'Sorry, you do not have permission to manage network plugins.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		if ( ( 'active' === $new_status || 'network-active' === $new_status ) && ! current_user_can( 'activate_plugin', $plugin ) ) {
			return new WP_Error(
				'rest_cannot_activate_plugin',
				__( 'Sorry, you are not allowed to activate this plugin.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		if ( 'inactive' === $new_status && ! current_user_can( 'deactivate_plugin', $plugin ) ) {
			return new WP_Error(
				'rest_cannot_deactivate_plugin',
				__( 'Sorry, you are not allowed to deactivate this plugin.', 'gutenberg' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Handle updating a plugin's status.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin         The plugin file to update.
	 * @param string $new_status     The plugin's new status.
	 * @param string $current_status The plugin's current status.
	 * @return true|WP_Error
	 */
	protected function handle_plugin_status( $plugin, $new_status, $current_status ) {
		if ( 'inactive' === $new_status ) {
			deactivate_plugins( $plugin, false, 'network-active' === $current_status );

			return true;
		}

		if ( 'active' === $new_status && 'network-active' === $current_status ) {
			return true;
		}

		$network_activate = 'network-active' === $new_status;
		$activated        = activate_plugin( $plugin, '', $network_activate );

		if ( ! $network_activate && is_network_only_plugin( $plugin ) && is_multisite() ) {
			return new WP_Error(
				'rest_network_only_plugin',
				__( 'Network only plugin must be network activated.', 'gutenberg' ),
				array( 'status' => 400 )
			);
		}

		if ( is_wp_error( $activated ) ) {
			return $activated;
		}

		return true;
	}

	/**
	 * Checks if the plugin is installed.
	 *
	 * @since 5.5.0
	 *
	 * @param string $plugin The plugin file.
	 * @return bool
	 */
	protected function is_plugin_installed( $plugin ) {
		return file_exists( WP_PLUGIN_DIR . '/' . $plugin );
	}

	/**
	 * Determine if the endpoints are available.
	 *
	 * Only the 'Direct' filesystem transport, and SSH/FTP when credentials are stored are supported at present.
	 *
	 * @since 5.5.0
	 *
	 * @return true|WP_Error True if filesystem is available, WP_Error otherwise.
	 */
	protected function is_filesystem_available() {
		$filesystem_method = get_filesystem_method();

		if ( 'direct' === $filesystem_method ) {
			return true;
		}

		ob_start();
		$filesystem_credentials_are_stored = request_filesystem_credentials( self_admin_url() );
		ob_end_clean();

		if ( $filesystem_credentials_are_stored ) {
			return true;
		}

		return new WP_Error( 'fs_unavailable', __( 'The filesystem is currently unavailable for managing plugins.', 'gutenberg' ) );
	}

	/**
	 * Retrieves the plugin's schema, conforming to JSON Schema.
	 *
	 * @since 4.7.0
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$this->schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'plugin',
			'type'       => 'object',
			'properties' => array(
				'plugin'       => array(
					'description' => __( 'The plugin file.', 'gutenberg' ),
					'type'        => 'string',
					'pattern'     => self::PATTERN,
					'readonly'    => true,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'status'       => array(
					'description' => __( 'The plugin activation status.', 'gutenberg' ),
					'type'        => 'string',
					'enum'        => is_multisite() ? array( 'inactive', 'active', 'network-active' ) : array( 'inactive', 'active' ),
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'name'         => array(
					'description' => __( 'The plugin name.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'plugin_uri'   => array(
					'description' => __( 'The plugin\'s website address.', 'gutenberg' ),
					'type'        => 'string',
					'format'      => 'uri',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
				),
				'author'       => array(
					'description' => __( 'The plugin author.', 'gutenberg' ),
					'type'        => 'object',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
				),
				'author_uri'   => array(
					'description' => __( 'Plugin author\'s website address.', 'gutenberg' ),
					'type'        => 'string',
					'format'      => 'uri',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
				),
				'description'  => array(
					'description' => __( 'The plugin description.', 'gutenberg' ),
					'type'        => 'object',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
					'properties'  => array(
						'raw'      => array(
							'description' => __( 'The raw plugin description.', 'gutenberg' ),
							'type'        => 'string',
						),
						'rendered' => array(
							'description' => __( 'The plugin description formatted for display.', 'gutenberg' ),
							'type'        => 'string',
						),
					),
				),
				'version'      => array(
					'description' => __( 'The plugin version number.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
				),
				'network_only' => array(
					'description' => __( 'Whether the plugin can only be activated network-wide.', 'gutenberg' ),
					'type'        => 'boolean',
					'readonly'    => true,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'requires_wp'  => array(
					'description' => __( 'Minimum required version of WordPress.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'requires_php' => array(
					'description' => __( 'Minimum required version of PHP.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'text_domain'  => array(
					'description' => __( 'The plugin\'s text domain.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
					'context'     => array( 'view', 'edit' ),
				),
			),
		);

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Retrieves the query params for the collections.
	 *
	 * @since 5.5.0
	 *
	 * @return array Query parameters for the collection.
	 */
	public function get_collection_params() {
		return array(
			'context' => $this->get_context_param( array( 'default' => 'view' ) ),
		);
	}
}
