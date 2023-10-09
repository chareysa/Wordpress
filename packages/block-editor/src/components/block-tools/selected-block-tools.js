/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { forwardRef, useRef, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { useInstanceId, useViewportMatch } from '@wordpress/compose';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';
import { getScrollContainer } from '@wordpress/dom';
import { VisuallyHidden } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockSelectionButton from './block-selection-button';
import BlockContextualToolbar from './block-contextual-toolbar';
import { store as blockEditorStore } from '../../store';
import BlockPopover from '../block-popover';
import useBlockToolbarPopoverProps from './use-block-toolbar-popover-props';
import useSelectedBlockToolProps from './use-selected-block-tool-props';
import { useShouldContextualToolbarShow } from '../../utils/use-should-contextual-toolbar-show';

function UnforwardSelectedBlockTools(
	{
		clientId,
		hasFixedToolbar,
		showEmptyBlockSideInserter,
		__unstableContentRef,
	},
	ref
) {
	const {
		capturingClientId,
		isInsertionPointVisible,
		lastClientId,
		rootClientId,
	} = useSelectedBlockToolProps( clientId );

	const { shouldShowBreadcrumb } = useSelect( ( select ) => {
		const { hasMultiSelection, __unstableGetEditorMode } =
			select( blockEditorStore );

		const editorMode = __unstableGetEditorMode();

		return {
			shouldShowBreadcrumb:
				! hasMultiSelection() &&
				( editorMode === 'navigation' || editorMode === 'zoom-out' ),
		};
	}, [] );

	const isLargeViewport = useViewportMatch( 'medium' );
	const instanceId = useInstanceId( UnforwardSelectedBlockTools );
	const descriptionId = `block-editor-block-contextual-toolbar--${ instanceId }`;

	const isToolbarForced = useRef( false );
	const { shouldShowContextualToolbar, canFocusHiddenToolbar } =
		useShouldContextualToolbarShow();

	const { stopTyping } = useDispatch( blockEditorStore );

	useShortcut(
		'core/block-editor/focus-toolbar',
		() => {
			isToolbarForced.current = true;
			stopTyping( true );
		},
		{
			isDisabled: ! canFocusHiddenToolbar,
		}
	);

	useEffect( () => {
		isToolbarForced.current = false;
	} );

	// Stores the active toolbar item index so the block toolbar can return focus
	// to it when re-mounting.
	const initialToolbarItemIndexRef = useRef();

	useEffect( () => {
		// Resets the index whenever the active block changes so this is not
		// persisted. See https://github.com/WordPress/gutenberg/pull/25760#issuecomment-717906169
		initialToolbarItemIndexRef.current = undefined;
	}, [ clientId ] );

	const popoverProps = useBlockToolbarPopoverProps( {
		contentElement: hasFixedToolbar
			? getScrollContainer()
			: __unstableContentRef?.current,
		clientId,
	} );

	const KeyboardInstructions = () => {
		return (
			<VisuallyHidden id={ descriptionId }>
				{ hasFixedToolbar
					? __(
							'Press Tab or Shift+Tab to navigate to other toolbars, and press Escape to return focus to the editor.'
					  )
					: __(
							'Use the Top Toolbar mode in the Options menu of the header to have document and block tools unified in a single menubar.'
					  ) }
			</VisuallyHidden>
		);
	};

	if ( hasFixedToolbar || ! isLargeViewport ) {
		return (
			<>
				<KeyboardInstructions />
				<BlockContextualToolbar
					ref={ ref }
					aria-describedby={ descriptionId }
					// Needs to be passed as `true` so it can be set fixed smaller screens as well
					isFixed={ true }
					__experimentalInitialIndex={
						initialToolbarItemIndexRef.current
					}
					__experimentalOnIndexChange={ ( index ) => {
						initialToolbarItemIndexRef.current = index;
					} }
					// Resets the index whenever the active block changes so
					// this is not persisted. See https://github.com/WordPress/gutenberg/pull/25760#issuecomment-717906169
					key={ clientId }
				/>
				{ shouldShowBreadcrumb && (
					<BlockPopover
						clientId={ capturingClientId || clientId }
						bottomClientId={ lastClientId }
						className={ classnames(
							'block-editor-block-list__block-popover',
							{
								'is-insertion-point-visible':
									isInsertionPointVisible,
							}
						) }
						{ ...popoverProps }
					>
						<BlockSelectionButton
							clientId={ clientId }
							rootClientId={ rootClientId }
						/>
					</BlockPopover>
				) }
			</>
		);
	}

	if ( showEmptyBlockSideInserter ) {
		return null;
	}

	if ( shouldShowBreadcrumb || shouldShowContextualToolbar ) {
		return (
			<>
				<BlockPopover
					clientId={ capturingClientId || clientId }
					bottomClientId={ lastClientId }
					className={ classnames(
						'block-editor-block-list__block-popover',
						{
							'is-insertion-point-visible':
								isInsertionPointVisible,
						}
					) }
					{ ...popoverProps }
				>
					{ shouldShowContextualToolbar && (
						<>
							<KeyboardInstructions />
							<BlockContextualToolbar
								ref={ ref }
								aria-describedby={ descriptionId }
								// If the toolbar is being shown because of being forced
								// it should focus the toolbar right after the mount.
								focusOnMount={ isToolbarForced.current }
								__experimentalInitialIndex={
									initialToolbarItemIndexRef.current
								}
								__experimentalOnIndexChange={ ( index ) => {
									initialToolbarItemIndexRef.current = index;
								} }
								// Resets the index whenever the active block changes so
								// this is not persisted. See https://github.com/WordPress/gutenberg/pull/25760#issuecomment-717906169
								key={ clientId }
							/>
						</>
					) }
					{ shouldShowBreadcrumb && (
						<BlockSelectionButton
							clientId={ clientId }
							rootClientId={ rootClientId }
						/>
					) }
				</BlockPopover>
			</>
		);
	}

	return null;
}

export default forwardRef( UnforwardSelectedBlockTools );
