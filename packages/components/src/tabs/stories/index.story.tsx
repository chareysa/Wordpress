/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { wordpress, more, link } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Tabs from '..';
import Popover from '../../popover';
import { Slot, Fill, Provider as SlotFillProvider } from '../../slot-fill';
import DropdownMenu from '../../dropdown-menu';
import Button from '../../button';

const meta: Meta< typeof Tabs > = {
	title: 'Components/Tabs',
	component: Tabs,
	parameters: {
		actions: { argTypesRegex: '^on.*' },
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};
export default meta;

const Template: StoryFn< typeof Tabs > = ( props ) => {
	return (
		// Ignore reason: `children` and `tabs` props are mutually exclusive.
		// When we ambiguously pass `props` here in Storybook, TS doesn't know
		// what to expect, so it errors.
		// @ts-expect-error
		<Tabs { ...props }>
			<Tabs.TabList>
				<Tabs.Tab id={ 'tab1' } title={ 'Tab 1' }>
					Tab 1
				</Tabs.Tab>
				<Tabs.Tab id={ 'tab2' } title={ 'Tab 2' }>
					Tab 2
				</Tabs.Tab>
				<Tabs.Tab id={ 'tab3' } title={ 'Tab 3' }>
					Tab 3
				</Tabs.Tab>
			</Tabs.TabList>
			<Tabs.TabPanel id={ 'tab1' }>
				<p>Selected tab: Tab 1</p>
			</Tabs.TabPanel>
			<Tabs.TabPanel id={ 'tab2' }>
				<p>Selected tab: Tab 2</p>
			</Tabs.TabPanel>
			<Tabs.TabPanel id={ 'tab3' }>
				<p>Selected tab: Tab 3</p>
			</Tabs.TabPanel>
		</Tabs>
	);
};

export const Default = Template.bind( {} );

const DisabledTabTemplate: StoryFn< typeof Tabs > = ( props ) => {
	return (
		// Ignore reason: `children` and `tabs` props are mutually exclusive.
		// When we ambiguously pass `props` here in Storybook, TS doesn't know
		// what to expect, so it errors.
		// @ts-expect-error
		<Tabs { ...props }>
			<Tabs.TabList>
				<Tabs.Tab id={ 'tab1' } title={ 'Tab 1' } disabled={ true }>
					Tab 1
				</Tabs.Tab>
				<Tabs.Tab id={ 'tab2' } title={ 'Tab 2' }>
					Tab 2
				</Tabs.Tab>
				<Tabs.Tab id={ 'tab3' } title={ 'Tab 3' }>
					Tab 3
				</Tabs.Tab>
			</Tabs.TabList>
			<Tabs.TabPanel id={ 'tab1' }>
				<p>Selected tab: Tab 1</p>
			</Tabs.TabPanel>
			<Tabs.TabPanel id={ 'tab2' }>
				<p>Selected tab: Tab 2</p>
			</Tabs.TabPanel>
			<Tabs.TabPanel id={ 'tab3' }>
				<p>Selected tab: Tab 3</p>
			</Tabs.TabPanel>
		</Tabs>
	);
};
export const DisabledTab = DisabledTabTemplate.bind( {} );

const WithTabIconsAndTooltipsTemplate: StoryFn< typeof Tabs > = ( props ) => {
	return (
		// SlotFill is used here to ensure the icon's tooltips are not
		// rendered inline, as that would cause them to inherit the tab's opacity.
		<SlotFillProvider>
			{ /* Ignore reason: `children` and `tabs` props are mutually 
			exclusive. When we ambiguously pass `props` here in Storybook, TS
			doesn't know what to expect, so it errors.
			@ts-expect-error */ }
			<Tabs { ...props }>
				<Tabs.TabList>
					<Tabs.Tab
						id={ 'tab1' }
						title={ 'Tab 1' }
						icon={ wordpress }
					/>
					<Tabs.Tab id={ 'tab2' } title={ 'Tab 2' } icon={ link } />
					<Tabs.Tab id={ 'tab3' } title={ 'Tab 3' } icon={ more } />
				</Tabs.TabList>
				<Tabs.TabPanel id={ 'tab1' }>
					<p>Selected tab: Tab 1</p>
				</Tabs.TabPanel>
				<Tabs.TabPanel id={ 'tab2' }>
					<p>Selected tab: Tab 2</p>
				</Tabs.TabPanel>
				<Tabs.TabPanel id={ 'tab3' }>
					<p>Selected tab: Tab 3</p>
				</Tabs.TabPanel>
			</Tabs>
			{ /* @ts-expect-error The 'Slot' component hasn't been typed yet. */ }
			<Popover.Slot />
		</SlotFillProvider>
	);
};
export const WithTabIconsAndTooltips = WithTabIconsAndTooltipsTemplate.bind(
	{}
);

export const ManualActivation = Template.bind( {} );
ManualActivation.args = {
	selectOnMove: false,
};

const UsingSlotFillTemplate: StoryFn< typeof Tabs > = ( props ) => {
	return (
		<SlotFillProvider>
			{ /* Ignore reason: `children` and `tabs` props are mutually 
			exclusive. When we ambiguously pass `props` here in Storybook, TS
			doesn't know what to expect, so it errors.
			@ts-expect-error */ }
			<Tabs { ...props }>
				<Tabs.TabList>
					<Tabs.Tab id={ 'tab1' } title={ 'Tab 1' }>
						Tab 1
					</Tabs.Tab>
					<Tabs.Tab id={ 'tab2' } title={ 'Tab 2' }>
						Tab 2
					</Tabs.Tab>
					<Tabs.Tab id={ 'tab3' } title={ 'Tab 3' }>
						Tab 3
					</Tabs.Tab>
				</Tabs.TabList>
				<Fill name="tabs-are-fun">
					<Tabs.TabPanel id={ 'tab1' }>
						<p>Selected tab: Tab 1</p>
					</Tabs.TabPanel>
					<Tabs.TabPanel id={ 'tab2' }>
						<p>Selected tab: Tab 2</p>
					</Tabs.TabPanel>
					<Tabs.TabPanel id={ 'tab3' }>
						<p>Selected tab: Tab 3</p>
					</Tabs.TabPanel>
				</Fill>
			</Tabs>
			<div
				style={ {
					border: '2px solid #999',
					width: '300px',
					margin: '20px auto',
				} }
			>
				<p>other stuff</p>
				<p>other stuff</p>
				<p>this is fun!</p>
				<p>other stuff</p>
				<Slot
					// ignore reason: slot-fill is not typed yet
					//@ts-expect-error
					bubblesVirtually
					as="div"
					name="tabs-are-fun"
				/>
			</div>
		</SlotFillProvider>
	);
};
export const UsingSlotFill = UsingSlotFillTemplate.bind( {} );
UsingSlotFill.storyName = 'Using SlotFill';

const CloseButtonTemplate: StoryFn< typeof Tabs > = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( true );

	return (
		<>
			{ isOpen ? (
				<div
					style={ {
						width: '400px',
						height: '100vh',
						borderRight: '1px solid #333',
					} }
				>
					{ /* Ignore reason: `children` and `tabs` props are mutually
		exclusive. When we ambiguously pass `props` here in Storybook, TS
		doesn't know what to expect, so it errors.
		@ts-expect-error */ }
					<Tabs { ...props }>
						<div
							style={ {
								display: 'flex',
								borderBottom: '1px solid #333',
							} }
						>
							<Tabs.TabList>
								<Tabs.Tab id={ 'tab1' } title={ 'Tab 1' }>
									Tab 1
								</Tabs.Tab>
								<Tabs.Tab id={ 'tab2' } title={ 'Tab 2' }>
									Tab 2
								</Tabs.Tab>
								<Tabs.Tab id={ 'tab3' } title={ 'Tab 3' }>
									Tab 3
								</Tabs.Tab>
							</Tabs.TabList>
							<Button
								variant={ 'tertiary' }
								style={ {
									marginLeft: 'auto',
									alignSelf: 'center',
								} }
								onClick={ () => setIsOpen( false ) }
							>
								Close Tabs
							</Button>
						</div>
						<Tabs.TabPanel id={ 'tab1' }>
							<p>Selected tab: Tab 1</p>
						</Tabs.TabPanel>
						<Tabs.TabPanel id={ 'tab2' }>
							<p>Selected tab: Tab 2</p>
						</Tabs.TabPanel>
						<Tabs.TabPanel id={ 'tab3' }>
							<p>Selected tab: Tab 3</p>
						</Tabs.TabPanel>
					</Tabs>
				</div>
			) : (
				<Button
					variant={ 'tertiary' }
					onClick={ () => setIsOpen( true ) }
				>
					Open Tabs
				</Button>
			) }
		</>
	);
};
export const InsertCustomElements = CloseButtonTemplate.bind( {} );

const MonolithicTemplate: StoryFn< typeof Tabs > = ( props ) => {
	return <Tabs { ...props } />;
};

export const Monolithic = MonolithicTemplate.bind( {} );
Monolithic.args = {
	tabs: [
		{
			id: 'tab1',
			title: 'Tab 1',
			content: <p>Selected tab: Tab 1</p>,
		},
		{
			id: 'tab2',
			title: 'Tab 2',
			content: <p>Selected tab: Tab 2</p>,
		},
		{
			id: 'tab3',
			title: 'Tab 3',
			content: <p>Selected tab: Tab 3</p>,
			tab: { disabled: true },
		},
		{
			id: 'tab4',
			title: 'Tab 4',
			content: <p>Selected tab: Tab 4</p>,
			tab: { icon: wordpress },
		},
	],
};
