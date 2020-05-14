<?php
/**
 * Bootstraps Global Styles.
 *
 * @package gutenberg
 */

/**
 * Whether the current theme has support for Global Styles.
 *
 * @return boolean
 */
function gutenberg_experimental_global_styles_has_theme_support() {
	return is_readable( locate_template( 'experimental-theme.json' ) );
}

/**
 * Given a styles tree, it creates a flattened one
 * whose keys are the CSS custom properties
 * and its values the CSS custom properties' values.
 *
 * @param array  $styles Styles object to process.
 * @param string $prefix Prefix to prepend to each variable.
 * @param string $token Token to use between levels.
 *
 * @return array The flattened tree.
 */
function gutenberg_experimental_global_styles_get_css_vars( $styles, $prefix = '', $token = '--' ) {
	$result = array();
	foreach ( $styles as $property => $value ) {
		$new_key = $prefix . str_replace( '/', '-', $property );

		if ( is_array( $value ) ) {
			$new_prefix = $new_key . $token;
			$result     = array_merge(
				$result,
				gutenberg_experimental_global_styles_get_css_vars( $value, $new_prefix, $token )
			);
		} else {
			$result[ $new_key ] = $value;
		}
	}
	return $result;
}

/**
 * Processes a file that adheres to the theme.json
 * schema and returns an array with its contents,
 * or a void array if none found.
 *
 * @param string $file_path Path to file.
 * @return array Contents that adhere to the theme.json schema.
 */
function gutenberg_experimental_global_styles_get_from_file( $file_path ) {
	$config = array();
	if ( file_exists( $file_path ) ) {
		$decoded_file = json_decode(
			file_get_contents( $file_path ),
			true
		);
		if ( is_array( $decoded_file ) ) {
			$config = $decoded_file;
		}
	}
	return $config;
}

/**
 * Returns the user's preferences.
 *
 * @return array Config that adheres to the theme.json schema.
 */
function gutenberg_experimental_global_styles_get_user() {
	$config   = array();
	$user_cpt = gutenberg_experimental_global_styles_get_user_cpt( array( 'publish' ) );
	if ( array_key_exists( 'post_content', $user_cpt ) ) {
		$decoded_data = json_decode( $user_cpt['post_content'], true );
		if ( is_array( $decoded_data ) ) {
			$config = $decoded_data;
		}
	}

	return gutenberg_experimental_global_styles_normalize_schema( $config );
}

/**
 * Returns the CPT that contains the user's preferences
 * for the current theme or a void array if none found.
 * It can also create and return a new draft CPT.
 *
 * @param array $post_status_filter Filter CPT by post status.
 *                                  By default, only fetches published posts.
 * @param bool  $should_create_draft Whether a new draft should be created
 *                                   if no CPT was found. False by default.
 * @return array Custom Post Type for the user's preferences.
 */
function gutenberg_experimental_global_styles_get_user_cpt( $post_status_filter = array( 'publish' ), $should_create_draft = false ) {
	$user_cpt         = array();
	$post_type_filter = 'wp_global_styles';
	$post_name_filter = 'wp-global-styles-' . strtolower( wp_get_theme()->get( 'TextDomain' ) );
	$recent_posts     = wp_get_recent_posts(
		array(
			'numberposts' => 1,
			'orderby'     => 'date',
			'order'       => 'desc',
			'post_type'   => $post_type_filter,
			'post_status' => $post_status_filter,
			'name'        => $post_name_filter,
		)
	);

	if ( is_array( $recent_posts ) && ( count( $recent_posts ) === 1 ) ) {
		$user_cpt = $recent_posts[0];
	} elseif ( $should_create_draft ) {
		$cpt_post_id = wp_insert_post(
			array(
				'post_content' => '{}',
				'post_status'  => 'draft',
				'post_type'    => $post_type_filter,
				'post_name'    => $post_name_filter,
			),
			true
		);
		$user_cpt    = get_post( $cpt_post_id, ARRAY_A );
	}

	return $user_cpt;
}

/**
 * Returns the post ID of the CPT containing the user's preferences.
 *
 * @return integer Custom Post Type ID for the user's preferences.
 */
function gutenberg_experimental_global_styles_get_user_cpt_id() {
	$user_cpt_id = null;
	$user_cpt    = gutenberg_experimental_global_styles_get_user_cpt( array( 'publish', 'draft' ), true );
	if ( array_key_exists( 'ID', $user_cpt ) ) {
		$user_cpt_id = $user_cpt['ID'];
	}
	return $user_cpt_id;
}

/**
 * Return core's preferences.
 *
 * @return array Config that adheres to the theme.json schema.
 */
function gutenberg_experimental_global_styles_get_core() {
	$config = gutenberg_experimental_global_styles_get_from_file(
		dirname( dirname( __FILE__ ) ) . '/experimental-default-global-styles.json'
	);

	return gutenberg_experimental_global_styles_normalize_schema( $config );
}

/**
 * Returns the theme presets registered via add_theme_support, if any.
 *
 * @return array
 */
function gutenberg_experimental_global_styles_get_theme_presets() {
	$theme_presets = gutenberg_experimental_global_styles_normalize_schema( array() );

	$theme_colors = get_theme_support( 'editor-color-palette' )[0];
	if ( is_array( $theme_colors ) ) {
		foreach ( $theme_colors as $color ) {
			$theme_presets['global']['presets']['color'][ $color['slug'] ] = $color['color'];
		}
	}

	$theme_gradients = get_theme_support( 'editor-gradient-presets' )[0];
	if ( is_array( $theme_gradients ) ) {
		foreach ( $theme_gradients as $gradient ) {
			$theme_presets['global']['presets']['gradient'][ $gradient['slug'] ] = $gradient['gradient'];
		}
	}

	$theme_font_sizes = get_theme_support( 'editor-font-sizes' )[0];
	if ( is_array( $theme_font_sizes ) ) {
		foreach ( $theme_font_sizes as $font_size ) {
			$theme_presets['global']['presets']['font-size'][ $font_size['slug'] ] = $font_size['size'];
		}
	}

	return $theme_presets;
}

/**
 * Returns the theme's preferences. It also fetches
 * the existing presets the theme declared via add_theme_support
 * and adds them to the global presets.
 *
 * @return array Config that adheres to the theme.json schema.
 */
function gutenberg_experimental_global_styles_get_theme() {
	$theme_presets = gutenberg_experimental_global_styles_get_theme_presets();
	$theme_config  = gutenberg_experimental_global_styles_normalize_schema(
		gutenberg_experimental_global_styles_get_from_file(
			locate_template( 'experimental-theme.json' )
		)
	);

	/*
	 * We want the presets declared in theme.json
	 * to take precedence over the ones declared via add_theme_support.
	 */
	$theme_config = gutenberg_experimental_global_styles_merge_trees(
		$theme_presets,
		$theme_config
	);

	return $theme_config;
}

/**
 * Retrieves the block data (selector/supports).
 *
 * @return array
 */
function gutenberg_experimental_global_styles_get_block_data() {
	// TODO: this data should be taken from the block registry.
	//
	// At the moment this array replicates the current capabilities
	// declared by blocks via __experimentalLineHeight,
	// __experimentalColor, and __experimentalFontSize.
	$block_data = array(
		'global'          => array(
			'selector' => ':root',
			'supports' => array(),
		),
		'core/paragraph'  => array(
			'selector' => 'p',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h1' => array(
			'selector' => 'h1',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h2' => array(
			'selector' => 'h2',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h3' => array(
			'selector' => 'h3',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h4' => array(
			'selector' => 'h4',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h5' => array(
			'selector' => 'h5',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/heading/h6' => array(
			'selector' => 'h6',
			'supports' => array( 'line-height', 'font-size', 'color' ),
		),
		'core/columns'    => array(
			'selector' => '.wp-block-columns',
			'supports' => array( 'color' ),
		),
		'core/group'      => array(
			'selector' => '.wp-block-group',
			'supports' => array( 'color' ),
		),
		'core/media-text' => array(
			'selector' => '.wp-block-media-text',
			'supports' => array( 'color' ),
		),
	);

	return $block_data;
}

/**
 * Takes a tree adhering to the theme.json schema and generates
 * the corresponding stylesheet.
 *
 * @param array $tree Input tree.
 *
 * @return string Stylesheet.
 */
function gutenberg_experimental_global_styles_resolver( $tree ) {
	$stylesheet = '';
	$block_data = gutenberg_experimental_global_styles_get_block_data();
	foreach ( array_keys( $tree ) as $block_name ) {
		if (
			! array_key_exists( $block_name, $block_data ) ||
			! array_key_exists( 'selector', $block_data[ $block_name ] ) ||
			! array_key_exists( 'supports', $block_data[ $block_name ] )
		) {
			// Skip blocks that haven't declared support,
			// so we don't know to process.
			continue;
		}

		$token         = '--';
		$prefix        = '--wp--preset' . $token;
		$css_variables = gutenberg_experimental_global_styles_get_css_vars( $tree[ $block_name ]['presets'], $prefix, $token );

		$stylesheet .= gutenberg_experimental_global_styles_resolver_styles(
			$block_data[ $block_name ]['selector'],
			$block_data[ $block_name ]['supports'],
			array_merge( $tree[ $block_name ]['styles'], $css_variables )
		);
	}
	return $stylesheet;
}

/**
 * Generates CSS declarations for a block.
 *
 * @param string $block_selector CSS selector for the block.
 * @param array  $block_supports A list of properties supported by the block.
 * @param array  $block_styles The list of properties/values to be converted to CSS.
 *
 * @return string The corresponding CSS rule.
 */
function gutenberg_experimental_global_styles_resolver_styles( $block_selector, $block_supports, $block_styles ) {
	$css_rule         = '';
	$css_declarations = '';
	foreach ( $block_styles as $property => $value ) {
		// Only convert to CSS:
		//
		// 1) The style attributes the block has declared support for.
		// 2) Any CSS custom property attached to the node.
		if ( in_array( $property, $block_supports, true ) || strstr( $property, '--' ) ) {
			$css_declarations .= "\t" . $property . ': ' . $value . ";\n";
		}
	}
	if ( '' !== $css_declarations ) {
		$css_rule .= $block_selector . " {\n";
		$css_rule .= $css_declarations;
		$css_rule .= "}\n";
	}

	return $css_rule;
}

/**
 * Helper function that merges trees that adhere to the theme.json schema.
 *
 * @param array ...$trees List of trees to be merged.
 *
 * @return array The merged result.
 */
function gutenberg_experimental_global_styles_merge_trees( ...$trees ) {
	$accumulator = gutenberg_experimental_global_styles_normalize_schema( array() );

	foreach ( $trees as $tree ) {
		foreach ( array_keys( $accumulator ) as $block_name ) {
			foreach ( array_keys( $accumulator['global']['presets'] ) as $property ) {
				if ( ! empty( $tree[ $block_name ]['presets'][ $property ] ) ) {
					$accumulator[ $block_name ]['presets'][ $property ] = $tree[ $block_name ]['presets'][ $property ];
				}
			}
		}
	}

	foreach ( $trees as $tree ) {
		foreach ( array_keys( $accumulator ) as $block_name ) {
			if ( ! empty( $tree[ $block_name ]['styles'] ) ) {
				$accumulator[ $block_name ]['styles'] = $tree[ $block_name ]['styles'];
			}
		}
	}

	return $accumulator;
}

/**
 * Given a tree, it normalizes it to the expected schema.
 *
 * @param array $tree Source tree to normalize.
 *
 * @return array Normalized tree.
 */
function gutenberg_experimental_global_styles_normalize_schema( $tree ) {
	$block_schema = array(
		'styles'   => array(),
		'features' => array(),
		'presets'  => array(
			'color'     => array(),
			'font-size' => array(),
			'gradient'  => array(),
		),
	);

	$normalized_tree = array( 'global' => array( $block_schema ) );
	$block_data      = gutenberg_experimental_global_styles_get_block_data();
	foreach ( array_keys( $block_data ) as $block_name ) {
		$normalized_tree[ $block_name ] = $block_schema;
	}

	$tree = array_merge_recursive(
		$normalized_tree,
		$tree
	);

	return $tree;
}

/**
 * Returns the stylesheet resulting of merging
 * core's, theme's, and user's preferences.
 *
 * @return string
 */
function gutenberg_experimental_global_styles_get_stylesheet() {
	$gs_merged = array();
	$gs_core   = gutenberg_experimental_global_styles_get_core();
	$gs_theme  = gutenberg_experimental_global_styles_get_theme();
	$gs_user   = gutenberg_experimental_global_styles_get_user();

	$gs_merged = gutenberg_experimental_global_styles_merge_trees( $gs_core, $gs_theme, $gs_user );

	$stylesheet = gutenberg_experimental_global_styles_resolver( $gs_merged );
	if ( empty( $stylesheet ) ) {
		return;
	}
	return $stylesheet;
}

/**
 * Fetches the preferences for each origin (core, theme, user)
 * and enqueues the resulting stylesheet.
 */
function gutenberg_experimental_global_styles_enqueue_assets() {
	if ( ! gutenberg_experimental_global_styles_has_theme_support() ) {
		return;
	}

	$stylesheet = gutenberg_experimental_global_styles_get_stylesheet();

	wp_register_style( 'global-styles', false, array(), true, true );
	wp_add_inline_style( 'global-styles', $stylesheet );
	wp_enqueue_style( 'global-styles' );
}

/**
 * Whether the loaded page is the site editor.
 *
 * @return boolean Whether the loaded page is the site editor.
 */
function gutenberg_experimental_global_styles_is_site_editor() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}

	$screen = get_current_screen();
	return ! empty( $screen ) && gutenberg_is_edit_site_page( $screen->id );
}

/**
 * Adds the necessary data for the Global Styles client UI to the block settings.
 *
 * @param array $settings Existing block editor settings.
 * @return array New block editor settings
 */
function gutenberg_experimental_global_styles_settings( $settings ) {
	if (
		! gutenberg_experimental_global_styles_has_theme_support() ||
		! gutenberg_experimental_global_styles_is_site_editor()
	) {
		return $settings;
	}

	$settings['__experimentalGlobalStylesUserEntityId'] = gutenberg_experimental_global_styles_get_user_cpt_id();

	$global_styles = gutenberg_experimental_global_styles_merge_trees(
		gutenberg_experimental_global_styles_get_core(),
		gutenberg_experimental_global_styles_get_theme()
	);

	$settings['__experimentalGlobalStylesBase'] = $global_styles;

	// Add the styles for the editor via the settings
	// so they get processed as if they were added by add_editor_styles:
	// they will get the editor wrapper class.
	$settings['styles'][] = array( 'css' => gutenberg_experimental_global_styles_get_stylesheet() );

	return $settings;
}

/**
 * Registers a Custom Post Type to store the user's preferences.
 */
function gutenberg_experimental_global_styles_register_cpt() {
	if ( ! gutenberg_experimental_global_styles_has_theme_support() ) {
		return;
	}

	$args = array(
		'label'        => __( 'Global Styles', 'gutenberg' ),
		'description'  => 'CPT to store user design tokens',
		'public'       => false,
		'show_ui'      => false,
		'show_in_rest' => true,
		'rest_base'    => '__experimental/global-styles',
		'capabilities' => array(
			'read'                   => 'edit_theme_options',
			'create_posts'           => 'edit_theme_options',
			'edit_posts'             => 'edit_theme_options',
			'edit_published_posts'   => 'edit_theme_options',
			'delete_published_posts' => 'edit_theme_options',
			'edit_others_posts'      => 'edit_theme_options',
			'delete_others_posts'    => 'edit_theme_options',
		),
		'map_meta_cap' => true,
		'supports'     => array(
			'editor',
			'revisions',
		),
	);
	register_post_type( 'wp_global_styles', $args );
}

if ( gutenberg_is_experiment_enabled( 'gutenberg-full-site-editing' ) ) {
	add_action( 'init', 'gutenberg_experimental_global_styles_register_cpt' );
	add_filter( 'block_editor_settings', 'gutenberg_experimental_global_styles_settings' );
	add_action( 'wp_enqueue_scripts', 'gutenberg_experimental_global_styles_enqueue_assets' );
}
