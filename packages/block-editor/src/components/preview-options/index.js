/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import {
	__experimentalUseSlot as useSlot,
	createSlotFill,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';

const {
	Fill: PluginPreviewMenuFill,
	Slot: PluginPreviewMenuSlot,
} = createSlotFill( 'PluginPreviewOptionsMenu' );

export { PluginPreviewMenuFill };

/**
 * An array of strings that represent `deviceType` values that belong to the
 * block editor core system.
 *
 * When the `deviceType` returned by `__experimentalGetPreviewDeviceType()`, is
 * one of these values, the built-in `VisualEditor` is responsible for rendering
 * a preview of that type.
 *
 * When the `deviceType` is something other than one of the `coreDeviceTypes`,
 * we are rendering a custom preview registered by the
 * `<PluginPreviewMenuItem />` and `<PluginPreview />` components, and defer to
 * a `<Slot />` filled by the plugin to draw the preview.
 *
 * @type {Array}
 */
export const coreDeviceTypes = [ 'Desktop', 'Tablet', 'Mobile' ];

export default function PreviewOptions( {
	children,
	className,
	isEnabled = true,
	deviceType,
	setDeviceType,
} ) {
	const slot = useSlot( PluginPreviewMenuSlot.__unstableName );
	const isMobile = useViewportMatch( 'small', '<' );
	if ( isMobile ) return null;

	const popoverProps = {
		className: classnames(
			className,
			'block-editor-post-preview__dropdown-content'
		),
		position: 'bottom left',
	};
	const toggleProps = {
		variant: 'tertiary',
		className: 'block-editor-post-preview__button-toggle',
		disabled: ! isEnabled,
		/* translators: button label text should, if possible, be under 16 characters. */
		children: __( 'Preview' ),
	};
	return (
		<DropdownMenu
			className="block-editor-post-preview__dropdown"
			popoverProps={ popoverProps }
			toggleProps={ toggleProps }
			icon={ null }
		>
			{ () => (
				<>
					<MenuGroup>
						<MenuItem
							className="block-editor-post-preview__button-resize"
							onClick={ () => setDeviceType( 'Desktop' ) }
							icon={ deviceType === 'Desktop' && check }
						>
							{ __( 'Desktop' ) }
						</MenuItem>
						<MenuItem
							className="block-editor-post-preview__button-resize"
							onClick={ () => setDeviceType( 'Tablet' ) }
							icon={ deviceType === 'Tablet' && check }
						>
							{ __( 'Tablet' ) }
						</MenuItem>
						<MenuItem
							className="block-editor-post-preview__button-resize"
							onClick={ () => setDeviceType( 'Mobile' ) }
							icon={ deviceType === 'Mobile' && check }
						>
							{ __( 'Mobile' ) }
						</MenuItem>
					</MenuGroup>

					{ slot?.fills?.length && (
						<MenuGroup>
							<PluginPreviewMenuSlot
								fillProps={ {
									deviceType,
									setDeviceType,
								} }
							/>
						</MenuGroup>
					) }

					{ children }
				</>
			) }
		</DropdownMenu>
	);
}
