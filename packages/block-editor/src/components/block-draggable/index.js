/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks';
import { Draggable } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockDraggableChip from './draggable-chip';
import useScrollWhenDragging from './use-scroll-when-dragging';

const BlockDraggable = ( {
	children,
	clientIds,
	cloneClassname,
	onDragStart,
	onDragEnd,
	elementId,
} ) => {
	const { srcRootClientId, isDraggable, icon } = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getTemplateLock,
				getBlockName,
			} = select( 'core/block-editor' );
			const rootClientId = getBlockRootClientId( clientIds[ 0 ] );
			const templateLock = rootClientId
				? getTemplateLock( rootClientId )
				: null;
			const blockName = getBlockName( clientIds[ 0 ] );

			return {
				srcRootClientId: rootClientId,
				isDraggable: 'all' !== templateLock,
				icon: getBlockType( blockName )?.icon,
			};
		},
		[ clientIds ]
	);
	const isDragging = useRef( false );
	const [
		startScrolling,
		scrollOnDragOver,
		stopScrolling,
	] = useScrollWhenDragging();

	const { startDraggingBlocks, stopDraggingBlocks } = useDispatch(
		'core/block-editor'
	);

	// Stop dragging blocks if the block draggable is unmounted
	useEffect( () => {
		return () => {
			if ( isDragging.current ) {
				stopDraggingBlocks();
			}
		};
	}, [] );

	if ( ! isDraggable ) {
		return children( { isDraggable: false } );
	}

	const transferData = {
		type: 'block',
		srcClientIds: clientIds,
		srcRootClientId,
	};

	return (
		<Draggable
			cloneClassname={ cloneClassname }
			elementId={ elementId }
			transferData={ transferData }
			onDragStart={ ( event ) => {
				startDraggingBlocks( clientIds );
				isDragging.current = true;

				startScrolling( event );

				if ( onDragStart ) {
					onDragStart();
				}
			} }
			onDragOver={ scrollOnDragOver }
			onDragEnd={ () => {
				stopDraggingBlocks();
				isDragging.current = false;

				stopScrolling();

				if ( onDragEnd ) {
					onDragEnd();
				}
			} }
			__experimentalDragComponent={
				<BlockDraggableChip count={ clientIds.length } icon={ icon } />
			}
		>
			{ ( { onDraggableStart, onDraggableEnd } ) => {
				return children( {
					draggable: true,
					onDragStart: onDraggableStart,
					onDragEnd: onDraggableEnd,
				} );
			} }
		</Draggable>
	);
};

export default BlockDraggable;
