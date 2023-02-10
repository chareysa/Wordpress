/**
 * Internal dependencies
 */
import * as globalStyles from './components/global-styles';
import { ExperimentalBlockEditorProvider } from './components/provider';
import { lock } from './lock-unlock';

/**
 * Experimental @wordpress/block-editor APIs.
 */
export const privateApis = {};
lock( privateApis, {
	...globalStyles,
	ExperimentalBlockEditorProvider,
} );
