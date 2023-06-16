/**
 * WordPress dependencies
 */
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';
import {
	__experimentalUseNavigator as useNavigator,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { SidebarNavigationScreenWrapper } from '../sidebar-navigation-screen-navigation-menus';
import ScreenNavigationMoreMenu from './more-menu';
import SingleNavigationMenu from './single-navigation-menu';
import {
	useDeleteNavigationMenu,
	useDuplicateNavigationMenu,
	useSaveNavigationMenu,
} from './use-navigation-menu-handlers';

export const postType = `wp_navigation`;

export default function SidebarNavigationScreenNavigationMenu() {
	const {
		params: { postId },
	} = useNavigator();

	const { record: navigationMenu, isResolving } = useEntityRecord(
		'postType',
		postType,
		postId
	);

	const { isSaving, isDeleting } = useSelect(
		( select ) => {
			const {
				isSavingEntityRecord,
				isDeletingEntityRecord,
				getEditedEntityRecord: getEditedEntityRecordSelector,
			} = select( coreStore );

			return {
				isSaving: isSavingEntityRecord( 'postType', postType, postId ),
				isDeleting: isDeletingEntityRecord(
					'postType',
					postType,
					postId
				),
				getEditedEntityRecord: getEditedEntityRecordSelector,
			};
		},
		[ postId ]
	);

	const isLoading = isResolving || isSaving || isDeleting;

	const menuTitle = navigationMenu?.title?.rendered || navigationMenu?.slug;

	const handleSave = useSaveNavigationMenu( navigationMenu );

	const handleDelete = useDeleteNavigationMenu( navigationMenu );

	const handleDuplicate = useDuplicateNavigationMenu( navigationMenu );

	if ( isLoading ) {
		return (
			<SidebarNavigationScreenWrapper
				description={ __(
					'Navigation menus are a curated collection of blocks that allow visitors to get around your site.'
				) }
			>
				<Spinner className="edit-site-sidebar-navigation-screen-navigation-menus__loading" />
			</SidebarNavigationScreenWrapper>
		);
	}

	if ( ! isLoading && ! navigationMenu ) {
		return (
			<SidebarNavigationScreenWrapper
				description={ __( 'Navigation Menu missing.' ) }
			/>
		);
	}

	if ( ! navigationMenu?.content?.raw ) {
		return (
			<SidebarNavigationScreenWrapper
				actions={
					<ScreenNavigationMoreMenu
						menuTitle={ decodeEntities( menuTitle ) }
						onDelete={ handleDelete }
						onSave={ handleSave }
						onDuplicate={ handleDuplicate }
					/>
				}
				title={ decodeEntities( menuTitle ) }
				description={ __( 'This Navigation Menu is empty.' ) }
			/>
		);
	}

	return (
		<SingleNavigationMenu
			navigationMenu={ navigationMenu }
			handleSave={ handleSave }
			handleDelete={ handleDelete }
			handleDuplicate={ handleDuplicate }
		/>
	);
}
