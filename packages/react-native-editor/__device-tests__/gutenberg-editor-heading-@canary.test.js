/**
 * Internal dependencies
 */
import { blockNames } from './pages/editor-page';
import { isAndroid } from './helpers/utils';
import testData from './helpers/test-data';

describe( 'Gutenberg Editor tests', () => {
	it( 'should be able to create a post with heading and paragraph blocks', async () => {
		await editorPage.addNewBlock( blockNames.heading );
		let headingBlockElement = await editorPage.getBlockAtPosition(
			blockNames.heading,
			1,
			{
				useWaitForVisible: true,
			}
		);
		if ( isAndroid() ) {
			await headingBlockElement.click();
		}
		await editorPage.sendTextToHeadingBlock(
			headingBlockElement,
			testData.heading,
			false
		);

		await editorPage.addNewBlock( blockNames.paragraph );
		const firstBlockElement = await editorPage.getTextBlockLocatorAtPosition(
			blockNames.paragraph,
			2
		);

		await editorPage.typeTextToParagraphBlock(
			firstBlockElement,
			testData.mediumText
		);

		await editorPage.addNewBlock( blockNames.paragraph );
		const secondBlockElement = await editorPage.getTextBlockLocatorAtPosition(
			blockNames.paragraph,
			3
		);

		await editorPage.typeTextToParagraphBlock(
			secondBlockElement,
			testData.mediumText
		);

		await editorPage.addNewBlock( blockNames.heading );
		headingBlockElement = await editorPage.getTextBlockLocatorAtPosition(
			blockNames.heading,
			4
		);

		await editorPage.typeTextToParagraphBlock(
			headingBlockElement,
			testData.heading
		);

		await editorPage.addNewBlock( blockNames.paragraph );
		const thirdBlockElement = await editorPage.getTextBlockLocatorAtPosition(
			blockNames.paragraph,
			5
		);

		await editorPage.typeTextToParagraphBlock(
			thirdBlockElement,
			testData.mediumText
		);
	} );
} );
