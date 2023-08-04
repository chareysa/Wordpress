/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { ___unstablePreferencesModalBaseOption as BaseOption } from '@wordpress/interface';
import { getPathAndQueryString } from '@wordpress/url';

function submitCustomFieldsForm() {
	const customFieldsForm = document.getElementById(
		'toggle-custom-fields-form'
	);

	if ( customFieldsForm ) {
		customFieldsForm
			.querySelector( '[name="_wp_http_referer"]' )
			.setAttribute(
				'value',
				getPathAndQueryString( window.location.href )
			);
		customFieldsForm.submit();
	}
}

export function CustomFieldsConfirmation( { willEnable } ) {
	const [ isReloading, setIsReloading ] = useState( false );
	return (
		<>
			<p className="edit-post-preferences-modal__custom-fields-confirmation-message">
				{ __(
					'A page reload is required for this change. Make sure your content is saved before reloading.'
				) }
			</p>
			<Button
				className="edit-post-preferences-modal__custom-fields-confirmation-button"
				variant="secondary"
				isBusy={ isReloading }
				disabled={ isReloading }
				onClick={ () => {
					setIsReloading( true );
					submitCustomFieldsForm();
				} }
			>
				{ willEnable
					? __( 'Show & Reload Page' )
					: __( 'Hide & Reload Page' ) }
			</Button>
		</>
	);
}

export function EnableCustomFieldsOption( { label, areCustomFieldsEnabled } ) {
	const [ isChecked, setIsChecked ] = useState( areCustomFieldsEnabled );

	return (
		<BaseOption
			label={ label }
			isChecked={ isChecked }
			onChange={ setIsChecked }
		>
			{ isChecked !== areCustomFieldsEnabled && (
				<CustomFieldsConfirmation willEnable={ isChecked } />
			) }
		</BaseOption>
	);
}

export default withSelect( ( select ) => ( {
	areCustomFieldsEnabled:
		!! select( editorStore ).getEditorSettings().enableCustomFields,
} ) )( EnableCustomFieldsOption );
