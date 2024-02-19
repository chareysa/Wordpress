/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	hasBlockSupport,
	switchToBlockType,
	store as blocksStore,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { useNotifyCopy } from '../../utils/use-notify-copy';
import usePasteStyles from '../use-paste-styles';
import { store as blockEditorStore } from '../../store';

export default function BlockActions( {
	clientIds,
	children,
	__experimentalUpdateSelection: updateSelection,
} ) {
	const { getDefaultBlockName, getGroupingBlockName } =
		useSelect( blocksStore );
	const selected = useSelect(
		( select ) => {
			const {
				canInsertBlockType,
				getBlockRootClientId,
				getBlocksByClientId,
				canMoveBlocks,
				canRemoveBlocks,
			} = select( blockEditorStore );

			const blocks = getBlocksByClientId( clientIds );
			const rootClientId = getBlockRootClientId( clientIds[ 0 ] );

			return {
				canMove: canMoveBlocks( clientIds, rootClientId ),
				canRemove: canRemoveBlocks( clientIds, rootClientId ),
				canInsertDefaultBlock: canInsertBlockType(
					getDefaultBlockName(),
					rootClientId
				),
				canCopyStyles: blocks.every( ( block ) => {
					return (
						!! block &&
						( hasBlockSupport( block.name, 'color' ) ||
							hasBlockSupport( block.name, 'typography' ) )
					);
				} ),
				canDuplicate: blocks.every( ( block ) => {
					return (
						!! block &&
						hasBlockSupport( block.name, 'multiple', true ) &&
						canInsertBlockType( block.name, rootClientId )
					);
				} ),
			};
		},
		[ clientIds, getDefaultBlockName ]
	);
	const { getBlocksByClientId, getBlocks } = useSelect( blockEditorStore );

	const {
		canMove,
		canRemove,
		canInsertDefaultBlock,
		canCopyStyles,
		canDuplicate,
	} = selected;

	const {
		removeBlocks,
		replaceBlocks,
		duplicateBlocks,
		insertAfterBlock,
		insertBeforeBlock,
		flashBlock,
		setBlockMovingClientId,
		setNavigationMode,
		selectBlock,
	} = useDispatch( blockEditorStore );

	const notifyCopy = useNotifyCopy();
	const pasteStyles = usePasteStyles();

	return children( {
		canCopyStyles,
		canDuplicate,
		canInsertDefaultBlock,
		canMove,
		canRemove,
		onDuplicate() {
			return duplicateBlocks( clientIds, updateSelection );
		},
		onRemove() {
			return removeBlocks( clientIds, updateSelection );
		},
		onInsertBefore() {
			const clientId = Array.isArray( clientIds )
				? clientIds[ 0 ]
				: clientId;
			insertBeforeBlock( clientId );
		},
		onInsertAfter() {
			const clientId = Array.isArray( clientIds )
				? clientIds[ clientIds.length - 1 ]
				: clientId;
			insertAfterBlock( clientId );
		},
		onMoveTo() {
			setNavigationMode( true );
			selectBlock( clientIds[ 0 ] );
			setBlockMovingClientId( clientIds[ 0 ] );
		},
		onGroup() {
			if ( ! clientIds.length ) {
				return;
			}

			const groupingBlockName = getGroupingBlockName();

			// Activate the `transform` on `core/group` which does the conversion.
			const newBlocks = switchToBlockType(
				getBlocksByClientId( clientIds ),
				groupingBlockName
			);

			if ( ! newBlocks ) {
				return;
			}
			replaceBlocks( clientIds, newBlocks );
		},
		onUngroup() {
			if ( ! clientIds.length ) {
				return;
			}

			const innerBlocks = getBlocks( clientIds[ 0 ] );
			if ( ! innerBlocks.length ) {
				return;
			}

			replaceBlocks( clientIds, innerBlocks );
		},
		onCopy() {
			if ( clientIds.length === 1 ) {
				flashBlock( clientIds[ 0 ] );
			}
			notifyCopy( 'copy', clientIds );
		},
		async onPasteStyles() {
			await pasteStyles( getBlocksByClientId( clientIds ) );
		},
	} );
}
