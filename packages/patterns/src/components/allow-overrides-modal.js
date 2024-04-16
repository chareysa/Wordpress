/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Button,
	TextControl,
	Modal,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useId } from '@wordpress/element';
import { speak } from '@wordpress/a11y';

export function AllowOverridesModal( {
	placeholder,
	initialName = '',
	onClose,
	onSave,
} ) {
	const [ editedBlockName, setEditedBlockName ] = useState( initialName );
	const descriptionId = useId();

	const isNameValid = !! editedBlockName.trim();

	const handleSubmit = () => {
		if ( editedBlockName !== initialName ) {
			const message = sprintf(
				/* translators: %s: new name/label for the block */
				__( 'Block name changed to: "%s".' ),
				editedBlockName
			);

			// Must be assertive to immediately announce change.
			speak( message, 'assertive' );
		}
		onSave( editedBlockName );

		// Immediate close avoids ability to hit save multiple times.
		onClose();
	};

	return (
		<Modal
			title={ __( 'Allow overrides' ) }
			onRequestClose={ onClose }
			overlayClassName="block-editor-block-allow-overrides-modal"
			focusOnMount="firstContentElement"
			aria={ { describedby: descriptionId } }
			size="small"
		>
			<form
				onSubmit={ ( event ) => {
					event.preventDefault();

					if ( ! isNameValid ) {
						return;
					}

					handleSubmit();
				} }
			>
				<p id={ descriptionId }>
					{ __( 'Enter a custom name for this block.' ) }
				</p>
				<VStack spacing="3">
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ editedBlockName }
						label={ __( 'Block name' ) }
						hideLabelFromVision
						help={ __(
							'This name will be used to denote the override wherever the synced pattern is used. The name here will help people understand its purpose. E.g. if you\'re creating a recipe pattern, it can be "Recipe Title", "Recipe Description", etc.'
						) }
						placeholder={ placeholder }
						onChange={ setEditedBlockName }
					/>
					<HStack justify="right">
						<Button
							__next40pxDefaultSize
							variant="tertiary"
							onClick={ onClose }
						>
							{ __( 'Cancel' ) }
						</Button>

						<Button
							__next40pxDefaultSize
							aria-disabled={ ! isNameValid }
							variant="primary"
							type="submit"
						>
							{ __( 'Allow overrides' ) }
						</Button>
					</HStack>
				</VStack>
			</form>
		</Modal>
	);
}

export function DisallowOverridesModal( { onClose, onSave } ) {
	const descriptionId = useId();

	return (
		<Modal
			title={ __( 'Disallow overrides' ) }
			onRequestClose={ onClose }
			overlayClassName="block-editor-block-disallow-overrides-modal"
			aria={ { describedby: descriptionId } }
			size="small"
		>
			<form
				onSubmit={ ( event ) => {
					event.preventDefault();
					onSave();
					onClose();
				} }
			>
				<p id={ descriptionId }>
					{ __(
						'Are you sure you want to disallow the overrides? This could cause problems with content entered into instances of this pattern.'
					) }
				</p>

				<HStack justify="right">
					<Button
						__next40pxDefaultSize
						variant="tertiary"
						onClick={ onClose }
					>
						{ __( 'Cancel' ) }
					</Button>

					<Button
						__next40pxDefaultSize
						variant="primary"
						type="submit"
					>
						{ __( 'Disallow overrides' ) }
					</Button>
				</HStack>
			</form>
		</Modal>
	);
}
