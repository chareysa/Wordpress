/**
 * External dependencies
 */
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import {
	StyledField as BaseControlField,
	Wrapper as BaseControlWrapper,
} from '../base-control/styles/base-control-styles';
import { COLORS, CONFIG } from '../utils';
import { space } from '../ui/utils/space';

const toolsPanelGrid = {
	container: css`
		column-gap: ${ space( 4 ) };
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: ${ space( 6 ) };
	`,
	item: {
		halfWidth: css`
			grid-column: span 1;
		`,
		fullWidth: css`
			grid-column: span 2;
		`,
	},
};

export const ToolsPanel = css`
	${ toolsPanelGrid.container };

	border-top: ${ CONFIG.borderWidth } solid ${ COLORS.gray[ 200 ] };
	margin-top: -1px;
	padding: ${ space( 4 ) };
`;

/**
 * Items injected into a ToolsPanel via a virtual bubbling slot will require
 * an inner dom element to be injected. The following rule allows for the
 * CSS grid display to be re-established.
 */
export const ToolsPanelWithInnerWrapper = css`
	> div {
		${ toolsPanelGrid.container }
		${ toolsPanelGrid.item.fullWidth }
	}
`;

export const ToolsPanelHiddenInnerWrapper = css`
	> div {
		display: none;
	}
`;

export const ToolsPanelHeader = css`
	align-items: center;
	display: flex;
	font-size: inherit;
	font-weight: 500;
	${ toolsPanelGrid.item.fullWidth }
	justify-content: space-between;
	line-height: normal;

	/* Required to meet specificity requirements to ensure zero margin */
	&& {
		margin: 0;
	}

	/* Tweak dropdown menu and toggle button for better alignment */
	> div {
		margin-top: ${ space( -1 ) };
		margin-bottom: ${ space( -1 ) };
		height: ${ space( 6 ) };

		/* first-child used to overcome specificity of menu toggle styles */
		> button:first-of-type {
			padding: 0;
			height: ${ space( 6 ) };
			min-width: ${ space( 6 ) };
			width: ${ space( 6 ) };
		}
	}
`;

export const ToolsPanelItem = css`
	${ toolsPanelGrid.item.fullWidth }

	&.single-column {
		${ toolsPanelGrid.item.halfWidth }
	}

	/* Clear spacing in and around controls added as panel items. */
	/* Remove when they can be addressed via context system. */
	& > div,
	& > fieldset {
		padding-bottom: 0;
		margin-bottom: 0;
		max-width: 100%;
	}

	/* Remove BaseControl components margins and leave spacing to grid layout */
	&& ${ BaseControlWrapper } {
		margin-bottom: 0;

		${ BaseControlField } {
			margin-bottom: 0;
		}
	}
`;

export const ToolsPanelItemPlaceholder = css`
	display: none;
`;

export const DropdownMenu = css`
	min-width: 200px;
`;
