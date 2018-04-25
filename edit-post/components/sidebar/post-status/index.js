/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './style.scss';
import PostVisibility from '../post-visibility';
import PostTrash from '../post-trash';
import PostSchedule from '../post-schedule';
import PostSticky from '../post-sticky';
import PostAuthor from '../post-author';
import PostFormat from '../post-format';
import PostPendingStatus from '../post-pending-status';

/**
 * Module Constants
 */
const PANEL_NAME = 'post-status';

function PostStatus( { isOpened, onTogglePanel } ) {
	return (
		<PanelBody className="edit-post-post-status" title={ __( 'Status & Visibility' ) } opened={ isOpened } onToggle={ onTogglePanel }>
			<PostVisibility />
			<PostSchedule />
			<PostFormat />
			<PostSticky />
			<PostPendingStatus />
			<PostAuthor />
			<PostTrash />
		</PanelBody>
	);
}

export default compose( [
	withSelect( ( select ) => ( {
		isOpened: select( 'core/edit-post' ).isEditorSidebarPanelOpened( PANEL_NAME ),
	} ) ),
	withDispatch( ( dispatch ) => ( {
		onTogglePanel() {
			return dispatch( 'core/edit-post' ).toggleGeneralSidebarEditorPanel( PANEL_NAME );
		},
	} ) ),
] )( PostStatus );

