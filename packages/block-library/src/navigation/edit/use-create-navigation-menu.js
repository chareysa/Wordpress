/**
 * WordPress dependencies
 */
import { serialize } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useGenerateDefaultNavigationTitle from './use-generate-default-navigation-title';

const SUCCESS = 'success';
const ERROR = 'error';
const PENDING = 'pending';
const IDLE = 'idle';

export default function useCreateNavigationMenu( clientId ) {
	const [ status, setStatus ] = useState( IDLE );
	const [ value, setValue ] = useState( null );
	const [ error, setError ] = useState( null );

	const { saveEntityRecord } = useDispatch( coreStore );
	const generateDefaultTitle = useGenerateDefaultNavigationTitle( clientId );

	// This callback uses data from the two placeholder steps and only creates
	// a new navigation menu when the user completes the final step.
	const create = useCallback(
		( title = null, blocks = [] ) => {
			setStatus( PENDING );
			setValue( null );
			setError( null );

			if ( ! title ) {
				title = generateDefaultTitle().catch( ( e ) => {
					setError( e?.message );
					setStatus( ERROR );
				} );
			}
			const record = {
				title,
				content: serialize( blocks ),
				status: 'publish',
			};

			return saveEntityRecord( 'postType', 'wp_navigation', record )
				.then( ( response ) => {
					setValue( response );
					setStatus( SUCCESS );
					return response;
				} )
				.catch( ( e ) => {
					setError( e?.message );
					setStatus( ERROR );
					return e;
				} );
		},
		[ serialize, saveEntityRecord ]
	);

	return {
		create,
		status,
		value,
		error,
	};
}
