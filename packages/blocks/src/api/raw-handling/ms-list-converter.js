/**
 * Browser dependencies
 */
const { parseInt } = window;

function isList( node ) {
	return node.nodeName === 'OL' || node.nodeName === 'UL';
}

export default function msListConverter( node, doc ) {
	if ( node.nodeName !== 'P' ) {
		return;
	}

	const style = node.getAttribute( 'style' );

	if ( ! style ) {
		return;
	}

	// Quick check.
	if ( style.indexOf( 'mso-list' ) === -1 ) {
		return;
	}

	const matches = /mso-list\s*:[^;]+level([0-9]+)/i.exec( style );

	if ( ! matches ) {
		return;
	}

	let level = parseInt( matches[ 1 ], 10 ) - 1 || 0;

	const prevNode = node.previousElementSibling;
	const listInfoElement = node.querySelector( 'span[style*="mso-list"]' );

	// Add new list if no previous.
	if ( ! prevNode || ! isList( prevNode ) ) {
		// See https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type.
		const type = listInfoElement ? listInfoElement.textContent.trim() : '';
		const isNumeric = /[1iIaA]/.test( type );
		const newListNode = doc.createElement( isNumeric ? 'ol' : 'ul' );

		if ( isNumeric ) {
			newListNode.setAttribute( 'type', type );
		}

		node.parentNode.insertBefore( newListNode, node );
	}

	const listNode = node.previousElementSibling;
	const listType = listNode.nodeName;
	const listItem = doc.createElement( 'li' );

	let receivingNode = listNode;

	// Remove the list info element.
	if ( listInfoElement ) {
		listInfoElement.remove();
	}

	// Add content.
	while ( node.firstChild ) {
		listItem.appendChild( node.firstChild );
	}

	// Change pointer depending on indentation level.
	while ( level-- ) {
		receivingNode = receivingNode.lastChild || receivingNode;

		// If it's a list, move pointer to the last item.
		if ( isList( receivingNode ) ) {
			receivingNode = receivingNode.lastChild || receivingNode;
		}
	}

	// Make sure we append to a list.
	if ( ! isList( receivingNode ) ) {
		receivingNode = receivingNode.appendChild(
			doc.createElement( listType )
		);
	}

	// Append the list item to the list.
	receivingNode.appendChild( listItem );

	// Remove the wrapper paragraph.
	node.parentNode.removeChild( node );
}
