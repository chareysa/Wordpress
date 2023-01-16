/**
 * WordPress dependencies
 */
import {
	alignCenter,
	alignLeft,
	alignRight,
	code,
	formatBold,
	formatItalic,
	formatStrikethrough,
	link,
	more,
	paragraph,
	arrowUp,
	arrowDown,
	arrowLeft,
	arrowRight,
	chevronDown,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarItem,
	ToolbarDropdownMenu,
} from '..';
import { SVG, Path, DropdownMenu } from '../../';

export default {
	title: 'Components/Toolbar',
	component: Toolbar,
	subcomponents: {
		ToolbarButton,
		ToolbarGroup,
		ToolbarItem,
		ToolbarDropdownMenu,
	},
	parameters: {
		controls: { expanded: true },
		docs: { source: { state: 'open' } },
	},
};

function InlineImageIcon() {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M4 18.5h16V17H4v1.5zM16 13v1.5h4V13h-4zM5.1 15h7.8c.6 0 1.1-.5 1.1-1.1V6.1c0-.6-.5-1.1-1.1-1.1H5.1C4.5 5 4 5.5 4 6.1v7.8c0 .6.5 1.1 1.1 1.1zm.4-8.5h7V10l-1-1c-.3-.3-.8-.3-1 0l-1.6 1.5-1.2-.7c-.3-.2-.6-.2-.9 0l-1.3 1V6.5zm0 6.1l1.8-1.3 1.3.8c.3.2.7.2.9-.1l1.5-1.4 1.5 1.4v1.5h-7v-.9z" />
		</SVG>
	);
}

export const Default = () => {
	return (
		// id is required for server side rendering
		// eslint-disable-next-line no-restricted-syntax
		<Toolbar label="Options" id="options-toolbar">
			<ToolbarGroup>
				<ToolbarButton icon={ paragraph } text="Paragraph" />
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarItem>
					{ ( toggleProps ) => (
						<DropdownMenu
							hasArrowIndicator
							icon={ alignLeft }
							label="Align"
							controls={ [
								{
									icon: alignLeft,
									title: 'Align left',
									isActive: true,
								},
								{
									icon: alignCenter,
									title: 'Align center',
								},
								{
									icon: alignRight,
									title: 'Align right',
								},
							] }
							toggleProps={ toggleProps }
						/>
					) }
				</ToolbarItem>
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarButton>Text</ToolbarButton>
				<ToolbarButton icon={ formatBold } label="Bold" isPressed />
				<ToolbarButton icon={ formatItalic } label="Italic" />
				<ToolbarButton icon={ link } label="Link" />
				<ToolbarGroup
					isCollapsed
					icon={ false }
					label="More rich text controls"
					controls={ [
						{ icon: code, title: 'Inline code' },
						{ icon: <InlineImageIcon />, title: 'Inline image' },
						{
							icon: formatStrikethrough,
							title: 'Strikethrough',
						},
					] }
				/>
			</ToolbarGroup>
			<ToolbarGroup
				icon={ more }
				label="Align"
				isCollapsed
				controls={ [
					{
						icon: alignLeft,
						title: 'Align left',
						isActive: true,
					},
					{ icon: alignCenter, title: 'Align center' },
					{ icon: alignRight, title: 'Align right' },
				] }
			/>
			<ToolbarDropdownMenu
				icon={ chevronDown }
				label="Select a direction"
				controls={ [
					{
						title: 'Up',
						icon: arrowUp,
					},
					{
						title: 'Right',
						icon: arrowRight,
					},
					{
						title: 'Down',
						icon: arrowDown,
					},
					{
						title: 'Left',
						icon: arrowLeft,
					},
				] }
			/>
		</Toolbar>
	);
};

export const WithoutGroup = () => {
	return (
		// id is required for server side rendering
		// eslint-disable-next-line no-restricted-syntax
		<Toolbar label="Options" id="options-toolbar-without-group">
			<ToolbarButton icon={ formatBold } label="Bold" isPressed />
			<ToolbarButton icon={ formatItalic } label="Italic" />
			<ToolbarButton icon={ link } label="Link" />
		</Toolbar>
	);
};
