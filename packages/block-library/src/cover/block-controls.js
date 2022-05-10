/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { ToolbarButton } from '@wordpress/components';

import {
	BlockControls,
	MediaReplaceFlow,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
	__experimentalBlockFullHeightAligmentControl as FullHeightAlignmentControl,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { postFeaturedImage } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ALLOWED_MEDIA_TYPES, IMAGE_BACKGROUND_TYPE } from './shared';

export function CoverBlockControlsPrimary( {
	setAttributes,
	contentPosition,
	hasInnerBlocks,
	minHeightUnit,
	minHeight,
} ) {
	const [ prevMinHeightValue, setPrevMinHeightValue ] = useState( minHeight );
	const [ prevMinHeightUnit, setPrevMinHeightUnit ] = useState(
		minHeightUnit
	);
	const isMinFullHeight = minHeightUnit === 'vh' && minHeight === 100;
	const toggleMinFullHeight = () => {
		if ( isMinFullHeight ) {
			// If there aren't previous values, take the default ones.
			if ( prevMinHeightUnit === 'vh' && prevMinHeightValue === 100 ) {
				return setAttributes( {
					minHeight: undefined,
					minHeightUnit: undefined,
				} );
			}

			// Set the previous values of height.
			return setAttributes( {
				minHeight: prevMinHeightValue,
				minHeightUnit: prevMinHeightUnit,
			} );
		}

		setPrevMinHeightValue( minHeight );
		setPrevMinHeightUnit( minHeightUnit );

		// Set full height.
		return setAttributes( {
			minHeight: 100,
			minHeightUnit: 'vh',
		} );
	};

	return (
		<>
			<BlockAlignmentMatrixControl
				label={ __( 'Change content position' ) }
				value={ contentPosition }
				onChange={ ( nextPosition ) =>
					setAttributes( {
						contentPosition: nextPosition,
					} )
				}
				isDisabled={ ! hasInnerBlocks }
			/>
			<FullHeightAlignmentControl
				isActive={ isMinFullHeight }
				onToggle={ toggleMinFullHeight }
				isDisabled={ ! hasInnerBlocks }
			/>
		</>
	);
}

export function CoverBlockControlsOther( {
	setAttributes,
	useFeaturedImage,
	dimRatio,
	id,
	url,
	onSelectMedia,
} ) {
	const toggleUseFeaturedImage = () => {
		setAttributes( {
			id: undefined,
			url: undefined,
			useFeaturedImage: ! useFeaturedImage,
			dimRatio: dimRatio === 100 ? 50 : dimRatio,
			backgroundType: useFeaturedImage
				? IMAGE_BACKGROUND_TYPE
				: undefined,
		} );
	};
	return (
		<>
			<ToolbarButton
				icon={ postFeaturedImage }
				label={ __( 'Use featured image' ) }
				isPressed={ useFeaturedImage }
				onClick={ toggleUseFeaturedImage }
			/>
			{ ! useFeaturedImage && (
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ url }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept="image/*,video/*"
					onSelect={ onSelectMedia }
					name={ ! url ? __( 'Add Media' ) : __( 'Replace' ) }
				/>
			) }
		</>
	);
}
export default function CoverBlockControls( {
	attributes,
	setAttributes,
	onSelectMedia,
	currentSettings,
} ) {
	const {
		contentPosition,
		id,
		useFeaturedImage,
		dimRatio,
		minHeight,
		minHeightUnit,
	} = attributes;
	const { hasInnerBlocks, url } = currentSettings;

	return (
		<>
			<BlockControls group="block">
				<CoverBlockControlsPrimary
					setAttributes={ setAttributes }
					contentPosition={ contentPosition }
					hasInnerBlocks={ hasInnerBlocks }
					minHeightUnit={ minHeightUnit }
					minHeight={ minHeight }
				/>
			</BlockControls>
			<BlockControls group="other">
				<CoverBlockControlsOther
					setAttributes={ setAttributes }
					useFeaturedImage={ useFeaturedImage }
					dimRatio={ dimRatio }
					id={ id }
					url={ url }
					onSelectMedia={ onSelectMedia }
				/>
			</BlockControls>
		</>
	);
}
