/**
 * WordPress dependencies
 */
import { createUndoManager } from '@wordpress/undo-manager';
import { useCallback, useMemo, useReducer } from '@wordpress/element';
import type { UndoManager } from '@wordpress/undo-manager';

type UndoRedoState< T > = {
	manager: UndoManager;
	value: T;
};

function undoRedoReducer< T >(
	state: UndoRedoState< T >,
	action:
		| { type: 'UNDO' }
		| { type: 'REDO' }
		| { type: 'RECORD'; value: T; isStaged: boolean }
): UndoRedoState< T > {
	switch ( action.type ) {
		case 'UNDO': {
			const undoRecord = state.manager.undo();
			if ( undoRecord ) {
				return {
					...state,
					value: undoRecord[ 0 ].changes.prop.from,
				};
			}
			return state;
		}
		case 'REDO': {
			const redoRecord = state.manager.redo();
			if ( redoRecord ) {
				return {
					...state,
					value: redoRecord[ 0 ].changes.prop.to,
				};
			}
			return state;
		}
		case 'RECORD': {
			state.manager.addRecord(
				[
					{
						id: 'object',
						changes: {
							prop: { from: state.value, to: action.value },
						},
					},
				],
				action.isStaged
			);
			return {
				...state,
				value: action.value,
			};
		}
	}

	return state;
}

/**
 * useState with undo/redo history.
 *
 * @param initialValue Initial value.
 * @return Value, setValue, hasUndo, hasRedo, undo, redo.
 */
export default function useStateWithHistory< T >( initialValue: T ) {
	const undoManager = useMemo( () => createUndoManager(), [] );
	const [ state, dispatch ] = useReducer( undoRedoReducer, {
		manager: undoManager,
		value: initialValue,
	} );

	return {
		value: state.value,
		setValue: useCallback( ( newValue: T, isStaged: boolean ) => {
			dispatch( {
				type: 'RECORD',
				value: newValue,
				isStaged,
			} );
		}, [] ),
		hasUndo: state.manager.hasUndo(),
		hasRedo: state.manager.hasRedo(),
		undo: useCallback( () => {
			dispatch( { type: 'UNDO' } );
		}, [] ),
		redo: useCallback( () => {
			dispatch( { type: 'REDO' } );
		}, [] ),
	};
}
