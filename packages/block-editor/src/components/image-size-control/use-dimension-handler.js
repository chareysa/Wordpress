/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

export default function useDimensionHandler(
	customHeight,
	customWidth,
	defaultHeight,
	defaultWidth,
	onChange
) {
	const [ currentWidth, setCurrentWidth ] = useState(
		customWidth ?? defaultWidth ?? ''
	);
	const [ currentHeight, setCurrentHeight ] = useState(
		customHeight ?? defaultHeight ?? ''
	);

	// When an image is first inserted, the default dimensions are initially
	// undefined. This effect updates the dimensions when the default values
	// come through.
	useEffect( () => {
		if ( customWidth === undefined && defaultWidth !== undefined ) {
			setCurrentWidth( defaultWidth );
		}
		if ( customHeight === undefined && defaultHeight !== undefined ) {
			setCurrentHeight( defaultHeight );
		}
	}, [ defaultWidth, defaultHeight ] );

	// if custom values change, it means an outsider has resized the image using some other method (eg resize box)
	// we should keep track of these values too. We need to parse them before comparing them as well as they can be strings.
	useEffect( () => {
		if (
			customWidth !== undefined &&
			Number.parseInt( customWidth ) !== Number.parseInt( defaultWidth )
		) {
			setCurrentWidth( customWidth );
		}
		if (
			customHeight !== undefined &&
			Number.parseInt( customHeight ) !== Number.parseInt( defaultHeight )
		) {
			setCurrentHeight( customHeight );
		}
	}, [ customWidth, customHeight ] );

	const updateDimension = ( dimension, value ) => {
		if ( dimension === 'width' ) {
			setCurrentWidth( value );
		} else {
			setCurrentHeight( value );
		}
		onChange( {
			[ dimension ]: value === '' ? undefined : parseInt( value, 10 ),
		} );
	};

	const updateDimensions = ( nextHeight, nextWidth ) => {
		setCurrentHeight( nextHeight ?? defaultHeight );
		setCurrentWidth( nextWidth ?? defaultWidth );
		onChange( { height: nextHeight, width: nextWidth } );
	};

	return {
		currentHeight,
		currentWidth,
		updateDimension,
		updateDimensions,
	};
}
