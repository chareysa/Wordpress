/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import deprecated from './deprecated';
import edit from './edit';
import icon from './icon';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'Image' ),
	description: __( 'Insert an image to make a visual statement.' ),
	icon,
	keywords: [
		'img', // "img" is not translated as it is intended to reflect the HTML <img> tag.
		__( 'photo' ),
	],
	styles: [
		{ name: 'default', label: _x( 'Default', 'block style' ), isDefault: true },
		{ name: 'circle-mask', label: _x( 'Circle Mask', 'block style' ) },
	],
	transforms,
	getEditWrapperProps( attributes ) {
		const { align, width } = attributes;

		if ( 'left' === align || 'center' === align || 'right' === align || 'wide' === align || 'full' === align || 'fullScreen' === align ) {
			return { 'data-align': align, 'data-resized': !! width };
		}
	},
	edit,
	save,
	deprecated,
};
