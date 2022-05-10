/**
 * Internal dependencies
 */
import { blockNames } from './pages/editor-page';
import { backspace, isAndroid, isLocalEnvironment } from './helpers/utils';

describe( 'Gutenberg Editor tests for List block', () => {
	// Prevent regression of https://github.com/wordpress-mobile/gutenberg-mobile/issues/871
	it( 'should handle spaces in a list', async () => {
		await editorPage.addNewBlock( blockNames.list );
		let listBlockElement = await editorPage.getListBlockAtPosition();

		// Send the list item text.
		await editorPage.typeTextToTextBlock( listBlockElement, '  a', false );

		// Send an Enter.
		await editorPage.typeTextToTextBlock( listBlockElement, '\n', false );

		// Click List block on Android.
		// Only needed when testing in local environment
		if ( isAndroid() && isLocalEnvironment() ) {
			await listBlockElement.click();
		}

		// Send a backspace.
		await editorPage.typeTextToTextBlock(
			listBlockElement,
			backspace,
			false
		);

		// There is a delay in Sauce Labs when a key is sent
		// There isn't an element to check as it's being typed into an element that already exists, workaround is to add this wait until there's a better solution
		if ( isAndroid() ) {
			await editorPage.driver.sleep( 1500 );
		}

		// Switch to html and verify html.
		const html = await editorPage.getHtmlContent();

		expect( html.toLowerCase() ).toBe(
			`<!-- wp:list -->
<ul><li>  a</li></ul>
<!-- /wp:list -->`
		);

		// Remove list block to reset editor to clean state.
		listBlockElement = await editorPage.getListBlockAtPosition();
		await listBlockElement.click();
		await editorPage.removeBlockAtPosition( blockNames.list );
	} );
} );
