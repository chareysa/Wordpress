<?php
/**
 * Plugin Name: Gutenberg Test Block Context
 * Plugin URI: https://github.com/WordPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-block-context
 */

/**
 * Enqueues a custom script for the plugin.
 */
function gutenberg_test_enqueue_block_context_script() {
	wp_enqueue_script(
		'gutenberg-test-block-context',
		plugins_url( 'block-context/index.js', __FILE__ ),
		array(
			'wp-block-editor',
			'wp-blocks',
			'wp-element',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'block-context/index.js' ),
		true
	);
}
add_action( 'init', 'gutenberg_test_enqueue_block_context_script' );

/**
 * Registers plugin test context blocks.
 */
function gutenberg_test_register_context_blocks() {
	register_block_type(
		'gutenberg/test-context-provider',
		array(
			'attributes'      => array(
				'recordId' => array(
					'type'    => 'number',
					'default' => 0,
				),
			),
			'providesContext' => array(
				'gutenberg/recordId' => 'recordId',
			),
		)
	);

	register_block_type(
		'gutenberg/test-context-consumer',
		array(
			'context' => array( 'gutenberg/recordId' ),
		)
	);
}
add_action( 'init', 'gutenberg_test_register_context_blocks' );
