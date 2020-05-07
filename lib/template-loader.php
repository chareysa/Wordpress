<?php
/**
 * Block template loader functions.
 *
 * @package gutenberg
 */

/**
 * Return a list of all overrideable default template types.
 *
 * @see get_query_template
 *
 * @return string[] List of all overrideable default template types.
 */
function get_template_types() {
	return array(
		'index',
		'404',
		'archive',
		'author',
		'category',
		'tag',
		'taxonomy',
		'date',
		'embed',
		'home',
		'front-page',
		'privacy-policy',
		'page',
		'search',
		'single',
		'singular',
		'attachment',
	);
}

/**
 * Adds necessary filters to use 'wp_template' posts instead of theme template files.
 */
function gutenberg_add_template_loader_filters() {
	if ( ! post_type_exists( 'wp_template' ) ) {
		return;
	}

	foreach ( get_template_types() as $template_type ) {
		if ( 'embed' === $template_type ) { // Skip 'embed' for now because it is not a regular template type.
			continue;
		}
		add_filter( str_replace( '-', '', $template_type ) . '_template', 'gutenberg_override_query_template', 20, 3 );
	}
}
add_action( 'wp_loaded', 'gutenberg_add_template_loader_filters' );

/**
 * Get the template hierarchy for a given template type.
 *
 * Internally, this filters into the "{$type}_template_hierarchy" hook to record the type-specific template hierarchy.
 *
 * @param string $template_type A template type.
 * @return string[] A list of template candidates, in descending order of priority.
 */
function get_template_hierachy( $template_type ) {
	if ( ! in_array( $template_type, get_template_types(), true ) ) {
		return array();
	}

	$get_template_function     = 'get_' . str_replace( '-', '_', $template_type ) . '_template'; // front-page -> get_front_page_template.
	$template_hierarchy_filter = str_replace( '-', '', $template_type ) . '_template_hierarchy'; // front-page -> frontpage_template_hierarchy.

	$result                             = array();
	$template_hierarchy_filter_function = function( $templates ) use ( &$result ) {
		$result = $templates;
		return $templates;
	};

	add_filter( $template_hierarchy_filter, $template_hierarchy_filter_function, 20, 1 );
	call_user_func( $get_template_function ); // This invokes template_hierarchy_filter.
	remove_filter( $template_hierarchy_filter, $template_hierarchy_filter_function, 20 );

	return $result;
}

/**
 * Filters into the "{$type}_template" hooks to redirect them to the Full Site Editing template canvas.
 *
 * Internally, this communicates the block content that needs to be used by the template canvas through a global variable.
 *
 * @param string $template  Path to the template. See locate_template().
 * @param string $type      Sanitized filename without extension.
 * @param array  $templates A list of template candidates, in descending order of priority.
 * @return string The path to the Full Site Editing template canvas file.
 */
function gutenberg_override_query_template( $template, $type, array $templates = array() ) {
	global $_wp_current_template_id, $_wp_current_template_content;

	$current_template_post = gutenberg_find_template_post( $templates );

	if ( $current_template_post ) {
		$_wp_current_template_id      = $current_template_post->ID;
		$_wp_current_template_content = empty( $current_template_post->post_content ) ? __( 'Empty template.', 'gutenberg' ) : $current_template_post->post_content;
	}

	// Add hooks for template canvas.
	// Add viewport meta tag.
	add_action( 'wp_head', 'gutenberg_viewport_meta_tag', 0 );

	// Render title tag with content, regardless of whether theme has title-tag support.
	remove_action( 'wp_head', '_wp_render_title_tag', 1 );    // Remove conditional title tag rendering...
	add_action( 'wp_head', 'gutenberg_render_title_tag', 1 ); // ...and make it unconditional.

	// This file will be included instead of the theme's template file.
	return gutenberg_dir_path() . 'lib/template-canvas.php';
}

/**
 * Recursively traverses a block tree, creating auto drafts
 * for any encountered template parts without a fixed post.
 *
 * @access private
 *
 * @param array $block The root block to start traversing from.
 */
function create_auto_draft_for_template_part_block( $block ) {
	global $_wp_current_template_part_ids;

	if ( 'core/template-part' === $block['blockName'] ) {
		if ( isset( $block['attrs']['postId'] ) ) {
			// Template part is customized.
			$template_part_id = $block['attrs']['postId'];
		} else {
			// A published post might already exist if this template part
			// was customized elsewhere or if it's part of a customized
			// template. We also check if an auto-draft was already created
			// because preloading can make this run twice, so, different code
			// paths can end up with different posts for the same template part.
			// E.g. The server could send back post ID 1 to the client, preload,
			// and create another auto-draft. So, if the client tries to resolve the
			// post ID from the slug and theme, it won't match with what the server sent.
			$template_part_query = new WP_Query(
				array(
					'post_type'      => 'wp_template_part',
					'post_status'    => array( 'publish', 'auto-draft' ),
					'name'           => $block['attrs']['slug'],
					'meta_key'       => 'theme',
					'meta_value'     => $block['attrs']['theme'],
					'posts_per_page' => 1,
					'no_found_rows'  => true,
				)
			);
			$template_part_post  = $template_part_query->have_posts() ? $template_part_query->next_post() : null;
			if ( $template_part_post ) {
				$template_part_id = $template_part_post->ID;
			} else {
				// Template part is not customized, get it from a file and make an auto-draft for it.
				$template_part_file_path =
				get_stylesheet_directory() . '/block-template-parts/' . $block['attrs']['slug'] . '.html';
				if ( ! file_exists( $template_part_file_path ) ) {
					if ( gutenberg_is_experiment_enabled( 'gutenberg-full-site-editing-demo' ) ) {
						$template_part_file_path =
							dirname( __FILE__ ) . '/demo-block-template-parts/' . $block['attrs']['slug'] . '.html';
						if ( ! file_exists( $template_part_file_path ) ) {
							return;
						}
					} else {
						return;
					}
				}
				$template_part_id = wp_insert_post(
					array(
						'post_content' => file_get_contents( $template_part_file_path ),
						'post_title'   => $block['attrs']['slug'],
						'post_status'  => 'auto-draft',
						'post_type'    => 'wp_template_part',
						'post_name'    => $block['attrs']['slug'],
						'meta_input'   => array(
							'theme' => $block['attrs']['theme'],
						),
					)
				);
			}
		}

		if ( isset( $_wp_current_template_part_ids ) ) {
			$_wp_current_template_part_ids[ $block['attrs']['slug'] ] = $template_part_id;
		} else {
			$_wp_current_template_part_ids = array( $block['attrs']['slug'] => $template_part_id );
		}
	}

	foreach ( $block['innerBlocks'] as $inner_block ) {
		create_auto_draft_for_template_part_block( $inner_block );
	}
}

/**
 * Return the correct 'wp_template' post for the current template hierarchy.
 *
 * @param string[] $template_hierarchy The current template hierarchy, ordered by priority.
 * @return WP_Post|null A template post object, or null if none could be found.
 */
function gutenberg_find_template_post( $template_hierarchy ) {
	if ( ! $template_hierarchy ) {
		return null;
	}

	$slugs = array_map(
		'gutenberg_strip_php_suffix',
		$template_hierarchy
	);

	// Find most specific 'wp_template' post matching the hierarchy.
	$template_query = new WP_Query(
		array(
			'post_type'      => 'wp_template',
			'post_status'    => 'publish',
			'post_name__in'  => $slugs,
			'orderby'        => 'post_name__in',
			'posts_per_page' => 1,
			'no_found_rows'  => true,
		)
	);

	$current_template_post = $template_query->have_posts() ? $template_query->next_post() : null;

	// Build map of template slugs to their priority in the current hierarchy.
	$slug_priorities = array_flip( $slugs );

	// See if there is a theme block template with higher priority than the resolved template post.
	$higher_priority_block_template_path     = null;
	$higher_priority_block_template_priority = PHP_INT_MAX;
	$block_template_files                    = glob( get_stylesheet_directory() . '/block-templates/*.html' );
	$block_template_files                    = is_array( $block_template_files ) ? $block_template_files : array();
	if ( is_child_theme() ) {
		$child_block_template_files = glob( get_template_directory() . '/block-templates/*.html' );
		$child_block_template_files = is_array( $child_block_template_files ) ? $child_block_template_files : array();
		$block_template_files       = array_merge( $block_template_files, $child_block_template_files );
	}
	if ( gutenberg_is_experiment_enabled( 'gutenberg-full-site-editing-demo' ) ) {
		$demo_block_template_files = glob( dirname( __FILE__ ) . '/demo-block-templates/*.html' );
		$demo_block_template_files = is_array( $demo_block_template_files ) ? $demo_block_template_files : array();
		$block_template_files      = array_merge( $block_template_files, $demo_block_template_files );
	}
	foreach ( $block_template_files as $path ) {
		if ( ! isset( $slug_priorities[ basename( $path, '.html' ) ] ) ) {
			continue;
		}
		$theme_block_template_priority = $slug_priorities[ basename( $path, '.html' ) ];
		if (
			$theme_block_template_priority < $higher_priority_block_template_priority &&
			( empty( $current_template_post ) || $theme_block_template_priority < $slug_priorities[ $current_template_post->post_name ] )
		) {
			$higher_priority_block_template_path     = $path;
			$higher_priority_block_template_priority = $theme_block_template_priority;
		}
	}

	// If there is, use it instead.
	if ( isset( $higher_priority_block_template_path ) ) {
		$post_name             = basename( $higher_priority_block_template_path, '.html' );
		$current_template_post = array(
			'post_content' => file_get_contents( $higher_priority_block_template_path ),
			'post_title'   => $post_name,
			'post_status'  => 'auto-draft',
			'post_type'    => 'wp_template',
			'post_name'    => $post_name,
		);
		if ( is_admin() ) {
			// Only create auto-draft of block template for editing
			// in admin screens, similarly to how we do it for new
			// posts in the editor.
			$current_template_post = get_post(
				wp_insert_post( $current_template_post )
			);
		} else {
			$current_template_post = new WP_Post(
				(object) $current_template_post
			);
		}
	}

	if ( isset( $_GET['_wp-find-template'] ) ) {
		if ( $current_template_post ) {
			wp_send_json_success( $current_template_post );
		} else {
			wp_send_json_error( array( 'message' => __( 'No matching template found.', 'gutenberg' ) ) );
		}
	}

	if ( $current_template_post ) {
		if ( is_admin() ) {
			foreach ( parse_blocks( $current_template_post->post_content ) as $block ) {
				create_auto_draft_for_template_part_block( $block );
			}
		}
		return $current_template_post;
	}
	return null;
}

/**
 * Displays title tag with content, regardless of whether theme has title-tag support.
 *
 * @see _wp_render_title_tag()
 */
function gutenberg_render_title_tag() {
	echo '<title>' . wp_get_document_title() . '</title>' . "\n";
}

/**
 * Renders the markup for the current template.
 */
function gutenberg_render_the_template() {
	global $_wp_current_template_content;
	global $wp_embed;

	if ( ! $_wp_current_template_content ) {
		echo '<h1>' . esc_html__( 'No matching template found', 'gutenberg' ) . '</h1>';
		return;
	}

	$content = $wp_embed->run_shortcode( $_wp_current_template_content );
	$content = $wp_embed->autoembed( $content );
	$content = do_blocks( $content );
	$content = wptexturize( $content );
	if ( function_exists( 'wp_filter_content_tags' ) ) {
		$content = wp_filter_content_tags( $content );
	} else {
		$content = wp_make_content_images_responsive( $content );
	}
	$content = str_replace( ']]>', ']]&gt;', $content );

	// Wrap block template in .wp-site-blocks to allow for specific descendant styles
	// (e.g. `.wp-site-blocks > *`).
	echo '<div class="wp-site-blocks">';
	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput
	echo '</div>';
}

/**
 * Renders a 'viewport' meta tag.
 *
 * This is hooked into {@see 'wp_head'} to decouple its output from the default template canvas.
 */
function gutenberg_viewport_meta_tag() {
	echo '<meta name="viewport" content="width=device-width, initial-scale=1" />' . "\n";
}

/**
 * Strips .php suffix from template file names.
 *
 * @access private
 *
 * @param string $template_file Template file name.
 * @return string Template file name without extension.
 */
function gutenberg_strip_php_suffix( $template_file ) {
	return preg_replace( '/\.php$/', '', $template_file );
}

/**
 * Extends default editor settings to enable template and template part editing.
 *
 * @param array $settings Default editor settings.
 *
 * @return array Filtered editor settings.
 */
function gutenberg_template_loader_filter_block_editor_settings( $settings ) {
	global $post, $_wp_current_template_id;

	if ( ! $post || ! post_type_exists( 'wp_template' ) || ! post_type_exists( 'wp_template_part' ) ) {
		return $settings;
	}

	// Create template part auto-drafts for the edited post.
	$post = isset( $_wp_current_template_id )
		? get_post( $_wp_current_template_id ) // It's a template.
		: get_post(); // It's a post.
	foreach ( parse_blocks( $post->post_content ) as $block ) {
		create_auto_draft_for_template_part_block( $block );
	}

	// TODO: Set editing mode and current template ID for editing modes support.
	return $settings;
}
add_filter( 'block_editor_settings', 'gutenberg_template_loader_filter_block_editor_settings' );
