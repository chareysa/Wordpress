/**
 * Internal dependencies
 */
import { isPhrasingContent } from './phrasing-content';

function getSibling( node, which ) {
	const sibling = node[ `${ which }Sibling` ];

	if ( ! sibling || ! isPhrasingContent( sibling ) ) {
		return;
	}

	if ( sibling ) {
		return sibling;
	}

	const { parentNode } = node;

	return getSibling( parentNode, which );
}

/**
 * Removes spacing that formats HTML.
 *
 * @see https://www.w3.org/TR/css-text-3/#white-space-processing
 *
 * @param {Node} node The node to be processed.
 * @return {void}
 */
export default function( node ) {
	if ( node.nodeType !== node.TEXT_NODE ) {
		return;
	}

	// Ignore pre content.
	if ( node.parentElement.closest( 'pre' ) ) {
		return;
	}

	// First, replace any sequence of HTML formatting space with a single space.
	let newData = node.data.replace( /[ \r\n\t]+/g, ' ' );

	// Remove the leading space if the text element is at the start of a block,
	// is preceded by a line break element, or has a space in the previous
	// element.
	if ( newData[ 0 ] === ' ' ) {
		const previousSibling = getSibling( node, 'previous' );

		if (
			! previousSibling ||
			previousSibling.nodeName === 'BR' ||
			previousSibling.textContent.slice( -1 ) === ' '
		) {
			newData = newData.slice( 1 );
		}
	}

	// Remove the trailing space if the text element is at the end of a block,
	// or is succeded by a line break element.
	if ( newData[ newData.length - 1 ] === ' ' ) {
		const nextSibling = getSibling( node, 'next' );

		if (
			! nextSibling ||
			nextSibling.nodeName === 'BR'
		) {
			newData = newData.slice( 0, -1 );
		}
	}

	// If there's no data left, remove the node, so `previousSibling` stays
	// accurate. Otherwise, update the node data.
	if ( ! newData ) {
		node.parentNode.removeChild( node );
	} else {
		node.data = newData;
	}
}
