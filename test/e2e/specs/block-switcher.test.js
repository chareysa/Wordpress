/**
 * Internal dependencies
 */
import {
	hasBlockSwitcher,
	getAvailableBlockTransforms,
	newPost,
	insertBlock,
	pressWithModifier,
} from '../support/utils';

describe( 'adding blocks', () => {
	beforeEach( async () => {
		await newPost();
	} );

	it( 'Should show the expected block transforms on the list block when the blocks are removed', async () => {
		// Inserting a list block.
		await insertBlock( 'List' );
		await page.keyboard.type( 'List content' );
		await pressWithModifier( 'alt', 'F10' );

		// The block switcher exists.
		expect( await hasBlockSwitcher() ).toBeTruthy();
		// The expected transforms appear.
		expect(
			await getAvailableBlockTransforms()
		).toEqual( [
			'Paragraph',
			'Quote',
		] );
	} );

	it( 'Should show the expected block transforms on the list block when the quote block is removed', async () => {
		// Remove quote block
		await page.evaluate( () => {
			wp.blocks.unregisterBlockType( 'core/quote' );
		} );

		// Inserting a list block
		await insertBlock( 'List' );
		await page.keyboard.type( 'List content' );
		await pressWithModifier( 'alt', 'F10' );

		// The block switcher exists.
		expect( await hasBlockSwitcher() ).toBeTruthy();
		// The expected transforms appear.
		expect(
			await getAvailableBlockTransforms()
		).toEqual( [
			'Paragraph',
		] );
	} );

	it( 'Should not show the block switcher if all the blocks the list block transforms into are removed', async () => {
		// Remove blocks
		await page.evaluate( () => {
			( [
				'core/quote',
				'core/paragraph',
			] ).map( ( block ) => wp.blocks.unregisterBlockType( block ) );
		} );

		// Inserting a list block
		await insertBlock( 'List' );
		await page.keyboard.type( 'List content' );
		await pressWithModifier( 'alt', 'F10' );

		// The block switcher exists.
		expect( await hasBlockSwitcher() ).toBeFalsy();
		// The expected transforms appear.
		expect(
			await getAvailableBlockTransforms()
		).toHaveLength( 0 );
	} );
} );
