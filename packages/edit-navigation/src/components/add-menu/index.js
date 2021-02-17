/**
 * External dependencies
 */
import { some } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { TextControl, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

const menuNameMatches = ( menuName ) => ( menu ) =>
	menu.name.toLowerCase() === menuName.toLowerCase();

export default function AddMenu( {
	className,
	menus,
	onCreate,
	titleText,
	helpText,
	focusOnMount = false,
} ) {
	const [ menuName, setMenuName ] = useState( '' );
	const { createErrorNotice, createInfoNotice, removeNotice } = useDispatch(
		noticesStore
	);
	const [ isCreatingMenu, setIsCreatingMenu ] = useState( false );
	const { saveMenu } = useDispatch( 'core' );

	const createMenu = async ( event ) => {
		event.preventDefault();

		if ( ! menuName.length ) {
			return;
		}

		// Remove any existing notices so duplicates aren't created.
		removeNotice( 'edit-navigation-error' );

		if ( some( menus, menuNameMatches( menuName ) ) ) {
			const message = sprintf(
				// translators: %s: the name of a menu.
				__(
					'The menu name %s conflicts with another menu name. Please try another.'
				),
				menuName
			);
			createErrorNotice( message, { id: 'edit-navigation-error' } );
			return;
		}

		setIsCreatingMenu( true );

		const menu = await saveMenu( { name: menuName } );
		if ( menu ) {
			createInfoNotice( __( 'Menu created' ), {
				type: 'snackbar',
				isDismissible: true,
			} );
			if ( onCreate ) {
				onCreate( menu.id );
			}
		}

		setIsCreatingMenu( false );
	};

	return (
		<form
			className={ classnames( 'edit-navigation-add-menu', className ) }
			onSubmit={ createMenu }
		>
			{ titleText && (
				<h3 className="edit-navigation-add-menu__title">
					{ titleText }
				</h3>
			) }
			<TextControl
				// Disable reason: it should focus.
				//
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={ focusOnMount }
				label={ __( 'Menu name' ) }
				value={ menuName }
				onChange={ setMenuName }
				help={ helpText }
			/>

			<Button
				className="edit-navigation-add-menu__create-menu-button"
				type="submit"
				isPrimary
				disabled={ ! menuName.length }
				isBusy={ isCreatingMenu }
			>
				{ __( 'Create menu' ) }
			</Button>
		</form>
	);
}
