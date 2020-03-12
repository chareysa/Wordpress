/**
 * External dependencies
 */
import { View } from 'react-native';
import { dropRight, times } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, StepperControl } from '@wordpress/components';
import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { withDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { compose, withPreferredColorScheme } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { withViewportMatch } from '@wordpress/viewport';
/**
 * Internal dependencies
 */
import styles from './editor.scss';

/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'core/column'.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_BLOCKS = [ 'core/column' ];

/**
 * Number of columns to assume for template in case the user opts to skip
 * template option selection.
 *
 * @type {number}
 */
const MIN_COLUMNS_NUMBER = 0;
const MAX_COLUMNS_NUMBER = 6;

function ColumnsEditContainer( {
	attributes,
	updateAlignment,
	updateColumns,
	isMobile,
	columnCount,
	isSelected,
} ) {
	const { verticalAlignment } = attributes;
	const [ columnsSettings, setColumnsSettings ] = useState( {
		columnsInRow: 2,
	} );
	const { width } = columnsSettings;

	useEffect( () => {
		updateColumns( columnCount, columnCount );
		setColumnsSettings( {
			...columnsSettings,
			columnsInRow: getColumnsInRow( width, columnCount ),
		} );
	}, [ columnCount ] );

	const getColumnsInRow = ( containerWidth, columnsNumber ) => {
		if ( containerWidth < 480 ) {
			return 1;
		}
		if ( containerWidth >= 480 && containerWidth < 768 ) {
			return Math.min( columnCount, 2 );
		}
		return columnsNumber;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Columns Settings' ) }>
					<StepperControl
						label={ __( 'Number of columns' ) }
						icon="columns"
						value={ columnCount }
						onChange={ ( value ) =>
							updateColumns( columnCount, value )
						}
						min={ MIN_COLUMNS_NUMBER }
						max={ MAX_COLUMNS_NUMBER }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
					isCollapsed={ false }
				/>
			</BlockControls>
			<View
				onLayout={ ( event ) => {
					const { width: newWidth } = event.nativeEvent.layout;
					if ( newWidth !== width ) {
						setColumnsSettings( {
							columnsInRow: getColumnsInRow(
								newWidth,
								columnCount
							),
							width: newWidth,
						} );
					}
				} }
			>
				<InnerBlocks
					renderAppender={
						isSelected && InnerBlocks.ButtonBlockAppender
					}
					flatListProps={ {
						...( ! isMobile && {
							contentContainerStyle: {
								...styles.columnsContainer,
								maxWidth: width,
							},
						} ),
						horizontal: ! isMobile && columnCount !== 0,
						scrollEnabled: false,
					} }
					containerStyle={ { flex: 1 } }
					allowedBlocks={ ALLOWED_BLOCKS }
					columnsSettings={ columnsSettings }
				/>
			</View>
		</>
	);
}

const ColumnsEditContainerWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		/**
		 * Update all child Column blocks with a new vertical alignment setting
		 * based on whatever alignment is passed in. This allows change to parent
		 * to overide anything set on a individual column basis.
		 *
		 * @param {string} verticalAlignment the vertical alignment setting
		 */
		updateAlignment( verticalAlignment ) {
			const { clientId, setAttributes } = ownProps;
			const { updateBlockAttributes } = dispatch( 'core/block-editor' );
			const { getBlockOrder } = registry.select( 'core/block-editor' );

			// Update own alignment.
			setAttributes( { verticalAlignment } );

			// Update all child Column Blocks to match
			const innerBlockClientIds = getBlockOrder( clientId );
			innerBlockClientIds.forEach( ( innerBlockClientId ) => {
				updateBlockAttributes( innerBlockClientId, {
					verticalAlignment,
				} );
			} );
		},
		updateBlockSettings( settings ) {
			const { clientId } = ownProps;
			const { updateBlockListSettings } = dispatch( 'core/block-editor' );
			updateBlockListSettings( clientId, settings );
		},
		/**
		 * Updates the column columnCount, including necessary revisions to child Column
		 * blocks to grant required or redistribute available space.
		 *
		 * @param {number} previousColumns Previous column columnCount.
		 * @param {number} newColumns      New column columnCount.
		 */
		updateColumns( previousColumns, newColumns ) {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( 'core/block-editor' );
			const { getBlocks } = registry.select( 'core/block-editor' );

			let innerBlocks = getBlocks( clientId );

			// Redistribute available width for existing inner blocks.
			const isAddingColumn = newColumns > previousColumns;

			if ( isAddingColumn ) {
				innerBlocks = [
					...innerBlocks,
					...times( newColumns - previousColumns, () => {
						return createBlock( 'core/column' );
					} ),
				];
			} else {
				// The removed column will be the last of the inner blocks.
				innerBlocks = dropRight(
					innerBlocks,
					previousColumns - newColumns
				);
			}

			replaceInnerBlocks( clientId, innerBlocks, false );
		},
	} )
)( ColumnsEditContainer );

const ColumnsEdit = ( props ) => {
	const { clientId, isSelected, getStylesFromColorScheme } = props;
	const { hasChildren, columnCount } = useSelect(
		( select ) => {
			const { getBlocks, getBlockCount } = select( 'core/block-editor' );

			return {
				hasChildren: getBlocks( clientId ).length > 0,
				columnCount: getBlockCount( clientId ),
			};
		},
		[ clientId ]
	);

	if ( ! isSelected && ! hasChildren ) {
		return (
			<View
				style={ [
					getStylesFromColorScheme(
						styles.columnsPlaceholder,
						styles.columnsPlaceholderDark
					),
					! hasChildren && {
						...styles.marginVerticalDense,
						...styles.marginHorizontalNone,
					},
				] }
			/>
		);
	}

	return (
		<ColumnsEditContainerWrapper columnCount={ columnCount } { ...props } />
	);
};

export default compose( [
	withViewportMatch( { isMobile: '< mobile' } ),
	withPreferredColorScheme,
] )( ColumnsEdit );
