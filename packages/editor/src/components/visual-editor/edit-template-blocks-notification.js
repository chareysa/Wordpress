/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

/**
 * Component that:
 *
 * - Displays a 'Edit your template to edit this block' notification when the
 *   user is focusing on editing page content and clicks on a disabled template
 *   block.
 * - Displays a 'Edit your template to edit this block' dialog when the user
 *   is focusing on editing page conetnt and double clicks on a disabled
 *   template block.
 *
 * @param {Object}                                 props
 * @param {import('react').RefObject<HTMLElement>} props.contentRef Ref to the block
 *                                                                  editor iframe canvas.
 */
export default function EditTemplateBlocksNotification( { contentRef } ) {
	const { onNavigateToEntityRecord, templateId, editorMode } = useSelect(
		( select ) => {
			const { getEditorSettings, getCurrentTemplateId } =
				select( editorStore );
			const { __unstableGetEditorMode } = select( blockEditorStore );

			return {
				onNavigateToEntityRecord:
					getEditorSettings().onNavigateToEntityRecord,
				templateId: getCurrentTemplateId(),
				editorMode: 'zoom-out' === __unstableGetEditorMode(),
			};
		},
		[]
	);

	const canEditTemplate = useSelect(
		( select ) =>
			!! select( coreStore ).canUser( 'create', {
				kind: 'postType',
				name: 'wp_template',
			} ),
		[]
	);

	const [ isDialogOpen, setIsDialogOpen ] = useState( false );

	const { __unstableSetEditorMode } = useDispatch( blockEditorStore );

	useEffect( () => {
		const handleDblClick = ( event ) => {
			if ( ! canEditTemplate ) {
				return;
			}

			if ( editorMode ) {
				__unstableSetEditorMode( editorMode ? 'edit' : 'zoom-out' );
				return;
			}

			if (
				! event.target.classList.contains( 'is-root-container' ) ||
				event.target.dataset?.type === 'core/template-part'
			) {
				return;
			}
			setIsDialogOpen( true );
		};

		const canvas = contentRef.current;
		canvas?.addEventListener( 'dblclick', handleDblClick );
		return () => {
			canvas?.removeEventListener( 'dblclick', handleDblClick );
		};
	}, [ contentRef, canEditTemplate, editorMode ] );

	if ( ! canEditTemplate ) {
		return null;
	}

	return (
		<ConfirmDialog
			isOpen={ isDialogOpen }
			confirmButtonText={ __( 'Edit template' ) }
			onConfirm={ () => {
				setIsDialogOpen( false );
				onNavigateToEntityRecord( {
					postId: templateId,
					postType: 'wp_template',
				} );
			} }
			onCancel={ () => setIsDialogOpen( false ) }
			size="medium"
		>
			{ __(
				'You’ve tried to select a block that is part of a template, which may be used on other posts and pages. Would you like to edit the template?'
			) }
		</ConfirmDialog>
	);
}
