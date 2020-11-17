<?php
/**
 * Block template functions.
 *
 * @package gutenberg
 */

/**
 * Returns all block template file path of the current theme and its parent theme.
 * Includes demo block template files if demo experiment is enabled.
 *
 * @return array $block_template_files A list of paths to all template files.
 */
function gutenberg_get_template_paths() {
	$block_template_files = glob( get_stylesheet_directory() . '/block-templates/*.html' );
	$block_template_files = is_array( $block_template_files ) ? $block_template_files : array();

	if ( is_child_theme() ) {
		$child_block_template_files = glob( get_template_directory() . '/block-templates/*.html' );
		$child_block_template_files = is_array( $child_block_template_files ) ? $child_block_template_files : array();
		$block_template_files       = array_merge( $block_template_files, $child_block_template_files );
	}

	return $block_template_files;
}

/**
 * Registers block editor 'wp_template' post type.
 */
function gutenberg_register_template_post_type() {
	if ( ! gutenberg_is_fse_theme() ) {
		return;
	}

	$labels = array(
		'name'                  => __( 'Templates', 'gutenberg' ),
		'singular_name'         => __( 'Template', 'gutenberg' ),
		'menu_name'             => _x( 'Templates', 'Admin Menu text', 'gutenberg' ),
		'add_new'               => _x( 'Add New', 'Template', 'gutenberg' ),
		'add_new_item'          => __( 'Add New Template', 'gutenberg' ),
		'new_item'              => __( 'New Template', 'gutenberg' ),
		'edit_item'             => __( 'Edit Template', 'gutenberg' ),
		'view_item'             => __( 'View Template', 'gutenberg' ),
		'all_items'             => __( 'All Templates', 'gutenberg' ),
		'search_items'          => __( 'Search Templates', 'gutenberg' ),
		'parent_item_colon'     => __( 'Parent Template:', 'gutenberg' ),
		'not_found'             => __( 'No templates found.', 'gutenberg' ),
		'not_found_in_trash'    => __( 'No templates found in Trash.', 'gutenberg' ),
		'archives'              => __( 'Template archives', 'gutenberg' ),
		'insert_into_item'      => __( 'Insert into template', 'gutenberg' ),
		'uploaded_to_this_item' => __( 'Uploaded to this template', 'gutenberg' ),
		'filter_items_list'     => __( 'Filter templates list', 'gutenberg' ),
		'items_list_navigation' => __( 'Templates list navigation', 'gutenberg' ),
		'items_list'            => __( 'Templates list', 'gutenberg' ),
	);

	$args = array(
		'labels'            => $labels,
		'description'       => __( 'Templates to include in your theme.', 'gutenberg' ),
		'public'            => false,
		'has_archive'       => false,
		'show_ui'           => true,
		'show_in_menu'      => 'themes.php',
		'show_in_admin_bar' => false,
		'show_in_rest'      => true,
		'rest_base'         => 'templates',
		'capability_type'   => array( 'template', 'templates' ),
		'map_meta_cap'      => true,
		'supports'          => array(
			'title',
			'slug',
			'excerpt',
			'editor',
			'revisions',
		),
	);

	register_post_type( 'wp_template', $args );
}
add_action( 'init', 'gutenberg_register_template_post_type' );

/**
 * Registers block editor 'wp_theme' taxonomy.
 */
function gutenberg_register_wp_theme_taxonomy() {
	if ( ! gutenberg_is_fse_theme() ) {
		return;
	}

	register_taxonomy(
		'wp_theme',
		array( 'wp_template', 'wp_template_part' ),
		array(
			'public'            => false,
			'hierarchical'      => false,
			'labels'            => array(
				'name'          => __( 'Themes', 'gutenberg' ),
				'singular_name' => __( 'Theme', 'gutenberg' ),
			),
			'query_var'         => false,
			'rewrite'           => false,
			'show_ui'           => false,
			'_builtin'          => true,
			'show_in_nav_menus' => false,
			'show_in_rest'      => true,
		)
	);
}
add_action( 'init', 'gutenberg_register_wp_theme_taxonomy' );

/**
 * Migrates old meta based theme storage to taxonomy
 * for wp_template and wp_template_part posts.
 */
function gutenberg_migrate_theme_meta_to_taxonomy() {
	if ( ! gutenberg_is_fse_theme() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
		return;
	}

	$terms = get_terms(
		array(
			'taxonomy'       => 'wp_theme',
			'posts_per_page' => 1,
			'hide_empty'     => false,
		)
	);
	if ( $terms ) {
		return;
	}

	$query = new WP_Query(
		array(
			'post_type'      => array( 'wp_template', 'wp_template_part' ),
			'posts_per_page' => -1,
			'post_status'    => array( 'publish', 'auto-draft', 'draft', 'trash' ),
		)
	);
	while ( $query->have_posts() ) {
		$query->the_post();
		$post  = get_post();
		$terms = array();

		$theme = get_post_meta( $post->ID, 'theme', true );
		if ( ! $theme ) {
			$theme = wp_get_theme()->get_stylesheet();
		}
		$terms[] = $theme;

		if ( $post->post_status === 'auto-draft' ) {
			$terms[] = 'wp_file_based';
		}

		wp_set_post_terms( $post->ID, $terms, 'wp_theme', true );
	}
	wp_reset_postdata();

	global $wp;
	wp_redirect( add_query_arg( $wp->query_vars, home_url( $wp->request ) ) );
	exit;
}
add_action( 'init', 'gutenberg_migrate_theme_meta_to_taxonomy' );

/**
 * Automatically set the theme meta for templates.
 *
 * @param array $post_id Template ID.
 * @param array $post    Template Post.
 * @param bool  $update  Is update.
 */
function gutenberg_set_template_post_theme( $post_id, $post, $update ) {
	if ( 'wp_template' !== $post->post_type || $update || 'trash' === $post->post_status ) {
		return;
	}

	$theme = get_post_meta( $post_id, 'theme', true );

	if ( ! $theme ) {
		update_post_meta( $post_id, 'theme', wp_get_theme()->get_stylesheet() );
	}
}

add_action( 'save_post', 'gutenberg_set_template_post_theme', 10, 3 );

/**
 * Filters the capabilities of a user to conditionally grant them capabilities for managing 'wp_template' posts.
 *
 * Any user who can 'edit_theme_options' will have access.
 *
 * @param array $allcaps A user's capabilities.
 * @return array Filtered $allcaps.
 */
function gutenberg_grant_template_caps( array $allcaps ) {
	if ( isset( $allcaps['edit_theme_options'] ) ) {
		$allcaps['edit_templates']             = $allcaps['edit_theme_options'];
		$allcaps['edit_others_templates']      = $allcaps['edit_theme_options'];
		$allcaps['edit_published_templates']   = $allcaps['edit_theme_options'];
		$allcaps['edit_private_templates']     = $allcaps['edit_theme_options'];
		$allcaps['delete_templates']           = $allcaps['edit_theme_options'];
		$allcaps['delete_others_templates']    = $allcaps['edit_theme_options'];
		$allcaps['delete_published_templates'] = $allcaps['edit_theme_options'];
		$allcaps['delete_private_templates']   = $allcaps['edit_theme_options'];
		$allcaps['publish_templates']          = $allcaps['edit_theme_options'];
		$allcaps['read_private_templates']     = $allcaps['edit_theme_options'];
	}

	return $allcaps;
}
add_filter( 'user_has_cap', 'gutenberg_grant_template_caps' );

/**
 * Filters `wp_template` posts slug resolution to bypass deduplication logic as
 * template slugs should be unique.
 *
 * @param string $slug          The resolved slug (post_name).
 * @param int    $post_ID       Post ID.
 * @param string $post_status   No uniqueness checks are made if the post is still draft or pending.
 * @param string $post_type     Post type.
 * @param int    $post_parent   Post parent ID.
 * @param int    $original_slug The desired slug (post_name).
 * @return string The original, desired slug.
 */
function gutenberg_filter_wp_template_wp_unique_post_slug( $slug, $post_ID, $post_status, $post_type, $post_parent, $original_slug ) {
	if ( 'wp_template' === $post_type ) {
		return $original_slug;
	}
	return $slug;
}
add_filter( 'wp_unique_post_slug', 'gutenberg_filter_wp_template_wp_unique_post_slug', 10, 6 );

/**
 * Fixes the label of the 'wp_template' admin menu entry.
 */
function gutenberg_fix_template_admin_menu_entry() {
	if ( ! gutenberg_is_fse_theme() ) {
		return;
	}
	global $submenu;
	if ( ! isset( $submenu['themes.php'] ) ) {
		return;
	}
	$post_type = get_post_type_object( 'wp_template' );
	if ( ! $post_type ) {
		return;
	}
	foreach ( $submenu['themes.php'] as $key => $submenu_entry ) {
		if ( $post_type->labels->all_items === $submenu['themes.php'][ $key ][0] ) {
			$submenu['themes.php'][ $key ][0] = $post_type->labels->menu_name; // phpcs:ignore WordPress.WP.GlobalVariablesOverride
			break;
		}
	}
}
add_action( 'admin_menu', 'gutenberg_fix_template_admin_menu_entry' );

/**
 * Filters the 'wp_template' post type columns in the admin list table.
 *
 * @param array $columns Columns to display.
 * @return array Filtered $columns.
 */
function gutenberg_filter_template_list_table_columns( array $columns ) {
	$columns['slug']        = __( 'Slug', 'gutenberg' );
	$columns['description'] = __( 'Description', 'gutenberg' );
	$columns['status']      = __( 'Status', 'gutenberg' );
	if ( isset( $columns['date'] ) ) {
		unset( $columns['date'] );
	}
	return $columns;
}
add_filter( 'manage_wp_template_posts_columns', 'gutenberg_filter_template_list_table_columns' );

/**
 * Renders column content for the 'wp_template' post type list table.
 *
 * @param string $column_name Column name to render.
 * @param int    $post_id     Post ID.
 */
function gutenberg_render_template_list_table_column( $column_name, $post_id ) {
	if ( 'slug' === $column_name ) {
		$post = get_post( $post_id );
		echo esc_html( $post->post_name );
		return;
	}

	if ( 'description' === $column_name ) {
		the_excerpt( $post_id );
		return;
	}

	if ( 'status' === $column_name ) {
		$post_status = get_post_status( $post_id );
		// The auto-draft status doesn't have localized labels.
		if ( 'auto-draft' === $post_status ) {
			echo esc_html_x( 'Auto-Draft', 'Post status', 'gutenberg' );
			return;
		}
		$post_status_object = get_post_status_object( $post_status );
		echo esc_html( $post_status_object->label );
		return;
	}
}
add_action( 'manage_wp_template_posts_custom_column', 'gutenberg_render_template_list_table_column', 10, 2 );

/**
 * Adds the auto-draft view to the 'wp_template' post type list.
 *
 * @param array $views The edit views to filter.
 */
function gutenberg_filter_templates_edit_views( $views ) {
	$url                = add_query_arg(
		array(
			'post_type'   => 'wp_template',
			'post_status' => 'auto-draft',
		),
		'edit.php'
	);
	$is_auto_draft_view = isset( $_REQUEST['post_status'] ) && 'auto-draft' === $_REQUEST['post_status'];
	$class_html         = $is_auto_draft_view ? ' class="current"' : '';
	$aria_current       = $is_auto_draft_view ? ' aria-current="page"' : '';
	$post_count         = wp_count_posts( 'wp_template', 'readable' );
	$label              = sprintf(
		// The auto-draft status doesn't have localized labels.
		translate_nooped_plural(
			/* translators: %s: Number of auto-draft posts. */
			_nx_noop(
				'Auto-Draft <span class="count">(%s)</span>',
				'Auto-Drafts <span class="count">(%s)</span>',
				'Post status',
				'gutenberg'
			),
			$post_count->{'auto-draft'}
		),
		number_format_i18n( $post_count->{'auto-draft'} )
	);

	$auto_draft_view = sprintf(
		'<a href="%s"%s%s>%s</a>',
		esc_url( $url ),
		$class_html,
		$aria_current,
		$label
	);

	array_splice( $views, 1, 0, array( 'auto-draft' => $auto_draft_view ) );

	return $views;
}
add_filter( 'views_edit-wp_template', 'gutenberg_filter_templates_edit_views' );

/**
 * Filter for adding a `resolved` parameter to `wp_template` queries.
 *
 * @param array $query_params The query parameters.
 * @return array Filtered $query_params.
 */
function filter_rest_wp_template_collection_params( $query_params ) {
	$query_params += array(
		'resolved' => array(
			'description' => __( 'Whether to filter for resolved templates', 'gutenberg' ),
			'type'        => 'boolean',
		),
	);
	return $query_params;
}
apply_filters( 'rest_wp_template_collection_params', 'filter_rest_wp_template_collection_params', 99, 1 );

/**
 * Filter for supporting the `resolved` parameter in `wp_template` queries.
 *
 * @param array           $args    The query arguments.
 * @param WP_REST_Request $request The request object.
 * @return array Filtered $args.
 */
function filter_rest_wp_template_query( $args, $request ) {
	if ( $request['resolved'] ) {
		$template_ids   = array( 0 ); // Return nothing by default (the 0 is needed for `post__in`).
		$template_types = $request['slug'] ? $request['slug'] : get_template_types();

		foreach ( $template_types as $template_type ) {
			// Skip 'embed' for now because it is not a regular template type.
			if ( in_array( $template_type, array( 'embed' ), true ) ) {
				continue;
			}

			$current_template = gutenberg_resolve_template( $template_type );
			if ( $current_template ) {
				$template_ids[] = $current_template->ID;
			}
		}
		$args['post__in']    = $template_ids;
		$args['post_status'] = array( 'publish', 'auto-draft' );
	}

	return $args;
}
add_filter( 'rest_wp_template_query', 'filter_rest_wp_template_query', 99, 2 );

