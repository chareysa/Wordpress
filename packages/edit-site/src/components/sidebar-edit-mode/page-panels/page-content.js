/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { PAGE_CONTENT_BLOCK_TYPES } from '../../page-content-focus/constants';
import { unlock } from '../../../private-apis';

const { BlockQuickNavigation } = unlock( blockEditorPrivateApis );

export default function PageContent() {
	const clientIds = useSelect(
		( select ) =>
			select( blockEditorStore ).__experimentalGetGlobalBlocksByName(
				PAGE_CONTENT_BLOCK_TYPES
			),
		[]
	);
	return <BlockQuickNavigation clientIds={ clientIds } />;
}
