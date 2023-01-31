/**
 * External dependencies
 */
import type { RefObject } from 'react';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import a11yPlugin from 'colord/plugins/a11y';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ColorObject, ColorPaletteProps, PaletteObject } from './types';

extend( [ namesPlugin, a11yPlugin ] );

export const extractColorNameFromCurrentValue = (
	currentValue?: ColorPaletteProps[ 'value' ],
	colors: ColorPaletteProps[ 'colors' ] = [],
	showMultiplePalettes: boolean = false
) => {
	if ( ! currentValue ) {
		return '';
	}

	const currentValueIsCssVariable = /^var\(/.test( currentValue );
	const normalizedCurrentValue = currentValueIsCssVariable
		? currentValue
		: colord( currentValue ).toHex();

	// Normalize format of `colors` to simplify the following loop
	type normalizedPaletteObject = { colors: ColorObject[] };
	const colorPalettes: normalizedPaletteObject[] = showMultiplePalettes
		? ( colors as PaletteObject[] )
		: [ { colors: colors as ColorObject[] } ];
	for ( const { colors: paletteColors } of colorPalettes ) {
		for ( const { name: colorName, color: colorValue } of paletteColors ) {
			const normalizedColorValue = currentValueIsCssVariable
				? colorValue
				: colord( colorValue ).toHex();

			if ( normalizedCurrentValue === normalizedColorValue ) {
				return colorName;
			}
		}
	}

	// translators: shown when the user has picked a custom color (i.e not in the palette of colors).
	return __( 'Custom' );
};

export const showTransparentBackground = ( currentValue?: string ) => {
	if ( typeof currentValue === 'undefined' ) {
		return true;
	}
	return colord( currentValue ).alpha() === 0;
};

// The PaletteObject type has a `colors` property (an array of ColorObject),
// while the ColorObject type has a `color` property (the CSS color value).
export const isMultiplePaletteObject = (
	obj: PaletteObject | ColorObject
): obj is PaletteObject =>
	Array.isArray( ( obj as PaletteObject ).colors ) && ! ( 'color' in obj );

export const isMultiplePaletteArray = (
	arr: ( PaletteObject | ColorObject )[]
): arr is PaletteObject[] => {
	return (
		arr.length > 0 &&
		arr.every( ( colorObj ) => isMultiplePaletteObject( colorObj ) )
	);
};

export const normalizeColorValue = (
	value: string | undefined,
	ref: RefObject< HTMLElement > | null
) => {
	const currentValueIsCssVariable = /^var\(/.test( value ?? '' );

	if ( ! currentValueIsCssVariable || ! ref?.current ) {
		return value;
	}

	const { ownerDocument } = ref.current;
	const { defaultView } = ownerDocument;
	const computedBackgroundColor = defaultView?.getComputedStyle(
		ref.current
	).backgroundColor;

	return computedBackgroundColor
		? colord( computedBackgroundColor ).toHex()
		: value;
};
