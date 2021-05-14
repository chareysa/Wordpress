<?php
/**
 * Bootstraps Global Styles.
 *
 * @package gutenberg
 */

/**
 * Takes a tree adhering to the theme.json schema and generates
 * the corresponding stylesheet.
 *
 * @param WP_Theme_JSON $tree Input tree.
 * @param string        $type Type of stylesheet we want accepts 'all', 'block_styles', and 'css_variables'.
 *
 * @return string Stylesheet.
 */
function gutenberg_experimental_global_styles_get_stylesheet( $tree, $type = 'all' ) {
	// Check if we can use cached.
	$can_use_cached = (
		( 'all' === $type ) &&
		( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) &&
		( ! defined( 'SCRIPT_DEBUG' ) || ! SCRIPT_DEBUG ) &&
		( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) &&
		! is_admin()
	);

	if ( $can_use_cached ) {
		// Check if we have the styles already cached.
		$cached = get_transient( 'global_styles' );
		if ( $cached ) {
			return $cached;
		}
	}

	$stylesheet = $tree->get_stylesheet( $type );

	if ( $can_use_cached ) {
		// Cache for a minute.
		// This cache doesn't need to be any longer, we only want to avoid spikes on high-traffic sites.
		set_transient( 'global_styles', $stylesheet, MINUTE_IN_SECONDS );
	}

	return $stylesheet;
}

/**
 * Fetches the preferences for each origin (core, theme, user)
 * and enqueues the resulting stylesheet.
 */
function gutenberg_experimental_global_styles_enqueue_assets() {
	if (
		! get_theme_support( 'experimental-link-color' ) && // link color support needs the presets CSS variables regardless of the presence of theme.json file.
		! WP_Theme_JSON_Resolver::theme_has_support() ) {
		return;
	}

	$settings = gutenberg_get_default_block_editor_settings();
	$all      = WP_Theme_JSON_Resolver::get_merged_data( $settings );

	$stylesheet = gutenberg_experimental_global_styles_get_stylesheet( $all );
	if ( empty( $stylesheet ) ) {
		return;
	}

	wp_register_style( 'global-styles', false, array(), true, true );
	wp_add_inline_style( 'global-styles', $stylesheet );
	wp_enqueue_style( 'global-styles' );
}

/**
 * Adds the necessary data for the Global Styles client UI to the block settings.
 *
 * This can be removed when plugin support requires WordPress 5.8.0+.
 *
 * @param array $settings Existing block editor settings.
 * @return array New block editor settings
 */
function gutenberg_experimental_global_styles_settings( $settings ) {
	// Set what is the context for this data request.
	$context = 'all';
	if (
		is_callable( 'get_current_screen' ) &&
		function_exists( 'gutenberg_is_edit_site_page' ) &&
		gutenberg_is_edit_site_page( get_current_screen()->id ) &&
		WP_Theme_JSON_Resolver::theme_has_support() &&
		gutenberg_supports_block_templates()
	) {
		$context = 'site-editor';
	}

	// So far, only mobile will use the endpoint.
	// However, we should be more specific here.
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		$context = 'mobile';
	}

	$origin = 'theme';
	if (
		WP_Theme_JSON_Resolver::theme_has_support() &&
		gutenberg_supports_block_templates()
	) {
		// Only lookup for the user data if we need it.
		$origin = 'user';
	}
	$consolidated = WP_Theme_JSON_Resolver::get_merged_data( $settings, $origin );

	if ( 'mobile' === $context ) {
		$settings['__experimentalStyles'] = $consolidated->get_raw_data()['styles'];
	}

	if ( 'site-editor' === $context ) {
		$theme       = WP_Theme_JSON_Resolver::get_merged_data( $settings, 'theme' );
		$user_cpt_id = WP_Theme_JSON_Resolver::get_user_custom_post_type_id();

		$settings['__experimentalGlobalStylesUserEntityId'] = $user_cpt_id;
		$settings['__experimentalGlobalStylesBaseStyles']   = $theme->get_raw_data();
	}

	if (
		'site-editor' !== $context &&
		'mobile' !== $context &&
		( WP_Theme_JSON_Resolver::theme_has_support() || get_theme_support( 'experimental-link-color' ) )
	) {
		$block_styles  = array( 'css' => gutenberg_experimental_global_styles_get_stylesheet( $consolidated, 'block_styles' ) );
		$css_variables = array(
			'css'                     => gutenberg_experimental_global_styles_get_stylesheet( $consolidated, 'css_variables' ),
			'__experimentalNoWrapper' => true,
		);

		$settings['styles'][] = $css_variables;
		$settings['styles'][] = $block_styles;
	}

	$settings['__experimentalFeatures'] = $consolidated->get_settings();
	unset( $settings['colors'] );
	unset( $settings['disableCustomColors'] );
	unset( $settings['disableCustomFontSizes'] );
	unset( $settings['disableCustomGradients'] );
	unset( $settings['enableCustomLineHeight'] );
	unset( $settings['enableCustomUnits'] );
	unset( $settings['enableCustomSpacing'] );
	unset( $settings['fontSizes'] );
	unset( $settings['gradients'] );

	return $settings;
}

/**
 * Register CPT to store/access user data.
 *
 * @return array|undefined
 */
function gutenberg_experimental_global_styles_register_user_cpt() {
	if ( ! WP_Theme_JSON_Resolver::theme_has_support() ) {
		return;
	}

	WP_Theme_JSON_Resolver::register_user_custom_post_type();
}

add_action( 'init', 'gutenberg_experimental_global_styles_register_user_cpt' );
// This can be removed when plugin support requires WordPress 5.8.0+.
if ( function_exists( 'get_block_editor_settings' ) ) {
	add_filter( 'block_editor_settings_all', 'gutenberg_experimental_global_styles_settings', PHP_INT_MAX );
} else {
	add_filter( 'block_editor_settings', 'gutenberg_experimental_global_styles_settings', PHP_INT_MAX );

}
add_action( 'wp_enqueue_scripts', 'gutenberg_experimental_global_styles_enqueue_assets' );


/**
 * Sanitizes global styles user content removing unsafe rules.
 *
 * @param string $content Post content to filter.
 * @return string Filtered post content with unsafe rules removed.
 */
function gutenberg_global_styles_filter_post( $content ) {
	$decoded_data        = json_decode( stripslashes( $content ), true );
	$json_decoding_error = json_last_error();
	if (
		JSON_ERROR_NONE === $json_decoding_error &&
		is_array( $decoded_data ) &&
		isset( $decoded_data['isGlobalStylesUserThemeJSON'] ) &&
		$decoded_data['isGlobalStylesUserThemeJSON']
	) {
		unset( $decoded_data['isGlobalStylesUserThemeJSON'] );
		$theme_json = new WP_Theme_JSON( $decoded_data );
		$theme_json->remove_insecure_properties();
		$data_to_encode                                = $theme_json->get_raw_data();
		$data_to_encode['isGlobalStylesUserThemeJSON'] = true;
		return wp_json_encode( $data_to_encode );
	}
	return $content;
}

/**
 * Adds the filters to filter global styles user theme.json.
 */
function gutenberg_global_styles_kses_init_filters() {
	add_filter( 'content_save_pre', 'gutenberg_global_styles_filter_post' );
}

/**
 * Removes the filters to filter global styles user theme.json.
 */
function gutenberg_global_styles_kses_remove_filters() {
	remove_filter( 'content_save_pre', 'gutenberg_global_styles_filter_post' );
}

/**
 * Register global styles kses filters if the user does not have unfiltered_html capability.
 *
 * @uses render_block_core_navigation()
 * @throws WP_Error An WP_Error exception parsing the block definition.
 */
function gutenberg_global_styles_kses_init() {
	gutenberg_global_styles_kses_remove_filters();
	if ( ! current_user_can( 'unfiltered_html' ) ) {
		gutenberg_global_styles_kses_init_filters();
	}
}

/**
 * This filter is the last being executed on force_filtered_html_on_import.
 * If the input of the filter is true it means we are in an import situation and should
 * enable kses, independently of the user capabilities.
 * So in that case we call gutenberg_global_styles_kses_init_filters;
 *
 * @param string $arg Input argument of the filter.
 * @return string Exactly what was passed as argument.
 */
function gutenberg_global_styles_force_filtered_html_on_import_filter( $arg ) {
	// force_filtered_html_on_import is true we need to init the global styles kses filters.
	if ( $arg ) {
		gutenberg_global_styles_kses_init_filters();
	}
	return $arg;
}

/**
 * This filter is the last being executed on force_filtered_html_on_import.
 * If the input of the filter is true it means we are in an import situation and should
 * enable kses, independently of the user capabilities.
 * So in that case we call gutenberg_global_styles_kses_init_filters;
 *
 * @param bool $allow_css       Whether the CSS in the test string is considered safe.
 * @param bool $css_test_string The CSS string to test..
 * @return bool If $allow_css is true it returns true.
 * If $allow_css is false and the CSS rule is referencing a WordPress css variable it returns true.
 * Otherwise the function return false.
 */
function gutenberg_global_styles_include_support_for_wp_variables( $allow_css, $css_test_string ) {
	if ( $allow_css ) {
		return $allow_css;
	}
	$allowed_preset_attributes = array(
		'background',
		'background-color',
		'border-color',
		'color',
		'font-family',
		'font-size',
	);
	$parts                     = explode( ':', $css_test_string, 2 );

	if ( ! in_array( trim( $parts[0] ), $allowed_preset_attributes, true ) ) {
		return $allow_css;
	}
	return ! ! preg_match( '/^var\(--wp-[a-zA-Z0-9\-]+\)$/', trim( $parts[1] ) );
}


add_action( 'init', 'gutenberg_global_styles_kses_init' );
add_action( 'set_current_user', 'gutenberg_global_styles_kses_init' );
add_filter( 'force_filtered_html_on_import', 'gutenberg_global_styles_force_filtered_html_on_import_filter', 999 );
add_filter( 'safecss_filter_attr_allow_css', 'gutenberg_global_styles_include_support_for_wp_variables', 10, 2 );
// This filter needs to be executed last.

