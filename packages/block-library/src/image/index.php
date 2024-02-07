<?php
/**
 * Server-side rendering of the `core/image` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/image` block on the server,
 * adding a data-id attribute to the element if core/gallery has added on pre-render.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block object.
 *
 * @return string The block content with the data-id attribute added.
 */
function render_block_core_image( $attributes, $content, $block ) {
	if ( false === stripos( $content, '<img' ) ) {
		return '';
	}

	$processor = new WP_HTML_Tag_Processor( $content );

	if ( ! $processor->next_tag( 'img' ) || null === $processor->get_attribute( 'src' ) ) {
		return '';
	}

	if ( isset( $attributes['data-id'] ) ) {
		// Add the data-id="$id" attribute to the img element
		// to provide backwards compatibility for the Gallery Block,
		// which now wraps Image Blocks within innerBlocks.
		// The data-id attribute is added in a core/gallery `render_block_data` hook.
		$processor->set_attribute( 'data-id', $attributes['data-id'] );
	}

	$link_destination  = isset( $attributes['linkDestination'] ) ? $attributes['linkDestination'] : 'none';
	$lightbox_settings = block_core_image_get_lightbox_settings( $block->parsed_block );

	/*
	 * If the lightbox is enabled and the image is not linked, add the filter
	 * and the JavaScript view file.
	 */
	if (
		isset( $lightbox_settings ) &&
		'none' === $link_destination &&
		isset( $lightbox_settings['enabled'] ) &&
		true === $lightbox_settings['enabled']
	) {
		wp_enqueue_script_module( '@wordpress/block-library/image' );

		/*
		 * This render needs to happen in a filter with priority 15 to ensure that
		 * it runs after the duotone filter and that duotone styles are applied to
		 * the image in the lightbox. Lightbox has to work with any plugins that
		 * might use filters as well. Removing this can be considered in the
		 * future if the way the blocks are rendered changes, or if a
		 * new kind of filter is introduced.
		 */
		add_filter( 'render_block_core/image', 'block_core_image_render_lightbox', 15, 2 );
	} else {
		/*
		 * Remove the filter if previously added by other Image blocks.
		 */
		remove_filter( 'render_block_core/image', 'block_core_image_render_lightbox', 15 );
	}

	return $processor->get_updated_html();
}

/**
 * Adds the lightboxEnabled flag to the block data.
 *
 * This is used to determine whether the lightbox should be rendered or not.
 *
 * @param array $block Block data.
 *
 * @return array Filtered block data.
 */
function block_core_image_get_lightbox_settings( $block ) {
	// Get the lightbox setting from the block attributes.
	if ( isset( $block['attrs']['lightbox'] ) ) {
		$lightbox_settings = $block['attrs']['lightbox'];
	}

	if ( ! isset( $lightbox_settings ) ) {
		$lightbox_settings = wp_get_global_settings( array( 'lightbox' ), array( 'block_name' => 'core/image' ) );

		// If not present in global settings, check the top-level global settings.
		//
		// NOTE: If no block-level settings are found, the previous call to
		// `wp_get_global_settings` will return the whole `theme.json`
		// structure in which case we can check if the "lightbox" key is present at
		// the top-level of the global settings and use its value.
		if ( isset( $lightbox_settings['lightbox'] ) ) {
			$lightbox_settings = wp_get_global_settings( array( 'lightbox' ) );
		}
	}

	return $lightbox_settings ?? null;
}

/**
 * Adds the directives and layout needed for the lightbox behavior.
 *
 * @param string $block_content Rendered block content.
 * @param array  $block         Block object.
 *
 * @return string Filtered block content.
 */
function block_core_image_render_lightbox( $block_content, $block ) {
	/*
	 * If it's not possible that an IMG element exists then return the given
	 * block content as-is. It may be that there's no actual image in the block
	 * or it could be that another plugin already modified this HTML.
	 */
	if ( false === stripos( $block_content, '<img' ) ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );

	$aria_label = __( 'Enlarge image' );

	/*
	 * If there's definitely no IMG element in the block then return the given
	 * block content as-is. There's nothing that this code can knowingly modify
	 * to add the lightbox behavior.
	 */
	if ( ! $processor->next_tag( 'img' ) ) {
		return $block_content;
	}

	$alt_attribute = $processor->get_attribute( 'alt' );

	// An empty alt attribute `alt=""` is valid for decorative images.
	if ( is_string( $alt_attribute ) ) {
		$alt_attribute = trim( $alt_attribute );
	}

	// It only makes sense to append the alt text to the button aria-label when the alt text is non-empty.
	if ( $alt_attribute ) {
		/* translators: %s: Image alt text. */
		$aria_label = sprintf( __( 'Enlarge image: %s' ), $alt_attribute );
	}

	// Note: We want to store the `src` in the context so we
	// can set it dynamically when the lightbox is opened.
	if ( isset( $block['attrs']['id'] ) ) {
		$img_uploaded_src = wp_get_attachment_url( $block['attrs']['id'] );
		$img_metadata     = wp_get_attachment_metadata( $block['attrs']['id'] );
		$img_width        = $img_metadata['width'] ?? 'none';
		$img_height       = $img_metadata['height'] ?? 'none';
	} else {
		$img_uploaded_src = $processor->get_attribute( 'src' );
		$img_width        = 'none';
		$img_height       = 'none';
	}

	if ( isset( $block['attrs']['scale'] ) ) {
		$scale_attr = $block['attrs']['scale'];
	} else {
		$scale_attr = false;
	}

	$w = new WP_HTML_Tag_Processor( $block_content );
	$w->next_tag( 'figure' );
	$w->add_class( 'wp-lightbox-container' );
	$class_names = $w->get_attribute( 'class' );
	$w->set_attribute( 'data-wp-interactive', '{"namespace":"core/image"}' );

	$w->set_attribute(
		'data-wp-context',
		wp_json_encode(
			array(
				'uploadedSrc'  => $img_uploaded_src,
				'classNames'   => $class_names,
				'targetWidth'  => $img_width,
				'targetHeight' => $img_height,
				'scaleAttr'    => $scale_attr,
				'ariaLabel'    => $aria_label,
			),
			JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
		)
	);
	$w->next_tag( 'img' );
	$w->set_attribute( 'data-wp-init--image', 'callbacks.initImage' );
	$w->set_attribute( 'data-wp-init--set-button-styles', 'callbacks.setButtonStyles' );
	$w->set_attribute( 'data-wp-on--load', 'callbacks.setButtonStyles' );
	// We need to set an event callback on the `img` specifically
	// because the `figure` element can also contain a caption, and
	// we don't want to trigger the lightbox when the caption is clicked.
	$w->set_attribute( 'data-wp-on--click', 'actions.showLightbox' );
	$w->set_attribute( 'data-wp-watch', 'callbacks.setStylesOnResize' );
	$body_content = $w->get_updated_html();

	// Add a button alongside image in the body content.
	$img = null;
	preg_match( '/<img[^>]+>/', $body_content, $img );

	$button =
		$img[0]
		. '<button
			class="lightbox-trigger"
			type="button"
			aria-haspopup="dialog"
			aria-label="' . esc_attr( $aria_label ) . '"
			data-wp-init="callbacks.initTriggerButton"
			data-wp-on--click="actions.showLightbox"
			data-wp-style--right="context.imageButtonRight"
			data-wp-style--top="context.imageButtonTop"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
				<path fill="#fff" d="M2 0a2 2 0 0 0-2 2v2h1.5V2a.5.5 0 0 1 .5-.5h2V0H2Zm2 10.5H2a.5.5 0 0 1-.5-.5V8H0v2a2 2 0 0 0 2 2h2v-1.5ZM8 12v-1.5h2a.5.5 0 0 0 .5-.5V8H12v2a2 2 0 0 1-2 2H8Zm2-12a2 2 0 0 1 2 2v2h-1.5V2a.5.5 0 0 0-.5-.5H8V0h2Z" />
			</svg>
		</button>';

	$body_content = preg_replace( '/<img[^>]+>/', $button, $body_content );

	add_action( 'wp_footer', 'block_core_image_print_lightbox_overlay' );

	return $body_content;
}

function block_core_image_print_lightbox_overlay() {
	$close_button_label = esc_attr__( 'Close' );

	// If the current theme does NOT have a `theme.json`, or the colors are not
	// defined, we need to set the background color & close button color to some
	// default values because we can't get them from the Global Styles.
	$background_color   = '#fff';
	$close_button_color = '#000';
	if ( wp_theme_has_theme_json() ) {
		$global_styles_color = wp_get_global_styles( array( 'color' ) );
		if ( ! empty( $global_styles_color['background'] ) ) {
			$background_color = esc_attr( $global_styles_color['background'] );
		}
		if ( ! empty( $global_styles_color['text'] ) ) {
			$close_button_color = esc_attr( $global_styles_color['text'] );
		}
	}

	echo <<<HTML
		<div 
			class="wp-lightbox-overlay zoom"
			data-wp-interactive='{"namespace":"core/image"}'
			data-wp-context='{}'
			data-wp-bind--role="state.roleAttribute"
			data-wp-bind--aria-label="state.ariaLabel"
			data-wp-bind--aria-modal="state.ariaModal"
			data-wp-class--active="state.lightboxEnabled"
			data-wp-class--hideAnimationEnabled="state.hideAnimationEnabled"
			data-wp-init="callbacks.initOverlay"
			data-wp-watch="callbacks.setOverlayFocus"
			data-wp-on--keydown="actions.handleKeydown"
			data-wp-on--touchstart="actions.handleTouchStart"
			data-wp-on--touchmove="actions.handleTouchMove"
			data-wp-on--touchend="actions.handleTouchEnd"
			data-wp-on--click="actions.hideLightbox"
			tabindex="-1"
			>
				<button type="button" aria-label="$close_button_label" style="fill: $close_button_color" class="close-button">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>
				</button>
				<div class="lightbox-image-container">
					<figure data-wp-bind--class="state.currentImage.classNames" data-wp-bind--style="state.currentImage.styles">
						<img data-wp-bind--src="state.currentImage.currentSrc" data-wp-style--object-fit="state.lightboxObjectFit">
					</figure>
				</div>
				<div class="lightbox-image-container">
					<figure data-wp-bind--class="state.currentImage.classNames" data-wp-bind--style="state.currentImage.styles">
						<img data-wp-bind--src="state.enlargedSrc" data-wp-style--object-fit="state.lightboxObjectFit" >
					</figure>
				</div>
				<div class="scrim" style="background-color: $background_color" aria-hidden="true"></div>
		</div>
HTML;
}

/**
 * Registers the `core/image` block on server.
 */
function register_block_core_image() {
	register_block_type_from_metadata(
		__DIR__ . '/image',
		array(
			'render_callback' => 'render_block_core_image',
		)
	);

	if ( defined( 'IS_GUTENBERG_PLUGIN' ) && IS_GUTENBERG_PLUGIN ) {
		$module_url = gutenberg_url( '/build/interactivity/image.min.js' );
	}

	wp_register_script_module(
		'@wordpress/block-library/image',
		isset( $module_url ) ? $module_url : includes_url( 'blocks/image/view.min.js' ),
		array( '@wordpress/interactivity' ),
		defined( 'GUTENBERG_VERSION' ) ? GUTENBERG_VERSION : get_bloginfo( 'version' )
	);
}
add_action( 'init', 'register_block_core_image' );
