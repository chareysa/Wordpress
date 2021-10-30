<?php
/**
 * Server-side rendering of the `core/post-comment-reply-link` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-comment-reply-link` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Return the post comment's reply link.
 */
function render_block_core_post_comment_reply_link( $attributes, $content, $block ) {
	if ( ! isset( $block->context['commentId'] ) ) {
		return '';
	}

	$thread_comments = get_option( 'thread_comments' );
	if ( ! $thread_comments ) {
		return '';
	}

	$comment = get_comment( $block->context['commentId'] );
	if ( empty( $comment ) ) {
		return '';
	}

	$depth     = 1;
	$max_depth = get_option( 'thread_comments_depth' );
	$parent_id = $comment->comment_parent;

	// Compute comment's depth iterating over its ancestors.
	while ( ! empty( $parent_id ) ) {
		$depth++;
		$parent_id = get_comment( $parent_id )->comment_parent;
	}

	$comment_reply_link = get_comment_reply_link(
		array(
			'depth'     => $depth,
			'max_depth' => $max_depth,
		),
		$comment
	);

	// Render nothing if the generated reply link is empty.
	if ( empty( $comment_reply_link ) ) {
		return;
	}

	$classes = '';
	if ( isset( $attributes['textAlign'] ) ) {
		$classes .= 'has-text-align-' . $attributes['textAlign'];
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );

	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$comment_reply_link
	);
}

/**
 * Registers the `core/post-comment-reply-link` block on the server.
 */
function register_block_core_post_comment_reply_link() {
	register_block_type_from_metadata(
		__DIR__ . '/post-comment-reply-link',
		array(
			'render_callback' => 'render_block_core_post_comment_reply_link',
		)
	);
}

add_action( 'init', 'register_block_core_post_comment_reply_link' );
