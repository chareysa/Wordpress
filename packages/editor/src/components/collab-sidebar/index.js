/**
 * WordPress dependencies
 */
// eslint-disable-next-line no-restricted-imports
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { comment as commentIcon } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import PluginSidebar from '../plugin-sidebar';
import { collabSidebarName } from './constants';
import { Comments } from './comments';
import { AddComment } from './add-comment';
import { store as editorStore } from '../../store';

const isBlockCommentExperimentEnabled =
	window?.__experimentalEnableBlockComment;
const modifyBlockCommentAttributes = ( settings, name ) => {
	if ( name?.includes( 'core/' ) && ! settings.attributes.blockCommentId ) {
		settings.attributes = {
			...settings.attributes,
			blockCommentId: {
				type: 'number',
				default: 0,
			},
			showCommentBoard: {
				type: 'boolean',
				default: false,
			},
		};
	}

	return settings;
};

// Apply the filter to all core blocks
addFilter(
	'blocks.registerBlockType',
	'block-comment/modify-core-block-attributes',
	modifyBlockCommentAttributes
);

/**
 * Renders the Collab sidebar.
 */
export default function CollabSidebar() {
	const { createNotice } = useDispatch( noticesStore );

	const [ threads, setThreads ] = useState( () => [] );
	const postId = useSelect( ( select ) => {
		return select( editorStore ).getCurrentPostId();
	}, [] );

	const currentUserData = useSelect( ( select ) => {
		return select( coreStore ).getCurrentUser();
	}, [] );

	// Get the dispatch functions to save the comment and update the block attributes.
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const clientId = useSelect( ( select ) => {
		return select( blockEditorStore ).getSelectedBlockClientId();
	}, [] );

	// Function to save the comment.
	const addNewComment = ( comment ) => {
		apiFetch( {
			path: '/wp/v2/comments',
			method: 'POST',
			data: {
				post: postId,
				content: comment,
				comment_date: new Date().toISOString(),
				comment_type: 'block_comment',
				comment_author: currentUserData?.name ?? null,
				comment_approved: 0,
			},
		} ).then( ( response ) => {
			updateBlockAttributes( clientId, {
				blockCommentId: response?.id,
			} );
			fetchComments();
		} );
	};

	const onCommentResolve = ( commentId ) => {
		apiFetch( {
			path: '/wp/v2/comments/' + commentId,
			method: 'POST',
			data: {
				status: 'approved',
			},
		} ).then( ( response ) => {
			if ( 'approved' === response.status ) {
				createNotice( 'snackbar', __( 'Thread marked as resolved.' ), {
					type: 'snackbar',
					isDismissible: true,
				} );
			}
			fetchComments();
		} );
	};

	const onEditComment = ( threadID, comment ) => {
		if ( threadID && comment.length > 0 ) {
			const editedComment = comment.replace( /^<p>|<\/p>$/g, '' );

			apiFetch( {
				path: '/wp/v2/comments/' + threadID,
				method: 'POST',
				data: {
					content: editedComment,
				},
			} ).then( ( response ) => {
				if ( 'trash' !== response.status && '' !== response.id ) {
					createNotice(
						'snackbar',
						__( 'Thread edited successfully.' ),
						{
							type: 'snackbar',
							isDismissible: true,
						}
					);
				}
				fetchComments();
			} );
		}
	};

	const onAddReply = ( threadID, comment ) => {
		if ( threadID ) {
			apiFetch( {
				path: '/wp/v2/comments/',
				method: 'POST',
				data: {
					parent: threadID,
					post: postId,
					content: comment,
					comment_date: new Date().toISOString(),
					comment_type: 'block_comment',
					comment_author: currentUserData?.name ?? null,
					comment_approved: 0,
				},
			} ).then( ( response ) => {
				if ( 'trash' !== response.status && '' !== response.id ) {
					createNotice(
						'snackbar',
						__( 'Reply added successfully.' ),
						{
							type: 'snackbar',
							isDismissible: true,
						}
					);
				}
				fetchComments();
			} );
		}
	};

	const onCommentDelete = ( threadID ) => {
		if ( threadID ) {
			apiFetch( {
				path: '/wp/v2/comments/' + threadID,
				method: 'DELETE',
			} ).then( ( response ) => {
				if ( 'trash' === response.status && '' !== response.id ) {
					updateBlockAttributes( clientId, {
						blockCommentId: undefined,
						showCommentBoard: undefined,
					} );
					createNotice(
						'snackbar',
						__( 'Thread deleted successfully.' ),
						{
							type: 'snackbar',
							isDismissible: true,
						}
					);
				}
				fetchComments();
			} );
		}
	};

	const fetchComments = () => {
		if ( postId ) {
			apiFetch( {
				path:
					'/wp/v2/comments?post=' +
					postId +
					'&type=block_comment' +
					'&status=any&per_page=100',
				method: 'GET',
			} ).then( ( data ) => {
				// Create a compare to store the references to all objects by id
				const compare = {};
				const result = [];

				// Initialize each object with an empty `reply` array
				data.forEach( ( item ) => {
					compare[ item.id ] = { ...item, reply: [] };
				} );

				// Iterate over the data to build the tree structure
				data.forEach( ( item ) => {
					if ( item.parent === 0 ) {
						// If parent is 0, it's a root item, push it to the result array
						result.push( compare[ item.id ] );
					} else if (
						compare[ item.parent ] &&
						'trash' !== item.status
					) {
						// Otherwise, find its parent and push it to the parent's `reply` array
						compare[ item.parent ].reply.push( compare[ item.id ] );
					}
				} );
				const filteredComments = result.filter(
					( comment ) => comment.status !== 'trash'
				);
				setThreads(
					Array.isArray( filteredComments ) ? filteredComments : []
				);
			} );
		}
	};

	useEffect( () => {
		fetchComments();
	}, [ postId ] );

	const allBlocks = useSelect( ( select ) => {
		// eslint-disable-next-line @wordpress/data-no-store-string-literals
		return select( 'core/block-editor' ).getBlocks();
	}, [] );
	
	const filteredBlocks = allBlocks?.filter(block => 
		block.attributes.blockCommentId !== 0
	);

	const blockCommentIds = filteredBlocks?.map(block => block.attributes.blockCommentId);
	const resultThreads = threads?.slice().reverse();
	const threadIdMap = new Map(resultThreads?.map(thread => [thread.id, thread]));
	const sortedThreads = blockCommentIds
	.map(id => threadIdMap.get(id))
	.filter(thread => thread !== undefined);

	// Check if the experimental flag is enabled.
	if ( ! isBlockCommentExperimentEnabled ) {
		return null; // or maybe return some message indicating no threads are available.
	}

	return (
		<PluginSidebar
			identifier={ collabSidebarName }
			title={ __( 'Comments' ) }
			icon={ commentIcon }
		>
			<div className="editor-collab-sidebar__activities">
				<AddComment
					threads={ sortedThreads }
					onSubmit={ addNewComment }
				/>
				<Comments
					threads={ sortedThreads }
					onEditComment={ onEditComment }
					onAddReply={ onAddReply }
					onCommentDelete={ onCommentDelete }
					onCommentResolve={ onCommentResolve }
				/>
			</div>
		</PluginSidebar>
	);
}