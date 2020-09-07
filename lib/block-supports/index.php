<?php
/**
 * Block support flags.
 *
 * @package gutenberg
 */

/**
 * Filter the registered blocks to apply the block supports attributes registration.
 */
function gutenberg_register_block_supports() {
	$block_registry         = WP_Block_Type_Registry::get_instance();
	$registered_block_types = $block_registry->get_all_registered();
	// Ideally we need a hook to extend the block registration
	// instead of mutating the block type.
	foreach ( $registered_block_types as $block_type ) {
		gutenberg_register_alignment_support( $block_type );
		gutenberg_register_colors_support( $block_type );
		gutenberg_register_typography_support( $block_type );
		gutenberg_register_custom_classname_support( $block_type );
	}
}

add_action( 'init', 'gutenberg_register_block_supports', 21 );

/**
 * Filters the frontend output of blocks and apply the block support flags transformations.
 *
 * @param  string $block_content rendered block content.
 * @param  array  $block block object.
 * @return string filtered block content.
 */
function gutenberg_apply_block_supports( $block_content, $block ) {
	if ( ! isset( $block['attrs'] ) ) {
		return $block_content;
	}

	$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
	// If no render_callback, assume styles have been previously handled.
	if ( ! $block_type || ! $block_type->render_callback ) {
		return $block_content;
	}

	$attributes = array();
	$attributes = gutenberg_apply_generated_classname_support( $attributes, $block['attrs'], $block_type );
	$attributes = gutenberg_apply_colors_support( $attributes, $block['attrs'], $block_type );
	$attributes = gutenberg_apply_typography_support( $attributes, $block['attrs'], $block_type );
	$attributes = gutenberg_apply_alignment_support( $attributes, $block['attrs'], $block_type );
	$attributes = gutenberg_apply_custom_classname_support( $attributes, $block['attrs'], $block_type );

	if ( ! count( $attributes ) ) {
		return $block_content;
	}

	$dom = new DOMDocument( '1.0', 'utf-8' );

	// Suppress DOMDocument::loadHTML warnings from polluting the front-end.
	$previous = libxml_use_internal_errors( true );

	$body_id = '__BLOCK_SUPPORTS_INJECTED_BODY_ID__';

	// We need to wrap the block in order to handle UTF-8 properly.
	$wrapped_block_html =
		'<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body id="'
		. $body_id
		. '">'
		. $block_content
		. '</body></html>';

	$success = $dom->loadHTML( $wrapped_block_html, LIBXML_HTML_NODEFDTD | LIBXML_COMPACT );

	// Clear errors and reset the use_errors setting.
	libxml_clear_errors();
	libxml_use_internal_errors( $previous );

	if ( ! $success ) {
		return $block_content;
	}

	$body_element = $dom->getElementByID( $body_id );
	$block_root   = $body_element->childNodes[0]; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

	if ( empty( $block_root ) ) {
		return $block_content;
	}

	// Merge and dedupe new and existing classes and styles.
	$current_classes = explode( ' ', trim( $block_root->getAttribute( 'class' ) ) );
	$classes_to_add  = array_key_exists( 'css_classes', $attributes ) ? $attributes['css_classes'] : array();
	$new_classes     = array_unique( array_filter( array_merge( $current_classes, $classes_to_add ) ) );

	$current_styles = preg_split( '/\s*;\s*/', trim( $block_root->getAttribute( 'style' ) ) );
	$styles_to_add  = array_key_exists( 'inline_styles', $attributes ) ? $attributes['inline_styles'] : array();
	$new_styles     = array_unique( array_map( 'gutenberg_normalize_css_rule', array_filter( array_merge( $current_styles, $styles_to_add ) ) ) );

	// Apply new styles and classes.
	if ( ! empty( $new_classes ) ) {
		// `DOMElement::setAttribute` handles attribute value escaping.
		$block_root->setAttribute( 'class', implode( ' ', $new_classes ) );
	}

	if ( ! empty( $new_styles ) ) {
		// `DOMElement::setAttribute` handles attribute value escaping.
		$block_root->setAttribute( 'style', implode( '; ', $new_styles ) . ';' );
	}

	$result = '';
	// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	foreach ( $body_element->childNodes as $child_node ) {
		$result .= $dom->saveHtml( $child_node );
	}
	return $result;
}
add_filter( 'render_block', 'gutenberg_apply_block_supports', 10, 2 );

/**
 * Normalizes spacing in a string representing a CSS rule
 *
 * @example
 * 'color  :red;' becomes 'color:red'
 *
 * @param  string $css_rule_string CSS rule.
 * @return string Normalized CSS rule.
 */
function gutenberg_normalize_css_rule( $css_rule_string ) {
	return trim( implode( ': ', preg_split( '/\s*:\s*/', $css_rule_string, 2 ) ), ';' );
}
