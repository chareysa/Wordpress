/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { ResizableBox, withNotices } from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { compose, useViewportMatch } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icon from './media-container-icon';

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

export function imageFillStyles( url, focalPoint ) {
	return url
		? {
				backgroundImage: `url(${ url })`,
				backgroundPosition: focalPoint
					? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`
					: `50% 50%`,
		  }
		: {};
}

function ResizableBoxContainer( { isSelected, isStackedOnMobile, ...props } ) {
	const isMobile = useViewportMatch( 'small', '<' );
	return (
		<ResizableBox
			showHandle={ isSelected && ( ! isMobile || ! isStackedOnMobile ) }
			{ ...props }
		/>
	);
}

function ToolbarEditButton( { onSelectMedia, mediaUrl, mediaId } ) {
	return (
		<BlockControls>
			<MediaReplaceFlow
				mediaId={ mediaId }
				mediaURL={ mediaUrl }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				accept="image/*,video/*"
				onSelect={ onSelectMedia }
			/>
		</BlockControls>
	);
}

function PlaceholderContainer( {
	onSelectMedia,
	className,
	noticeUI,
	noticeOperations,
} ) {
	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	return (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			labels={ {
				title: __( 'Media area' ),
			} }
			className={ className }
			onSelect={ onSelectMedia }
			accept="image/*,video/*"
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			notices={ noticeUI }
			onError={ onUploadError }
		/>
	);
}

function MediaContainer( props ) {
	const {
		mediaPosition,
		mediaUrl,
		mediaType,
		mediaWidth,
		commitWidthChange,
		onWidthChange,
		toggleSelection,
		isSelected,
		isStackedOnMobile,
		className,
		imageFill,
		focalPoint,
		mediaId,
		mediaAlt,
		onSelectMedia,
	} = props;

	if ( mediaType && mediaUrl ) {
		const onResizeStart = () => {
			toggleSelection( false );
		};
		const onResize = ( event, direction, elt ) => {
			onWidthChange( parseInt( elt.style.width ) );
		};
		const onResizeStop = ( event, direction, elt ) => {
			toggleSelection( true );
			commitWidthChange( parseInt( elt.style.width ) );
		};
		const enablePositions = {
			right: mediaPosition === 'left',
			left: mediaPosition === 'right',
		};

		const backgroundStyles =
			mediaType === 'image' && imageFill
				? imageFillStyles( mediaUrl, focalPoint )
				: {};

		const mediaTypeRenderers = {
			image: () => <img src={ mediaUrl } alt={ mediaAlt } />,
			video: () => <video controls src={ mediaUrl } />,
		};

		return (
			<ResizableBoxContainer
				className="editor-media-container__resizer"
				style={ backgroundStyles }
				size={ { width: mediaWidth + '%' } }
				minWidth="10%"
				maxWidth="100%"
				enable={ enablePositions }
				onResizeStart={ onResizeStart }
				onResize={ onResize }
				onResizeStop={ onResizeStop }
				axis="x"
				isSelected={ isSelected }
				isStackedOnMobile={ isStackedOnMobile }
			>
				<ToolbarEditButton
					onSelectMedia={ onSelectMedia }
					mediaUrl={ mediaUrl }
					mediaId={ mediaId }
				/>
				<figure className={ className } style={ backgroundStyles }>
					{ ( mediaTypeRenderers[ mediaType ] || noop )() }
				</figure>
			</ResizableBoxContainer>
		);
	}

	return <PlaceholderContainer { ...props } />;
}

export default compose( [
	withDispatch( ( dispatch ) => {
		const { toggleSelection } = dispatch( 'core/block-editor' );

		return {
			toggleSelection,
		};
	} ),
	withNotices,
] )( MediaContainer );
