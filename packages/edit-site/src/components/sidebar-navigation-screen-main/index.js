/**
 * WordPress dependencies
 */
import { __experimentalItemGroup as ItemGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { layout, symbol, navigation, styles, page } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import SidebarNavigationItem from '../sidebar-navigation-item';
import { SidebarNavigationItemGlobalStyles } from '../sidebar-navigation-screen-global-styles';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';
import {
	NAVIGATION_POST_TYPE,
	TEMPLATE_POST_TYPE,
	PATTERN_TYPES,
} from '../../utils/constants';

export function MainSidebarNavigationContent( { activeItem } ) {
	return (
		<ItemGroup>
			<SidebarNavigationItem
				uid="navigation-navigation-item"
				params={ { postType: NAVIGATION_POST_TYPE } }
				withChevron
				icon={ navigation }
				aria-current={ activeItem === 'navigation-navigation-item' }
			>
				{ __( 'Navigation' ) }
			</SidebarNavigationItem>
			<SidebarNavigationItemGlobalStyles
				uid="styles-navigation-item"
				className="is-selected"
				withChevron
				icon={ styles }
				aria-current={ activeItem === 'styles-navigation-item' }
			>
				{ __( 'Styles' ) }
			</SidebarNavigationItemGlobalStyles>
			<SidebarNavigationItem
				uid="page-navigation-item"
				params={ { postType: 'page' } }
				withChevron
				icon={ page }
				aria-current={ activeItem === 'page-navigation-item' }
			>
				{ __( 'Pages' ) }
			</SidebarNavigationItem>
			<SidebarNavigationItem
				uid="template-navigation-item"
				params={ { postType: TEMPLATE_POST_TYPE } }
				withChevron
				icon={ layout }
				aria-current={ activeItem === 'template-navigation-item' }
			>
				{ __( 'Templates' ) }
			</SidebarNavigationItem>
			<SidebarNavigationItem
				uid="patterns-navigation-item"
				params={ { postType: PATTERN_TYPES.user } }
				withChevron
				icon={ symbol }
				aria-current={ activeItem === 'patterns-navigation-item' }
			>
				{ __( 'Patterns' ) }
			</SidebarNavigationItem>
		</ItemGroup>
	);
}

export default function SidebarNavigationScreenMain() {
	const { setEditorCanvasContainerView } = unlock(
		useDispatch( editSiteStore )
	);

	// Clear the editor canvas container view when accessing the main navigation screen.
	useEffect( () => {
		setEditorCanvasContainerView( undefined );
	}, [ setEditorCanvasContainerView ] );

	return (
		<SidebarNavigationScreen
			isRoot
			title={ __( 'Design' ) }
			description={ __(
				'Customize the appearance of your website using the block editor.'
			) }
			content={ <MainSidebarNavigationContent /> }
		/>
	);
}
