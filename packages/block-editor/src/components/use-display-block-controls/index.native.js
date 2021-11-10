/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { hasBlockSupport } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { useBlockEditContext } from '../block-edit/context';
import { store as blockEditorStore } from '../../store';

export default function useDisplayBlockControls() {
	const { isSelected, clientId, name } = useBlockEditContext();
	return useSelect(
		( select ) => {
			const { getBlockName, getBlockRootClientId } = select(
				blockEditorStore
			);

			const parentId = getBlockRootClientId( clientId );
			const parentBlockName = getBlockName( parentId );

			const displayControls = hasBlockSupport(
				parentBlockName,
				'__experimentalExposeControlsToChildren',
				true
			);

			if ( displayControls && isSelected ) {
				return true;
			}

			return false;
		},
		[ clientId, isSelected, name ]
	);
}
