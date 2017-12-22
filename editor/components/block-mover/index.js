/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { first, last } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton, withContext } from '@wordpress/components';
import { getBlockType } from '@wordpress/blocks';
import { compose } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { getBlockMoverLabel } from './mover-label';
import { isFirstBlock, isLastBlock, getBlockIndex, getBlock } from '../../store/selectors';
import { selectBlock } from '../../store/actions';

export function BlockMover( { onMoveUp, onMoveDown, isFirst, isLast, uids, blockType, firstIndex, isLocked, ...props } ) {
	if ( isLocked ) {
		return null;
	}

	// We emulate a disabled state because forcefully applying the `disabled`
	// attribute on the button while it has focus causes the screen to change
	// to an unfocused state (body as active element) without firing blur on,
	// the rendering parent, leaving it unable to react to focus out.
	return (
		<div
			className="editor-block-mover"
			draggable={ props.draggable }
			onDragStart={ props.onDragStart }
			onDragEnd={ props.onDragEnd }
		>
			<IconButton
				className="editor-block-mover__control"
				onClick={ isFirst ? null : onMoveUp }
				icon="arrow-up-alt2"
				tooltip={ __( 'Move Up' ) }
				label={ getBlockMoverLabel(
					uids.length,
					blockType && blockType.title,
					firstIndex,
					isFirst,
					isLast,
					-1,
				) }
				aria-disabled={ isFirst }
			/>
			<IconButton
				className="editor-block-mover__control"
				onClick={ isLast ? null : onMoveDown }
				icon="arrow-down-alt2"
				tooltip={ __( 'Move Down' ) }
				label={ getBlockMoverLabel(
					uids.length,
					blockType && blockType.title,
					firstIndex,
					isFirst,
					isLast,
					1,
				) }
				aria-disabled={ isLast }
			/>
		</div>
	);
}

export default compose(
	connect(
		( state, ownProps ) => {
			const block = getBlock( state, first( ownProps.uids ) );

			return ( {
				isFirst: isFirstBlock( state, first( ownProps.uids ) ),
				isLast: isLastBlock( state, last( ownProps.uids ) ),
				firstIndex: getBlockIndex( state, first( ownProps.uids ) ),
				blockType: block ? getBlockType( block.name ) : null,
			} );
		},
		( dispatch, ownProps ) => ( {
			onMoveDown() {
				if ( ownProps.uids.length === 1 ) {
					dispatch( selectBlock( first( ownProps.uids ) ) );
				}

				dispatch( {
					type: 'MOVE_BLOCKS_DOWN',
					uids: ownProps.uids,
				} );
			},
			onMoveUp() {
				if ( ownProps.uids.length === 1 ) {
					dispatch( selectBlock( first( ownProps.uids ) ) );
				}

				dispatch( {
					type: 'MOVE_BLOCKS_UP',
					uids: ownProps.uids,
				} );
			},
		} )
	),
	withContext( 'editor' )( ( settings ) => {
		const { templateLock } = settings;

		return {
			isLocked: templateLock === 'all',
		};
	} ),
)( BlockMover );
