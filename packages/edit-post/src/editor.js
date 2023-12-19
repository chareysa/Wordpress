/**
 * WordPress dependencies
 */
import { store as blocksStore } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	ErrorBoundary,
	PostLockedModal,
	store as editorStore,
	privateApis as editorPrivateApis,
} from '@wordpress/editor';
import { useMemo, useState, useCallback, useRef } from '@wordpress/element';
import { SlotFillProvider } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { store as preferencesStore } from '@wordpress/preferences';
import { CommandMenu } from '@wordpress/commands';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Layout from './components/layout';
import EditorInitialization from './components/editor-initialization';
import { store as editPostStore } from './store';
import { unlock } from './lock-unlock';

const { ExperimentalEditorProvider } = unlock( editorPrivateApis );

function Editor( {
	postId: initialPostId,
	postType: initialPostType,
	settings,
	initialEdits,
	...props
} ) {
	const isLargeViewport = useViewportMatch( 'medium' );

	const postHistory = useRef( [] );
	const [ currentPost, setCurrentPost ] = useState( {
		postId: initialPostId,
		postType: initialPostType,
	} );

	const onSelectPost = useCallback(
		( postId, postType ) => {
			postHistory.current.unshift( currentPost );
			setCurrentPost( { postId, postType } );
		},
		[ currentPost ]
	);

	const goBack = () => {
		const previousPost = postHistory.current.shift();
		setCurrentPost( {
			postId: previousPost.postId ? previousPost.postId : initialPostId,
			postType: previousPost.postType
				? previousPost.postType
				: initialPostType,
		} );
	};

	const {
		allowRightClickOverrides,
		hasFixedToolbar,
		focusMode,
		isDistractionFree,
		hasInlineToolbar,
		post,
		preferredStyleVariations,
		hiddenBlockTypes,
		blockTypes,
		keepCaretInsideBlock,
		template,
	} = useSelect(
		( select ) => {
			const {
				isFeatureActive,
				getEditedPostTemplate,
				getHiddenBlockTypes,
			} = select( editPostStore );
			const { getEntityRecord, getPostType, getEntityRecords, canUser } =
				select( coreStore );
			const { getEditorSettings } = select( editorStore );
			const { getBlockTypes } = select( blocksStore );
			const isTemplate = [ 'wp_template', 'wp_template_part' ].includes(
				currentPost.postType
			);
			// Ideally the initializeEditor function should be called using the ID of the REST endpoint.
			// to avoid the special case.
			let postObject;
			if ( isTemplate ) {
				const posts = getEntityRecords(
					'postType',
					currentPost.postType,
					{
						wp_id: currentPost.postId,
					}
				);
				postObject = posts?.[ 0 ];
			} else {
				postObject = getEntityRecord(
					'postType',
					currentPost.postType,
					currentPost.postId
				);
			}
			const supportsTemplateMode =
				getEditorSettings().supportsTemplateMode;
			const isViewable =
				getPostType( currentPost.postType )?.viewable ?? false;
			const canEditTemplate = canUser( 'create', 'templates' );
			return {
				allowRightClickOverrides: isFeatureActive(
					'allowRightClickOverrides'
				),
				hasFixedToolbar:
					isFeatureActive( 'fixedToolbar' ) || ! isLargeViewport,
				focusMode: isFeatureActive( 'focusMode' ),
				isDistractionFree: isFeatureActive( 'distractionFree' ),
				hasInlineToolbar: isFeatureActive( 'inlineToolbar' ),
				preferredStyleVariations: select( preferencesStore ).get(
					'core/edit-post',
					'preferredStyleVariations'
				),
				hiddenBlockTypes: getHiddenBlockTypes(),
				blockTypes: getBlockTypes(),
				keepCaretInsideBlock: isFeatureActive( 'keepCaretInsideBlock' ),
				template:
					supportsTemplateMode && isViewable && canEditTemplate
						? getEditedPostTemplate()
						: null,
				post: postObject,
			};
		},
		[ currentPost.postType, currentPost.postId, isLargeViewport ]
	);

	const { updatePreferredStyleVariations, setIsInserterOpened } =
		useDispatch( editPostStore );

	const editorSettings = useMemo( () => {
		const result = {
			...settings,
			onSelectPost,
			goBack,
			postHistory: postHistory.current,
			__experimentalPreferredStyleVariations: {
				value: preferredStyleVariations,
				onChange: updatePreferredStyleVariations,
			},
			hasFixedToolbar,
			focusMode,
			isDistractionFree,
			hasInlineToolbar,
			allowRightClickOverrides,

			// This is marked as experimental to give time for the quick inserter to mature.
			__experimentalSetIsInserterOpened: setIsInserterOpened,
			keepCaretInsideBlock,
			// Keep a reference of the `allowedBlockTypes` from the server to handle use cases
			// where we need to differentiate if a block is disabled by the user or some plugin.
			defaultAllowedBlockTypes: settings.allowedBlockTypes,
		};

		// Omit hidden block types if exists and non-empty.
		if ( hiddenBlockTypes.length > 0 ) {
			// Defer to passed setting for `allowedBlockTypes` if provided as
			// anything other than `true` (where `true` is equivalent to allow
			// all block types).
			const defaultAllowedBlockTypes =
				true === settings.allowedBlockTypes
					? blockTypes.map( ( { name } ) => name )
					: settings.allowedBlockTypes || [];

			result.allowedBlockTypes = defaultAllowedBlockTypes.filter(
				( type ) => ! hiddenBlockTypes.includes( type )
			);
		}

		return result;
	}, [
		settings,
		onSelectPost,
		preferredStyleVariations,
		updatePreferredStyleVariations,
		hasFixedToolbar,
		focusMode,
		isDistractionFree,
		hasInlineToolbar,
		allowRightClickOverrides,
		setIsInserterOpened,
		keepCaretInsideBlock,
		hiddenBlockTypes,
		blockTypes,
	] );

	if ( ! post ) {
		return null;
	}

	return (
		<SlotFillProvider>
			<ExperimentalEditorProvider
				settings={ editorSettings }
				post={ post }
				initialEdits={ initialEdits }
				useSubRegistry={ false }
				__unstableTemplate={ template }
				{ ...props }
			>
				<ErrorBoundary>
					<CommandMenu />
					<EditorInitialization postId={ currentPost.postId } />
					<Layout />
				</ErrorBoundary>
				<PostLockedModal />
			</ExperimentalEditorProvider>
		</SlotFillProvider>
	);
}

export default Editor;
