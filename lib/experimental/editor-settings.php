<?php
/**
 * Utilities to manage editor settings.
 *
 * @package gutenberg
 */

/**
 * Initialize a block-based editor.
 *
 * @param string $editor_name          Editor name.
 * @param string $editor_script_handle Editor script handle.
 * @param array  $settings {
 *      Elements to initialize a block-based editor.
 *
 *      @type array  $preload_paths        Array of paths to preload.
 *      @type string $initializer_name     Editor initialization function name.
 *      @type array  $editor_settings      Editor settings.
 * }
 * @return void
 */
function gutenberg_initialize_editor( $editor_name, $editor_script_handle, $settings ) {

	$defaults = array(
		'preload_paths'    => array(),
		'initializer_name' => 'initialize',
		'editor_settings'  => array(),
	);

	$settings = wp_parse_args( $settings, $defaults );

	/**
	 * Preload common data by specifying an array of REST API paths that will be preloaded.
	 *
	 * Filters the array of paths that will be preloaded.
	 *
	 * @param string[] $preload_paths Array of paths to preload.
	 */
	$preload_paths = apply_filters( "{$editor_name}_preload_paths", $settings['preload_paths'] );

	$preload_data = array_reduce(
		$preload_paths,
		'rest_preload_api_request',
		array()
	);

	wp_add_inline_script(
		'wp-api-fetch',
		sprintf(
			'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );',
			wp_json_encode( $preload_data )
		),
		'after'
	);
	wp_add_inline_script(
		"wp-{$editor_script_handle}",
		sprintf(
			'wp.domReady( function() {
				wp.%s.%s( "%s", %s );
			} );',
			lcfirst( str_replace( '-', '', ucwords( $editor_script_handle, '-' ) ) ),
			$settings['initializer_name'],
			str_replace( '_', '-', $editor_name ),
			wp_json_encode( $settings['editor_settings'] )
		)
	);

	// Preload server-registered block schemas.
	wp_add_inline_script(
		'wp-blocks',
		'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
	);
}

/**
 * Sets a global JS variable used to trigger the availability of zoomed out view.
 */
function gutenberg_enable_zoomed_out_view() {
	$gutenberg_experiments = get_option( 'gutenberg-experiments' );
	if ( $gutenberg_experiments && array_key_exists( 'gutenberg-zoomed-out-view', $gutenberg_experiments ) ) {
		wp_add_inline_script( 'wp-block-editor', 'window.__experimentalEnableZoomedOutView = true', 'before' );
	}
}

add_action( 'admin_init', 'gutenberg_enable_zoomed_out_view' );

/**
 * Sets a global JS variable used to trigger the availability of the Navigation List View experiment.
 */
function gutenberg_enable_off_canvas_navigation_editor() {
	$gutenberg_experiments = get_option( 'gutenberg-experiments' );
	if ( $gutenberg_experiments && array_key_exists( 'gutenberg-off-canvas-navigation-editor', $gutenberg_experiments ) ) {
		wp_add_inline_script( 'wp-block-editor', 'window.__experimentalEnableOffCanvasNavigationEditor = true', 'before' );
	}
}

add_action( 'admin_init', 'gutenberg_enable_off_canvas_navigation_editor' );
