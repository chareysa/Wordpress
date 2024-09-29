/**
 * External dependencies
 */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

/**
 * Internal dependencies
 */
import { CONFIG, COLORS } from '../../utils';
import type { ToggleGroupControlProps } from '../types';

export const toggleGroupControl = ( {
	isBlock,
	isDeselectable,
	size,
}: Pick< ToggleGroupControlProps, 'isBlock' | 'isDeselectable' > & {
	size: NonNullable< ToggleGroupControlProps[ 'size' ] >;
} ) => css`
	background: ${ COLORS.ui.background };
	border: 1px solid transparent;
	border-radius: ${ CONFIG.radiusSmall };
	display: inline-flex;
	min-width: 0;
	position: relative;

	${ toggleGroupControlSize( size ) }
	${ ! isDeselectable && enclosingBorders( isBlock ) }

	@media not ( prefers-reduced-motion ) {
		&.is-animation-enabled::before {
			transition-property: transform;
			transition-duration: 0.2s;
			transition-timing-function: ease-out;
		}
	}

	&::before {
		content: '';
		position: absolute;
		pointer-events: none;
		background: ${ COLORS.gray[ 900 ] };

		// Windows High Contrast mode will show this outline, but not the box-shadow.
		outline: 2px solid transparent;
		outline-offset: -3px;

		/* Using a large value to avoid antialiasing rounding issues
			when scaling in the transform, see: https://stackoverflow.com/a/52159123 */
		--antialiasing-factor: 100;
		border-radius: calc(
				${ CONFIG.radiusXSmall } /
					( var( --indicator-width ) / var( --antialiasing-factor ) )
			) / ${ CONFIG.radiusXSmall };
		left: -1px; // Correcting for border.
		width: calc( var( --antialiasing-factor ) * 1px );
		height: calc( var( --indicator-height ) * 1px );
		transform-origin: left top;
		transform: translateX( calc( var( --indicator-left ) * 1px ) )
			scaleX(
				calc( var( --indicator-width ) / var( --antialiasing-factor ) )
			);
	}
`;

const enclosingBorders = ( isBlock: ToggleGroupControlProps[ 'isBlock' ] ) => {
	const enclosingBorder = css`
		border-color: ${ COLORS.ui.border };
	`;

	return css`
		${ isBlock && enclosingBorder }

		&:hover {
			border-color: ${ COLORS.ui.borderHover };
		}

		&:focus-within {
			border-color: ${ COLORS.ui.borderFocus };
			box-shadow: ${ CONFIG.controlBoxShadowFocus };
			z-index: 1;
			// Windows High Contrast mode will show this outline, but not the box-shadow.
			outline: 2px solid transparent;
			outline-offset: -2px;
		}
	`;
};

export const toggleGroupControlSize = (
	size: NonNullable< ToggleGroupControlProps[ 'size' ] >
) => {
	const styles = {
		default: css`
			min-height: 36px;
			padding: 2px;
		`,
		'__unstable-large': css`
			min-height: 40px;
			padding: 3px;
		`,
	};

	return styles[ size ];
};

export const block = css`
	display: flex;
	width: 100%;
`;

export const VisualLabelWrapper = styled.div`
	// Makes the inline label be the correct height, equivalent to setting line-height: 0
	display: flex;
`;
