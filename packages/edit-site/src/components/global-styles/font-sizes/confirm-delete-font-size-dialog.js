/**
 * WordPress dependencies
 */
import {
	__experimentalConfirmDialog as ConfirmDialog,
	__experimentalUseNavigator as useNavigator,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

function ConfirmDeleteFontSizeDialog( {
	fontSize,
	isOpen,
	toggleOpen,
	handleRemoveFontSize,
} ) {
	const navigator = useNavigator();

	const handleConfirm = async () => {
		toggleOpen();
		handleRemoveFontSize( fontSize );
		navigator.goTo( '/typography/font-sizes/' );
	};

	const handleCancel = () => {
		toggleOpen();
	};

	return (
		<ConfirmDialog
			isOpen={ isOpen }
			cancelButtonText={ __( 'Cancel' ) }
			confirmButtonText={ __( 'Delete' ) }
			onCancel={ handleCancel }
			onConfirm={ handleConfirm }
			size="medium"
		>
			{ fontSize &&
				sprintf(
					/* translators: %s: Name of the font size preset. */
					__(
						'Are you sure you want to delete "%s" font size preset?'
					),
					fontSize.name
				) }
		</ConfirmDialog>
	);
}

export default ConfirmDeleteFontSizeDialog;
