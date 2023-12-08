/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	ToolbarButton,
	ToolbarGroup,
	ToolbarItem,
} from '@wordpress/components';
import {
	switchToBlockType,
	store as blocksStore,
	isReusableBlock,
	isTemplatePart,
} from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { copy } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import useBlockDisplayInformation from '../use-block-display-information';
import BlockIcon from '../block-icon';
import BlockTransformationsMenu from './block-transformations-menu';
import { useBlockVariationTransforms } from './block-variation-transformations';
import BlockStylesMenu from './block-styles-menu';
import PatternTransformationsMenu from './pattern-transformations-menu';
import useBlockDisplayTitle from '../block-title/use-block-display-title';

export const BlockSwitcherDropdownMenu = ( { clientIds, blocks } ) => {
	const { replaceBlocks, multiSelect, updateBlockAttributes } =
		useDispatch( blockEditorStore );
	const blockInformation = useBlockDisplayInformation( blocks[ 0 ].clientId );
	const {
		possibleBlockTransformations,
		canRemove,
		hasBlockStyles,
		icon,
		isZoomOutMode,
		patterns,
	} = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getBlockTransformItems,
				__experimentalGetPatternTransformItems,
				canRemoveBlocks,
			} = select( blockEditorStore );
			const { getBlockStyles, getBlockType } = select( blocksStore );
			const { __unstableGetEditorMode } = select( blockEditorStore );
			const rootClientId = getBlockRootClientId(
				Array.isArray( clientIds ) ? clientIds[ 0 ] : clientIds
			);
			const [ { name: firstBlockName } ] = blocks;
			const _isSingleBlockSelected = blocks.length === 1;
			const styles =
				_isSingleBlockSelected && getBlockStyles( firstBlockName );
			let _icon;
			if ( _isSingleBlockSelected ) {
				_icon = blockInformation?.icon; // Take into account active block variations.
			} else {
				const isSelectionOfSameType =
					new Set( blocks.map( ( { name } ) => name ) ).size === 1;
				// When selection consists of blocks of multiple types, display an
				// appropriate icon to communicate the non-uniformity.
				_icon = isSelectionOfSameType
					? getBlockType( firstBlockName )?.icon
					: copy;
			}
			return {
				possibleBlockTransformations: getBlockTransformItems(
					blocks,
					rootClientId
				),
				canRemove: canRemoveBlocks( clientIds, rootClientId ),
				hasBlockStyles: !! styles?.length,
				icon: _icon,
				isZoomOutMode: __unstableGetEditorMode() === 'zoom-out',
				patterns: __experimentalGetPatternTransformItems(
					blocks,
					rootClientId
				),
			};
		},
		[ clientIds, blocks, blockInformation?.icon ]
	);

	const blockVariationTransformations = useBlockVariationTransforms( {
		clientIds,
		blocks,
	} );

	const blockTitle = useBlockDisplayTitle( {
		clientId: Array.isArray( clientIds ) ? clientIds[ 0 ] : clientIds,
		maximumLength: 35,
	} );

	const isSingleBlock = blocks.length === 1;
	const isReusable = isSingleBlock && isReusableBlock( blocks[ 0 ] );
	const isTemplate = isSingleBlock && isTemplatePart( blocks[ 0 ] );

	function selectForMultipleBlocks( insertedBlocks ) {
		if ( insertedBlocks.length > 1 ) {
			multiSelect(
				insertedBlocks[ 0 ].clientId,
				insertedBlocks[ insertedBlocks.length - 1 ].clientId
			);
		}
	}

	// Simple block tranformation based on the `Block Transforms` API.
	function onBlockTransform( name ) {
		const newBlocks = switchToBlockType( blocks, name );
		replaceBlocks( clientIds, newBlocks );
		selectForMultipleBlocks( newBlocks );
	}

	function onBlockVariationTransform( name ) {
		updateBlockAttributes( blocks[ 0 ].clientId, {
			...blockVariationTransformations.find(
				( { name: variationName } ) => variationName === name
			).attributes,
		} );
	}

	// Pattern transformation through the `Patterns` API.
	function onPatternTransform( transformedBlocks ) {
		replaceBlocks( clientIds, transformedBlocks );
		selectForMultipleBlocks( transformedBlocks );
	}

	/**
	 * The `isTemplate` check is a stopgap solution here.
	 * Ideally, the Transforms API should handle this
	 * by allowing to exclude blocks from wildcard transformations.
	 */
	const hasPossibleBlockTransformations =
		!! possibleBlockTransformations.length && canRemove && ! isTemplate;
	const hasPossibleBlockVariationTransformations =
		!! blockVariationTransformations?.length;
	const hasPatternTransformation = !! patterns?.length && canRemove;
	const hasNoMenu =
		! hasBlockStyles &&
		! hasPossibleBlockTransformations &&
		! hasPossibleBlockVariationTransformations;

	if ( hasNoMenu || isZoomOutMode ) {
		return (
			<ToolbarGroup>
				<ToolbarButton
					disabled
					className="block-editor-block-switcher__no-switcher-icon"
					title={ blockTitle }
					icon={
						<>
							<BlockIcon icon={ icon } showColors />
							{ ( isReusable || isTemplate ) && (
								<span className="block-editor-block-switcher__toggle-text">
									{ blockTitle }
								</span>
							) }
						</>
					}
				/>
			</ToolbarGroup>
		);
	}

	const blockSwitcherLabel = isSingleBlock
		? blockTitle
		: __( 'Multiple blocks selected' );

	const blockSwitcherDescription = isSingleBlock
		? __( 'Change block type or style' )
		: sprintf(
				/* translators: %d: number of blocks. */
				_n(
					'Change type of %d block',
					'Change type of %d blocks',
					blocks.length
				),
				blocks.length
		  );

	const hasBlockOrBlockVariationTransforms =
		hasPossibleBlockTransformations ||
		hasPossibleBlockVariationTransformations;
	const showDropDown =
		hasBlockStyles ||
		hasBlockOrBlockVariationTransforms ||
		hasPatternTransformation;
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<DropdownMenu
						className="block-editor-block-switcher"
						label={ blockSwitcherLabel }
						popoverProps={ {
							placement: 'bottom-start',
							className: 'block-editor-block-switcher__popover',
						} }
						icon={
							<>
								<BlockIcon
									icon={ icon }
									className="block-editor-block-switcher__toggle"
									showColors
								/>
								{ ( isReusable || isTemplate ) && (
									<span className="block-editor-block-switcher__toggle-text">
										{ blockTitle }
									</span>
								) }
							</>
						}
						toggleProps={ {
							describedBy: blockSwitcherDescription,
							...toggleProps,
						} }
						menuProps={ { orientation: 'both' } }
					>
						{ ( { onClose } ) =>
							showDropDown && (
								<div className="block-editor-block-switcher__container">
									{ hasPatternTransformation && (
										<PatternTransformationsMenu
											blocks={ blocks }
											patterns={ patterns }
											onSelect={ (
												transformedBlocks
											) => {
												onPatternTransform(
													transformedBlocks
												);
												onClose();
											} }
										/>
									) }
									{ hasBlockOrBlockVariationTransforms && (
										<BlockTransformationsMenu
											className="block-editor-block-switcher__transforms__menugroup"
											possibleBlockTransformations={
												possibleBlockTransformations
											}
											possibleBlockVariationTransformations={
												blockVariationTransformations
											}
											blocks={ blocks }
											onSelect={ ( name ) => {
												onBlockTransform( name );
												onClose();
											} }
											onSelectVariation={ ( name ) => {
												onBlockVariationTransform(
													name
												);
												onClose();
											} }
										/>
									) }
									{ hasBlockStyles && (
										<BlockStylesMenu
											hoveredBlock={ blocks[ 0 ] }
											onSwitch={ onClose }
										/>
									) }
								</div>
							)
						}
					</DropdownMenu>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
};

export const BlockSwitcher = ( { clientIds } ) => {
	const blocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlocksByClientId( clientIds ),
		[ clientIds ]
	);

	if ( ! blocks.length || blocks.some( ( block ) => ! block ) ) {
		return null;
	}

	return (
		<BlockSwitcherDropdownMenu clientIds={ clientIds } blocks={ blocks } />
	);
};

export default BlockSwitcher;
