<?php
/**
 * Start: Include for phase 2
 * Widget Updater REST API: WP_REST_Widget_Forms class
 *
 * @package gutenberg
 * @since 5.2.0
 */

/**
 * Controller which provides REST endpoint for updating a widget.
 *
 * @since 5.2.0
 *
 * @see WP_REST_Controller
 */
class WP_REST_Widget_Utils_Controller extends WP_REST_Controller {

	/**
	 * Constructs the controller.
	 *
	 * @access public
	 */
	public function __construct() {
		$this->namespace = '__experimental';
		$this->rest_base = 'widget-utils';
	}

	/**
	 * Registers the necessary REST API route.
	 *
	 * @access public
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/form/(?P<widget_class>[^/]*)/',
			array(
				'args' => array(
					'widget_class' => array(
						'description'       => __( 'Class name of the widget.', 'gutenberg' ),
						'type'              => 'string',
						'required'          => true,
						'validate_callback' => array( $this, 'is_valid_widget' ),
					),
					'instance'     => array(
						'description' => __( 'Current widget instance', 'gutenberg' ),
						'type'        => 'object',
						'default'     => array(),
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'permission_callback' => array( $this, 'permissions_check' ),
					'callback'            => array( $this, 'compute_widget_form' ),
				),
			)
		);
	}

	/**
	 * Checks if the user has permissions to make the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 * @since 5.2.0
	 * @access public
	 */
	public function permissions_check() {
		// Verify if the current user has edit_theme_options capability.
		// This capability is required to access the widgets screen.
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return new WP_Error(
				'widgets_cannot_access',
				__( 'Sorry, you are not allowed to access widgets on this site.', 'gutenberg' ),
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		return true;
	}

	/**
	 * Checks if the widget being referenced is valid.
	 *
	 * @param string $widget_class Name of the class the widget references.
	 *
	 * @return boolean| True if the widget being referenced exists and false otherwise.
	 * @since 5.2.0
	 */
	private function is_valid_widget( $widget_class ) {
		$widget_class = urldecode( $widget_class );
		global $wp_widget_factory;
		if ( ! $widget_class ) {
			return false;
		}

		return isset( $wp_widget_factory->widgets[ $widget_class ] ) &&
			( $wp_widget_factory->widgets[ $widget_class ] instanceof WP_Widget );
	}

	/**
	 * Returns the new widget instance and the form that represents it.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 5.7.0
	 * @access public
	 */
	public function compute_widget_form( $request ) {
		$widget_class = urldecode( $request->get_param( 'widget_class' ) );
		$instance     = $request->get_param( 'instance' );

		global $wp_widget_factory;
		$widget_obj = $wp_widget_factory->widgets[ $widget_class ];

		$widget_obj->_set( -1 );
		ob_start();

		$instance = apply_filters( 'widget_form_callback', $instance, $widget_obj );

		$return = null;
		if ( false !== $instance ) {
			$return = $widget_obj->form( $instance );

			/**
			 * Fires at the end of the widget control form.
			 *
			 * Use this hook to add extra fields to the widget form. The hook
			 * is only fired if the value passed to the 'widget_form_callback'
			 * hook is not false.
			 *
			 * Note: If the widget has no form, the text echoed from the default
			 * form method can be hidden using CSS.
			 *
			 * @param WP_Widget $widget_obj The widget instance (passed by reference).
			 * @param null $return Return null if new fields are added.
			 * @param array $instance An array of the widget's settings.
			 *
			 * @since 5.2.0
			 */
			do_action_ref_array( 'in_widget_form', array( &$widget_obj, &$return, $instance ) );
		}
		$form = ob_get_clean();

		return rest_ensure_response(
			array(
				'instance' => $instance,
				'form'     => $form,
			)
		);
	}

}
/**
 * End: Include for phase 2
 */
