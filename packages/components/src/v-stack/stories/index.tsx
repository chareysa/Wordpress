/**
 * External dependencies
 */
import type { ComponentMeta, ComponentStory } from '@storybook/react';

/**
 * Internal dependencies
 */
import { View } from '../../view';
import { VStack } from '..';

const ALIGNMENTS = {
	top: 'top',
	topLeft: 'topLeft',
	topRight: 'topRight',
	left: 'left',
	center: 'center',
	right: 'right',
	bottom: 'bottom',
	bottomLeft: 'bottomLeft',
	bottomRight: 'bottomRight',
	edge: 'edge',
	stretch: 'stretch',
};

const meta: ComponentMeta< typeof VStack > = {
	component: VStack,
	title: 'Components (Experimental)/VStack',
	argTypes: {
		alignment: {
			control: { type: 'select' },
			options: Object.keys( ALIGNMENTS ),
			mapping: ALIGNMENTS,
		},
		as: { control: { type: 'text' } },
		direction: { control: { type: 'text' } },
		justify: { control: { type: 'text' } },
		spacing: { control: { type: 'text' } },
	},
	parameters: {
		controls: { expanded: true },
		docs: { source: { state: 'open' } },
	},
};
export default meta;

const Template: ComponentStory< typeof VStack > = ( props ) => {
	return (
		<VStack
			{ ...props }
			style={ { background: '#eee', minHeight: '200px' } }
		>
			{ [ 'One', 'Two', 'Three', 'Four', 'Five' ].map( ( text ) => (
				<View key={ text } style={ { background: '#b9f9ff' } }>
					{ text }
				</View>
			) ) }
		</VStack>
	);
};

export const Default = Template.bind( {} );
