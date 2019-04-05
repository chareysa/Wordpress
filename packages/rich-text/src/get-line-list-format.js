/**
 * Internal dependencies
 */

import { getLineIndex } from './get-line-index';

/**
 * Returns the list format of the line at the selection start position.
 *
 * @param {Object} value     The rich-text value
 *
 * @return {Object} Object with listFormat.
 */
export function getLineListFormat( value ) {
	const { replacements, start } = value;
	const startingLineIndex = getLineIndex( value, start );
	const startLineFormats = replacements[ startingLineIndex ] || [];
	const [ listFormat ] = startLineFormats.slice( -1 );
	return listFormat;
}
