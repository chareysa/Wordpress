/**
 * External dependencies
 */
import classnames from 'classnames';
import { CompositeItem } from 'reakit';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useMemo, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import InserterListItemDraggable from './draggable';

function InserterListItem( {
	className,
	composite,
	item,
	onSelect,
	onHover,
	isDraggable,
	...props
} ) {
	const isDragging = useRef( false );
	const itemIconStyle = item.icon
		? {
				backgroundColor: item.icon.background,
				color: item.icon.foreground,
		  }
		: {};
	const blocks = useMemo( () => {
		return [
			createBlock(
				item.name,
				item.initialAttributes,
				createBlocksFromInnerBlocksTemplate( item.innerBlocks )
			),
		];
	}, [ item.name, item.initialAttributes, item.initialAttributes ] );

	return (
		<InserterListItemDraggable
			isEnabled={ isDraggable && ! item.disabled }
			blocks={ blocks }
			icon={ item.icon }
		>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				<div
					className="block-editor-block-types-list__list-item"
					draggable={ draggable }
					onDragStart={ ( event ) => {
						isDragging.current = true;
						if ( onDragStart ) {
							onHover( null );
							onDragStart( event );
						}
					} }
					onDragEnd={ ( event ) => {
						isDragging.current = false;
						if ( onDragEnd ) {
							onDragEnd( event );
						}
					} }
				>
					<CompositeItem
						role="option"
						as={ Button }
						{ ...composite }
						className={ classnames(
							'block-editor-block-types-list__item',
							className
						) }
						disabled={ item.isDisabled }
						onClick={ ( event ) => {
							event.preventDefault();
							onSelect( item );
							onHover( null );
						} }
						onFocus={ () => {
							if ( isDragging.current ) {
								return;
							}
							onHover( item );
						} }
						onMouseEnter={ () => {
							if ( isDragging.current ) {
								return;
							}
							onHover( item );
						} }
						onMouseLeave={ () => onHover( null ) }
						onBlur={ () => onHover( null ) }
						// Use the CompositeItem `focusable` prop over Button's
						// isFocusable. The latter was shown to cause an issue
						// with tab order in the inserter list.
						focusables
						{ ...props }
					>
						<span
							className="block-editor-block-types-list__item-icon"
							style={ itemIconStyle }
						>
							<BlockIcon icon={ item.icon } showColors />
						</span>
						<span className="block-editor-block-types-list__item-title">
							{ item.title }
						</span>
					</CompositeItem>
				</div>
			) }
		</InserterListItemDraggable>
	);
}

export default InserterListItem;
