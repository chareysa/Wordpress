/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

function processing( state, { type, id, ...rest } ) {
	switch ( type ) {
		case 'START_PROCESSING_POST':
			state[ id ] = {
				...state[ id ],
				inProgress: true,
			};
			break;
		case 'FINISH_PROCESSING_POST':
			state[ id ] = {
				...state[ id ],
				inProgress: false,
			};
			break;
		case 'ENQUEUE_AFTER_PROCESSING':
			const pendingActions = state[ id ]?.pendingActions || [];
			if ( ! pendingActions.includes( rest.action ) ) {
				state[ id ] = {
					...state[ id ],
					pendingActions: [ ...pendingActions, rest.action ],
				};
			}
			break;
	}

	return state || {};
}

export default combineReducers( {
	processing,
} );
