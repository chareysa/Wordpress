/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	getColorClassName,
	__experimentalGetGradientClass,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
	backgroundImageStyles,
	dimRatioToClass,
	isContentPositionCenter,
	getPositionClassName,
} from './shared';

export default function save( { attributes } ) {
	const {
		backgroundType,
		gradient,
		contentPosition,
		customGradient,
		customOverlayColor,
		dimRatio,
		focalPoint,
		hasParallax,
		overlayColor,
		url,
		id,
		minHeight: minHeightProp,
		minHeightUnit,
	} = attributes;
	const overlayColorClass = getColorClassName(
		'background-color',
		overlayColor
	);
	const gradientClass = __experimentalGetGradientClass( gradient );
	const minHeight = minHeightUnit
		? `${ minHeightProp }${ minHeightUnit }`
		: minHeightProp;

	const isImageBackground = IMAGE_BACKGROUND_TYPE === backgroundType;
	const isVideoBackground = VIDEO_BACKGROUND_TYPE === backgroundType;

	const style = {
		...( isImageBackground && hasParallax
			? backgroundImageStyles( url )
			: {} ),
		backgroundColor: ! overlayColorClass ? customOverlayColor : undefined,
		background: customGradient && ! url ? customGradient : undefined,
		minHeight: minHeight || undefined,
	};

	const mediaStyle = {
		objectPosition:
			// prettier-ignore
			focalPoint && ! hasParallax
				? `${ Math.round( focalPoint.x * 100 ) }% ${ Math.round( focalPoint.y * 100) }%`
				: undefined,
	};

	const classes = classnames(
		dimRatioToClass( dimRatio ),
		overlayColorClass,
		{
			'has-background-dim': dimRatio !== 0,
			'has-parallax': hasParallax,
			'has-background-gradient': gradient || customGradient,
			[ gradientClass ]: ! url && gradientClass,
			'has-custom-content-position': ! isContentPositionCenter(
				contentPosition
			),
		},
		getPositionClassName( contentPosition )
	);

	return (
		<div className={ classes } style={ style }>
			{ url && ( gradient || customGradient ) && dimRatio !== 0 && (
				<span
					aria-hidden="true"
					className={ classnames(
						'wp-block-cover__gradient-background',
						gradientClass
					) }
					style={
						customGradient
							? { background: customGradient }
							: undefined
					}
				/>
			) }
			{ isImageBackground && url && ! hasParallax && (
				<img
					className={ classnames(
						'wp-block-cover__image-background',
						id ? `wp-image-${ id }` : null
					) }
					alt=""
					src={ url }
					style={ mediaStyle }
				/>
			) }
			{ isVideoBackground && url && (
				<video
					className="wp-block-cover__video-background"
					autoPlay
					muted
					loop
					playsInline
					src={ url }
					style={ mediaStyle }
				/>
			) }
			<div className="wp-block-cover__inner-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
