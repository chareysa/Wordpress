/**
 * Internal dependencies
 */
import * as globalStyles from './components/global-styles';
import { ExperimentalBlockEditorProvider } from './components/provider';
import { lock } from './lock-unlock';
import OffCanvasEditor from './components/off-canvas-editor';
import ResizableBoxPopover from './components/resizable-box-popover';
import { ComposedPrivateInserter as PrivateInserter } from './components/inserter';
import PrivateListView from './components/list-view/private-list-view';
import BlockInfo from './components/block-info-slot-fill';
import { useShouldContextualToolbarShow } from './utils/use-should-contextual-toolbar-show';
import { cleanEmptyObject } from './hooks/utils';

/**
 * Private @wordpress/block-editor APIs.
 */
export const privateApis = {};
lock( privateApis, {
	...globalStyles,
	ExperimentalBlockEditorProvider,
	OffCanvasEditor,
	PrivateInserter,
	PrivateListView,
	ResizableBoxPopover,
	BlockInfo,
	useShouldContextualToolbarShow,
	cleanEmptyObject,
} );
