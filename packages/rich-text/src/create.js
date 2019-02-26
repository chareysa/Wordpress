/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */

import { isEmpty } from './is-empty';
import { isFormatEqual } from './is-format-equal';
import { createElement } from './create-element';
import { concatPair } from './concat';
import {
	LINE_SEPARATOR,
	OBJECT_REPLACEMENT_CHARACTER,
} from './special-characters';

/**
 * Browser dependencies
 */

const { TEXT_NODE, ELEMENT_NODE } = window.Node;

function createEmptyValue() {
	return {
		formats: [],
		lines: [],
		objects: [],
		text: '',
	};
}

function simpleFindKey( object, value ) {
	for ( const key in object ) {
		if ( object[ key ] === value ) {
			return key;
		}
	}
}

function toFormat( { type, attributes } ) {
	let formatType;

	if ( attributes && attributes.class ) {
		formatType = select( 'core/rich-text' ).getFormatTypeForClassName( attributes.class );

		if ( formatType ) {
			// Preserve any additional classes.
			attributes.class = ` ${ attributes.class } `.replace( ` ${ formatType.className } `, ' ' ).trim();

			if ( ! attributes.class ) {
				delete attributes.class;
			}
		}
	}

	if ( ! formatType ) {
		formatType = select( 'core/rich-text' ).getFormatTypeForBareElement( type );
	}

	if ( ! formatType ) {
		return attributes ? { type, attributes } : { type };
	}

	if (
		formatType.__experimentalCreatePrepareEditableTree &&
		! formatType.__experimentalCreateOnChangeEditableValue
	) {
		return null;
	}

	if ( ! attributes ) {
		return { type: formatType.name };
	}

	const registeredAttributes = {};
	const unregisteredAttributes = {};

	for ( const name in attributes ) {
		const key = simpleFindKey( formatType.attributes, name );

		if ( key ) {
			registeredAttributes[ key ] = attributes[ name ];
		} else {
			unregisteredAttributes[ name ] = attributes[ name ];
		}
	}

	return {
		type: formatType.name,
		attributes: registeredAttributes,
		unregisteredAttributes,
	};
}

/**
 * Create a RichText value from an `Element` tree (DOM), an HTML string or a
 * plain text string, with optionally a `Range` object to set the selection. If
 * called without any input, an empty value will be created. If
 * `multilineTag` is provided, any content of direct children whose type matches
 * `multilineTag` will be separated by two newlines. The optional functions can
 * be used to filter out content.
 *
 * @param {Object}  [$1]                      Optional named arguments.
 * @param {Element} [$1.element]              Element to create value from.
 * @param {string}  [$1.text]                 Text to create value from.
 * @param {string}  [$1.html]                 HTML to create value from.
 * @param {Range}   [$1.range]                Range to create value from.
 * @param {string}  [$1.multilineTag]         Multiline tag if the structure is
 *                                            multiline.
 * @param {Array}   [$1.multilineWrapperTags] Tags where lines can be found if
 *                                            nesting is possible.
 *
 * @return {Object} A rich text value.
 */
export function create( {
	element,
	text,
	html,
	range,
	multilineTag,
	multilineWrapperTags,
	__unstableIsEditableTree: isEditableTree,
} = {} ) {
	if ( typeof text === 'string' && text.length > 0 ) {
		return {
			formats: Array( text.length ),
			lines: Array( text.length ),
			objects: Array( text.length ),
			text,
		};
	}

	if ( typeof html === 'string' && html.length > 0 ) {
		element = createElement( document, html );
	}

	if ( typeof element !== 'object' ) {
		return createEmptyValue();
	}

	if ( ! multilineTag ) {
		return createFromElement( {
			element,
			range,
			isEditableTree,
		} );
	}

	return createFromMultilineElement( {
		element,
		range,
		multilineTag,
		multilineWrapperTags,
		isEditableTree,
	} );
}

/**
 * Helper to accumulate the value's selection start and end from the current
 * node and range.
 *
 * @param {Object} accumulator Object to accumulate into.
 * @param {Node}   node        Node to create value with.
 * @param {Range}  range       Range to create value with.
 * @param {Object} value       Value that is being accumulated.
 */
function accumulateSelection( accumulator, node, range, value ) {
	if ( ! range ) {
		return;
	}

	const { parentNode } = node;
	const { startContainer, startOffset, endContainer, endOffset } = range;
	const currentLength = accumulator.text.length;

	// Selection can be extracted from value.
	if ( value.start !== undefined ) {
		accumulator.start = currentLength + value.start;
	// Range indicates that the current node has selection.
	} else if ( node === startContainer && node.nodeType === TEXT_NODE ) {
		accumulator.start = currentLength + startOffset;
	// Range indicates that the current node is selected.
	} else if (
		parentNode === startContainer &&
		node === startContainer.childNodes[ startOffset ]
	) {
		accumulator.start = currentLength;
	// Range indicates that the selection is after the current node.
	} else if (
		parentNode === startContainer &&
		node === startContainer.childNodes[ startOffset - 1 ]
	) {
		accumulator.start = currentLength + value.text.length;
	// Fallback if no child inside handled the selection.
	} else if ( node === startContainer ) {
		accumulator.start = currentLength;
	}

	// Selection can be extracted from value.
	if ( value.end !== undefined ) {
		accumulator.end = currentLength + value.end;
	// Range indicates that the current node has selection.
	} else if ( node === endContainer && node.nodeType === TEXT_NODE ) {
		accumulator.end = currentLength + endOffset;
	// Range indicates that the current node is selected.
	} else if (
		parentNode === endContainer &&
		node === endContainer.childNodes[ endOffset - 1 ]
	) {
		accumulator.end = currentLength + value.text.length;
	// Range indicates that the selection is before the current node.
	} else if (
		parentNode === endContainer &&
		node === endContainer.childNodes[ endOffset ]
	) {
		accumulator.end = currentLength;
	// Fallback if no child inside handled the selection.
	} else if ( node === endContainer ) {
		accumulator.end = currentLength + endOffset;
	}
}

/**
 * Adjusts the start and end offsets from a range based on a text filter.
 *
 * @param {Node}     node   Node of which the text should be filtered.
 * @param {Range}    range  The range to filter.
 * @param {Function} filter Function to use to filter the text.
 *
 * @return {?Object} Object containing range properties.
 */
function filterRange( node, range, filter ) {
	if ( ! range ) {
		return;
	}

	const { startContainer, endContainer } = range;
	let { startOffset, endOffset } = range;

	if ( node === startContainer ) {
		startOffset = filter( node.nodeValue.slice( 0, startOffset ) ).length;
	}

	if ( node === endContainer ) {
		endOffset = filter( node.nodeValue.slice( 0, endOffset ) ).length;
	}

	return { startContainer, startOffset, endContainer, endOffset };
}

function filterString( string ) {
	// Reduce any whitespace used for HTML formatting to one space
	// character, because it will also be displayed as such by the browser.
	return string.replace( /[\n\r\t]+/g, ' ' );
}

/**
 * Creates a Rich Text value from a DOM element and range.
 *
 * @param {Object}    $1                      Named argements.
 * @param {?Element}  $1.element              Element to create value from.
 * @param {?Range}    $1.range                Range to create value from.
 * @param {?string}   $1.multilineTag         Multiline tag if the structure is
 *                                            multiline.
 * @param {?Array}    $1.multilineWrapperTags Tags where lines can be found if
 *                                            nesting is possible.
 *
 * @return {Object} A rich text value.
 */
function createFromElement( {
	element,
	range,
	multilineTag,
	multilineWrapperTags,
	currentWrapperTags = [],
	isEditableTree,
} ) {
	const accumulator = createEmptyValue();

	if ( ! element ) {
		return accumulator;
	}

	if ( ! element.hasChildNodes() ) {
		accumulateSelection( accumulator, element, range, createEmptyValue() );
		return accumulator;
	}

	const length = element.childNodes.length;

	// Optimise for speed.
	for ( let index = 0; index < length; index++ ) {
		const node = element.childNodes[ index ];
		const type = node.nodeName.toLowerCase();

		if ( node.nodeType === TEXT_NODE ) {
			const text = filterString( node.nodeValue );
			range = filterRange( node, range, filterString );
			accumulateSelection( accumulator, node, range, { text } );
			// Create a sparse array of the same length as `text`, in which
			// formats can be added.
			accumulator.formats.length += text.length;
			accumulator.lines.length += text.length;
			accumulator.objects.length += text.length;
			accumulator.text += text;
			continue;
		}

		if ( node.nodeType !== ELEMENT_NODE ) {
			continue;
		}

		if (
			node.getAttribute( 'data-rich-text-padding' ) ||
			( isEditableTree && type === 'br' && ! node.getAttribute( 'data-rich-text-line-break' ) )
		) {
			accumulateSelection( accumulator, node, range, createEmptyValue() );
			continue;
		}

		if ( type === 'br' ) {
			accumulateSelection( accumulator, node, range, createEmptyValue() );
			concatPair( accumulator, create( { text: '\n' } ) );
			continue;
		}

		const lastFormats = accumulator.formats[ accumulator.formats.length - 1 ];
		const lastFormat = lastFormats && lastFormats[ lastFormats.length - 1 ];
		const newFormat = toFormat( {
			type,
			attributes: getAttributes( { element: node } ),
		} );
		const format = isFormatEqual( newFormat, lastFormat ) ? lastFormat : newFormat;

		if ( multilineWrapperTags && multilineWrapperTags.indexOf( type ) !== -1 ) {
			const value = createFromMultilineElement( {
				element: node,
				range,
				multilineTag,
				multilineWrapperTags,
				currentWrapperTags: [ ...currentWrapperTags, format ],
				isEditableTree,
			} );

			accumulateSelection( accumulator, node, range, value );
			concatPair( accumulator, value );
			continue;
		}

		const value = createFromElement( {
			element: node,
			range,
			multilineTag,
			multilineWrapperTags,
			isEditableTree,
		} );

		accumulateSelection( accumulator, node, range, value );

		// Don't apply the element as formatting if it has no content.
		if ( isEmpty( value ) && ! format.attributes ) {
			continue;
		}

		if ( format.attributes && value.text.length === 0 ) {
			concatPair( accumulator, {
				formats: [ , ],
				lines: [ , ],
				objects: [ format ],
				text: OBJECT_REPLACEMENT_CHARACTER,
			} );
			continue;
		}

		concatPair( accumulator, {
			...value,
			formats: Array.from( value.formats, ( formats ) =>
				formats ? [ format, ...formats ] : [ format ]
			),
		} );
	}

	return accumulator;
}

/**
 * Creates a rich text value from a DOM element and range that should be
 * multiline.
 *
 * @param {Object}    $1                      Named argements.
 * @param {?Element}  $1.element              Element to create value from.
 * @param {?Range}    $1.range                Range to create value from.
 * @param {?string}   $1.multilineTag         Multiline tag if the structure is
 *                                            multiline.
 * @param {?Array}    $1.multilineWrapperTags Tags where lines can be found if
 *                                            nesting is possible.
 * @param {boolean}   $1.currentWrapperTags   Whether to prepend a line
 *                                            separator.
 *
 * @return {Object} A rich text value.
 */
function createFromMultilineElement( {
	element,
	range,
	multilineTag,
	multilineWrapperTags,
	currentWrapperTags = [],
	isEditableTree,
} ) {
	const accumulator = createEmptyValue();

	if ( ! element || ! element.hasChildNodes() ) {
		return accumulator;
	}

	const length = element.children.length;

	// Optimise for speed.
	for ( let index = 0; index < length; index++ ) {
		const node = element.children[ index ];

		if ( node.nodeName.toLowerCase() !== multilineTag ) {
			continue;
		}

		const value = createFromElement( {
			element: node,
			range,
			multilineTag,
			multilineWrapperTags,
			currentWrapperTags,
			isEditableTree,
		} );

		// Multiline value text should be separated by a line separator.
		if ( index !== 0 || currentWrapperTags.length > 0 ) {
			const formats = currentWrapperTags.length > 0 ? [ currentWrapperTags ] : [ , ];

			accumulator.formats.length += 1;
			accumulator.lines = accumulator.lines.concat( formats );
			accumulator.objects.length += 1;
			accumulator.text += LINE_SEPARATOR;
		}

		accumulateSelection( accumulator, node, range, value );
		concatPair( accumulator, value );
	}

	return accumulator;
}

/**
 * Gets the attributes of an element in object shape.
 *
 * @param {Object}    $1                 Named argements.
 * @param {Element}   $1.element         Element to get attributes from.
 *
 * @return {?Object} Attribute object or `undefined` if the element has no
 *                   attributes.
 */
function getAttributes( { element } ) {
	if ( ! element.hasAttributes() ) {
		return;
	}

	const length = element.attributes.length;
	let accumulator;

	// Optimise for speed.
	for ( let i = 0; i < length; i++ ) {
		const { name, value } = element.attributes[ i ];

		if ( name.indexOf( 'data-rich-text-' ) === 0 ) {
			continue;
		}

		accumulator = accumulator || {};
		accumulator[ name ] = value;
	}

	return accumulator;
}
