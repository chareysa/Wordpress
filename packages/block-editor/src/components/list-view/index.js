/**
 * External dependencies
 */
import { throttle } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMergeRefs } from '@wordpress/compose';
import { __experimentalTreeGrid as TreeGrid } from '@wordpress/components';
import { AsyncModeProvider, useDispatch, useSelect } from '@wordpress/data';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useReducer,
	useState,
	forwardRef,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const WINDOW_OVERSCAN = 1;
const ITEM_HEIGHT = 36;

function measureWindow( scrollContainer, setWindowMeasurement ) {
	const maxVisible = Math.floor( scrollContainer.clientHeight / ITEM_HEIGHT );
	const start = Math.max(
		0,
		Math.floor( scrollContainer.scrollTop / ITEM_HEIGHT ) - WINDOW_OVERSCAN
	);
	setWindowMeasurement( {
		maxVisible: maxVisible + WINDOW_OVERSCAN,
		start,
	} );
}

/**
 * Internal dependencies
 */
import ListViewBranch from './branch';
import { ListViewContext } from './context';
import ListViewDropIndicator from './drop-indicator';
import useListViewClientIds from './use-list-view-client-ids';
import useListViewDropZone from './use-list-view-drop-zone';
import { store as blockEditorStore } from '../../store';

const noop = () => {};
const expanded = ( state, action ) => {
	switch ( action.type ) {
		case 'expand':
			return { ...state, ...{ [ action.clientId ]: true } };
		case 'collapse':
			return { ...state, ...{ [ action.clientId ]: false } };
		default:
			return state;
	}
};

/**
 * Wrap `ListViewRows` with `TreeGrid`. ListViewRows is a
 * recursive component (it renders itself), so this ensures TreeGrid is only
 * present at the very top of the navigation grid.
 *
 * @param {Object}   props                                          Components props.
 * @param {Array}    props.blocks                                   Custom subset of block client IDs to be used instead of the default hierarchy.
 * @param {Function} props.onSelect                                 Block selection callback.
 * @param {boolean}  props.showNestedBlocks                         Flag to enable displaying nested blocks.
 * @param {boolean}  props.showOnlyCurrentHierarchy                 Flag to limit the list to the current hierarchy of blocks.
 * @param {boolean}  props.__experimentalFeatures                   Flag to enable experimental features.
 * @param {boolean}  props.__experimentalPersistentListViewFeatures Flag to enable features for the Persistent List View experiment.
 * @param {Object}   ref                                            Forwarded ref
 */
function ListView(
	{
		blocks,
		showOnlyCurrentHierarchy,
		onSelect = noop,
		__experimentalFeatures,
		__experimentalPersistentListViewFeatures,
		...props
	},
	ref
) {
	const {
		clientIdsTree,
		selectedClientIds,
		draggedClientIds,
	} = useListViewClientIds(
		blocks,
		showOnlyCurrentHierarchy,
		__experimentalPersistentListViewFeatures
	);

	const globalBlockCount = useSelect( ( select ) => {
		return select( blockEditorStore ).getGlobalBlockCount();
	}, [] );

	const { selectBlock } = useDispatch( blockEditorStore );
	const selectEditorBlock = useCallback(
		( clientId ) => {
			selectBlock( clientId );
			onSelect( clientId );
		},
		[ selectBlock, onSelect ]
	);
	const [ expandedState, setExpandedState ] = useReducer( expanded, {} );

	const { ref: dropZoneRef, target: blockDropTarget } = useListViewDropZone();
	const elementRef = useRef();
	const treeGridRef = useMergeRefs( [ elementRef, dropZoneRef, ref ] );

	const isMounted = useRef( false );
	useEffect( () => {
		isMounted.current = true;
	}, [] );

	const [ windowMeasurement, setWindowMeasurement ] = useState( {
		maxVisible: 30,
		start: 0,
	} );

	useLayoutEffect( () => {
		if ( ! __experimentalPersistentListViewFeatures ) {
			return;
		}
		const scrollContainer = elementRef.current.parentNode;
		measureWindow( scrollContainer, setWindowMeasurement );
		const measureListOnScroll = throttle( ( event ) => {
			measureWindow( event.target, setWindowMeasurement );
		}, 16 );
		scrollContainer.addEventListener( 'scroll', measureListOnScroll );
		return () => {
			scrollContainer.removeEventListener(
				'scroll',
				measureListOnScroll
			);
		};
	}, [] );

	const expand = useCallback(
		( clientId ) => {
			if ( ! clientId ) {
				return;
			}
			setExpandedState( { type: 'expand', clientId } );
		},
		[ setExpandedState ]
	);
	const collapse = useCallback(
		( clientId ) => {
			if ( ! clientId ) {
				return;
			}
			setExpandedState( { type: 'collapse', clientId } );
		},
		[ setExpandedState ]
	);
	const expandRow = ( row ) => {
		expand( row?.dataset?.block );
	};
	const collapseRow = ( row ) => {
		collapse( row?.dataset?.block );
	};

	const contextValue = useMemo(
		() => ( {
			__experimentalFeatures,
			__experimentalPersistentListViewFeatures,
			isTreeGridMounted: isMounted.current,
			draggedClientIds,
			selectedClientIds,
			expandedState,
			expand,
			collapse,
		} ),
		[
			__experimentalFeatures,
			__experimentalPersistentListViewFeatures,
			isMounted.current,
			draggedClientIds,
			selectedClientIds,
			expandedState,
			expand,
			collapse,
		]
	);
	return (
		<AsyncModeProvider value={ true }>
			<ListViewDropIndicator
				listViewRef={ elementRef }
				blockDropTarget={ blockDropTarget }
			/>
			<TreeGrid
				className="block-editor-list-view-tree"
				aria-label={ __( 'Block navigation structure' ) }
				ref={ treeGridRef }
				onCollapseRow={ collapseRow }
				onExpandRow={ expandRow }
			>
				<ListViewContext.Provider value={ contextValue }>
					<ListViewBranch
						blocks={ clientIdsTree }
						selectBlock={ selectEditorBlock }
						windowMeasurement={ windowMeasurement }
						globalBlockCount={ globalBlockCount }
						{ ...props }
					/>
				</ListViewContext.Provider>
			</TreeGrid>
		</AsyncModeProvider>
	);
}
export default forwardRef( ListView );
