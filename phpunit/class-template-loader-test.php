<?php
/**
 * Template_Loader_Test class
 *
 * @package WordPress
 */

/**
 * Tests for the block template loading algorithm.
 */
class Template_Loader_Test extends WP_UnitTestCase {
	private static $post;
	private static $template_part_post;

	public static function wpSetUpBeforeClass() {
		switch_theme( 'tt1-blocks' );
		gutenberg_register_template_post_type();
		gutenberg_register_template_part_post_type();
		gutenberg_register_wp_theme_taxonomy();
		gutenberg_register_wp_template_part_area_taxonomy();

		// Set up custom template post.
		$args       = array(
			'post_type'    => 'wp_template',
			'post_name'    => 'wp-custom-template-my-block-template',
			'post_title'   => 'My Custom Block Template',
			'post_content' => 'Content',
			'post_excerpt' => 'Description of my block template',
			'tax_input'    => array(
				'wp_theme' => array(
					get_stylesheet(),
				),
			),
		);
		self::$post = self::factory()->post->create_and_get( $args );
		wp_set_post_terms( self::$post->ID, get_stylesheet(), 'wp_theme' );
	}

	public static function wpTearDownAfterClass() {
		wp_delete_post( self::$post->ID );
	}

	public function tearDown() {
		global $_wp_current_template_content;
		unset( $_wp_current_template_content );
	}

	function test_gutenberg_page_home_block_template_takes_precedence_over_less_specific_block_templates() {
		global $_wp_current_template_content;
		$type                   = 'page';
		$templates              = array(
			'page-home.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path = gutenberg_override_query_template( get_stylesheet_directory() . '/page-home.php', $type, $templates );
		$this->assertEquals( gutenberg_dir_path() . 'lib/template-canvas.php', $resolved_template_path );

		$expected_template = gutenberg_get_block_file_template( get_stylesheet() . '//page-home' );
		$this->assertEquals( $expected_template->content, $_wp_current_template_content );
	}

	function test_gutenberg_page_block_template_takes_precedence() {
		global $_wp_current_template_content;
		$type                   = 'page';
		$templates              = array(
			'page-slug-doesnt-exist.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path = gutenberg_override_query_template( get_stylesheet_directory() . '/page.php', $type, $templates );
		$this->assertEquals( gutenberg_dir_path() . 'lib/template-canvas.php', $resolved_template_path );

		$expected_template = gutenberg_get_block_file_template( get_stylesheet() . '//page' );
		$this->assertEquals( $expected_template->content, $_wp_current_template_content );
	}

	function test_gutenberg_block_template_takes_precedence_over_equally_specific_php_template() {
		global $_wp_current_template_content;
		$type                   = 'index';
		$templates              = array(
			'index.php',
		);
		$resolved_template_path = gutenberg_override_query_template( get_stylesheet_directory() . '/index.php', $type, $templates );
		$this->assertEquals( gutenberg_dir_path() . 'lib/template-canvas.php', $resolved_template_path );

		$expected_template = gutenberg_get_block_file_template( get_stylesheet() . '//index' );
		$this->assertEquals( $expected_template->content, $_wp_current_template_content );
	}

	/**
	 * In a hybrid theme, a PHP template of higher specificity will take precedence over a block template
	 * with lower specificity.
	 *
	 * Covers https://github.com/WordPress/gutenberg/pull/29026.
	 */
	function test_gutenberg_more_specific_php_template_takes_precedence_over_less_specific_block_template() {
		$page_id_template       = 'page-1.php';
		$page_id_template_path  = get_stylesheet_directory() . '/' . $page_id_template;
		$type                   = 'page';
		$templates              = array(
			'page-slug-doesnt-exist.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path = gutenberg_override_query_template( $page_id_template_path, $type, $templates );
		$this->assertEquals( $page_id_template_path, $resolved_template_path );
	}

	/**
	 * If a theme is a child of a block-based parent theme but has php templates for some of its pages,
	 * a php template of the child will take precedence over the parent's block template if they have
	 * otherwise equal specificity.
	 *
	 * Covers https://github.com/WordPress/gutenberg/pull/31123.
	 */
	function test_gutenberg_child_theme_php_template_takes_precedence_over_equally_specific_parent_theme_block_template() {
		register_theme_directory( __DIR__ . '/fixtures/' );
		switch_theme( 'tt1-blocks-child' );

		$page_slug_template      = 'page-home.php';
		$page_slug_template_path = get_stylesheet_directory() . '/' . $page_slug_template;
		$type                    = 'page';
		$templates               = array(
			'page-home.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path  = gutenberg_override_query_template( $page_slug_template_path, $type, $templates );
		$this->assertEquals( $page_slug_template_path, $resolved_template_path );

		switch_theme( 'tt1-blocks' );
	}

	function test_gutenberg_child_theme_block_template_takes_precedence_over_equally_specific_parent_theme_php_template() {
		global $_wp_current_template_content;
		add_filter( 'template_directory', array( $this, 'change_template_directory' ), 10, 1 );

		$page_template                   = 'page.php';
		$parent_theme_page_template_path = get_template_directory() . '/' . $page_template;
		$type                            = 'page';
		$templates                       = array(
			'page-slug-doesnt-exist.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path          = gutenberg_override_query_template( $parent_theme_page_template_path, $type, $templates );
		$this->assertEquals( gutenberg_dir_path() . 'lib/template-canvas.php', $resolved_template_path );

		$expected_template = gutenberg_get_block_file_template( get_stylesheet() . '//index' );
		$this->assertEquals( $expected_template->content, $_wp_current_template_content );
		remove_filter( 'template_directory', array( $this, 'change_template_directory' ) );
	}

	/**
	 * Regression: https://github.com/WordPress/gutenberg/issues/31399.
	 */
	function test_gutenberg_custom_page_php_template_takes_precedence_over_all_other_templates() {
		$custom_page_template      = 'templates/full-width.php';
		$custom_page_template_path = get_stylesheet_directory() . '/' . $custom_page_template;
		$type                      = 'page';
		$templates                 = array(
			$custom_page_template,
			'page-slug.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path    = gutenberg_override_query_template( $custom_page_template_path, $type, $templates );
		$this->assertEquals( $custom_page_template_path, $resolved_template_path );
	}

	/**
	 * Covers: https://github.com/WordPress/gutenberg/pull/30438.
	 */
	function test_gutenberg_custom_page_block_template_takes_precedence_over_all_other_templates() {
		global $_wp_current_template_content;

		$custom_page_block_template = 'wp-custom-template-my-block-template';
		$page_template_path         = get_stylesheet_directory() . '/' . 'page.php';
		$type                       = 'page';
		$templates                  = array(
			$custom_page_block_template,
			'page-slug.php',
			'page-1.php',
			'page.php',
		);
		$resolved_template_path     = gutenberg_override_query_template( $page_template_path, $type, $templates );
		$this->assertEquals( gutenberg_dir_path() . 'lib/template-canvas.php', $resolved_template_path );

		$expected_template = gutenberg_get_block_template( get_stylesheet() . '//' . $custom_page_block_template );
		$this->assertEquals( $expected_template->content, $_wp_current_template_content );
	}

	function change_template_directory( $template_dir ) {
		return $template_dir . '-parent';
	}
}
