/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import icon from './icon';
import save from './save';
import transforms from './transforms';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'Shortcode' ),
	description: __( 'Insert additional custom elements with a WordPress shortcode.' ),
	icon,
	transforms,
	supports: {
		customClassName: false,
		className: false,
		html: false,
	},
	attributes: {
		text: {
			type: 'string',
			source: 'html',
		},
	},
	edit,
	save,
};
