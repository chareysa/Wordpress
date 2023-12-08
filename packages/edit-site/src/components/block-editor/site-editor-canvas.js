/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { BlockTools, store as blockEditorStore } from '@wordpress/block-editor';
import { useViewportMatch, useResizeObserver } from '@wordpress/compose';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import BackButton from './back-button';
import ResizableEditor from './resizable-editor';
import EditorCanvas from './editor-canvas';
import EditorCanvasContainer from '../editor-canvas-container';
import useSiteEditorSettings from './use-site-editor-settings';
import { store as editSiteStore } from '../../store';
import {
	FOCUSABLE_ENTITIES,
	NAVIGATION_POST_TYPE,
} from '../../utils/constants';
import { unlock } from '../../lock-unlock';
import PageContentFocusNotifications from '../page-content-focus-notifications';

export default function SiteEditorCanvas() {
	const { clearSelectedBlock } = useDispatch( blockEditorStore );

	const { templateType, isFocusMode, isViewMode, isEditingTemplate } =
		useSelect( ( select ) => {
			const { getEditedPostType, getCanvasMode } = unlock(
				select( editSiteStore )
			);

			const { getRenderingMode, getCurrentTemplateId } =
				select( editorStore );
			const _templateId = getCurrentTemplateId();
			const _templateType = getEditedPostType();

			return {
				isEditingTemplate:
					!! _templateId && getRenderingMode() === 'template-only',
				templateType: _templateType,
				isFocusMode: FOCUSABLE_ENTITIES.includes( _templateType ),
				isViewMode: getCanvasMode() === 'view',
			};
		}, [] );

	const [ resizeObserver, sizes ] = useResizeObserver();

	const settings = useSiteEditorSettings();

	const isMobileViewport = useViewportMatch( 'small', '<' );
	const enableResizing =
		isFocusMode &&
		! isViewMode &&
		// Disable resizing in mobile viewport.
		! isMobileViewport;

	const contentRef = useRef();
	const isTemplateTypeNavigation = templateType === NAVIGATION_POST_TYPE;
	const isNavigationFocusMode = isTemplateTypeNavigation && isFocusMode;
	const forceFullHeight = isNavigationFocusMode;

	return (
		<>
			<EditorCanvasContainer.Slot>
				{ ( [ editorCanvasView ] ) =>
					editorCanvasView ? (
						<div className="edit-site-visual-editor is-focus-mode">
							{ editorCanvasView }
						</div>
					) : (
						<BlockTools
							className={ classnames( 'edit-site-visual-editor', {
								'is-focus-mode':
									isFocusMode ||
									!! editorCanvasView ||
									isEditingTemplate,
								'is-view-mode': isViewMode,
							} ) }
							__unstableContentRef={ contentRef }
							onClick={ ( event ) => {
								// Clear selected block when clicking on the gray background.
								if ( event.target === event.currentTarget ) {
									clearSelectedBlock();
								}
							} }
						>
							<BackButton />
							<ResizableEditor
								enableResizing={ enableResizing }
								height={
									sizes.height && ! forceFullHeight
										? sizes.height
										: '100%'
								}
							>
								<EditorCanvas
									enableResizing={ enableResizing }
									settings={ settings }
									contentRef={ contentRef }
								>
									{ resizeObserver }
								</EditorCanvas>
							</ResizableEditor>
						</BlockTools>
					)
				}
			</EditorCanvasContainer.Slot>
			<PageContentFocusNotifications contentRef={ contentRef } />
		</>
	);
}
