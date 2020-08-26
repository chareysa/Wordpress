/**
 * WordPress dependencies
 */
import { createContext, useContext, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getGlobalStyles } from './global-styles-renderer';

const GlobalStylesContext = createContext( {
	/* eslint-disable no-unused-vars */
	getProperty: ( context, family, name ) => {},
	setProperty: ( context, family, name, value ) => {},
	globalContext: {},
	/* eslint-enable no-unused-vars */
} );

export const useGlobalStylesContext = () => useContext( GlobalStylesContext );

export default ( { children, entityId, baseStyles, contexts } ) => {
	const {
		userStyles,
		getProperty,
		setProperty,
	} = useGlobalStylesFromEntities( entityId );

	useGlobalStylesEffectToUpdateStylesheet( contexts, baseStyles, userStyles );

	return (
		<GlobalStylesContext.Provider
			value={ {
				getProperty,
				setProperty,
				contexts,
			} }
		>
			{ children }
		</GlobalStylesContext.Provider>
	);
};

/**
 * Hook that exposes an API to retrieve and update user styles.
 *
 * @param {number} entityId Entity that stores the user data as CPT.
 *
 * @return {Object} User data as well as getters and setters.
 */
const useGlobalStylesFromEntities = ( entityId ) => {
	const { editEntityRecord } = useDispatch( 'core' );
	const userStyles = useSelect( ( select ) => {
		// Trigger entity retrieval
		select( 'core' ).getEntityRecord(
			'postType',
			'wp_global_styles',
			entityId
		);

		const userData = select( 'core' ).getEditedEntityRecord(
			'postType',
			'wp_global_styles',
			entityId
		);

		return userData?.content ? JSON.parse( userData.content ) : {};
	} );

	const getProperty = ( context, family, name ) =>
		userStyles?.[ context ]?.styles?.[ family ]?.[ name ];

	const setProperty = ( context, family, name, value ) =>
		editEntityRecord( 'postType', 'wp_global_styles', entityId, {
			content: JSON.stringify( {
				...userStyles,
				[ context ]: {
					styles: {
						...userStyles?.[ context ]?.styles,
						[ family ]: {
							...userStyles?.[ context ]?.styles?.[ family ],
							[ name ]: value,
						},
					},
				},
			} ),
		} );

	return {
		userStyles,
		getProperty,
		setProperty,
	};
};

const useGlobalStylesEffectToUpdateStylesheet = (
	contexts,
	baseStyles,
	userStyles
) => {
	useEffect( () => {
		const embeddedStylesheetId = 'global-styles-inline-css';
		let styleNode = document.getElementById( embeddedStylesheetId );

		if ( ! styleNode ) {
			styleNode = document.createElement( 'style' );
			styleNode.id = embeddedStylesheetId;
			document
				.getElementsByTagName( 'head' )[ 0 ]
				.appendChild( styleNode );
		}

		styleNode.innerText = getGlobalStyles(
			contexts,
			baseStyles,
			userStyles
		);
	}, [ userStyles ] );
};
