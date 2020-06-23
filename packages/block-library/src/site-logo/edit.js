/**
 * External dependencies
 */
import classnames from 'classnames';
import { includes, pick } from 'lodash';

/**
 * WordPress dependencies
 */
import { isBlobURL } from '@wordpress/blob';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Notice,
	PanelBody,
	RangeControl,
	ResizableBox,
	Spinner,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icon from './icon';
import useClientWidth from '../image/use-client-width';

/**
 * Module constants
 */
import { MIN_SIZE } from '../image/constants';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const ACCEPT_MEDIA_STRING = 'image/*';

const SiteLogo = ( {
	alt,
	attributes: { align, width, height },
	containerRef,
	isSelected,
	setAttributes,
	url,
} ) => {
	const clientWidth = useClientWidth( containerRef, [ align ] );
	const isLargeViewport = useViewportMatch( 'medium' );
	const isWideAligned = includes( [ 'wide', 'full' ], align );
	const isResizable = ! isWideAligned && isLargeViewport;
	const [ { naturalWidth, naturalHeight }, setNaturalSize ] = useState( {} );
	const { toggleSelection } = useDispatch( 'core/block-editor' );
	const classes = classnames( {
		'is-transient': isBlobURL( url ),
	} );
	const { maxWidth, isRTL, title } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const siteEntities = select( 'core' ).getEditedEntityRecord(
			'root',
			'site'
		);
		return {
			title: siteEntities.title,
			...pick( getSettings(), [ 'imageSizes', 'isRTL', 'maxWidth' ] ),
		};
	} );

	function onResizeStart() {
		toggleSelection( false );
	}

	function onResizeStop() {
		toggleSelection( true );
	}

	let img = (
		// Disable reason: Image itself is not meant to be interactive, but
		// should direct focus to block.
		/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
		<a href="#home" className={ classes } rel="home" title={ title }>
			<span className="custom-logo-link">
				<img
					className="custom-logo"
					src={ url }
					alt={ alt }
					onLoad={ ( event ) => {
						setNaturalSize(
							pick( event.target, [
								'naturalWidth',
								'naturalHeight',
							] )
						);
					} }
				/>
			</span>
		</a>
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
	);

	let imageWidthWithinContainer;
	let logoInspectorControls = null;

	if ( clientWidth && naturalWidth && naturalHeight ) {
		const exceedMaxWidth = naturalWidth > clientWidth;
		imageWidthWithinContainer = exceedMaxWidth ? clientWidth : naturalWidth;
	}

	if ( ! isResizable || ! imageWidthWithinContainer ) {
		img = <div style={ { width, height } }>{ img }</div>;
	} else {
		const currentWidth = width || imageWidthWithinContainer;
		const ratio = naturalWidth / naturalHeight;
		const currentHeight = currentWidth / ratio;
		const minWidth =
			naturalWidth < naturalHeight ? MIN_SIZE : MIN_SIZE * ratio;
		const minHeight =
			naturalHeight < naturalWidth ? MIN_SIZE : MIN_SIZE / ratio;

		// With the current implementation of ResizableBox, an image needs an
		// explicit pixel value for the max-width. In absence of being able to
		// set the content-width, this max-width is currently dictated by the
		// vanilla editor style. The following variable adds a buffer to this
		// vanilla style, so 3rd party themes have some wiggleroom. This does,
		// in most cases, allow you to scale the image beyond the width of the
		// main column, though not infinitely.
		// @todo It would be good to revisit this once a content-width variable
		// becomes available.
		const maxWidthBuffer = maxWidth * 2.5;

		let showRightHandle = false;
		let showLeftHandle = false;

		/* eslint-disable no-lonely-if */
		// See https://github.com/WordPress/gutenberg/issues/7584.
		if ( align === 'center' ) {
			// When the image is centered, show both handles.
			showRightHandle = true;
			showLeftHandle = true;
		} else if ( isRTL ) {
			// In RTL mode the image is on the right by default.
			// Show the right handle and hide the left handle only when it is
			// aligned left. Otherwise always show the left handle.
			if ( align === 'left' ) {
				showRightHandle = true;
			} else {
				showLeftHandle = true;
			}
		} else {
			// Show the left handle and hide the right handle only when the
			// image is aligned right. Otherwise always show the right handle.
			if ( align === 'right' ) {
				showLeftHandle = true;
			} else {
				showRightHandle = true;
			}
		}
		/* eslint-enable no-lonely-if */

		img = (
			<ResizableBox
				size={ { width, height } }
				showHandle={ isSelected }
				minWidth={ minWidth }
				maxWidth={ maxWidthBuffer }
				minHeight={ minHeight }
				maxHeight={ maxWidthBuffer / ratio }
				lockAspectRatio
				enable={ {
					top: false,
					right: showRightHandle,
					bottom: true,
					left: showLeftHandle,
				} }
				onResizeStart={ onResizeStart }
				onResizeStop={ ( event, direction, elt, delta ) => {
					onResizeStop();
					setAttributes( {
						width: parseInt( currentWidth + delta.width, 10 ),
						height: parseInt( currentHeight + delta.height, 10 ),
					} );
				} }
			>
				{ img }
			</ResizableBox>
		);

		logoInspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Site Logo Settings' ) }>
					<RangeControl
						label={ __( 'Image width' ) }
						onChange={ ( newWidth ) =>
							setAttributes( { width: newWidth } )
						}
						min={ minWidth }
						max={ maxWidthBuffer }
						initialPosition={ Math.min(
							naturalWidth,
							maxWidthBuffer
						) }
						value={ width || '' }
						disabled={ ! isResizable }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

	return (
		<>
			{ logoInspectorControls }
			{ img }
		</>
	);
};

export default function LogoEdit( {
	attributes,
	className,
	setAttributes,
	isSelected,
} ) {
	const { width } = attributes;
	const [ url, setUrl ] = useState( null );
	const [ error, setError ] = useState();
	const ref = useRef();
	const { sitelogo } = useSelect( ( select ) =>
		select( 'core' ).getEditedEntityRecord( 'root', 'site' )
	);
	const mediaItemData = useSelect(
		( select ) => {
			const mediaItem = select( 'core' ).getEntityRecord(
				'root',
				'media',
				sitelogo
			);
			return (
				mediaItem && {
					url: mediaItem.source_url,
					alt: mediaItem.alt_text,
				}
			);
		},
		[ sitelogo ]
	);

	const { editEntityRecord } = useDispatch( 'core' );
	const setLogo = ( newValue ) =>
		editEntityRecord( 'root', 'site', undefined, {
			sitelogo: newValue,
		} );

	let alt = null;
	if ( mediaItemData ) {
		alt = mediaItemData.alt;
		if ( url !== mediaItemData.url ) {
			setUrl( mediaItemData.url );
		}
	}

	const onSelectLogo = ( media ) => {
		if ( ! media ) {
			return;
		}

		if ( ! media.id && media.url ) {
			// This is a temporary blob image
			setLogo( '' );
			setError();
			setUrl( media.url );
			return;
		}

		setLogo( media.id.toString() );
	};

	const deleteLogo = () => {
		setLogo( '' );
		setUrl( '' );
	};

	const onUploadError = ( message ) => {
		setError( message[ 2 ] ? message[ 2 ] : null );
	};

	const controls = (
		<BlockControls>
			<ToolbarGroup>
			{ url && (
				<MediaReplaceFlow
					mediaURL={ url }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept={ ACCEPT_MEDIA_STRING }
					onSelect={ onSelectLogo }
					onError={ onUploadError }
				/>
			) }
			{ !! url && (
				<ToolbarButton
					icon="trash"
					onClick={ () => deleteLogo() }
					label={ __( 'Delete Site Logo' ) }
				/>
			) }
			</ToolbarGroup>
		</BlockControls>
	);

	const label = __( 'Site Logo' );
	let logoImage;
	if ( url === null ) {
		logoImage = <Spinner />;
	}

	if ( !! url ) {
		logoImage = (
			<SiteLogo
				alt={ alt }
				attributes={ attributes }
				className={ className }
				containerRef={ ref }
				isSelected={ isSelected }
				setAttributes={ setAttributes }
				url={ url }
			/>
		);
	}

	const mediaPlaceholder = (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			labels={ {
				title: label,
				instructions: __(
					'Upload an image, or pick one from your media library, to be your site logo'
				),
			} }
			onSelect={ onSelectLogo }
			accept={ ACCEPT_MEDIA_STRING }
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			mediaPreview={ logoImage }
			notices={
				error && (
					<Notice status="error" isDismissible={ false }>
						{ error }
					</Notice>
				)
			}
			onError={ onUploadError }
		/>
	);

	const classes = classnames( className, {
		'is-resized': !! width,
		'is-focused': isSelected,
	} );

	const key = !! url;

	return (
		<Block.div ref={ ref } className={ classes } key={ key }>
			{ controls }
			{ url && logoImage }
			{ ! url && mediaPlaceholder }
		</Block.div>
	);
}
