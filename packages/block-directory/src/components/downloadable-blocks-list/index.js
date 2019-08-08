/**
 * WordPress dependencies
 */
import { getBlockMenuDefaultClassName } from '@wordpress/blocks';
import { withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import DownloadableBlockListItem from '../downloadable-block-list-item';

function DownloadableBlocksList( { items, onHover = () => {}, children, handleDownloadableBlock, installBlock } ) {
	return (
		/*
		 * Disable reason: The `list` ARIA role is redundant but
		 * Safari+VoiceOver won't announce the list otherwise.
		 */
		/* eslint-disable jsx-a11y/no-redundant-roles */
		<ul role="list" className="block-directory-downloadable-blocks-list">
			{ items && items.map( ( item ) =>
				<DownloadableBlockListItem
					key={ item.id }
					className={ getBlockMenuDefaultClassName( item.id ) }
					icons={ item.icons }
					onClick={ () => {
						handleDownloadableBlock( item );
						installBlock( item.id );
						onHover( null );
					} }
					onFocus={ () => onHover( item ) }
					onMouseEnter={ () => onHover( item ) }
					onMouseLeave={ () => onHover( null ) }
					onBlur={ () => onHover( null ) }
					isDisabled={ item.isDisabled }
					item={ item }
				/>
			) }
			{ children }
		</ul>
		/* eslint-enable jsx-a11y/no-redundant-roles */
	);
}

export default compose(
	withDispatch( ( ownDispatch, props ) => {
		const { installBlock, handleDownloadableBlock } = ownDispatch( 'core/block-directory' );
		const { removeNotice } = ownDispatch( 'core/notices' );
		const { onSelect } = props;

		const retryIfFailed = ( slug ) => {
			removeNotice( 'block-install-error' );
			installBlock( slug, retryIfFailed, removeIfFailed );
		};

		const removeIfFailed = () => {
			removeNotice( 'block-install-error' );
			//TODO: remove block and unregister block type from editor;
		};

		const retryDownloadIfFailed = ( item ) => {
			removeNotice( 'block-preview-error' );
			handleDownloadableBlock( item, onSelect, retryDownloadIfFailed );
		};

		return {
			installBlock: ( slug ) => {
				installBlock( slug, retryIfFailed, removeIfFailed );
			},
			handleDownloadableBlock: ( item ) => {
				handleDownloadableBlock( item, onSelect, retryDownloadIfFailed );
			},
		};
	} ),
)( DownloadableBlocksList );
