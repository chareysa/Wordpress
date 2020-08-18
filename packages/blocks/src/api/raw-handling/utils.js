/**
 * External dependencies
 */
import { mapValues, mergeWith, isFunction } from 'lodash';

/**
 * WordPress dependencies
 */
import { isPhrasingContent } from '@wordpress/dom';

/**
 * Internal dependencies
 */
import { hasBlockSupport } from '..';

/**
 * Browser dependencies
 */
const { ELEMENT_NODE, TEXT_NODE } = window.Node;

/**
 * Given raw transforms from blocks, merges all schemas into one.
 *
 * @param {Array}  transforms            Block transforms, of the `raw` type.
 * @param {Object} phrasingContentSchema The phrasing content schema.
 * @param {Object} isPaste               Whether the context is pasting or not.
 *
 * @return {Object} A complete block content schema.
 */
export function getBlockContentSchema(
	transforms,
	phrasingContentSchema,
	isPaste
) {
	const schemas = transforms.map( ( { isMatch, blockName, schema } ) => {
		const hasAnchorSupport = hasBlockSupport( blockName, 'anchor' );

		schema = isFunction( schema )
			? schema( { phrasingContentSchema, isPaste } )
			: schema;

		// If the block does not has anchor support and the transform does not
		// provides an isMatch we can return the schema right away.
		if ( ! hasAnchorSupport && ! isMatch ) {
			return schema;
		}

		return mapValues( schema, ( value ) => {
			let attributes = value.attributes || [];
			// If the block supports the "anchor" functionality, it needs to keep its ID attribute.
			if ( hasAnchorSupport ) {
				attributes = [ ...attributes, 'id' ];
			}
			return {
				...value,
				attributes,
				isMatch: isMatch ? isMatch : undefined,
			};
		} );
	} );

	return mergeWith( {}, ...schemas, ( objValue, srcValue, key ) => {
		switch ( key ) {
			case 'children': {
				if ( objValue === '*' || srcValue === '*' ) {
					return '*';
				}

				return { ...objValue, ...srcValue };
			}
			case 'attributes':
			case 'require': {
				return [ ...( objValue || [] ), ...( srcValue || [] ) ];
			}
			case 'isMatch': {
				// If one of the values being merge is undefined (matches everything),
				// the result of the merge will be undefined.
				if ( ! objValue || ! srcValue ) {
					return undefined;
				}
				// When merging two isMatch functions, the result is a new function
				// that returns if one of the source functions returns true.
				return ( ...args ) => {
					return objValue( ...args ) || srcValue( ...args );
				};
			}
		}
	} );
}

/**
 * Checks wether HTML can be considered plain text. That is, it does not contain
 * any elements that are not line breaks.
 *
 * @param {string} HTML The HTML to check.
 *
 * @return {boolean} Wether the HTML can be considered plain text.
 */
export function isPlain( HTML ) {
	return ! /<(?!br[ />])/i.test( HTML );
}

/**
 * Given node filters, deeply filters and mutates a NodeList.
 *
 * @param {NodeList} nodeList The nodeList to filter.
 * @param {Array}    filters  An array of functions that can mutate with the provided node.
 * @param {Document} doc      The document of the nodeList.
 * @param {Object}   schema   The schema to use.
 */
export function deepFilterNodeList( nodeList, filters, doc, schema ) {
	Array.from( nodeList ).forEach( ( node ) => {
		deepFilterNodeList( node.childNodes, filters, doc, schema );

		filters.forEach( ( item ) => {
			// Make sure the node is still attached to the document.
			if ( ! doc.contains( node ) ) {
				return;
			}

			item( node, doc, schema );
		} );
	} );
}

/**
 * Given node filters, deeply filters HTML tags.
 * Filters from the deepest nodes to the top.
 *
 * @param {string} HTML    The HTML to filter.
 * @param {Array}  filters An array of functions that can mutate with the provided node.
 * @param {Object} schema  The schema to use.
 *
 * @return {string} The filtered HTML.
 */
export function deepFilterHTML( HTML, filters = [], schema ) {
	const doc = document.implementation.createHTMLDocument( '' );

	doc.body.innerHTML = HTML;

	deepFilterNodeList( doc.body.childNodes, filters, doc, schema );

	return doc.body.innerHTML;
}

/**
 * Gets a sibling within text-level context.
 *
 * @param {Element} node  The subject node.
 * @param {string}  which "next" or "previous".
 */
export function getSibling( node, which ) {
	const sibling = node[ `${ which }Sibling` ];

	if ( sibling && isPhrasingContent( sibling ) ) {
		return sibling;
	}

	const { parentNode } = node;

	if ( ! parentNode || ! isPhrasingContent( parentNode ) ) {
		return;
	}

	return getSibling( parentNode, which );
}
