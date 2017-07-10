/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { __ } from 'i18n';
import { IconButton } from 'components';

/**
 * Internal dependencies
 */
import './style.scss';
import { isEditorSidebarOpened } from 'editor/selectors';

function BlockSettingsMenu( { onDelete, selectBlock, isSidebarOpened, toggleSidebar, setSidebarMode } ) {
	const toggleInspector = () => {
		selectBlock();
		setSidebarMode();
		if ( ! isSidebarOpened ) {
			toggleSidebar();
		}
	};

	return (
		<div className="editor-block-settings-menu">
			<IconButton
				className="editor-block-settings-menu__control"
				onClick={ toggleInspector }
				icon="admin-generic"
				label={ __( 'Show inspector' ) }
			/>
			<IconButton
				className="editor-block-settings-menu__control"
				onClick={ onDelete }
				icon="trash"
				label={ __( 'Delete the block' ) }
			/>
		</div>
	);
}

export default connect(
	( state ) => ( {
		isSidebarOpened: isEditorSidebarOpened( state ),
	} ),
	( dispatch, ownProps ) => ( {
		onDelete() {
			dispatch( {
				type: 'REMOVE_BLOCKS',
				uids: [ ownProps.uid ],
			} );
		},
		selectBlock() {
			dispatch( {
				type: 'TOGGLE_BLOCK_SELECTED',
				selected: true,
				uid: ownProps.uid,
			} );
		},
		setSidebarMode() {
			dispatch( {
				type: 'SELECT_SIDEBAR_MODE',
				sidebarMode: 'block',
			} );
		},
		toggleSidebar() {
			dispatch( { type: 'TOGGLE_SIDEBAR' } );
		},
	} )
)( BlockSettingsMenu );
