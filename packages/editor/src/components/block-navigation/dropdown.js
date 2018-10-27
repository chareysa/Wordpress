/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { IconButton, Dropdown, Icon, SVG, Path, KeyboardShortcuts } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { rawShortcut } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import BlockNavigation from './';

const MenuIcon = (
	<Icon
		icon={ <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><Path d="M5 5H3v2h2V5zm3 8h11v-2H8v2zm9-8H6v2h11V5zM7 11H5v2h2v-2zm0 8h2v-2H7v2zm3-2v2h11v-2H10z" /></SVG> }
		size={ 20 }
	/>
);

function BlockNavigationDropdown() {
	return	(
		<Dropdown
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Fragment>
					<KeyboardShortcuts
						bindGlobal
						shortcuts={ {
							[ rawShortcut.access( 'o' ) ]: onToggle,
						} }
					/>
					<IconButton
						icon={ MenuIcon }
						aria-expanded={ isOpen }
						onClick={ onToggle }
						label={ __( 'Block Navigation' ) }
						className="editor-block-navigation"
					/>
				</Fragment>
			) }
			renderContent={ ( { onClose } ) => (
				<BlockNavigation onSelect={ onClose } />
			) }
		/>
	);
}

export default BlockNavigationDropdown;
