/**
 * External dependencies
 */
import { find, map } from 'lodash';
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Provided an array of color objects as set by the theme or by the editor defaults,
 * and the values of the defined color or custom color returns a color object describing the color.
 *
 * @param {Array}   colors       Array of color objects as set by the theme or by the editor defaults.
 * @param {?string} definedColor A string containing the color slug.
 * @param {?string} customColor  A string containing the customColor value.
 *
 * @return {?Object} If definedColor is passed and the name is found in colors,
 *                   the color object exactly as set by the theme or editor defaults is returned.
 *                   Otherwise, an object that just sets the color is defined.
 */
export const getColorObjectByAttributeValues = (
	colors,
	definedColor,
	customColor
) => {
	if ( definedColor ) {
		const colorObj = find( colors, { slug: definedColor } );

		if ( colorObj ) {
			return colorObj;
		}
	}
	return {
		color: customColor,
	};
};

/**
 * Provided an array of color objects as set by the theme or by the editor defaults, and a color value returns the color object matching that value or undefined.
 *
 * @param {Array}   colors     Array of color objects as set by the theme or by the editor defaults.
 * @param {?string} colorValue A string containing the color value.
 *
 * @return {?Object} Color object included in the colors array whose color property equals colorValue.
 *                   Returns undefined if no color object matches this requirement.
 */
export const getColorObjectByColorValue = ( colors, colorValue ) => {
	return find( colors, { color: colorValue } );
};

/**
 * Returns a class based on the context a color is being used and its slug.
 *
 * @param {string} colorContextName Context/place where color is being used e.g: background, text etc...
 * @param {string} colorSlug        Slug of the color.
 *
 * @return {?string} String with the class corresponding to the color in the provided context.
 *                   Returns undefined if either colorContextName or colorSlug are not provided.
 */
export function getColorClassName( colorContextName, colorSlug ) {
	if ( ! colorContextName || ! colorSlug ) {
		return undefined;
	}

	// In the past, we used lodash's kebabCase to process slugs.
	// By doing so, this method also accepted and converted non string values
	// into strings. Some plugins relied on this behavior.
	if ( 'string' !== typeof colorSlug ) {
		colorSlug = String( colorSlug );
		deprecated( 'The color slug should be a string.' );
	}

	// In the past, we used lodash's kebabCase to process slugs.
	// By doing so, this method also stripped special characters
	// such as the # in "#FFFFF". Some plugins relied on this behavior.
	const slug = colorSlug.replace( /[^a-zA-Z0-9\-]/g, '' );
	if ( slug !== colorSlug ) {
		deprecated( 'The color slug should not have any special character.' );
	}

	// We don't want to use kebabCase from lodash here
	// see https://github.com/WordPress/gutenberg/issues/32347
	// However, we need to make sure the generated class
	// doesn't contain spaces.
	return `has-${ slug.replace( /\s+/g, '-' ) }-${ colorContextName.replace(
		/\s+/g,
		'-'
	) }`;
}

/**
 * Given an array of color objects and a color value returns the color value of the most readable color in the array.
 *
 * @param {Array}   colors     Array of color objects as set by the theme or by the editor defaults.
 * @param {?string} colorValue A string containing the color value.
 *
 * @return {string} String with the color value of the most readable color.
 */
export function getMostReadableColor( colors, colorValue ) {
	return tinycolor
		.mostReadable( colorValue, map( colors, 'color' ) )
		.toHexString();
}
