<?php
/**
 * Navigation block block hooks tests.
 *
 * @package WordPress
 * @subpackage Blocks
 */

/**
 * Tests for the Navigation block.
 *
 * @group blocks
 */
class Block_Navigation_Block_Hooks_Test extends WP_UnitTestCase {
	/**
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Original markup.
	 *
	 * @var string
	 */
	protected static $original_markup;

	/**
	 * Post object.
	 *
	 * @var object
	 */
	protected static $navigation_post;

	/**
	 * Setup method.
	 *
	 * * @param WP_UnitTest_Factory $factory Helper that lets us create fake data.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			array(
				'role' => 'administrator',
			)
		);

		//self::$original_markup = '<!-- wp:navigation-link {"label":"News & About","type":"page","id":2,"url":"http://localhost:8888/?page_id=2","kind":"post-type"} /-->';

		self::$navigation_post = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'wp_navigation',
				'post_title'   => 'Navigation Menu',
				'post_content' => 'Original content',
			)
		);
	}

	/**
	 *
	 */
	public static function wpTearDownAfterClass() {
		self::delete_user( self::$admin_id );
	}

	/**
	 * Tear down each test method.
	 */
	public function tear_down() {
		$registry = WP_Block_Type_Registry::get_instance();

		if ( $registry->is_registered( 'tests/my-block' ) ) {
			$registry->unregister( 'tests/my-block' );
		}

		parent::tear_down();
	}

	/**
	 * @covers ::gutenberg_block_core_navigation_update_ignore_hooked_blocks_meta
	 */
	public function test_block_core_navigation_update_ignore_hooked_blocks_meta_preserves_entities() {
		if ( ! function_exists( 'set_ignored_hooked_blocks_metadata' ) ) {
			$this->markTestSkipped( 'Test skipped on WordPress versions that do not included required Block Hooks functionalit.' );
		}

		register_block_type(
			'tests/my-block',
			array(
				'block_hooks' => array(
					'core/navigation' => 'last_child',
				),
			)
		);

		$original_markup    = '<!-- wp:navigation-link {"label":"News & About","type":"page","id":2,"url":"http://localhost:8888/?page_id=2","kind":"post-type"} /-->';
		$post               = new stdClass();
		$post->ID           = self::$navigation_post->ID;
		$post->post_content = $original_markup;

		$post = gutenberg_block_core_navigation_update_ignore_hooked_blocks_meta( $post );

		// We expect the '&' character to be replaced with its unicode representation.
		$expected_markup = str_replace( '&', '\u0026', $original_markup );

		$this->assertSame(
			$expected_markup,
			$post->post_content,
			'Post content did not match expected markup with entities escaped.'
		);
		$this->assertSame(
			array( 'tests/my-block' ),
			json_decode( get_post_meta( self::$navigation_post->ID, '_wp_ignored_hooked_blocks', true ), true ),
			'Block was not added to ignored hooked blocks metadata.'
		);
	}

	/**
	 * @covers ::gutenberg_block_core_navigation_update_ignore_hooked_blocks_meta
	 */
	public function test_block_core_navigation_rest_creation() {
		wp_set_current_user( self::$admin_id );

		$post_type_object = get_post_type_object( 'wp_navigation' );
		$request          = new WP_REST_Request( 'POST', '/wp/v2/' . $post_type_object->rest_base );
		$request->set_body_params(
			array(
				'title'   => 'Title ' . $post_type_object->label,
				'content' => $post_type_object->label,
				'_locale' => 'user',
			)
		);
		$response = rest_get_server()->dispatch( $request );

		$this->assertNotEmpty( $response->get_status() );
		$this->assertSame( 201, $response->get_status() );
	}
}
