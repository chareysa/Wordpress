/**
 * WordPress dependencies
 */
import {
	TextControl,
	Button,
	Modal,
	SelectControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const SYNC_TYPES = {
	full: 'fully',
	unsynced: 'unsynced',
};

export default function CreatePatternModal( {
	closeModal,
	onCreate,
	onError,
} ) {
	const [ name, setName ] = useState( '' );
	const [ categoryId, setCategoryId ] = useState( '' );
	const [ syncType, setSyncType ] = useState( SYNC_TYPES.full );
	const [ isSubmitting, setIsSubmitting ] = useState( false );

	const { records: categories } = useEntityRecords(
		'taxonomy',
		'wp_pattern',
		{ per_page: -1, hide_empty: false, context: 'view' }
	);

	const options = ( categories || [] )
		.map( ( category ) => ( {
			label: category.name,
			value: category.id,
		} ) )
		.concat( [
			{ value: '', label: __( 'Select a category' ), disabled: true },
		] );

	const onSyncChange = () => {
		setSyncType(
			syncType === SYNC_TYPES.full ? SYNC_TYPES.unsynced : SYNC_TYPES.full
		);
	};

	const { createErrorNotice } = useDispatch( noticesStore );
	const { saveEntityRecord, invalidateResolution } = useDispatch( coreStore );

	async function createPattern() {
		if ( ! name ) {
			createErrorNotice( __( 'Name is not defined.' ), {
				type: 'snackbar',
			} );
			return;
		}

		const selectedCategories = categoryId ? [ categoryId ] : undefined;

		try {
			// TODO: Enforce unique pattern names?

			const pattern = await saveEntityRecord(
				'postType',
				'wp_block',
				{
					title: name || __( 'Untitled Pattern' ),
					content: '',
					status: 'publish',
					meta: { wp_block: { sync_status: syncType } },
					wp_pattern: selectedCategories,
				},
				{ throwOnError: true }
			);

			// Invalidate pattern category taxonomy so nav screen can reflect
			// up-to-date counts.
			invalidateResolution( 'getEntityRecords', [
				'taxonomy',
				'wp_pattern',
				{ per_page: -1, hide_empty: false, context: 'view' },
			] );

			onCreate( { pattern, categoryId } );
		} catch ( error ) {
			const errorMessage =
				error.message && error.code !== 'unknown_error'
					? error.message
					: __( 'An error occurred while creating the pattern.' );

			createErrorNotice( errorMessage, { type: 'snackbar' } );
			onError();
		}
	}

	return (
		<Modal
			title={ __( 'Create a pattern' ) }
			onRequestClose={ closeModal }
			overlayClassName="edit-site-create-pattern-modal"
		>
			<p>
				{ __(
					'Turn this block into a pattern for you to reuse later'
				) }
			</p>

			<form
				onSubmit={ async ( event ) => {
					event.preventDefault();
					if ( ! name ) {
						return;
					}
					setIsSubmitting( true );
					await createPattern();
				} }
			>
				<VStack spacing="4">
					<TextControl
						className="edit-site-create-pattern-modal__input"
						label={ __( 'Name' ) }
						onChange={ setName }
						placeholder={ __( 'My pattern' ) }
						required
						value={ name }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Category' ) }
						onChange={ setCategoryId }
						options={ options }
						size="__unstable-large"
						value={ categoryId }
					/>
					<ToggleControl
						label={ __( 'Synced' ) }
						onChange={ onSyncChange }
						help={
							syncType === SYNC_TYPES.full
								? __( 'Content is synced' )
								: __( 'Content is not synced' )
						}
						checked={ syncType === SYNC_TYPES.full }
					/>
					<HStack justify="right">
						<Button
							variant="tertiary"
							onClick={ () => {
								closeModal();
							} }
						>
							{ __( 'Cancel' ) }
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={ ! name }
							isBusy={ isSubmitting }
						>
							{ __( 'Create' ) }
						</Button>
					</HStack>
				</VStack>
			</form>
		</Modal>
	);
}
