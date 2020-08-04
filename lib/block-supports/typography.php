<?php
/**
 * Typography block support flag.
 *
 * @package gutenberg
 */

/**
 * Add CSS classes and inline styles for font sizes to the incoming attributes array.
 * This will be applied to the block markup in the front-end.
 *
 * @param  array $attributes comprehensive list of attributes to be applied.
 * @param  array $block_attributes block attributes.
 * @param  array $block_type block type.
 * @return array Font size CSS classes and inline styles.
 */
function gutenberg_apply_typography_support( $attributes, $block_attributes, $block_type ) {
	$has_font_size_support   = $block_type->supports && array_key_exists( '__experimentalFontSize', $block_type->supports );
	$has_line_height_support = $block_type->supports && array_key_exists( '__experimentalLineHeight', $block_type->supports );

	// Font Size.
	if ( $has_font_size_support ) {
		$has_named_font_size  = array_key_exists( 'fontSize', $block_attributes );
		$has_custom_font_size = isset( $block_attributes['style']['typography']['fontSize'] );

		// Apply required class or style.
		if ( $has_named_font_size ) {
			$attributes['css_classes'][] = sprintf( 'has-%s-font-size', $block_attributes['fontSize'] );
		} elseif ( $has_custom_font_size ) {
			$attributes['inline_styles'][] = sprintf( 'font-size: %spx;', $block_attributes['style']['typography']['fontSize'] );
		}
	}

	// Line Height.
	if ( $has_line_height_support ) {
		$has_line_height = isset( $block_attributes['style']['typography']['lineHeight'] );
		// Add the style (no classes for line-height).
		if ( $has_line_height ) {
			$attributes['inline_styles'][] = sprintf( 'line-height: %s;', $block_attributes['style']['typography']['lineHeight'] );
		}
	}

	return $attributes;
}
