/**
 * External dependencies
 */
import classnames from 'classnames';
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { upload, Icon } from '@wordpress/icons';
import { getFilesFromDataTransfer } from '@wordpress/dom';
import { useRefEffect } from '@wordpress/compose';

function getDragEventType( { dataTransfer } ) {
	if ( dataTransfer ) {
		// Use lodash `includes` here as in the Edge browser `types` is implemented
		// as a DomStringList, whereas in other browsers it's an array. `includes`
		// happily works with both types.
		if (
			includes( dataTransfer.types, 'Files' ) ||
			getFilesFromDataTransfer( dataTransfer ).length > 0
		) {
			return 'file';
		}

		if ( includes( dataTransfer.types, 'text/html' ) ) {
			return 'html';
		}
	}

	return 'default';
}

function useFreshRef( value ) {
	const ref = useRef();
	ref.current = value;
	return ref;
}

export function useDropZone( {
	isDisabled,
	onFilesDrop,
	onHTMLDrop,
	onDrop: _onDrop,
	onDragStart: _onDragStart,
	onDragEnter: _onDragEnter,
	onDragLeave: _onDragLeave,
	onDragEnd: _onDragEnd,
	onDragOver: _onDragOver,
} ) {
	const onFilesDropRef = useFreshRef( onFilesDrop );
	const onHTMLDropRef = useFreshRef( onHTMLDrop );
	const onDropRef = useFreshRef( _onDrop );
	const onDragStartRef = useFreshRef( _onDragStart );
	const onDragEnterRef = useFreshRef( _onDragEnter );
	const onDragLeaveRef = useFreshRef( _onDragLeave );
	const onDragEndRef = useFreshRef( _onDragEnd );
	const onDragOverRef = useFreshRef( _onDragOver );

	return useRefEffect(
		( element ) => {
			if ( isDisabled ) {
				return;
			}

			let isDragging = false;

			const { ownerDocument } = element;

			function maybeDragStart( event ) {
				if ( isDragging ) {
					return;
				}

				isDragging = true;

				ownerDocument.removeEventListener(
					'dragenter',
					maybeDragStart
				);

				if ( onDragStartRef.current ) {
					onDragStartRef.current( event );
				}
			}

			function onDragEnter( event ) {
				event.preventDefault();

				// The `dragenter` event will also fire when entering child
				// elements, but we only want to call `onDragEnter` when
				// entering the drop zone, which means the `relatedTarget`
				// (element that has been left) should be outside the drop zone.
				if ( element.contains( event.relatedTarget ) ) {
					return;
				}

				if ( onDragEnterRef.current ) {
					onDragEnterRef.current( event );
				}
			}

			function onDragOver( event ) {
				// Only call onDragOver for the innermost hovered drop zones.
				if ( ! event.defaultPrevented && onDragOverRef.current ) {
					onDragOverRef.current( event );
				}

				// Prevent the browser default while also signalling to parent
				// drop zones that `onDragOver` is already handled.
				event.preventDefault();
			}

			function onDragLeave( event ) {
				// The `dragleave` event will also fire when leaving child
				// elements, but we only want to call `onDragLeave` when
				// leaving the drop zone, which means the `relatedTarget`
				// (element that has been entered) should be outside the drop
				// zone.
				if ( element.contains( event.relatedTarget ) ) {
					return;
				}

				if ( onDragLeaveRef.current ) {
					onDragLeaveRef.current( event );
				}
			}

			function onDrop( event ) {
				// This seemingly useless line has been shown to resolve a Safari issue
				// where files dragged directly from the dock are not recognized
				event.dataTransfer && event.dataTransfer.files.length; // eslint-disable-line no-unused-expressions

				const type = getDragEventType( event );

				if ( type === 'file' && onFilesDropRef.current ) {
					onFilesDropRef.current(
						getFilesFromDataTransfer( event.dataTransfer )
					);
				} else if ( type === 'html' && onHTMLDropRef.current ) {
					onHTMLDropRef.current(
						event.dataTransfer.getData( 'text/html' )
					);
				} else if ( type === 'default' && onDropRef.current ) {
					onDropRef.current( event );
				}

				maybeDragEnd( event );

				event.stopPropagation();
				event.preventDefault();
			}

			function maybeDragEnd( event ) {
				if ( ! isDragging ) {
					return;
				}

				isDragging = false;

				ownerDocument.addEventListener( 'dragenter', maybeDragStart );

				if ( onDragEndRef.current ) {
					onDragEndRef.current( event );
				}
			}

			element.addEventListener( 'drop', onDrop );
			element.addEventListener( 'dragenter', onDragEnter );
			element.addEventListener( 'dragover', onDragOver );
			element.addEventListener( 'dragleave', onDragLeave );
			// Note that `dragend` doesn't fire consistently for file and HTML
			// drag  events where the drag origin is outside the browser window.
			// In Firefox it may also not fire if the originating node is
			// removed.
			ownerDocument.addEventListener( 'dragend', maybeDragEnd );
			ownerDocument.addEventListener( 'mouseup', maybeDragEnd );
			// The `dragstart` event doesn't fire if the drag started outside
			// the document.
			ownerDocument.addEventListener( 'dragenter', maybeDragStart );

			return () => {
				element.removeEventListener( 'drop', onDrop );
				element.removeEventListener( 'dragenter', onDragEnter );
				element.removeEventListener( 'dragover', onDragOver );
				element.removeEventListener( 'dragleave', onDragLeave );
				ownerDocument.removeEventListener( 'dragend', maybeDragEnd );
				ownerDocument.removeEventListener( 'mouseup', maybeDragEnd );
				ownerDocument.addEventListener( 'dragenter', maybeDragStart );
			};
		},
		[ isDisabled ]
	);
}

export default function DropZoneComponent( {
	className,
	label,
	onFilesDrop,
	onHTMLDrop,
	onDrop,
} ) {
	const [ isDraggingOverDocument, setIsDraggingOverDocument ] = useState();
	const [ isDraggingOverElement, setIsDraggingOverElement ] = useState();
	const [ type, setType ] = useState();
	const ref = useDropZone( {
		onFilesDrop,
		onHTMLDrop,
		onDrop,
		onDragStart( event ) {
			setIsDraggingOverDocument( true );
			setType( getDragEventType( event ) );
		},
		onDragEnd() {
			setIsDraggingOverDocument( false );
			setType();
		},
		onDragEnter() {
			setIsDraggingOverElement( true );
		},
		onDragLeave() {
			setIsDraggingOverElement( false );
		},
	} );

	let children;

	if ( isDraggingOverElement ) {
		children = (
			<div className="components-drop-zone__content">
				<Icon
					icon={ upload }
					className="components-drop-zone__content-icon"
				/>
				<span className="components-drop-zone__content-text">
					{ label ? label : __( 'Drop files to upload' ) }
				</span>
			</div>
		);
	}

	const classes = classnames( 'components-drop-zone', className, {
		'is-active':
			( isDraggingOverDocument || isDraggingOverElement ) &&
			( ( type === 'file' && onFilesDrop ) ||
				( type === 'html' && onHTMLDrop ) ||
				( type === 'default' && onDrop ) ),
		'is-dragging-over-document': isDraggingOverDocument,
		'is-dragging-over-element': isDraggingOverElement,
		[ `is-dragging-${ type }` ]: !! type,
	} );

	return (
		<div ref={ ref } className={ classes }>
			{ children }
		</div>
	);
}
