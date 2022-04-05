/**
 * Internal dependencies
 */
import { blockNames } from './pages/editor-page';
import { isAndroid, clickMiddleOfElement, swipeUp } from './helpers/utils';
import testData from './helpers/test-data';

describe( 'Gutenberg Editor Image Block tests', () => {
	it( 'should be able to add an image block', async () => {
		await editorPage.addNewBlock( blockNames.image );
		await editorPage.closePicker();

		const imageBlock = await editorPage.getBlockAtPosition(
			blockNames.image,
			1,
			{
				useWaitForVisible: true,
			}
		);

		// Can only add image from media library on iOS
		if ( ! isAndroid() ) {
			await editorPage.selectEmptyImageBlock( imageBlock );
			await editorPage.chooseMediaLibrary();

			// Workaround because of #952.
			const titleElement = await editorPage.getTitleElement();
			await clickMiddleOfElement( editorPage.driver, titleElement );
			await editorPage.dismissKeyboard();
			// End workaround.

			await swipeUp( editorPage.driver, imageBlock );
			await editorPage.enterCaptionToSelectedImageBlock(
				testData.imageCaption,
				true
			);
			await editorPage.dismissKeyboard();
		}
		await editorPage.addNewBlock( blockNames.paragraph );

		// Adding this condition to separate iOS and Android, not sure why but this is the combination that works for both platforms.
		const paragraphBlockElement = await editorPage.getTextBlockLocatorAtPosition(
			blockNames.paragraph,
			2
		);

		if ( isAndroid() ) {
			await paragraphBlockElement.click();
		}

		await editorPage.typeTextToParagraphBlock(
			paragraphBlockElement,
			testData.shortText
		);

		// skip HTML check for Android since we couldn't add image from media library
		/* eslint-disable jest/no-conditional-expect */
		if ( ! isAndroid() ) {
			const html = await editorPage.getHtmlContent();

			expect( html.toLowerCase() ).toBe(
				testData.imageShorteHtml.toLowerCase()
			);
		}
		/* eslint-enable jest/no-conditional-expect */
	} );
} );
