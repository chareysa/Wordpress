/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useReducedMotion } from '@wordpress/compose';
import { __unstableMotion as motion } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import BlockPopover from './index';

const animateVariants = {
	hide: { opacity: 0, scaleY: 0.75 },
	show: { opacity: 1, scaleY: 1 },
	exit: { opacity: 0, scaleY: 0.9 },
};

function BlockPopoverDropZone( {
	__unstablePopoverSlot,
	__unstableContentRef,
} ) {
	const { clientId } = useSelect( ( select ) => {
		const { getBlockOrder, getBlockInsertionPoint } =
			select( blockEditorStore );
		const insertionPoint = getBlockInsertionPoint();
		const order = getBlockOrder( insertionPoint.rootClientId );

		if ( ! order.length ) {
			return {};
		}

		return {
			clientId: order[ insertionPoint.index ],
		};
	}, [] );
	const reducedMotion = useReducedMotion();

	return (
		<BlockPopover
			clientId={ clientId }
			__unstableCoverTarget
			__unstablePopoverSlot={ __unstablePopoverSlot }
			__unstableContentRef={ __unstableContentRef }
			className="block-editor-block-popover__drop-zone"
		>
			<motion.div
				data-testid="block-popover-drop-zone"
				initial={
					reducedMotion ? animateVariants.show : animateVariants.hide
				}
				animate={ animateVariants.show }
				exit={
					reducedMotion ? animateVariants.show : animateVariants.exit
				}
				className="block-editor-block-popover__drop-zone-foreground"
			/>
		</BlockPopover>
	);
}

export default BlockPopoverDropZone;
