/**
 * External dependencies
 */
import createSelector from 'rememo';

/**
 * Returns all the available format types.
 *
 * @param {Object} state Data state.
 *
 * @example
 * ```js
 * import { store as richTextStore } from '@wordpress/rich-text';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *    const { getFormatTypes } = useSelect(
 *        ( select ) => select( richTextStore ),
 *        []
 *    );
 *
 *    const availableFormats = getFormatTypes();
 *
 *    return availableFormats ? (
 *        <ul>
 *            { availableFormats?.map( ( format ) => (
 *                <li>{ format.name }</li>
 *           ) ) }
 *        </ul>
 *    ) : (
 *        __( 'No Formats available' )
 *    );
 * };
 * ```
 *
 * @return {Array} Format types.
 */
export const getFormatTypes = createSelector(
	( state ) => Object.values( state.formatTypes ),
	( state ) => [ state.formatTypes ]
);

/**
 * Returns a format type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name  Format type name.
 *
 * @return {Object?} Format type.
 */
export function getFormatType( state, name ) {
	return state.formatTypes[ name ];
}

/**
 * Gets the format type, if any, that can handle a bare element (without a
 * data-format-type attribute), given the tag name of this element.
 *
 * @param {Object} state              Data state.
 * @param {string} bareElementTagName The tag name of the element to find a
 *                                    format type for.
 * @return {?Object} Format type.
 */
export function getFormatTypeForBareElement( state, bareElementTagName ) {
	const formatTypes = getFormatTypes( state );
	return (
		formatTypes.find( ( { className, tagName } ) => {
			return className === null && bareElementTagName === tagName;
		} ) ||
		formatTypes.find( ( { className, tagName } ) => {
			return className === null && '*' === tagName;
		} )
	);
}

/**
 * Gets the format type, if any, that can handle an element, given its classes.
 *
 * @param {Object} state            Data state.
 * @param {string} elementClassName The classes of the element to find a format
 *                                  type for.
 * @return {?Object} Format type.
 */
export function getFormatTypeForClassName( state, elementClassName ) {
	return getFormatTypes( state ).find( ( { className } ) => {
		if ( className === null ) {
			return false;
		}

		return ` ${ elementClassName } `.indexOf( ` ${ className } ` ) >= 0;
	} );
}
