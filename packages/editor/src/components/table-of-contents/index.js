/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { info } from '@wordpress/icons';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TableOfContentsPanel from './panel';

function TableOfContents(
	{ hasOutlineItemsDisabled, repositionDropdown, ...props },
	ref
) {
	const hasBlocks = useSelect(
		( select ) => !! select( 'core/block-editor' ).getBlockCount(),
		[]
	);
	return (
		<Dropdown
			position={ repositionDropdown ? 'middle right right' : 'bottom' }
			className="table-of-contents"
			contentClassName="table-of-contents__popover"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					{ ...props }
					ref={ ref }
					onClick={ hasBlocks ? onToggle : undefined }
					icon={ info }
					aria-expanded={ isOpen }
					label={ __( 'Outline' ) }
					tooltipPosition="bottom"
					aria-disabled={ ! hasBlocks }
				/>
			) }
			renderContent={ ( { onClose } ) => (
				<TableOfContentsPanel
					onRequestClose={ onClose }
					hasOutlineItemsDisabled={ hasOutlineItemsDisabled }
				/>
			) }
		/>
	);
}

export default forwardRef( TableOfContents );
