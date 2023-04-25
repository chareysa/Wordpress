/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { paragraph as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import deprecated from './deprecated';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			content: sprintf(
				/* translators: %s: Link href (example link) */
				__(
					'In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and <a href="%s">a greyhound</a> for coursing.'
				),
				'#'
			),
		},
	},
	__experimentalLabel( attributes, { context } ) {
		if ( context === 'accessibility' ) {
			const { content } = attributes;
			return ! content || content.length === 0 ? __( 'Empty' ) : content;
		}
	},
	transforms,
	deprecated,
	merge( attributes, attributesToMerge ) {
		return {
			content:
				( attributes.content || '' ) +
				( attributesToMerge.content || '' ),
		};
	},
	edit,
	save,
};

export const init = () => initBlock( { name, metadata, settings } );
