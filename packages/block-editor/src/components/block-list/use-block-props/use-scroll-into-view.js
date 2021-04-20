/**
 * External dependencies
 */
import scrollIntoView from 'dom-scroll-into-view';

/**
 * WordPress dependencies
 */
/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getScrollContainer } from '@wordpress/dom';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

export function useScrollIntoView( clientId ) {
	const ref = useRef();
	const isSelectionEnd = useSelect(
		( select ) => {
			const { isBlockSelected, getBlockSelectionEnd } = select(
				blockEditorStore
			);

			return (
				isBlockSelected( clientId ) ||
				getBlockSelectionEnd() === clientId
			);
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( ! isSelectionEnd ) {
			return;
		}

		const extentNode = ref.current;

		// If the block is focused, the browser will already have scrolled into
		// view if necessary.
		if ( extentNode.contains( extentNode.ownerDocument.activeElement ) ) {
			return;
		}

		const scrollContainer = getScrollContainer( extentNode );

		// If there's no scroll container, it follows that there's no scrollbar
		// and thus there's no need to try to scroll into view.
		if ( ! scrollContainer ) {
			return;
		}

		scrollIntoView( extentNode, scrollContainer, {
			onlyScrollIfNeeded: true,
		} );
	}, [ isSelectionEnd ] );

	return ref;
}
