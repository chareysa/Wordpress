/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Register block type hooks', () => {
	test.beforeEach( async ( { requestUtils, admin } ) => {
		await requestUtils.activatePlugin(
			'gutenberg-test-register-block-type-hooks'
		);
		await admin.visitPostEditor();
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin(
			'gutenberg-test-register-block-type-hooks'
		);
	} );

	test( 'has a custom category for Paragraph block', async ( { page } ) => {
		await page.click( 'role=button[name="Toggle block inserter"i]' );

		expect(
			page.locator(
				'role=listbox[name="Widgets"i] >> role=option[name="Paragraph"i]'
			)
		).toBeDefined();
	} );
} );
