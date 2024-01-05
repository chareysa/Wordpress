/**
 * External dependencies
 */
import { paramCase as kebabCase } from 'change-case';

/**
 * WordPress dependencies
 */
import { downloadBlob } from '@wordpress/blob';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { decodeEntities } from '@wordpress/html-entities';
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import { PATTERN_TYPES, TEMPLATE_PART_POST_TYPE } from '../../utils/constants';

export const exportJSONaction = {
	id: 'export-pattern',
	label: __( 'Export as JSON' ),
	isEligible: ( item ) => item.type === PATTERN_TYPES.user,
	callback: ( item ) => {
		const json = {
			__file: item.type,
			title: item.title || item.name,
			content: item.patternPost.content.raw,
			syncStatus: item.patternPost.wp_pattern_sync_status,
		};
		return downloadBlob(
			`${ kebabCase( item.title || item.name ) }.json`,
			JSON.stringify( json, null, 2 ),
			'application/json'
		);
	},
};

export const renameAction = {
	id: 'rename-pattern',
	label: __( 'Rename' ),
	isEligible: ( item ) => {
		const isTemplatePart = item.type === TEMPLATE_PART_POST_TYPE;
		const isUserPattern = item.type === PATTERN_TYPES.user;
		const isCustomPattern =
			isUserPattern || ( isTemplatePart && item.isCustom );
		const hasThemeFile = isTemplatePart && item.templatePart.has_theme_file;
		return isCustomPattern && ! hasThemeFile;
	},
	RenderModal: ( { item, closeModal } ) => {
		const [ title, setTitle ] = useState( () => item.title );
		const { editEntityRecord, saveEditedEntityRecord } =
			useDispatch( coreStore );
		const { createSuccessNotice, createErrorNotice } =
			useDispatch( noticesStore );
		async function onRename( event ) {
			event.preventDefault();
			try {
				await editEntityRecord( 'postType', item.type, item.id, {
					title,
				} );
				// Update state before saving rerenders the list.
				setTitle( '' );
				closeModal();
				// Persist edited entity.
				await saveEditedEntityRecord( 'postType', item.type, item.id, {
					throwOnError: true,
				} );
				createSuccessNotice(
					item.type === TEMPLATE_PART_POST_TYPE
						? __( 'Template part renamed.' )
						: __( 'Pattern renamed.' ),
					{ type: 'snackbar' }
				);
			} catch ( error ) {
				const fallbackErrorMessage =
					item.type === TEMPLATE_PART_POST_TYPE
						? __(
								'An error occurred while renaming the template part.'
						  )
						: __( 'An error occurred while renaming the pattern.' );
				const errorMessage =
					error.message && error.code !== 'unknown_error'
						? error.message
						: fallbackErrorMessage;
				createErrorNotice( errorMessage, { type: 'snackbar' } );
			}
		}
		return (
			<form onSubmit={ onRename }>
				<VStack spacing="5">
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Name' ) }
						value={ title }
						onChange={ setTitle }
						required
					/>
					<HStack justify="right">
						<Button
							__next40pxDefaultSize
							variant="tertiary"
							onClick={ () => {
								closeModal();
							} }
						>
							{ __( 'Cancel' ) }
						</Button>
						<Button
							__next40pxDefaultSize
							variant="primary"
							type="submit"
						>
							{ __( 'Save' ) }
						</Button>
					</HStack>
				</VStack>
			</form>
		);
	},
};

const canDeleteOrReset = ( item ) => {
	const isTemplatePart = item.type === TEMPLATE_PART_POST_TYPE;
	const isUserPattern = item.type === PATTERN_TYPES.user;
	return isUserPattern || ( isTemplatePart && item.isCustom );
};

export const deleteAction = {
	id: 'delete-pattern',
	label: __( 'Delete' ),
	isEligible: ( item ) => {
		const isTemplatePart = item.type === TEMPLATE_PART_POST_TYPE;
		const hasThemeFile = isTemplatePart && item.templatePart.has_theme_file;
		return canDeleteOrReset( item ) && ! hasThemeFile;
	},
	hideModalHeader: true,
	RenderModal: ( { item, closeModal } ) => {
		const { __experimentalDeleteReusableBlock } =
			useDispatch( reusableBlocksStore );
		const { createErrorNotice, createSuccessNotice } =
			useDispatch( noticesStore );
		const { removeTemplate } = useDispatch( editSiteStore );

		const deletePattern = async () => {
			try {
				await __experimentalDeleteReusableBlock( item.id );
				createSuccessNotice(
					sprintf(
						// translators: %s: The pattern's title e.g. 'Call to action'.
						__( '"%s" deleted.' ),
						item.title
					),
					{ type: 'snackbar', id: 'edit-site-patterns-success' }
				);
			} catch ( error ) {
				const errorMessage =
					error.message && error.code !== 'unknown_error'
						? error.message
						: __( 'An error occurred while deleting the pattern.' );
				createErrorNotice( errorMessage, {
					type: 'snackbar',
					id: 'edit-site-patterns-error',
				} );
			}
		};
		const deleteItem = () =>
			item.type === TEMPLATE_PART_POST_TYPE
				? removeTemplate( item )
				: deletePattern();
		return (
			<VStack spacing="5">
				<Text>
					{ sprintf(
						// translators: %s: The pattern or template part's title e.g. 'Call to action'.
						__( 'Are you sure you want to delete "%s"?' ),
						decodeEntities( item.title || item.name )
					) }
				</Text>
				<HStack justify="right">
					<Button variant="tertiary" onClick={ closeModal }>
						{ __( 'Cancel' ) }
					</Button>
					<Button variant="primary" onClick={ deleteItem }>
						{ __( 'Delete' ) }
					</Button>
				</HStack>
			</VStack>
		);
	},
};

export const resetAction = {
	id: 'reset-action',
	label: __( 'Clear customizations' ),
	isEligible: ( item ) => {
		const isTemplatePart = item.type === TEMPLATE_PART_POST_TYPE;
		const hasThemeFile = isTemplatePart && item.templatePart.has_theme_file;
		return canDeleteOrReset( item ) && hasThemeFile;
	},
	hideModalHeader: true,
	RenderModal: ( { item, closeModal } ) => {
		const { removeTemplate } = useDispatch( editSiteStore );
		return (
			<VStack spacing="5">
				<Text>
					{ __(
						'Are you sure you want to clear these customizations?'
					) }
				</Text>
				<HStack justify="right">
					<Button variant="tertiary" onClick={ closeModal }>
						{ __( 'Cancel' ) }
					</Button>
					<Button
						variant="primary"
						onClick={ () => removeTemplate( item ) }
					>
						{ __( 'Clear' ) }
					</Button>
				</HStack>
			</VStack>
		);
	},
};
