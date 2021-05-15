/**
 * External dependencies
 */
import { first, last } from 'lodash';

/**
 * WordPress dependencies
 */
import { isEntirelySelected } from '@wordpress/dom';
import { isKeyboardEvent } from '@wordpress/keycodes';
import { useSelect, useDispatch } from '@wordpress/data';
import { useRefEffect } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';

export default function useSelectAll() {
	const {
		getBlockOrder,
		getSelectedBlockClientIds,
		getBlockRootClientId,
	} = useSelect( blockEditorStore );
	const { multiSelect } = useDispatch( blockEditorStore );

	return useRefEffect( ( node ) => {
		function onKeyDown( event ) {
			if (
				! isKeyboardEvent.primary( event, 'a' ) ||
				! isEntirelySelected( event.target )
			) {
				return;
			}

			const selectedClientIds = getSelectedBlockClientIds();

			if ( ! selectedClientIds.length ) {
				return;
			}

			const [ firstSelectedClientId ] = selectedClientIds;
			const rootClientId = getBlockRootClientId( firstSelectedClientId );
			let blockClientIds = getBlockOrder( rootClientId );

			if ( selectedClientIds.length === blockClientIds.length ) {
				blockClientIds = getBlockOrder(
					getBlockRootClientId( rootClientId )
				);
			}

			const firstClientId = first( blockClientIds );
			const lastClientId = last( blockClientIds );

			if ( firstClientId === lastClientId ) {
				return;
			}

			multiSelect( firstClientId, lastClientId );
			event.preventDefault();
		}

		node.addEventListener( 'keydown', onKeyDown );
		return () => {
			node.removeEventListener( 'keydown', onKeyDown );
		};
	}, [] );
}
