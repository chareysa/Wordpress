/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import {
	NavigableToolbar,
	ToolSelector,
	store as blockEditorStore,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';
import { Button, ToolbarItem } from '@wordpress/components';
import { listView, plus } from '@wordpress/icons';
import { useRef, useCallback } from '@wordpress/element';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as editorStore } from '../../store';
import EditorHistoryRedo from '../editor-history/redo';
import EditorHistoryUndo from '../editor-history/undo';

const { useCanBlockToolbarBeFocused } = unlock( blockEditorPrivateApis );

const preventDefault = ( event ) => {
	event.preventDefault();
};

function DocumentTools( {
	className,
	showIconLabels,
	disableBlockTools = false,
	children,
	// This is a temporary prop until the list view is fully unified between post and site editors.
	listViewLabel = __( 'Document Overview' ),
} ) {
	const inserterButton = useRef();
	const { setIsInserterOpened, setIsListViewOpened } =
		useDispatch( editorStore );
	const {
		isInserterDisabled,
		isInserterOpened,
		isListViewOpen,
		listViewShortcut,
		listViewToggleRef,
		hasFixedToolbar,
	} = useSelect( ( select ) => {
		const {
			hasInserterItems,
			getBlockRootClientId,
			getBlockSelectionEnd,
			getSettings,
		} = select( blockEditorStore );
		const { getEditorSettings, isListViewOpened, getListViewToggleRef } =
			unlock( select( editorStore ) );
		const { getShortcutRepresentation } = select( keyboardShortcutsStore );

		return {
			isInserterDisabled:
				! getEditorSettings().richEditingEnabled ||
				// Todo change with insertion point
				! hasInserterItems(
					getBlockRootClientId( getBlockSelectionEnd() )
				),
			isInserterOpened: select( editorStore ).isInserterOpened(),
			isListViewOpen: isListViewOpened(),
			listViewShortcut: getShortcutRepresentation(
				'core/editor/toggle-list-view'
			),
			listViewToggleRef: getListViewToggleRef(),
			hasFixedToolbar: getSettings().hasFixedToolbar,
		};
	}, [] );

	const isLargeViewport = useViewportMatch( 'medium' );
	const isWideViewport = useViewportMatch( 'wide' );
	const blockToolbarCanBeFocused = useCanBlockToolbarBeFocused();

	/* translators: accessibility text for the editor toolbar */
	const toolbarAriaLabel = __( 'Document tools' );

	const toggleListView = useCallback(
		() => setIsListViewOpened( ! isListViewOpen ),
		[ setIsListViewOpened, isListViewOpen ]
	);

	const toggleInserter = useCallback( () => {
		if ( isInserterOpened ) {
			// Focusing the inserter button should close the inserter popover.
			// However, there are some cases it won't close when the focus is lost.
			// See https://github.com/WordPress/gutenberg/issues/43090 for more details.
			inserterButton.current.focus();
			setIsInserterOpened( false );
		} else {
			setIsInserterOpened( true );
		}
	}, [ isInserterOpened, setIsInserterOpened ] );

	/* translators: button label text should, if possible, be under 16 characters. */
	const longLabel = _x(
		'Toggle block inserter',
		'Generic label for block inserter button'
	);
	const shortLabel = ! isInserterOpened ? __( 'Add' ) : __( 'Close' );

	return (
		<NavigableToolbar
			className={ classnames( 'editor-document-tools', className ) }
			aria-label={ toolbarAriaLabel }
			shouldUseKeyboardFocusShortcut={ ! blockToolbarCanBeFocused }
			variant="unstyled"
		>
			<div className="editor-document-tools__left">
				<ToolbarItem
					ref={ inserterButton }
					as={ Button }
					className="editor-document-tools__inserter-toggle"
					variant="primary"
					isPressed={ isInserterOpened }
					onMouseDown={ preventDefault }
					onClick={ toggleInserter }
					disabled={ disableBlockTools || isInserterDisabled }
					icon={ plus }
					label={ showIconLabels ? shortLabel : longLabel }
					showTooltip={ ! showIconLabels }
					aria-expanded={ isInserterOpened }
				/>
				{ ( isWideViewport || ! showIconLabels ) && (
					<>
						{ isLargeViewport && ! hasFixedToolbar && (
							<ToolbarItem
								as={ ToolSelector }
								showTooltip={ ! showIconLabels }
								variant={
									showIconLabels ? 'tertiary' : undefined
								}
								disabled={ disableBlockTools }
								size="compact"
							/>
						) }
						<ToolbarItem
							as={ EditorHistoryUndo }
							showTooltip={ ! showIconLabels }
							variant={ showIconLabels ? 'tertiary' : undefined }
							size="compact"
						/>
						<ToolbarItem
							as={ EditorHistoryRedo }
							showTooltip={ ! showIconLabels }
							variant={ showIconLabels ? 'tertiary' : undefined }
							size="compact"
						/>
						<ToolbarItem
							as={ Button }
							className="editor-document-tools__document-overview-toggle"
							icon={ listView }
							disabled={ disableBlockTools }
							isPressed={ isListViewOpen }
							/* translators: button label text should, if possible, be under 16 characters. */
							label={ listViewLabel }
							onClick={ toggleListView }
							shortcut={ listViewShortcut }
							showTooltip={ ! showIconLabels }
							variant={ showIconLabels ? 'tertiary' : undefined }
							aria-expanded={ isListViewOpen }
							ref={ listViewToggleRef }
							size="compact"
						/>
					</>
				) }
				{ children }
			</div>
		</NavigableToolbar>
	);
}

export default DocumentTools;
