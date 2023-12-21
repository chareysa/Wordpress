<?php
/**
 * Test WP_Font_Library::get_font_collections().
 *
 * @package WordPress
 * @subpackage Font Library
 *
 * @group fonts
 * @group font-library
 *
 * @covers WP_Font_Library::get_font_collections
 */
class Tests_Fonts_WpFontLibrary_GetFontCollections extends WP_UnitTestCase {

	public function reset_collections() {
		// Resets the private static property WP_Font_Library::$collections to empty array.
		$reflection = new ReflectionClass( 'WP_Font_Library' );
		$property   = $reflection->getProperty( 'collections' );
		$property->setAccessible( true );
		$property->setValue( array() );
	}
 
	public function set_up() {
		$this->reset_collections();
	}

	public function tear_down() {
		$this->reset_collections();
	}

	public function test_should_get_an_empty_list() {
		$font_collections = WP_Font_Library::get_font_collections();
		$this->assertEmpty( $font_collections, 'Should return an empty array.' );
	}

	public function test_should_get_mock_font_collection() {
		$my_font_collection_config = array(
			'id'          => 'my-font-collection',
			'name'        => 'My Font Collection',
			'description' => 'Demo about how to a font collection to your WordPress Font Library.',
			'src'         => path_join( __DIR__, 'my-font-collection-data.json' ),
		);

		WP_Font_Library::register_font_collection( $my_font_collection_config );

		$font_collections = WP_Font_Library::get_font_collections();
		$this->assertNotEmpty( $font_collections, 'Sould return an array of font collections.' );
		$this->assertCount( 1, $font_collections, 'Should return an array with one font collection.' );
		$this->assertArrayHasKey( 'my-font-collection', $font_collections, 'The array should have the key of the registered font collection id.' );
		$this->assertInstanceOf( 'WP_Font_Collection', $font_collections['my-font-collection'], 'The value of the array $font_collections[id] should be an instance of WP_Font_Collection class.' );
	}
}
