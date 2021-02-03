/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { name } from './block.json';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/button' ],
			transform: ( buttons ) =>
				// Creates the buttons block
				createBlock(
					name,
					{},
					// Loop the selected buttons
					buttons.map( ( attributes ) =>
						// Create singular button in the buttons block
						createBlock( 'core/button', attributes )
					)
				),
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: ( buttons ) =>
				// Creates the buttons block
				createBlock(
					name,
					{},
					// Loop the selected buttons
					buttons.map( ( attributes ) => {
						// Remove any HTML tags
						const div = document.createElement( 'div' );
						div.innerHTML = attributes.content;
						const text = div.innerText || '';
						// Get first url
						const link = div.querySelector( 'a' );
						const url = link ? link.getAttribute( 'href' ) : null;
						// Create singular button in the buttons block
						return createBlock( 'core/button', {
							text,
							url,
						} );
					} )
				),
			isMatch: ( paragraphs ) => {
				const buttons = paragraphs.filter( ( attributes ) => {
					const div = document.createElement( 'div' );
					div.innerHTML = attributes.content;
					const text = div.innerText || '';
					return text.length <= 30;
				} );

				return buttons.length === paragraphs.length;
			},
		},
	],
};

export default transforms;
