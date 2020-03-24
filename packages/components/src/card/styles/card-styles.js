/**
 * External dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress dependencies
 */
import { HorizontalRule } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import { color } from '../../utils/colors';

export const styleProps = {
	borderColor: color( 'lightGray.500' ),
	borderRadius: '3px',
	backgroundShady: color( 'lightGray.200' ),
};

const { borderColor, borderRadius, backgroundShady } = styleProps;

export const CardUI = styled.div`
	background: ${color( 'white' )};
	box-sizing: border-box;
	border-radius: ${borderRadius};
	border: 1px solid ${borderColor};

	${handleBorderless};

	&.is-elevated {
		box-shadow: 0px 1px 3px 0px rgba( 0, 0, 0, 0.2 ),
			0px 1px 1px 0px rgba( 0, 0, 0, 0.14 ),
			0px 2px 1px -1px rgba( 0, 0, 0, 0.12 );
	}
`;

export const HeaderUI = styled.div`
	border-bottom: 1px solid ${borderColor};
	border-top-left-radius: ${borderRadius};
	border-top-right-radius: ${borderRadius};
	box-sizing: border-box;

	&:last-child {
		border-bottom: none;
	}

	${headerFooterPaddings};
	${handleBorderless};
	${handleShady};
`;

export const MediaUI = styled.div`
	box-sizing: border-box;
	overflow: hidden;

	& > img,
	& > iframe {
		display: block;
		height: auto;
		max-width: 100%;
		width: 100%;
	}

	&:first-of-type {
		border-top-left-radius: ${borderRadius};
		border-top-right-radius: ${borderRadius};
	}

	&:last-of-type {
		border-bottom-left-radius: ${borderRadius};
		border-bottom-right-radius: ${borderRadius};
	}
`;

export const BodyUI = styled.div`
	box-sizing: border-box;

	${bodyPadding};
	${handleShady};
`;

export const FooterUI = styled.div`
	border-top: 1px solid ${borderColor};
	border-bottom-left-radius: ${borderRadius};
	border-bottom-right-radius: ${borderRadius};
	box-sizing: border-box;

	&:first-of-type {
		border-top: none;
	}

	${headerFooterPaddings};
	${handleBorderless};
	${handleShady};
`;

export const DividerUI = styled( HorizontalRule )`
	all: unset;
	border-top: 1px solid ${borderColor};
	box-sizing: border-box;
	display: block;
	height: 0;
	width: 100%;
`;

export function bodyPadding() {
	return `
		&.is-padding {
			&-large {
				padding: 24px 32px;
			}
			&-medium {
				padding: 16px 24px;
			}
			&-small {
				padding: 16px;
			}
			&-extraSmall {
				padding: 8px;
			}
		}
	`;
}

export function headerFooterPaddings() {
	return `
		&.is-padding {
			&-large {
				padding: 24px 32px;
			}
			&-medium {
				padding: 16px 24px;
			}
			&-small {
				padding: 16px;
			}
			&-extraSmall {
				padding: 8px;
			}
		}
	`;
}

export function handleBorderless() {
	return `
		&.is-borderless {
			border: none;
		}
	`;
}

export function handleShady() {
	return `
		&.is-shady {
			background: ${ backgroundShady };
		}
	`;
}
