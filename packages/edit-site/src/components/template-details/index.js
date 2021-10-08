/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	MenuGroup,
	MenuItem,
	__experimentalHeading as Heading,
	__experimentalText as Text,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import isTemplateRevertable from '../../utils/is-template-revertable';
import { MENU_TEMPLATES } from '../navigation-sidebar/navigation-panel/constants';
import { store as editSiteStore } from '../../store';
import TemplateAreas from './template-areas';

export default function TemplateDetails( { template, onClose } ) {
	const { title, description } = useSelect(
		( select ) =>
			select( editorStore ).__experimentalGetTemplateInfo( template ),
		[]
	);
	const { openNavigationPanelToMenu, revertTemplate } = useDispatch(
		editSiteStore
	);

	if ( ! template ) {
		return null;
	}

	const showTemplateInSidebar = () => {
		onClose();
		openNavigationPanelToMenu( MENU_TEMPLATES );
	};

	const revert = () => {
		revertTemplate( template );
		onClose();
	};

	return (
		<div className="edit-site-template-details">
			<div className="edit-site-template-details__group">
				<Heading
					level={ 4 }
					weight={ 600 }
					className="edit-site-template-details__title"
				>
					{ title }
				</Heading>

				{ description && (
					<Text
						size="body"
						className="edit-site-template-details__description"
					>
						{ description }
					</Text>
				) }
			</div>

			<TemplateAreas />

			{ isTemplateRevertable( template ) && (
				<MenuGroup className="edit-site-template-details__group edit-site-template-details__revert">
					<MenuItem
						className="edit-site-template-details__revert-button"
						info={ __( 'Restore template to theme default' ) }
						onClick={ revert }
					>
						{ __( 'Clear customizations' ) }
					</MenuItem>
				</MenuGroup>
			) }

			<Button
				className="edit-site-template-details__show-all-button"
				onClick={ showTemplateInSidebar }
				aria-label={ __(
					'Browse all templates. This will open the template menu in the navigation side panel.'
				) }
			>
				{ __( 'Browse all templates' ) }
			</Button>
		</div>
	);
}
