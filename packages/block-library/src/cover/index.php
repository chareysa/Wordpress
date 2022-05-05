<?php
/**
 * Server-side rendering of the `core/cover` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/cover` block on server.
 *
 * @param array $attributes The block attributes.
 * @param array $content    The block rendered content.
 *
 * @return string Returns the cover block markup, if useFeaturedImage is true.
 */
function render_block_core_cover( $attributes, $content ) {
	if ( false === $attributes['useFeaturedImage'] ) {
		return $content;
	}

	$is_image_background = 'image' === $attributes['backgroundType'];
	if ( ! $is_image_background ) {
		return $content;
	}

	$is_img_element = ! ( $attributes['hasParallax'] || $attributes['isRepeated'] );

	if ( $is_img_element ) {
		$object_position = '';
		if ( isset( $attributes['focalPoint'] ) ) {
			$object_position = round( $attributes['focalPoint']['x'] * 100 ) . '%' . ' ' . round( $attributes['focalPoint']['y'] * 100 ) . '%';
		}

		$attr = array(
			"class"                => "wp-block-cover__image-background",
			"style"                => "object-position: " . $object_position,
			"data-object-fit"      => "cover",
			"data-object-position" => $object_position,
		);

		$image = get_the_post_thumbnail( null, 'post-thumbnail', $attr );

		$content = str_replace(
			'</span><div',
			'</span>' . $image . '<div',
			$content
		);

	} else {
		if ( in_the_loop() ) {
			update_post_thumbnail_cache();
		}
		$current_featured_image = get_the_post_thumbnail_url();
		$content                = preg_replace(
			'/class=\".*?\"/',
			'${0} style="background-image:url(' . esc_url( $current_featured_image ) . ')"',
			$content,
			1
		);
	}


	return $content;
}

/**
 * Registers the `core/cover` block renderer on server.
 */
function register_block_core_cover() {
	register_block_type_from_metadata(
		__DIR__ . '/cover',
		array(
			'render_callback' => 'render_block_core_cover',
		)
	);
}
add_action( 'init', 'register_block_core_cover' );
