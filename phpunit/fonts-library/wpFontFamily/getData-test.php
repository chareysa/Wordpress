<?php
/**
 * Test WP_Font_Family::get_data().
 *
 * @package WordPress
 * @subpackage Fonts Library
 *
 * @group fonts
 * @group fonts-library
 *
 * @covers WP_Font_Family::get_data
 */
class Tests_Fonts_WpFontsLibrary_GetData extends WP_UnitTestCase {

	/**
	 * @dataProvider data_should_get_data
	 *
	 * @param array $font_data Font family data in theme.json format.
	 */
	public function test_should_get_data( $font_data ) {
		$font = new WP_Font_Family( $font_data );
		$this->assertSame( $font_data, $font->get_data() );
	}

	/**
	 * Data provider.
	 *
	 * @return array[]
	 */
	public function data_should_get_data() {
		return array(
			'with one google font face to be downloaded' => array(
				array(
					'name'       => 'Piazzolla',
					'slug'       => 'piazzolla',
					'fontFamily' => 'Piazzolla',
					'fontFace'   => array(
						array(
							'fontFamily'        => 'Piazzolla',
							'fontStyle'         => 'italic',
							'fontWeight'        => '400',
							'src'               => 'http://fonts.gstatic.com/s/piazzolla/v33/N0b72SlTPu5rIkWIZjVgI-TckS03oGpPETyEJ88Rbvi0_TzOzKcQhZqx3gX9BRy5m5M.ttf',
							'download_from_url' => 'http://fonts.gstatic.com/s/piazzolla/v33/N0b72SlTPu5rIkWIZjVgI-TckS03oGpPETyEJ88Rbvi0_TzOzKcQhZqx3gX9BRy5m5M.ttf',
						),
					),
				),
			),
			'with one google font face to not be downloaded' => array(
				array(
					'name'       => 'Piazzolla',
					'slug'       => 'piazzolla',
					'fontFamily' => 'Piazzolla',
					'fontFace'   => array(
						array(
							'fontFamily' => 'Piazzolla',
							'fontStyle'  => 'italic',
							'fontWeight' => '400',
							'src'        => 'http://fonts.gstatic.com/s/piazzolla/v33/N0b72SlTPu5rIkWIZjVgI-TckS03oGpPETyEJ88Rbvi0_TzOzKcQhZqx3gX9BRy5m5M.ttf',
						),
					),
				),
			),
			'without font faces'                         => array(
				array(
					'name'       => 'Arial',
					'slug'       => 'arial',
					'fontFamily' => 'Arial',
					'fontFace'   => array(),
				),
			),
			'with local files'                           => array(
				array(
					'name'       => 'Inter',
					'slug'       => 'inter',
					'fontFamily' => 'Inter',
					'fontFace'   => array(
						array(
							'fontFamily'    => 'Inter',
							'fontStyle'     => 'normal',
							'fontWeight'    => '400',
							'uploaded_file' => 'files0',
						),
						array(
							'fontFamily'    => 'Inter',
							'fontStyle'     => 'normal',
							'fontWeight'    => '500',
							'uploaded_file' => 'files1',
						),
					),
				),
			),
		);
	}
}
