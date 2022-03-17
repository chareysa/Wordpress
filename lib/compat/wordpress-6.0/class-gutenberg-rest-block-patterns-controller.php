<?php
/**
 * REST API: WP_REST_Block_Patterns_Controller class
 *
 * @subpackage REST_API
 * @package    WordPress
 */

/**
 * Core class used to access block patterns via the REST API.
 *
 * @see   WP_REST_Controller
 */
class WP_REST_Block_Patterns_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = '__experimental';
		$this->rest_base = 'block-patterns/patterns';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see   register_rest_route()
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
				'schema'      => array( $this, 'get_public_item_schema' ),
				'allow_batch' => array( 'v1' => true ),
			)
		);
	}

	/**
	 * Checks whether a given request has permission to read navigation areas.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( current_user_can( 'edit_posts' ) ) {
			return true;
		}

		foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
			if ( current_user_can( $post_type->cap->edit_posts ) ) {
				return true;
			}
		}

		return new WP_Error(
			'rest_cannot_view',
			__( 'Sorry, you are not allowed to view the registered block patterns.', 'gutenberg' ),
			array( 'status' => rest_authorization_required_code() )
		);
	}

	/**
	 * Retrieves all block patterns.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		// Load block patterns from w.org.
		_load_remote_block_patterns(); // patterns with the `core` keyword
		_load_remote_featured_patterns(); // patterns in the `featured` category
		gutenberg_register_remote_theme_patterns(); // patterns requested by current theme

		$response = array();
		$patterns = WP_Block_Patterns_Registry::get_instance()->get_all_registered();
		foreach ( $patterns as $pattern ) {
			$prepared_pattern = $this->prepare_item_for_response( $pattern, $request );
			$response[] = $this->prepare_response_for_collection( $prepared_pattern );
		}
		return rest_ensure_response( $response );
	}

	/**
	 * Prepare a raw block pattern before it gets output in a REST API response.
	 *
	 * @param object          $item    Raw pattern as registered, before any changes.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {
		$prepared_pattern = array(
			'name'           => $item['name'],
			'title'          => $item['title'],
			'blockTypes'     => $item['blockTypes'],
			'categories'     => $item['categories'],
			'content'        => $item['content'],
		);

		$prepared_pattern = $this->add_additional_fields_to_object( $prepared_pattern, $request );

		return new WP_REST_Response( $prepared_pattern );
	}

	/**
	 * Retrieves the block pattern schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'block-pattern',
			'type'       => 'object',
			'properties' => array(
				'title'      => array(
					'description' => __( 'The pattern title, in human readable format.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'name'       => array(
					'description' => __( "The pattern name.", 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
				),
				'blockTypes' => array(
					'description' => __( 'Block types that the pattern is intended to be used with.', 'gutenberg' ),
					'type'        => 'array',
					'readonly'    => true,
				),
				'categories' => array(
					'description' => __( "The pattern's category slugs.", 'gutenberg' ),
					'type'        => 'array',
					'readonly'    => true,
				),
				'content'    => array(
					'description' => __( 'The pattern content.', 'gutenberg' ),
					'type'        => 'string',
					'readonly'    => true,
				),
			),
		);

		return $this->add_additional_fields_schema( $schema );
	}
}
