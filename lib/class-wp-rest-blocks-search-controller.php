<?php
/**
 * Start: Include for phase 2
 * Block Areas REST API: WP_REST_Blocks_Controller class
 *
 * @package gutenberg
 * @since 5.7.0
 */

/**
 * Controller which provides REST endpoint for the blocks.
 *
 * @since 5.2.0
 *
 * @see WP_REST_Controller
 */
class WP_REST_Blocks_Search_Controller extends WP_REST_Controller {

	/**
	 * Constructs the controller.
	 *
	 * @access public
	 */
	public function __construct() {
		$this->namespace = '__experimental';
		$this->rest_base = 'blocks';
	}

	/**
	 * Registers the necessary REST API routes.
	 *
	 * @access public
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
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Checks whether a given request has permission to read blocks.
	 *
	 * @since 5.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return new WP_Error(
				'rest_user_cannot_view',
				__( 'Sorry, you are not allowed to install blocks.', 'gutenberg' )
			);
		}

		return true;
	}

	/**
	 * Retrieves all blocks.
	 *
	 * @since 5.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {

		if ( ! isset($_REQUEST[ 'search' ] ) ) {
			return rest_ensure_response( array() );
		}

		$search_string = preg_quote( $_REQUEST[ 'search' ] );

		include( ABSPATH . WPINC . '/version.php' );

		$url = 'http://api.wordpress.org/plugins/info/1.2/';
		$url = add_query_arg(
			array(
				'action'  => 'query_plugins',
				'request[block]' => $search_string,
				'request[wp_version]' => '5.3',
				'request[per_page]' => '3'
			),
			$url
		);
		$http_url = $url;
		$ssl      = wp_http_supports( array( 'ssl' ) );
		if ( $ssl ) {
			$url = set_url_scheme( $url, 'https' );
		}
		$http_args = array(
			'timeout'    => 15,
			'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url( '/' ),
		);

		$request  = wp_remote_get( $url, $http_args );
		$response = json_decode( wp_remote_retrieve_body( $request ), true );

		return rest_ensure_response( array_map( 'parse_block_metadata', $response[ 'plugins' ] ) );
	}
}

function parse_block_metadata( $plugin ) {
	$block                  = new stdClass();
	$block->id              = $plugin[ 'slug' ];

	// TODO: map to name in block.json
	$block->name            = $plugin[ 'slug' ] === 'boxer-block' ? 'boxer/boxer': 'lez-library/listicles';

	// DECIDE: Plugin's name or Title in block.json
	$block->title           = $plugin[ 'name' ];

	// DECIDE: Plugin's description or description in block.json
	$block->description     = wp_strip_all_tags( $plugin[ 'description' ] );

	$block->rating          = $plugin[ 'rating' ];
	$block->ratingCount     = $plugin[ 'num_ratings' ];
	$block->activeInstalls  = $plugin[ 'active_installs' ];

	// DECIDE: Plugin's author or author in block.json
	$block->author          = wp_strip_all_tags( $plugin[ 'author' ] );

	// DECIDE: Plugin's icons or icon in block.json
	$block->icon            = isset( $plugin[ 'icons' ][ '1x' ] ) ? $plugin[ 'icons' ][ '1x' ] : 'block-default';

	// TODO: map to name in block.json 
	// Note: asset property with dependencies proposal: https://github.com/WordPress/gutenberg/pull/13693#issuecomment-491814028
	$block->assets          = $plugin[ 'slug' ] === 'boxer-block'
	? json_decode( '{
		"editor_script": {
			"src": "http://plugins.svn.wordpress.org/boxer-block/trunk/build/index.js"
		},
		"view_script": {
			"src": "http://plugins.svn.wordpress.org/boxer-block/trunk/build/view.js"
		},
		"style": {
			"src": "http://plugins.svn.wordpress.org/boxer-block/trunk/style.css"
		},
		"editor_style": {
			"src": "http://plugins.svn.wordpress.org/boxer-block/trunk/editor.css"
		}
	}' )
	: json_decode( '{
		"editor_script": {
			"src": "http://plugins.svn.wordpress.org/listicles/trunk/dist/blocks.build.js"
		},
		"style": {
			"src": "http://plugins.svn.wordpress.org/listicles/trunk/dist/blocks.style.build.css"
		},
		"editor_style": {
			"src": "http://plugins.svn.wordpress.org/listicles/trunk/dist/blocks.editor.build.css"
		}
	}' );

	$block->humanizedUpdated = human_time_diff( strtotime( $plugin[ 'last_updated' ] ), current_time( 'timestamp' ) ) . __( ' ago' );

	// TODO: calculate these values
	$block->authorAverageRating = null;
	$block->authorBlocksCount   = null;
	$block->authorSupportTime   = null;

	return $block;
}