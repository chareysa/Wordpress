/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ScreenHeader from './header';
import { useCanCustomizeColor } from './hooks';
import ScreenElementColorpicker from './screen-element-colorpicker';

function ScreenButtonColor( { name } ) {
	const canCustomize = useCanCustomizeColor(
		name,
		'color.background',
		'buttonColor'
	);

	if ( ! canCustomize ) {
		return null;
	}

	return (
		<>
			<ScreenHeader
				title={ __( 'Buttons' ) }
				description={ __(
					'Set the default colors used for buttons across the site.'
				) }
			/>

			<h4 className="edit-site-global-styles-section-title">
				{ __( 'Text color' ) }
			</h4>

			<ScreenElementColorpicker
				name={ name }
				element="button"
				path="elements.button.color.text"
			/>

			<h4 className="edit-site-global-styles-section-title">
				{ __( 'Background color' ) }
			</h4>

			<ScreenElementColorpicker
				name={ name }
				element="button"
				path="elements.button.color.background"
			/>
		</>
	);
}

export default ScreenButtonColor;
