/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Spinner,
	Button,
	SelectControl,
	Dropdown,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import ManageLocations from './manage-locations';
import AddMenuForm from './add-menu-form';

export default function Header( {
	menus,
	selectedMenuId,
	onSelectMenu,
	onCancelAddingMenu,
} ) {
	return (
		<div className="edit-navigation-header">
			<h1>{ __( 'Navigation' ) }</h1>

			<div className="edit-navigation-header__actions">
				{ menus ? (
					<div className="edit-navigation-header__current-menu">
						<p>{ __( 'Currently editing' ) }</p>
						<SelectControl
							className="edit-navigation-toolbar__menu-select"
							label={ __( 'Currently editing' ) }
							hideLabelFromVision
							disabled={ ! menus.length }
							value={ selectedMenuId ?? 0 }
							options={
								menus.length
									? menus.map( ( menu ) => ( {
											value: menu.id,
											label: menu.name + ' (Primary)', //Just a reminder to show the menu location, if set.
									  } ) )
									: [
											{
												value: 0,
												label: __(
													'— Select navigation —'
												),
											},
									  ]
							}
							onChange={ onSelectMenu }
						/>
					</div>
				) : (
					<Spinner />
				) }

				<Dropdown
					contentClassName="edit-navigation-header__add-new-form"
					position="bottom center"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							isTertiary
							aria-expanded={ isOpen }
							onClick={ onToggle }
						>
							{ __( 'Add new' ) }
						</Button>
					) }
					renderContent={ () => (
						<AddMenuForm
							menus={ menus }
							onCancel={ onCancelAddingMenu }
							onCreate={ onSelectMenu }
						/>
					) }
				/>

				<Dropdown
					contentClassName="edit-navigation-header__manage-locations"
					position="bottom center"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							isTertiary
							aria-expanded={ isOpen }
							onClick={ onToggle }
						>
							{ __( 'Manage locations' ) }
						</Button>
					) }
					renderContent={ () => <ManageLocations /> }
				/>
			</div>
		</div>
	);
}
