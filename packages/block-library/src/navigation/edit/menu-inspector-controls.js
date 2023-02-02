/**
 * WordPress dependencies
 */
import {
	experiments as blockEditorExperiments,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import NavigationMenuSelector from './navigation-menu-selector';
import { LeafMoreMenu } from '../leaf-more-menu';
import { unlock } from '../../experiments';
import DeletedNavigationWarning from './deleted-navigation-warning';

/* translators: %s: The name of a menu. */
const actionLabel = __( "Switch to '%s'" );

const MainContent = ( {
	clientId,
	currentMenuId,
	isLoading,
	isNavigationMenuMissing,
	onCreateNew,
} ) => {
	const { OffCanvasEditor } = unlock( blockEditorExperiments );
	// Provide a hierarchy of clientIds for the given Navigation block (clientId).
	// This is required else the list view will display the entire block tree.
	const clientIdsTree = useSelect(
		( select ) => {
			const { __unstableGetClientIdsTree } = select( blockEditorStore );
			return __unstableGetClientIdsTree( clientId );
		},
		[ clientId ]
	);

	if ( currentMenuId && isNavigationMenuMissing ) {
		return <p>{ __( 'Select or create a menu' ) }</p>;
	}

	if ( currentMenuId && isNavigationMenuMissing ) {
		return <DeletedNavigationWarning onCreateNew={ onCreateNew } />;
	}

	if ( isLoading ) {
		return <Spinner />;
	}

	return (
		<OffCanvasEditor
			blocks={ clientIdsTree }
			isExpanded={ true }
			LeafMoreMenu={ LeafMoreMenu }
		/>
	);
};

const MenuInspectorControls = ( props ) => {
	const {
		createNavigationMenuIsSuccess,
		createNavigationMenuIsError,
		currentMenuId = null,
		onCreateNew,
		onSelectClassicMenu,
		onSelectNavigationMenu,
		isManageMenusButtonDisabled,
	} = props;

	return (
		<InspectorControls group="list">
			<PanelBody
				title={ process.env.IS_GUTENBERG_PLUGIN ? null : __( 'Menu' ) }
			>
				<HStack className="wp-block-navigation-off-canvas-editor__header">
					<Heading
						className="wp-block-navigation-off-canvas-editor__title"
						level={ 2 }
					>
						{ __( 'Menu' ) }
					</Heading>
					<NavigationMenuSelector
						currentMenuId={ currentMenuId }
						onSelectClassicMenu={ onSelectClassicMenu }
						onSelectNavigationMenu={ onSelectNavigationMenu }
						onCreateNew={ onCreateNew }
						createNavigationMenuIsSuccess={
							createNavigationMenuIsSuccess
						}
						createNavigationMenuIsError={
							createNavigationMenuIsError
						}
						actionLabel={ actionLabel }
						isManageMenusButtonDisabled={
							isManageMenusButtonDisabled
						}
					/>
				</HStack>
				<MainContent { ...props } />
			</PanelBody>
		</InspectorControls>
	);
};

export default MenuInspectorControls;
