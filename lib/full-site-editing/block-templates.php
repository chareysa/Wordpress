<?php
/**
 * Utilities used to fetch and create templates and template parts.
 *
 * @package    Gutenberg
 * @subpackage REST_API
 */

/**
 * Finds all nested template part file paths in a theme's directory.
 *
 * @access private
 *
 * @param string $base_directory The theme's file path.
 * @return array $path_list A list of paths to all template part files.
 */
function _gutenberg_get_template_paths( $base_directory ) {
	$path_list = array();
	if ( file_exists( $base_directory ) ) {
		$nested_files      = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $base_directory ) );
		$nested_html_files = new RegexIterator( $nested_files, '/^.+\.html$/i', RecursiveRegexIterator::GET_MATCH );
		foreach ( $nested_html_files as $path => $file ) {
			$path_list[] = $path;
		}
	}
	return $path_list;
}

/**
 * Retrieves the template file from the theme for a given slug.
 *
 * @access private
 * @internal
 *
 * @param array  $template_type wp_template or wp_template_part.
 * @param string $slug template slug.
 *
 * @return array Template.
 */
function _gutenberg_get_template_file( $template_type, $slug ) {
	$template_base_paths = array(
		'wp_template'      => 'block-templates',
		'wp_template_part' => 'block-template-parts',
	);
	$themes              = array(
		get_stylesheet() => get_stylesheet_directory(),
		get_template()   => get_template_directory(),
	);

	if ( 'wp_template_part' === $template_type ) {
		$template_part_data = _gutenberg_get_template_part_info_from_theme_json();
	}

	foreach ( $themes as $theme_slug => $theme_dir ) {
		$file_path = $theme_dir . '/' . $template_base_paths[ $template_type ] . '/' . $slug . '.html';
		if ( file_exists( $file_path ) ) {

			$new_template_item = array(
				'slug'  => $slug,
				'path'  => $file_path,
				'theme' => $theme_slug,
				'type'  => $template_type,
			);

			if ( 'wp_template_part' === $template_type ) {
				return _gutenberg_add_template_part_section_info(
					$new_template_item,
					$template_part_data
				);
			}
			return $new_template_item;
		}
	}

	return null;
}

/**
 * Retrieves the template files from  the theme.
 *
 * @access private
 * @internal
 *
 * @param array $template_type wp_template or wp_template_part.
 *
 * @return array Template.
 */
function _gutenberg_get_template_files( $template_type ) {
	$template_base_paths = array(
		'wp_template'      => 'block-templates',
		'wp_template_part' => 'block-template-parts',
	);
	$themes              = array(
		get_stylesheet() => get_stylesheet_directory(),
		get_template()   => get_template_directory(),
	);

	$template_files = array();

	if ( 'wp_template_part' === $template_type ) {
		$template_part_data = _gutenberg_get_template_part_info_from_theme_json();
	}

	foreach ( $themes as $theme_slug => $theme_dir ) {
		$theme_template_files = _gutenberg_get_template_paths( $theme_dir . '/' . $template_base_paths[ $template_type ] );
		foreach ( $theme_template_files as $template_file ) {
			$template_base_path = $template_base_paths[ $template_type ];
			$template_slug      = substr(
				$template_file,
				// Starting position of slug.
				strpos( $template_file, $template_base_path . DIRECTORY_SEPARATOR ) + 1 + strlen( $template_base_path ),
				// Subtract ending '.html'.
				-5
			);

			$new_template_item = array(
				'slug'  => $template_slug,
				'path'  => $template_file,
				'theme' => $theme_slug,
				'type'  => $template_type,
			);

			if ( 'wp_template_part' === $template_type ) {
				$template_files[] = _gutenberg_add_template_part_section_info(
					$new_template_item,
					$template_part_data
				);
			} else {
				$template_files[] = $new_template_item;
			}
		}
	}

	return $template_files;
}

/**
 * Attempts to read the theme.json and return the 'template-parts' field.
 *
 * @return array Template part data from theme.json or empty array if not found.
 */
function _gutenberg_get_template_part_info_from_theme_json() {
	if ( is_readable( locate_template( 'experimental-theme.json' ) ) ) {
		$theme_json = file_get_contents( locate_template( 'experimental-theme.json' ) );
		$data       = json_decode(
			$theme_json,
			true
		);
	}
	if ( isset( $data['template-parts'] ) ) {
		return $data['template-parts'];
	}

	return array();
}

/**
 * Attempts to add the template part's section information to the input template.
 *
 * @param array $template_info Template to add information to (requires 'type' and 'slug' fields).
 * @param array $theme_data Template part information from theme.json.
 *
 * @return array Template.
 */
function _gutenberg_add_template_part_section_info( $template_info, $theme_data ) {
	if ( isset( $theme_data[ $template_info['slug'] ]['section'] ) ) {
		$template_info['section'] = gutenberg_filter_template_part_section_type( $theme_data[ $template_info['slug'] ]['section'] );
	}
	return $template_info;
}

/**
 * Parses wp_template content and injects the current theme's
 * stylesheet as a theme attribute into each wp_template_part
 *
 * @param string $template_content serialized wp_template content.
 *
 * @return string Updated wp_template content.
 */
function _inject_theme_attribute_in_content( $template_content ) {
	$has_updated_content = false;
	$new_content         = '';
	$template_blocks     = parse_blocks( $template_content );

	foreach ( $template_blocks as $key => $block ) {
		if (
			'core/template-part' === $block['blockName'] &&
			! isset( $block['attrs']['theme'] )
		) {
			$template_blocks[ $key ]['attrs']['theme'] = wp_get_theme()->get_stylesheet();
			$has_updated_content                       = true;
		}
	}

	if ( $has_updated_content ) {
		foreach ( $template_blocks as $block ) {
			$new_content .= serialize_block( $block );
		}

		return $new_content;
	}

	return $template_content;
}

/**
 * Build a unified template object based on a theme file.
 *
 * @param array $template_file Theme file.
 * @param array $template_type wp_template or wp_template_part.
 *
 * @return WP_Block_Template Template.
 */
function _gutenberg_build_template_result_from_file( $template_file, $template_type ) {
	$default_template_types = gutenberg_get_default_template_types();
	$template_content       = file_get_contents( $template_file['path'] );
	$theme                  = wp_get_theme()->get_stylesheet();

	if ( 'wp_template' === $template_type ) {
		$template_content = _inject_theme_attribute_in_content( $template_content );
	}

	$template            = new WP_Block_Template();
	$template->id        = $theme . '//' . $template_file['slug'];
	$template->theme     = $theme;
	$template->content   = $template_content;
	$template->slug      = $template_file['slug'];
	$template->is_custom = false;
	$template->type      = $template_type;
	$template->title     = $template_file['slug'];
	$template->status    = 'publish';

	if ( 'wp_template' === $template_type && isset( $default_template_types[ $template_file['slug'] ] ) ) {
		$template->description = $default_template_types[ $template_file['slug'] ]['description'];
		$template->title       = $default_template_types[ $template_file['slug'] ]['title'];
	}

	if ( 'wp_template_part' === $template_type && isset( $template_file['section'] ) ) {
		$template->section = $template_file['section'];
	}

	return $template;
}

/**
 * Build a unified template object based a post Object.
 *
 * @param WP_Post $post Template post.
 *
 * @return WP_Block_Template|WP_Error Template.
 */
function _gutenberg_build_template_result_from_post( $post ) {
	$terms = get_the_terms( $post, 'wp_theme' );

	if ( is_wp_error( $terms ) ) {
		return $terms;
	}

	if ( ! $terms ) {
		return new WP_Error( 'template_missing_theme', __( 'No theme is defined for this template.', 'gutenberg' ) );
	}

	$theme = $terms[0]->name;

	$template              = new WP_Block_Template();
	$template->wp_id       = $post->ID;
	$template->id          = $theme . '//' . $post->post_name;
	$template->theme       = $theme;
	$template->content     = $post->post_content;
	$template->slug        = $post->post_name;
	$template->is_custom   = true;
	$template->type        = $post->post_type;
	$template->description = $post->post_excerpt;
	$template->title       = $post->post_title;
	$template->status      = $post->post_status;

	if ( 'wp_template_part' === $post->post_type ) {
		$type_terms = get_the_terms( $post, 'wp_template_section' );
		if ( ! is_wp_error( $type_terms ) && false !== $type_terms ) {
			$template->section = $type_terms[0]->name;
		}
	}

	return $template;
}

/**
 * Retrieves a list of unified template objects based on a query.
 *
 * @param array $query {
 *     Optional. Arguments to retrieve templates.
 *
 *     @type array  $slug__in List of slugs to include.
 *     @type int    $wp_id Post ID of customized template.
 * }
 * @param array $template_type wp_template or wp_template_part.
 *
 * @return array Templates.
 */
function gutenberg_get_block_templates( $query = array(), $template_type = 'wp_template' ) {
	$wp_query_args = array(
		'post_status'    => array( 'auto-draft', 'draft', 'publish' ),
		'post_type'      => $template_type,
		'posts_per_page' => -1,
		'no_found_rows'  => true,
		'tax_query'      => array(
			array(
				'taxonomy' => 'wp_theme',
				'field'    => 'name',
				'terms'    => wp_get_theme()->get_stylesheet(),
			),
		),
	);

	if ( 'wp_template_part' === $template_type && isset( $query['section'] ) ) {
		$wp_query_args['tax_query'][]           = array(
			'taxonomy' => 'wp_template_section',
			'field'    => 'name',
			'terms'    => $query['section'],
		);
		$wp_query_args['tax_query']['relation'] = 'AND';
	}

	if ( isset( $query['slug__in'] ) ) {
		$wp_query_args['post_name__in'] = $query['slug__in'];
	}

	// This is only needed for the regular templates/template parts CPT listing and editor.
	if ( isset( $query['wp_id'] ) ) {
		$wp_query_args['p'] = $query['wp_id'];
	} else {
		$wp_query_args['post_status'] = 'publish';
	}

	$template_query = new WP_Query( $wp_query_args );
	$query_result   = array();
	foreach ( $template_query->get_posts() as $post ) {
		$template = _gutenberg_build_template_result_from_post( $post );

		if ( ! is_wp_error( $template ) ) {
			$query_result[] = $template;
		}
	}

	if ( ! isset( $query['wp_id'] ) ) {
		$template_files = _gutenberg_get_template_files( $template_type );
		foreach ( $template_files as $template_file ) {
			$is_not_custom      = false === array_search(
				wp_get_theme()->get_stylesheet() . '//' . $template_file['slug'],
				array_column( $query_result, 'id' ),
				true
			);
			$fits_slug_query    =
				! isset( $query['slug__in'] ) || in_array( $template_file['slug'], $query['slug__in'], true );
			$fits_section_query =
				! isset( $query['section'] ) || $template_file['section'] === $query['section'];
			$should_include     = $is_not_custom && $fits_slug_query && $fits_section_query;
			if ( $should_include ) {
				$query_result[] = _gutenberg_build_template_result_from_file( $template_file, $template_type );
			}
		}
	}

	return $query_result;
}

/**
 * Retrieves a single unified template object using its id.
 *
 * @param string $id Template unique identifier (example: theme|slug).
 * @param array  $template_type wp_template or wp_template_part.
 *
 * @return WP_Block_Template|null Template.
 */
function gutenberg_get_block_template( $id, $template_type = 'wp_template' ) {
	$parts = explode( '//', $id, 2 );
	if ( count( $parts ) < 2 ) {
		return null;
	}
	list( $theme, $slug ) = $parts;
	$wp_query_args        = array(
		'name'           => $slug,
		'post_type'      => $template_type,
		'post_status'    => array( 'auto-draft', 'draft', 'publish', 'trash' ),
		'posts_per_page' => 1,
		'no_found_rows'  => true,
		'tax_query'      => array(
			array(
				'taxonomy' => 'wp_theme',
				'field'    => 'name',
				'terms'    => $theme,
			),
		),
	);
	$template_query       = new WP_Query( $wp_query_args );
	$posts                = $template_query->get_posts();

	if ( count( $posts ) > 0 ) {
		$template = _gutenberg_build_template_result_from_post( $posts[0] );

		if ( ! is_wp_error( $template ) ) {
			return $template;
		}
	}

	if ( wp_get_theme()->get_stylesheet() === $theme ) {
		$template_file = _gutenberg_get_template_file( $template_type, $slug );
		if ( null !== $template_file ) {
			return _gutenberg_build_template_result_from_file( $template_file, $template_type );
		}
	}

	return null;
}

/**
 * Generates a unique slug for templates or template parts.
 *
 * @param string $slug          The resolved slug (post_name).
 * @param int    $post_ID       Post ID.
 * @param string $post_status   No uniqueness checks are made if the post is still draft or pending.
 * @param string $post_type     Post type.
 * @return string The original, desired slug.
 */
function gutenberg_filter_wp_template_unique_post_slug( $slug, $post_ID, $post_status, $post_type ) {
	if ( 'wp_template' !== $post_type || 'wp_template_part' !== $post_type ) {
		return $slug;
	}

	// Template slugs must be unique within the same theme.
	$theme = get_the_terms( $post_ID, 'wp_theme' )[0]->slug;

	$check_query_args = array(
		'post_name'      => $slug,
		'post_type'      => $post_type,
		'posts_per_page' => 1,
		'post__not_in'   => $post_ID,
		'tax_query'      => array(
			'taxonomy' => 'wp_theme',
			'field'    => 'name',
			'terms'    => $theme,
		),
		'no_found_rows'  => true,
	);
	$check_query      = new WP_Query( $check_query_args );
	$posts            = $check_query->get_posts();

	if ( count( $posts ) > 0 ) {
		$suffix = 2;
		do {
			$query_args              = $check_query_args;
			$alt_post_name           = _truncate_post_slug( $slug, 200 - ( strlen( $suffix ) + 1 ) ) . "-$suffix";
			$query_args['post_name'] = $alt_post_name;
			$query                   = new WP_Query( $check_query_args );
			$suffix++;
		} while ( count( $query->get_posts() ) > 0 );
		$slug = $alt_post_name;
	}

	return $slug;
}
add_filter( 'wp_unique_post_slug', 'gutenberg_filter_wp_template_unique_post_slug', 10, 4 );
