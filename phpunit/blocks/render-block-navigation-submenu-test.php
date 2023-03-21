<?php
/**
 * Tests server side rendering of core/navigation-submenu
 *
 * @package    Gutenberg
 * @subpackage block-library
 */

/**
 * Tests for various cases in Navigation Submenu rendering
 */
class Render_Block_Navigation_Submenu_Test extends WP_UnitTestCase {
	private static $category;
	private static $page;
	private static $draft;
	private static $custom_draft;
	private static $custom_post;

	private static $pages;
	private static $terms;
	/**
	 * @var array|null
	 */
	private $original_block_supports;

	public static function set_up_before_class() {

		self::$draft   = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'page',
				'post_status'  => 'draft',
				'post_name'    => 'ceilingcat',
				'post_title'   => 'Ceiling Cat',
				'post_content' => 'Ceiling Cat content',
				'post_excerpt' => 'Ceiling Cat',
			)
		);
		self::$pages[] = self::$draft;

		self::$custom_draft = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'cats',
				'post_status'  => 'draft',
				'post_name'    => 'metalcat',
				'post_title'   => 'Metal Cat',
				'post_content' => 'Metal Cat content',
				'post_excerpt' => 'Metal Cat',
			)
		);
		self::$pages[]      = self::$custom_draft;

		self::$custom_post = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'dogs',
				'post_status'  => 'publish',
				'post_name'    => 'metaldog',
				'post_title'   => 'Metal Dog',
				'post_content' => 'Metal Dog content',
				'post_excerpt' => 'Metal Dog',
			)
		);
		self::$pages[]     = self::$custom_post;

		self::$page    = self::factory()->post->create_and_get(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_name'    => 'tabby',
				'post_title'   => 'Tabby cats',
				'post_content' => 'Tabby cat content',
				'post_excerpt' => 'Tabby cat',
			)
		);
		self::$pages[] = self::$page;

		self::$category = self::factory()->category->create_and_get(
			array(
				'taxonomy'    => 'category',
				'name'        => 'cats',
				'slug'        => 'cats',
				'description' => 'Cats Category',
			)
		);

		self::$terms[] = self::$category;
	}

	public function set_up() {
		parent::set_up();

		$this->original_block_supports      = WP_Block_Supports::$block_to_render;
		WP_Block_Supports::$block_to_render = array(
			'attrs'     => array(),
			'blockName' => '',
		);
	}

	public function tear_down() {
		WP_Block_Supports::$block_to_render = $this->original_block_supports;
		parent::tear_down();
	}

	/**
	 * @group submenu-color-inheritance
	 * @covers ::gutenberg_render_block_core_navigation_submenu
	 */
	public function test_should_apply_preset_colors_inherited_from_parent_block_via_context() {
		$page_id = self::$page->ID;

		$parsed_blocks = parse_blocks(
			'<!-- wp:navigation-submenu {"label":"Submenu Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} -->
            <!-- wp:navigation-link {"label":"Submenu Item Link Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} /-->
        <!-- /wp:navigation-submenu -->'
		);

		$this->assertEquals( 1, count( $parsed_blocks ), 'Submenu block not parsable.' );

		$block = $parsed_blocks[0];

		// Colors inherited from parent Navigation block.
		$context = array(
			'overlayTextColor'       => 'purple',
			'overlayBackgroundColor' => 'yellow',
		);

		$navigation_link_block = new WP_Block( $block, $context );

		$rendered_html = gutenberg_render_block_core_navigation_submenu(
			$navigation_link_block->attributes,
			array(),
			$navigation_link_block
		);

		$p = new WP_HTML_Tag_Processor( $rendered_html );
		$p->next_tag(
			array(
				'tag_name'   => 'ul',
				'class_name' => 'wp-block-navigation__submenu-container',
			)
		);
		$p->get_attribute( 'class' );

		$this->assertEquals(
			'wp-block-navigation__submenu-container has-text-color has-purple-color has-background has-yellow-background-color',
			$p->get_attribute( 'class' ),
			'Submenu block colors inherited from context not applied correctly'
		);
	}

	/**
	 * @group submenu-color-inheritance
	 * @covers ::gutenberg_render_block_core_navigation_submenu
	 */
	public function test_should_apply_custom_colors_inherited_from_parent_block_via_context() {
		$page_id = self::$page->ID;

		$parsed_blocks = parse_blocks(
			'<!-- wp:navigation-submenu {"label":"Submenu Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} -->
            <!-- wp:navigation-link {"label":"Submenu Item Link Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} /-->
        <!-- /wp:navigation-submenu -->'
		);

		$this->assertEquals( 1, count( $parsed_blocks ), 'Submenu block not parsable.' );

		$block = $parsed_blocks[0];

		// Colors inherited from parent Navigation block.
		$context = array(
			'customOverlayTextColor'       => '#BCC60A',
			'customOverlayBackgroundColor' => '#E10E0E',
		);

		$navigation_link_block = new WP_Block( $block, $context );

		$this->assertStringContainsString(
			'<ul style="color:' . $context['customOverlayTextColor'] . ';background-color:' . $context['customOverlayBackgroundColor'] . ';" class="wp-block-navigation__submenu-container has-text-color has-background">',
			gutenberg_render_block_core_navigation_submenu(
				$navigation_link_block->attributes,
				array(),
				$navigation_link_block
			),
			'Submenu block colors inherited from context not applied correctly'
		);
	}

	/**
	 * @group submenu-color-inheritance
	 * @covers ::gutenberg_render_block_core_navigation_submenu
	 */
	public function test_should_apply_mix_of_preset_and_custom_colors_inherited_from_parent_block_via_context() {
		$page_id = self::$page->ID;

		$parsed_blocks = parse_blocks(
			'<!-- wp:navigation-submenu {"label":"Submenu Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} -->
            <!-- wp:navigation-link {"label":"Submenu Item Link Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} /-->
        <!-- /wp:navigation-submenu -->'
		);

		$this->assertEquals( 1, count( $parsed_blocks ), 'Submenu block not parsable.' );

		$block = $parsed_blocks[0];

		// Colors inherited from parent Navigation block.
		$context = array(
			'overlayTextColor'             => 'purple',
			'customOverlayBackgroundColor' => '#E10E0E',
		);

		$navigation_link_block = new WP_Block( $block, $context );

		$this->assertStringContainsString(
			'<ul style="background-color:' . $context['customOverlayBackgroundColor'] . ';" class="wp-block-navigation__submenu-container has-text-color has-' . $context['overlayTextColor'] . '-color has-background">',
			gutenberg_render_block_core_navigation_submenu(
				$navigation_link_block->attributes,
				array(),
				$navigation_link_block
			),
			'Submenu block colors inherited from context not applied correctly'
		);
	}

	/**
	 * @group submenu-color-inheritance
	 * @covers ::gutenberg_render_block_core_navigation_submenu
	 */
	public function test_should_not_apply_custom_colors_if_missing_from_context() {
		$page_id = self::$page->ID;

		$parsed_blocks = parse_blocks(
			'<!-- wp:navigation-submenu {"label":"Submenu Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} -->
            <!-- wp:navigation-link {"label":"Submenu Item Link Label","type":"page","id":' . $page_id . ',"url":"http://localhost:8888/?page_id=' . $page_id . '","kind":"post-type"} /-->
        <!-- /wp:navigation-submenu -->'
		);

		$this->assertEquals( 1, count( $parsed_blocks ), 'Submenu block not parsable.' );

		$block = $parsed_blocks[0];

		// Intentionally empty - no colors.
		$context = array();

		$navigation_link_block = new WP_Block( $block, $context );

		$actual = gutenberg_render_block_core_navigation_submenu(
			$navigation_link_block->attributes,
			array(),
			$navigation_link_block
		);

		$this->assertStringContainsString(
			'<ul class="wp-block-navigation__submenu-container">',
			$actual,
			'Submenu block should not apply colors if missing from context'
		);

		$this->assertStringNotContainsString(
			$actual,
			'has-text-color has-background',
			'Submenu block should not apply "has-*" color classes if missing from context'
		);

	}
}
