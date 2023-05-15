/**
 * WordPress dependencies
 */
import { group as icon } from '@wordpress/icons';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import { format } from './format';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
	save,
};

// Would be good to also remove the format if the block is unregistered.
registerFormatType( 'core/footnote', format );

export const init = () => {
	initBlock( { name, metadata, settings } );
};
