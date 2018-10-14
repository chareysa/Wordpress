/**
 * Internal dependencies
 */
import {
	getEditedPostContent,
	newPost,
	insertBlock,
} from '../support/utils';

describe( 'Code block', () => {
	beforeEach( async () => {
		await newPost();
	} );

	it( 'should convert to a preformatted block', async () => {
		const code = 'print "Hello Dolly!"';

		await insertBlock( 'Code' );

		await page.type( '.editor-block-list__block textarea', code );

		// Verify the content starts out as a Code block.
		const originalPostContent = await getEditedPostContent();
		expect( originalPostContent ).toMatchSnapshot();

		// Hover over this block to show its toolbar so we can click on the block
		// conversion button.
		const insertionPoint = await page.$( '.editor-block-list__block-edit' );
		const rect = await insertionPoint.boundingBox();
		await page.mouse.move( rect.x + ( rect.width / 2 ), rect.y + ( rect.height / 2 ), { steps: 10 } );

		// Convert this block to a Preformatted block.
		await page.click( '.editor-block-switcher__toggle' );
		await page.click( '.editor-block-types-list__item[aria-label="Preformatted"]' );

		// The content should now be a Preformatted block with no data loss.
		const convertedPostContent = await getEditedPostContent();
		expect( convertedPostContent ).toMatchSnapshot();
	} );
} );
