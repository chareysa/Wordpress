/**
 * WordPress dependencies
 */

import { BlockContextualToolbar } from '@wordpress/block-editor';
import { PostSavedState, PostPreviewButton } from '@wordpress/editor';
import { useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PinnedItems } from '@wordpress/interface';
import { useViewportMatch } from '@wordpress/compose';
import { __unstableMotion as motion, Popover } from '@wordpress/components';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import FullscreenModeClose from './fullscreen-mode-close';
import HeaderToolbar from './header-toolbar';
import MoreMenu from './more-menu';
import PostPublishButtonOrToggle from './post-publish-button-or-toggle';
import { default as DevicePreview } from '../device-preview';
import ViewLink from '../view-link';
import MainDashboardButton from './main-dashboard-button';
import { store as editPostStore } from '../../store';
import DocumentActions from './document-actions';

const slideY = {
	hidden: { y: '-50px' },
	distractionFreeInactive: { y: 0 },
	hover: { y: 0, transition: { type: 'tween', delay: 0.2 } },
};

const slideX = {
	hidden: { x: '-100%' },
	distractionFreeInactive: { x: 0 },
	hover: { x: 0, transition: { type: 'tween', delay: 0.2 } },
};

function Header( {
	setEntitiesSavedStatesCallback,
	setListViewToggleElement,
} ) {
	const isLargeViewport = useViewportMatch( 'large' );
	const blockToolbarRef = useRef();
	const {
		hasActiveMetaboxes,
		hasFixedToolbar,
		isPublishSidebarOpened,
		showIconLabels,
	} = useSelect( ( select ) => {
		const { get: getPreference } = select( preferencesStore );

		return {
			hasActiveMetaboxes: select( editPostStore ).hasMetaBoxes(),
			isPublishSidebarOpened:
				select( editPostStore ).isPublishSidebarOpened(),
			hasFixedToolbar: getPreference( 'core/edit-post', 'fixedToolbar' ),
			showIconLabels:
				select( editPostStore ).isFeatureActive( 'showIconLabels' ),
		};
	}, [] );

	return (
		<div className="edit-post-header">
			<MainDashboardButton.Slot>
				<motion.div
					variants={ slideX }
					transition={ { type: 'tween', delay: 0.8 } }
				>
					<FullscreenModeClose showTooltip />
				</motion.div>
			</MainDashboardButton.Slot>
			<motion.div
				variants={ slideY }
				transition={ { type: 'tween', delay: 0.8 } }
				className="edit-post-header__toolbar"
			>
				<HeaderToolbar
					hasFixedToolbar={ hasFixedToolbar }
					setListViewToggleElement={ setListViewToggleElement }
				/>
				{ hasFixedToolbar && isLargeViewport && (
					<>
						<div className="selected-block-tools-wrapper">
							<BlockContextualToolbar isFixed />
						</div>
						<Popover.Slot
							ref={ blockToolbarRef }
							name="block-toolbar"
						/>
					</>
				) }
				<div className="edit-post-header__center">
					<DocumentActions />
				</div>
			</motion.div>
			<motion.div
				variants={ slideY }
				transition={ { type: 'tween', delay: 0.8 } }
				className="edit-post-header__settings"
			>
				{ ! isPublishSidebarOpened && (
					// This button isn't completely hidden by the publish sidebar.
					// We can't hide the whole toolbar when the publish sidebar is open because
					// we want to prevent mounting/unmounting the PostPublishButtonOrToggle DOM node.
					// We track that DOM node to return focus to the PostPublishButtonOrToggle
					// when the publish sidebar has been closed.
					<PostSavedState
						forceIsDirty={ hasActiveMetaboxes }
						showIconLabels={ showIconLabels }
					/>
				) }
				<DevicePreview />
				<PostPreviewButton forceIsAutosaveable={ hasActiveMetaboxes } />
				<ViewLink />
				<PostPublishButtonOrToggle
					forceIsDirty={ hasActiveMetaboxes }
					setEntitiesSavedStatesCallback={
						setEntitiesSavedStatesCallback
					}
				/>
				{ ( isLargeViewport || ! showIconLabels ) && (
					<>
						<PinnedItems.Slot scope="core/edit-post" />
						<MoreMenu showIconLabels={ showIconLabels } />
					</>
				) }
				{ showIconLabels && ! isLargeViewport && (
					<MoreMenu showIconLabels={ showIconLabels } />
				) }
			</motion.div>
		</div>
	);
}

export default Header;
