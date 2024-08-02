/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	InspectorControls,
	useBlockProps,
	useSettings,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

function ColumnInspectorControls( { width, setAttributes } ) {
	const [ availableUnits ] = useSettings( 'spacing.units' );
	const units = useCustomUnits( {
		availableUnits: availableUnits || [ '%', 'px', 'em', 'rem', 'vw' ],
	} );
	return (
		<PanelBody title={ __( 'Settings' ) }>
			<UnitControl
				label={ __( 'Width' ) }
				labelPosition="edge"
				__unstableInputWidth="80px"
				value={ width || '' }
				onChange={ ( nextWidth ) => {
					nextWidth = 0 > parseFloat( nextWidth ) ? '0' : nextWidth;
					setAttributes( { width: nextWidth } );
				} }
				units={ units }
			/>
		</PanelBody>
	);
}

function ColumnEdit( {
	attributes: { verticalAlignment, width, templateLock, allowedBlocks },
	setAttributes,
	clientId,
	isSelected,
} ) {
	const classes = clsx( 'block-core-columns', {
		[ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
	} );

	const {
		columnsIds,
		hasChildBlocks,
		rootClientId,
		isParentSelected,
		areAllColumnsEmpty,
	} = useSelect(
		( select ) => {
			const {
				getBlockCount,
				getBlockOrder,
				getBlockRootClientId,
				isBlockSelected,
			} = select( blockEditorStore );

			const rootId = getBlockRootClientId( clientId );
			const _columnsIds = getBlockOrder( rootId );

			return {
				hasChildBlocks: getBlockCount( clientId ) > 0,
				rootClientId: rootId,
				columnsIds: _columnsIds,
				isParentSelected: isBlockSelected( rootId ),
				areAllColumnsEmpty: _columnsIds.every(
					( id ) => getBlockCount( id ) === 0
				),
			};
		},
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const updateAlignment = ( value ) => {
		// Update own alignment.
		setAttributes( { verticalAlignment: value } );
		// Reset parent Columns block.
		updateBlockAttributes( rootClientId, {
			verticalAlignment: null,
		} );
	};

	const widthWithUnit = Number.isFinite( width ) ? width + '%' : width;
	const blockProps = useBlockProps( {
		className: classes,
		style: widthWithUnit ? { flexBasis: widthWithUnit } : undefined,
	} );

	const columnsCount = columnsIds.length;
	const currentColumnPosition = columnsIds.indexOf( clientId ) + 1;

	const label = sprintf(
		/* translators: 1: Block label (i.e. "Block: Column"), 2: Position of the selected block, 3: Total number of sibling blocks of the same type */
		__( '%1$s (%2$d of %3$d)' ),
		blockProps[ 'aria-label' ],
		currentColumnPosition,
		columnsCount
	);

	const innerBlocksProps = useInnerBlocksProps(
		{ ...blockProps, 'aria-label': label },
		{
			templateLock,
			allowedBlocks,
			renderAppender:
				( hasChildBlocks || ! ( isParentSelected || isSelected ) ) &&
				! areAllColumnsEmpty
					? undefined
					: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
					controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
				/>
			</BlockControls>
			<InspectorControls>
				<ColumnInspectorControls
					width={ width }
					setAttributes={ setAttributes }
				/>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}

export default ColumnEdit;
