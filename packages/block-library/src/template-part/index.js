/**
 * External dependencies
 */
import { startCase } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;
export { metadata, name };

export const settings = {
	title: _x( 'Template Part', 'block title' ),
	description: __(
		'Edit the different global regions of your site, like the header, footer, sidebar, or create your own.'
	),
	keywords: [ __( 'template part' ) ],
	__experimentalLabel: ( { slug } ) => startCase( slug ),
	edit,
};
