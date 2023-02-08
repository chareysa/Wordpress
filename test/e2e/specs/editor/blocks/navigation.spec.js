/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe(
	'As a user I want the navigation block to fallback to the best possible default',
	() => {
		test.beforeAll( async ( { requestUtils } ) => {
			//TT3 is preferable to emptytheme because it already has the navigation block on its templates.
			await requestUtils.activateTheme( 'twentytwentythree' );
		} );

		test.beforeEach( async ( { admin, requestUtils } ) => {
			await Promise.all( [
				requestUtils.deleteAllNavigationMenus(),
				admin.createNewPost(),
			] );
		} );

		test.afterAll( async ( { requestUtils } ) => {
			await Promise.all( [
				requestUtils.deleteAllNavigationMenus(),
				requestUtils.activateTheme( 'twentytwentyone' ),
			] );
		} );

		test.afterEach( async ( { requestUtils } ) => {
			await requestUtils.deleteAllPosts();
		} );

		test( 'default to a list of pages if there are no menus', async ( {
			editor,
		} ) => {
			await editor.insertBlock( { name: 'core/navigation' } );

			const pageListBlock = editor.canvas.getByRole( 'document', {
				name: 'Block: Page List',
			} );

			await expect( pageListBlock ).toBeVisible( {
				// Wait for the Nav and Page List block API requests to resolve.
				// Note: avoid waiting on network requests as these are not perceivable
				// to the user.
				// See: https://github.com/WordPress/gutenberg/pull/45070#issuecomment-1373712007.
				timeout: 10000,
			} );

			// Check the markup of the block is correct.
			await editor.publishPost();
			const content = await editor.getEditedPostContent();
			expect( content ).toBe(
				`<!-- wp:navigation -->
<!-- wp:page-list /-->
<!-- /wp:navigation -->`
			);
		} );

		test( 'default to my only existing menu', async ( {
			editor,
			page,
			requestUtils,
		} ) => {
			const createdMenu = await requestUtils.createNavigationMenu( {
				title: 'Test Menu 1',
				content:
					'<!-- wp:navigation-link {"label":"WordPress","type":"custom","url":"http://www.wordpress.org/","kind":"custom","isTopLevelLink":true} /-->',
			} );

			await editor.insertBlock( { name: 'core/navigation' } );

			//check the block in the canvas.
			await expect(
				editor.canvas.locator(
					'role=textbox[name="Navigation link text"i] >> text="WordPress"'
				)
			).toBeVisible();

			// Check the markup of the block is correct.
			await editor.publishPost();
			await expect.poll( editor.getBlocks ).toMatchObject( [
				{
					name: 'core/navigation',
					attributes: { ref: createdMenu.id },
				},
			] );
			await page.locator( 'role=button[name="Close panel"i]' ).click();

			//check the block in the frontend.
			await page.goto( '/' );
			await expect(
				page.locator(
					'role=navigation >> role=link[name="WordPress"i]'
				)
			).toBeVisible();
		} );
	}
);
