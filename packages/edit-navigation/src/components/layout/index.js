/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	__unstableUseBlockSelectionClearer as useBlockSelectionClearer,
} from '@wordpress/block-editor';
import {
	DropZoneProvider,
	Popover,
	SlotFillProvider,
	Spinner,
} from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import {
	InterfaceSkeleton,
	ComplementaryArea,
	store as interfaceStore,
} from '@wordpress/interface';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EmptyState from './empty-state';
import {
	IsMenuNameControlFocusedContext,
	MenuIdContext,
	useNavigationEditor,
	useNavigationBlockEditor,
	useMenuNotifications,
} from '../../hooks';
import ErrorBoundary from '../error-boundary';
import NavigationEditorShortcuts from './shortcuts';
import Sidebar from './sidebar';
import Header from '../header';
import Notices from '../notices';
import BlockToolbar from './block-toolbar';
import Editor from '../editor';
import InspectorAdditions from '../inspector-additions';
import { store as editNavigationStore } from '../../store';

const interfaceLabels = {
	/* translators: accessibility text for the navigation screen top bar landmark region. */
	header: __( 'Navigation top bar' ),
	/* translators: accessibility text for the navigation screen content landmark region. */
	body: __( 'Navigation menu blocks' ),
	/* translators: accessibility text for the widgets screen settings landmark region. */
	sidebar: __( 'Navigation settings' ),
};

export default function Layout( { blockEditorSettings } ) {
	const contentAreaRef = useBlockSelectionClearer();
	const isLargeViewport = useViewportMatch( 'medium' );
	const [ isMenuNameControlFocused, setIsMenuNameControlFocused ] = useState(
		false
	);
	const { saveNavigationPost } = useDispatch( editNavigationStore );
	const savePost = () => saveNavigationPost( navigationPost );

	const {
		menus,
		hasLoadedMenus,
		hasFinishedInitialLoad,
		selectedMenuId,
		navigationPost,
		selectMenu,
		deleteMenu,
		openManageLocationsModal,
		closeManageLocationsModal,
		isManageLocationsModalOpen,
	} = useNavigationEditor();

	const [ blocks, onInput, onChange ] = useNavigationBlockEditor(
		navigationPost
	);

	const { hasSidebarEnabled } = useSelect(
		( select ) => ( {
			hasSidebarEnabled: !! select(
				interfaceStore
			).getActiveComplementaryArea( 'core/edit-navigation' ),
		} ),
		[]
	);

	useMenuNotifications( selectedMenuId );

	const hasMenus = !! menus?.length;
	const isBlockEditorReady = !! ( hasMenus && navigationPost );
	const hasPermanentSidebar = isLargeViewport && hasMenus;

	return (
		<ErrorBoundary>
			<SlotFillProvider>
				<DropZoneProvider>
					<BlockEditorKeyboardShortcuts.Register />
					<NavigationEditorShortcuts.Register />
					<NavigationEditorShortcuts saveBlocks={ savePost } />
					<Notices />
					<BlockEditorProvider
						value={ blocks }
						onInput={ onInput }
						onChange={ onChange }
						settings={ {
							...blockEditorSettings,
							templateLock: 'all',
						} }
						useSubRegistry={ false }
					>
						<MenuIdContext.Provider value={ selectedMenuId }>
							<IsMenuNameControlFocusedContext.Provider
								value={ useMemo(
									() => [
										isMenuNameControlFocused,
										setIsMenuNameControlFocused,
									],
									[ isMenuNameControlFocused ]
								) }
							>
								<InterfaceSkeleton
									className={ classnames(
										'edit-navigation-layout',
										{
											'has-permanent-sidebar': hasPermanentSidebar,
										}
									) }
									labels={ interfaceLabels }
									header={
										<Header
											isPending={ ! hasLoadedMenus }
											menus={ menus }
											selectedMenuId={ selectedMenuId }
											onSelectMenu={ selectMenu }
											navigationPost={ navigationPost }
										/>
									}
									content={
										<>
											{ ! hasFinishedInitialLoad && (
												<Spinner />
											) }

											{ hasFinishedInitialLoad &&
												! hasMenus && <EmptyState /> }

											{ isBlockEditorReady && (
												<>
													<BlockToolbar
														isFixed={
															! isLargeViewport
														}
													/>
													<div
														className="edit-navigation-layout__content-area"
														ref={ contentAreaRef }
													>
														<Editor
															isPending={
																! hasLoadedMenus
															}
															blocks={ blocks }
														/>
														<InspectorAdditions
															isManageLocationsModalOpen={
																isManageLocationsModalOpen
															}
															openManageLocationsModal={
																openManageLocationsModal
															}
															closeManageLocationsModal={
																closeManageLocationsModal
															}
															onSelectMenu={
																selectMenu
															}
															menus={ menus }
															menuId={
																selectedMenuId
															}
															onDeleteMenu={
																deleteMenu
															}
														/>
													</div>
												</>
											) }
										</>
									}
									sidebar={
										( hasPermanentSidebar ||
											hasSidebarEnabled ) && (
											<ComplementaryArea.Slot scope="core/edit-navigation" />
										)
									}
								/>
								<Sidebar
									hasPermanentSidebar={ hasPermanentSidebar }
								/>
							</IsMenuNameControlFocusedContext.Provider>
						</MenuIdContext.Provider>
					</BlockEditorProvider>
					<Popover.Slot />
				</DropZoneProvider>
			</SlotFillProvider>
		</ErrorBoundary>
	);
}
