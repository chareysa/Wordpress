/**
 * External dependencies
 */
import type { ComponentMeta } from '@storybook/react';

/**
 * Internal dependencies
 */
import { Navigation } from '..';
import { NavigationBackButton } from '../back-button';
import { NavigationGroup } from '../group';
import { NavigationItem } from '../item';
import { NavigationMenu } from '../menu';
import { DefaultStory } from './utils/default';
import { GroupStory } from './utils/group';
import { ControlledStateStory } from './utils/controlled-state';
import { SearchStory } from './utils/search';
import { MoreExamplesStory } from './utils/more-examples';
import { HideIfEmptyStory } from './utils/hide-if-empty';
import './style.css';

const meta: ComponentMeta< typeof Navigation > = {
	title: 'Components (Experimental)/Navigation',
	component: Navigation,
	subcomponents: {
		// @ts-expect-error - See https://github.com/storybookjs/storybook/issues/23170
		NavigationBackButton,
		// @ts-expect-error - See https://github.com/storybookjs/storybook/issues/23170
		NavigationGroup,
		// @ts-expect-error - See https://github.com/storybookjs/storybook/issues/23170
		NavigationItem,
		// @ts-expect-error - See https://github.com/storybookjs/storybook/issues/23170
		NavigationMenu,
	},
	argTypes: {
		activeItem: { control: { type: null } },
		activeMenu: { control: { type: null } },
		children: { control: { type: null } },
		onActivateMenu: { control: { type: null } },
	},
	parameters: {
		actions: { argTypesRegex: '^on.*' },
		controls: {
			expanded: true,
		},
		docs: { canvas: { sourceState: 'shown' } },
	},
};

export default meta;

export const _default = DefaultStory.bind( {} );
export const ControlledState = ControlledStateStory.bind( {} );
export const Groups = GroupStory.bind( {} );
export const Search = SearchStory.bind( {} );
export const MoreExamples = MoreExamplesStory.bind( {} );
export const HideIfEmpty = HideIfEmptyStory.bind( {} );
