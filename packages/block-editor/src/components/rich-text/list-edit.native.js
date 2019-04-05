/**
 * WordPress dependencies
 */

import { Toolbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	changeListType,
	getLineListFormat,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

import BlockFormatControls from '../block-format-controls';

/**
 * Whether or not the root list is selected.
 *
 * @return {boolean} True if the root list or nothing is selected, false if an
 *                   inner list is selected.
 */
function isListRootSelected( value ) {
	return getLineListFormat( value ).nestingLevel < 1;
}

/**
 * Wether or not the selected list has the given tag name.
 *
 * @param {string}  tagName     The tag name the list should have.
 * @param {string}  rootTagName The current root tag name, to compare with in
 *                              case nothing is selected.
 *
 * @return {boolean}             [description]
 */
function isActiveListType( tagName, rootTagName, value ) {
	const listFormat = getLineListFormat( value );

	if ( ! listFormat || ! listFormat.type ) {
		return tagName === rootTagName;
	}

	return listFormat.type.toLowerCase() === tagName;
}

export const ListEdit = ( {
	onTagNameChange,
	tagName,
	value,
	onChange,
} ) => (
	<BlockFormatControls>
		<Toolbar
			controls={ [
				onTagNameChange && {
					icon: 'editor-ul',
					title: __( 'Convert to unordered list' ),
					isActive: isActiveListType( 'ul', tagName, value ),
					onClick() {
						onChange( changeListType( value, { type: 'ul' } ) );

						if ( isListRootSelected( value ) ) {
							onTagNameChange( 'ul' );
						}
					},
				},
				onTagNameChange && {
					icon: 'editor-ol',
					title: __( 'Convert to ordered list' ),
					isActive: isActiveListType( 'ol', tagName, value ),
					onClick() {
						onChange( changeListType( value, { type: 'ol' } ) );

						if ( isListRootSelected( value ) ) {
							onTagNameChange( 'ol' );
						}
					},
				},
			].filter( Boolean ) }
		/>
	</BlockFormatControls>
);
