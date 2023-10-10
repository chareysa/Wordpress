/**
 * Defines as extensibility slot for the Summary panel.
 */

/**
 * WordPress dependencies
 */
import { createSlotFill, PanelRow } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'PluginPostExcerpt' );

/**
 * Renders a post excerpt panel in the post sidebar.
 *
 * @param {Object}  props             Component properties.
 * @param {string}  [props.className] An optional class name added to the row.
 * @param {Element} props.children    Children to be rendered.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var __ = wp.i18n.__;
 * var PluginPostExcerpt = wp.editPost.PluginPostExcerpt;
 *
 * function MyPluginPostExcerpt() {
 * 	return React.createElement(
 * 		PluginPostExcerpt,
 * 		{
 * 			className: 'my-plugin-post-excerpt',
 * 		},
 * 		__( 'Post excerpt custom content' )
 * 	)
 * }
 * ```
 *
 * @example
 * ```jsx
 * // Using ESNext syntax
 * import { __ } from '@wordpress/i18n';
 * import { PluginPostExcerpt } from '@wordpress/edit-post';
 *
 * const MyPluginPostExcerpt = () => (
 * 	<PluginPostExcerpt
 * 		className="my-plugin-post-excerpt"
 * 	>
 * 		{ __( 'Post excerpt custom content' ) }
 * 	</PluginPostExcerpt>
 * );
 * ```
 *
 * @return {Component} The component to be rendered.
 */
const PluginPostExcerpt = ( { children, className } ) => {
	return (
		<Fill>
			<PanelRow className={ className }>{ children }</PanelRow>
		</Fill>
	);
};

PluginPostExcerpt.Slot = Slot;

export default PluginPostExcerpt;
