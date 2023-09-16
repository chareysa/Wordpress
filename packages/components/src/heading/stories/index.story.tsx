/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * Internal dependencies
 */
import { Heading } from '..';

const meta: Meta< typeof Heading > = {
	component: Heading,
	title: 'Components (Experimental)/Heading',
	argTypes: {
		adjustLineHeightForInnerControls: { control: { type: 'text' } },
		as: { control: { type: 'text' } },
		color: { control: { type: 'color' } },
		display: { control: { type: 'text' } },
		letterSpacing: { control: { type: 'text' } },
		lineHeight: { control: { type: 'text' } },
		optimizeReadabilityFor: { control: { type: 'color' } },
		variant: {
			control: { type: 'radio' },
			options: [ 'undefined', 'muted' ],
			mapping: { undefined, muted: 'muted' },
		},
		weight: { control: { type: 'text' } },
	},
	parameters: {
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};
export default meta;

export const Default: StoryFn< typeof Heading > = ( props ) => (
	<Heading { ...props } />
);
Default.args = {
	children: 'Heading',
};
