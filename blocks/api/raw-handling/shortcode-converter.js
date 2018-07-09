/**
 * External dependencies
 */
import { castArray, find, first, includes, mapValues, pickBy, some } from 'lodash';

/**
 * WordPress dependencies
 */
import { regexp, next } from '@wordpress/shortcode';

/**
 * Internal dependencies
 */
import { createBlock, findTransform } from '../factory';
import { getBlockAttributes } from '../parser';

function segmentHTMLToShortcodeBlock( HTML, lastIndex = 0, transformsFrom = [], blockTypes = [] ) {
	const transformation = findTransform( transformsFrom, ( transform ) => (
		transform.type === 'shortcode' &&
		some( castArray( transform.tag ), ( tag ) => regexp( tag ).test( HTML ) )
	) );

	if ( ! transformation ) {
		return [ HTML ];
	}

	const transformTags = castArray( transformation.tag );
	const transformTag = first( transformTags );

	let blockType, match;

	if ( ( match = next( transformTag, HTML, lastIndex ) ) ) {
		const beforeHTML = HTML.substr( 0, match.index );

		lastIndex = match.index + match.content.length;

		// If the shortcode content does not contain HTML and the shortcode is
		// not on a new line (or in paragraph from Markdown converter),
		// consider the shortcode as inline text, and thus skip conversion for
		// this segment.
		if (
			! includes( match.shortcode.content || '', '<' ) &&
			! /(\n|<p>)\s*$/.test( beforeHTML )
		) {
			return segmentHTMLToShortcodeBlock( HTML, lastIndex );
		}

		const attributes = mapValues(
			pickBy( transformation.attributes, ( schema ) => schema.shortcode ),
			// Passing all of `match` as second argument is intentionally broad
			// but shouldn't be too relied upon.
			//
			// See: https://github.com/WordPress/gutenberg/pull/3610#discussion_r152546926
			( schema ) => schema.shortcode( match.shortcode.attrs, match ),
		);

		blockType = find( blockTypes, { name: transformation.blockName } );
		const block = createBlock(
			transformation.blockName,
			getBlockAttributes(
				{
					...blockType,
					attributes: transformation.attributes,
				},
				match.shortcode.content,
				attributes,
			),
			[],
			blockType
		);

		return [
			beforeHTML,
			block,
			...segmentHTMLToShortcodeBlock( HTML.substr( lastIndex ) ),
		];
	}

	return [ HTML ];
}

export default segmentHTMLToShortcodeBlock;
