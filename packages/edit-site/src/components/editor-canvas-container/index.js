/**
 * WordPress dependencies
 */
import { Children, cloneElement, useState } from '@wordpress/element';
import { createSlotFill, Button } from '@wordpress/components';
import { ESCAPE } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { closeSmall } from '@wordpress/icons';
import {
	useFocusOnMount,
	useFocusReturn,
	useMergeRefs,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { unlock } from '../../private-apis';
import { store as editSiteStore } from '../../store';

/**
 * Returns a translated string for the title of the editor canvas container.
 *
 * @param {string} view Editor canvas container view.
 *
 * @return {string} Translated string corresponding to value of view. Default is ''.
 */
export function getEditorCanvasContainerTitle( view ) {
	switch ( view ) {
		case 'style-book':
			return __( 'Style book' );
		default:
			return '';
	}
}

const SLOT_FILL_NAME = 'EditSiteEditorCanvasContainerSlot';
const { Slot: EditorCanvasContainerSlot, Fill: EditorCanvasContainerFill } =
	createSlotFill( SLOT_FILL_NAME );

function EditorCanvasContainer( {
	children,
	closeButtonLabel,
	onClose = () => {},
} ) {
	const [ isClosed, setIsClosed ] = useState( false );
	const { setEditorCanvasContainerView } = unlock(
		useDispatch( editSiteStore )
	);
	const focusOnMountRef = useFocusOnMount( 'firstElement' );
	const sectionFocusReturnRef = useFocusReturn();
	const refs = useMergeRefs( [ sectionFocusReturnRef, focusOnMountRef ] );

	function onCloseContainer() {
		onClose();
		setEditorCanvasContainerView( 'init' );
		setIsClosed( true );
	}

	function closeOnEscape( event ) {
		if ( event.keyCode === ESCAPE && ! event.defaultPrevented ) {
			event.preventDefault();
			onCloseContainer();
		}
	}

	const childrenWithProps = Array.isArray( children )
		? Children.map( children, ( child, index ) =>
				index === 0
					? cloneElement( child, {
							ref: refs,
							onKeyDown: closeOnEscape,
					  } )
					: child
		  )
		: cloneElement( children, { ref: refs, onKeyDown: closeOnEscape } );

	if ( isClosed ) {
		return null;
	}

	return (
		/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
		<section className="edit-site-editor-canvas-container">
			<EditorCanvasContainerFill>
				<Button
					className="edit-site-editor-canvas-container__close-button"
					icon={ closeSmall }
					label={ closeButtonLabel || __( 'Close' ) }
					onClick={ onCloseContainer }
					showTooltip={ false }
				/>
				{ childrenWithProps }
			</EditorCanvasContainerFill>
		</section>
	);
}

EditorCanvasContainer.Slot = EditorCanvasContainerSlot;
export default EditorCanvasContainer;
