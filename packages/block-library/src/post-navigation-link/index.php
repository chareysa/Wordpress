<?php
/**
 * Server-side rendering of the `core/post-navigation-link` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-navigation-link` block on the server.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block default content.
 *
 * @return string Returns the next or previous post link that is adjacent to the current post.
 */
function render_block_core_post_navigation_link( $attributes, $content ) {
	if ( ! is_singular() ) {
		return '';
	}

	// Get the nagigation type to show the proper link. Available options are `next|previous`.
	$navigation_type = isset( $attributes['type'] ) ? $attributes['type'] : 'next';
	// Allow only `next` and `previous` in `$navigation_type`.
	if ( ! in_array( $navigation_type, array( 'next', 'previous' ), true ) ) {
		return '';
	}
	$classes = "post-navigation-link-$navigation_type";
	if ( isset( $attributes['textAlign'] ) ) {
		$classes .= " has-text-align-{$attributes['textAlign']}";
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );
	// Set default values.
	$format = '%link';
	$link   = 'next' === $navigation_type ? _x( 'Next', 'label for next post link', 'gutenberg' ) : _x( 'Previous', 'label for previous post link', 'gutenberg' );
	$label  = '';
	// If a custom label is provided, make this a link.
	// `$label` is used to prepend the provided label, if we want to show the page title as well.
	if ( isset( $attributes['label'] ) && ! empty( $attributes['label'] ) ) {
		$label = "{$attributes['label']}";
		$link  = $label;
	}

	// If we want to also show the page title, make the page title a link and prepend the label.
	if ( isset( $attributes['showTitle'] ) && $attributes['showTitle'] ) {
		if ( $label ) {
			$format = "$label %link";
		}
		$link = '%title';
	}
	// The dynamic portion of the function name, `$navigation_type`,
	// refers to the type of adjacency, 'next' or 'previous'.
	$get_link_function = "get_{$navigation_type}_post_link";
	$content           = $get_link_function( $format, $link );
	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `core/post-navigation-link` block on the server.
 */
function register_block_core_post_navigation_link() {
	register_block_type_from_metadata(
		__DIR__ . '/post-navigation-link',
		array(
			'render_callback' => 'render_block_core_post_navigation_link',
		)
	);
}
add_action( 'init', 'register_block_core_post_navigation_link' );
