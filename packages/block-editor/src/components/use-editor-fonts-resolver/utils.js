/*
 * Format the font face name to use in the font-family property of a font face.
 *
 * The input can be a string with the font face name or a string with multiple font face names separated by commas.
 * It removes the leading and trailing quotes from the font face name.
 *
 * @param {string} input - The font face name.
 * @return {string} The formatted font face name.
 *
 * Example:
 * formatFontFaceName("Open Sans") => "Open Sans"
 * formatFontFaceName("'Open Sans', sans-serif") => "Open Sans"
 * formatFontFaceName(", 'Open Sans', 'Helvetica Neue', sans-serif") => "Open Sans"
 */
function formatFontFaceName( input ) {
	if ( ! input ) {
		return '';
	}

	let output = input.trim();
	if ( output.includes( ',' ) ) {
		output = output
			.split( ',' )
			// Finds the first item that is not an empty string.
			.find( ( item ) => item.trim() !== '' )
			.trim();
	}
	// Removes leading and trailing quotes.
	output = output.replace( /^["']|["']$/g, '' );

	// Firefox needs the font name to be wrapped in double quotes meanwhile other browsers don't.
	if ( window.navigator.userAgent.toLowerCase().includes( 'firefox' ) ) {
		output = `"${ output }"`;
	}
	return output;
}

/*
 * Loads the font face from a URL and adds it to the browser.
 * It also adds it to the iframe document.
 */
export async function loadFontFaceInBrowser( fontFace, source, documentRef ) {
	if ( typeof source !== 'string' ) {
		return;
	}
	const dataSource = `url(${ source })`;
	const newFont = new window.FontFace(
		formatFontFaceName( fontFace.fontFamily ),
		dataSource,
		{
			style: fontFace.fontStyle,
			weight: fontFace.fontWeight,
		}
	);

	const loadedFace = await newFont.load();

	// Add the font to the ref document.
	documentRef.fonts.add( loadedFace );

	// Add the font to the window document.
	if ( documentRef !== window.document ) {
		window.document.fonts.add( loadedFace );
	}
}
