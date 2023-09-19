/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Site editor title', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'emptytheme' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test( 'displays the selected template name in the title for the index template', async ( {
		admin,
		page,
	} ) => {
		// Navigate to a template.
		await admin.visitSiteEditor( {
			postId: 'emptytheme//index',
			postType: 'wp_template',
			canvas: 'edit',
		} );
		const title = page.locator(
			'role=region[name="Editor top bar"i] >> role=heading[level=1]'
		);

		await expect( title ).toHaveText( 'Editing template:Index' );
	} );

	test( 'displays the selected template name in the title for the header template', async ( {
		admin,
		page,
	} ) => {
		// Navigate to a template part.
		await admin.visitSiteEditor( {
			postId: 'emptytheme//header',
			postType: 'wp_template_part',
			canvas: 'edit',
		} );
		const title = page.locator(
			'role=region[name="Editor top bar"i] >> role=heading[level=1]'
		);

		await expect( title ).toHaveText( 'Editing template part:header' );
	} );
} );
