<?php
/**
 * Tests_Formatting_Wordcount class
 *
 * @package WordPress
 */

class Tests_Formatting_Wordcount extends WP_UnitTestCase {
	public function test_word_count() {
		$expected_settings = array(
			array(
				'message'                     => 'Basic test.',
				'string'                      => 'one two three',
				'words'                       => 3,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 13,
			),
			array(
				'message'                     => 'HTML tags.',
				'string'                      => 'one <em class="test">two</em><br />three',
				'words'                       => 3,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 12,
			),
			array(
				'message'                     => 'Line breaks.',
				'string'                      => "one\ntwo\nthree",
				'words'                       => 3,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 11,
			),
			array(
				'message'                     => 'Encoded spaces.',
				'string'                      => 'one&nbsp;two&#160;three',
				'words'                       => 3,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 13,
			),

			/*
			// phpcs:ignore Squiz.Commenting.BlockComment.NoCapital
			array(
				'message'                     => 'Punctuation.',
				'string'                      => "It's two three " . json_decode( '"\u2026"' ) . ' 4?',
				'words'                       => 3,
				'characters_excluding_spaces' => 15,
				'characters_including_spaces' => 19,
			),
			*/

			/*
			// phpcs:ignore Squiz.Commenting.BlockComment.NoCapital
			array(
				'message'                       => 'Em dash.',
				'string'                        => 'one' . json_decode( '"\u2014"' ) . '--three',
				'words'                         => 3,
				'characters_excluding_spaces'   => 14,
				'characters_including_spaces'   => 14,
			),
			*/
			array(
				'message'                     => 'Shortcodes.',
				'string'                      => 'one [shortcode attribute="value"]two[/shortcode]three',
				'words'                       => 3,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 12,
			),

			/*
			// phpcs:ignore Squiz.Commenting.BlockComment.NoCapital
			array(
				'message'                     => 'Astrals.',
				'string'                      => '\uD83D\uDCA9',
				'words'                       => 1,
				'characters_excluding_spaces' => 1,
				'characters_including_spaces' => 1,
			),
			*/
			array(
				'message'                     => 'HTML comment.',
				'string'                      => 'one<!-- comment -->two three',
				'words'                       => 2,
				'characters_excluding_spaces' => 11,
				'characters_including_spaces' => 12,
			),
			array(
				'message'                     => 'HTML entity.',
				'string'                      => '&gt; test',
				'words'                       => 1,
				'characters_excluding_spaces' => 5,
				'characters_including_spaces' => 6,
			),
		);

		foreach ( $expected_settings as $expected_setting ) {
			foreach ( array( 'words', 'characters_excluding_spaces', 'characters_including_spaces' ) as $type ) {
				$this->assertEquals(
					gutenberg_word_count( $expected_setting['string'], $type ),
					$expected_setting[ $type ],
					$expected_setting['message'] . ' (' . $type . ')'
				);
			}
		}
	}
}
