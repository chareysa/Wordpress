/**
 * WordPress dependencies
 */
import { remove } from '@wordpress/utils';

/**
 * Removes iframes.
 *
 * @param {Node} node The node to check.
 *
 * @return {void}
 */
export default function( node ) {
	if ( node.nodeName === 'IFRAME' ) {
		remove( node );
	}
}
