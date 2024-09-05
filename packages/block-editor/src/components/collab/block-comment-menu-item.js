/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { collabComment } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';

export default function BlockCommentMenuItem( { onClose } ) {
	// eslint-disable-next-line @wordpress/data-no-store-string-literals
	const { openGeneralSidebar } = useDispatch( 'core/edit-post' );

	// eslint-disable-next-line @wordpress/data-no-store-string-literals
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const clientId = useSelect( ( select ) => {
		// eslint-disable-next-line @wordpress/data-no-store-string-literals
		const { getSelectedBlockClientId } = select( 'core/block-editor' );
		return getSelectedBlockClientId();
	}, [] );

	const openCollabBoard = () => {
		onClose();
		updateBlockAttributes( clientId, {
			showCommentBoard: true,
		} );
		openGeneralSidebar( 'edit-post/collab-sidebar' );
	};

	return (
		<MenuItem
			icon={ collabComment }
			onClick={ openCollabBoard }
			aria-haspopup="dialog"
		>
			{ _x(
                'Add Comment', 
                'Click to open comment sidebar and add comment'
            ) }
		</MenuItem>
	);
}
