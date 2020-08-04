<?php
/**
 * Align block support flag.
 *
 * @package gutenberg
 */

/**
 * Registers the attributes block attribute for block types that support it.
 *
 * @param  array $block_type Block Type.
 */
function gutenberg_register_alignment_support( $block_type ) {
	if ( $block_type->supports && array_key_exists( 'align', $block_type->supports ) ) {
		if ( ! $block_type->attributes ) {
			$block_type->attributes = array();
		}

		$block_type->attributes['align'] = array(
			'type' => 'string',
			'enum' => array( 'left', 'center', 'right', 'wide', 'full', '' ),
		);
	}
}

/**
 * Add CSS classes for block alignment to the incoming attributes array.
 * This will be applied to the block markup in the front-end.
 *
 * @param  array $attributes comprehensive list of attributes to be applied.
 * @param  array $block_attributes block attributes.
 * @param  array $block_type Block Type.
 * @return array Block alignment CSS classes and inline styles.
 */
function gutenberg_apply_alignment_support( $attributes, $block_attributes, $block_type ) {
	if ( $block_type->supports && array_key_exists( 'align', $block_type->supports ) ) {
		$has_block_alignment = array_key_exists( 'align', $block_attributes );

		if ( $has_block_alignment ) {
			$attributes['css_classes'][] = sprintf( 'align%s', $block_attributes['align'] );
		}
	}

	return $attributes;
}
