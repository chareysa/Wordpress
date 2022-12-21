/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { moreVertical } from '@wordpress/icons';
import { DropdownMenu, MenuItem, MenuGroup } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
	variant: 'toolbar',
};

export const LeafMoreMenu = ( props ) => {
	const { clientId, block } = props;

	const { insertBlock, replaceBlock, removeBlocks } =
		useDispatch( blockEditorStore );

	return (
		<DropdownMenu
			icon={ moreVertical }
			label={ __( 'Options' ) }
			className="block-editor-block-settings-menu"
			popoverProps={ POPOVER_PROPS }
			noIcons
			{ ...props }
		>
			{ ( { onClose } ) => (
				<MenuGroup>
					<MenuItem
						onClick={ () => {
							const newLink = createBlock(
								'core/navigation-link'
							);
							if ( block.name === 'core/navigation-submenu' ) {
								const updateSelectionOnInsert = false;
								insertBlock(
									newLink,
									block.innerBlocks.length,
									clientId,
									updateSelectionOnInsert
								);
							} else {
								// Convert to a submenu if the block currently isn't one.
								const newSubmenu = createBlock(
									'core/navigation-submenu',
									block.attributes,
									block.innerBlocks
										? [ ...block.innerBlocks, newLink ]
										: [ newLink ]
								);
								replaceBlock( clientId, newSubmenu );
							}
							onClose();
						} }
					>
						{ __( 'Add submenu item' ) }
					</MenuItem>
					<MenuItem
						onClick={ () => {
							removeBlocks( [ clientId ], false );
							onClose();
						} }
					>
						{ __( 'Remove item' ) }
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
};
