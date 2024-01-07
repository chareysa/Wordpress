/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import { check } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import SwapTemplateButton from './swap-template-button';
import ResetDefaultTemplate from './reset-default-template';
import { unlock } from '../../lock-unlock';
import CreateNewTemplate from './create-new-template';

const POPOVER_PROPS = {
	className: 'editor-post-template__dropdown',
	placement: 'bottom-start',
};

export default function BlockThemeControl( { id } ) {
	const { isTemplateHidden, getPostLinkProps } = useSelect( ( select ) => {
		const { getEditorSettings } = select( editorStore );
		const { getRenderingMode } = unlock( select( editorStore ) );

		return {
			isTemplateHidden: getRenderingMode() === 'post-only',
			getPostLinkProps: getEditorSettings().getPostLinkProps,
		};
	}, [] );
	const { editedRecord: template, hasResolved } = useEntityRecord(
		'postType',
		'wp_template',
		id
	);

	const { createSuccessNotice } = useDispatch( noticesStore );
	const { setRenderingMode } = useDispatch( editorStore );
	const editTemplate = getPostLinkProps
		? getPostLinkProps( {
				postId: template.wp_id,
				postType: 'wp_template',
				canvas: 'edit',
		  } )
		: {};

	if ( ! hasResolved ) {
		return null;
	}

	return (
		<DropdownMenu
			popoverProps={ POPOVER_PROPS }
			focusOnMount
			toggleProps={ {
				variant: 'tertiary',
			} }
			label={ __( 'Template options' ) }
			text={ decodeEntities( template.title ) }
			icon={ null }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup>
						<MenuItem
							onClick={ ( event ) => {
								editTemplate.onClick( event );
								onClose();
								createSuccessNotice(
									__(
										'Editing template. Changes made here affect all posts and pages that use the template.'
									),
									{
										type: 'snackbar',
									}
								);
							} }
						>
							{ __( 'Edit template' ) }
						</MenuItem>
						<SwapTemplateButton onClick={ onClose } />
						<ResetDefaultTemplate onClick={ onClose } />
						<CreateNewTemplate onClick={ onClose } />
					</MenuGroup>
					<MenuGroup>
						<MenuItem
							icon={ ! isTemplateHidden ? check : undefined }
							isSelected={ ! isTemplateHidden }
							role="menuitemcheckbox"
							onClick={ () => {
								setRenderingMode(
									isTemplateHidden
										? 'template-locked'
										: 'post-only'
								);
							} }
						>
							{ __( 'Template preview' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);
}
