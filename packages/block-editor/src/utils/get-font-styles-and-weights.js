/**
 * WordPress dependencies
 */
import { _x, __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { formatFontStyle } from './format-font-style';
import { formatFontWeight } from './format-font-weight';

const FONT_STYLES = [
	{
		name: _x( 'Regular', 'font style' ),
		value: 'normal',
	},
	{
		name: _x( 'Italic', 'font style' ),
		value: 'italic',
	},
];

const FONT_WEIGHTS = [
	{
		name: _x( 'Thin', 'font weight' ),
		value: '100',
	},
	{
		name: _x( 'Extra Light', 'font weight' ),
		value: '200',
	},
	{
		name: _x( 'Light', 'font weight' ),
		value: '300',
	},
	{
		name: _x( 'Regular', 'font weight' ),
		value: '400',
	},
	{
		name: _x( 'Medium', 'font weight' ),
		value: '500',
	},
	{
		name: _x( 'Semi Bold', 'font weight' ),
		value: '600',
	},
	{
		name: _x( 'Bold', 'font weight' ),
		value: '700',
	},
	{
		name: _x( 'Extra Bold', 'font weight' ),
		value: '800',
	},
	{
		name: _x( 'Black', 'font weight' ),
		value: '900',
	},
];

/**
 * Builds a list of font style and weight options based on font family faces.
 * Defaults to the standard font styles and weights if no font family faces are provided.
 *
 * @param {Array} fontFamilyFaces font family faces array
 * @return {Object} new object with combined and separated font style and weight properties
 */
export function getFontStylesAndWeights( fontFamilyFaces ) {
	let fontStyles = [];
	let fontWeights = [];
	const combinedStyleAndWeightOptions = [];
	const isSystemFont = ! fontFamilyFaces || fontFamilyFaces?.length === 0;
	let isVariableFont = false;

	fontFamilyFaces?.forEach( ( face ) => {
		const fontWeight = formatFontWeight( face.fontWeight );
		const fontStyle = formatFontStyle( face.fontStyle );

		// Check if font weight includes a space that is not at the start or end of the string. If so, it must be a variable font. e.g. "100 900"
		if ( /\s/.test( fontWeight.value.trim() ) ) {
			isVariableFont = true;
			fontWeight.value = fontWeight.value.replace( /\s+/g, '-' );
			// TODO: Handle variable weights and styles.
		}

		// Create font style and font weight lists without duplicates.
		if ( fontStyle ) {
			if (
				! fontStyles.some(
					( style ) => style.value === fontStyle.value
				)
			) {
				fontStyles.push( fontStyle );
			}
		}
		if ( fontWeight ) {
			if (
				! fontWeights.some(
					( weight ) => weight.value === fontWeight.value
				)
			) {
				fontWeights.push( fontWeight );
			}
		}
	} );

	// If there is no font weight of 700, then include faux bold as an option.
	if ( ! fontWeights.some( ( weight ) => weight.value === '700' ) ) {
		fontWeights.push( {
			name: _x( 'Bold', 'font weight' ),
			value: '700',
		} );
	}

	// If there is no italic font style, then include faux italic as an option.
	if ( ! fontStyles.some( ( style ) => style.value === 'italic' ) ) {
		fontStyles.push( {
			name: _x( 'Italic', 'font style' ),
			value: 'italic',
		} );
	}

	// Use default font styles and weights for system and variable fonts.
	if ( isSystemFont || isVariableFont ) {
		fontStyles = FONT_STYLES;
		fontWeights = FONT_WEIGHTS;
	}

	// Use default styles and weights if there are no available styles or weights from the provided font faces.
	fontStyles = fontStyles.length === 0 ? FONT_STYLES : fontStyles;
	fontWeights = fontWeights.length === 0 ? FONT_WEIGHTS : fontWeights;

	// Generate combined font style and weight options for available fonts.
	fontStyles.forEach( ( { name: styleName, value: styleValue } ) => {
		fontWeights.forEach( ( { name: weightName, value: weightValue } ) => {
			const optionName =
				styleValue === 'normal'
					? weightName
					: sprintf(
							/* translators: 1: Font weight name. 2: Font style name. */
							__( '%1$s %2$s' ),
							weightName,
							styleName
					  );

			combinedStyleAndWeightOptions.push( {
				key: `${ styleValue }-${ weightValue }`,
				name: optionName,
				style: {
					fontStyle: styleValue,
					fontWeight: weightValue,
				},
			} );
		} );
	} );

	return {
		fontStyles,
		fontWeights,
		combinedStyleAndWeightOptions,
		isSystemFont,
		isVariableFont,
	};
}
