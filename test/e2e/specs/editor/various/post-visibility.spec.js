/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Post visibility', () => {
	const wp = '';
	test.afterEach( async ( { pageUtils } ) => {
		await pageUtils.setBrowserViewport( 'large' );
	} );
	[ 'large', 'small' ].forEach( ( viewport ) => {
		test( `can be changed when the viewport is ${ viewport }`, async ( {
			page,
			admin,
			pageUtils,
			editor,
		} ) => {
			await pageUtils.setBrowserViewport( viewport );

			await admin.createNewPost();

			await editor.openDocumentSettingsSidebar();

			await page.click(
				'.components-button.edit-post-post-visibility__toggle.is-tertiary'
			);

			await page.click( '#editor-post-private-0' );

			await page.click( 'role=button[name="OK"i]' );

			const currentStatus = await page.evaluate( () => {
				return wp.data
					.select( 'core/editor' )
					.getEditedPostAttribute( 'status' );
			} );

			expect( currentStatus ).toBe( 'private' );
		} );

		test( `can be canceled when the viewport is ${ viewport }`, async ( {
			page,
			pageUtils,
			admin,
			editor,
		} ) => {
			await pageUtils.setBrowserViewport( viewport );

			await admin.createNewPost();

			await editor.openDocumentSettingsSidebar();

			const initialStatus = await page.evaluate( () => {
				return wp.data
					.select( 'core/editor' )
					.getEditedPostAttribute( 'status' );
			} );

			await page.click(
				'.components-button.edit-post-post-visibility__toggle.is-tertiary'
			);

			await page.click( '#editor-post-private-0' );

			await page.click( 'role=button[name="Cancel"i]' );

			const currentStatus = await page.evaluate( () => {
				return wp.data
					.select( 'core/editor' )
					.getEditedPostAttribute( 'status' );
			} );

			expect( initialStatus ).toBe( currentStatus );
		} );
	} );

	test( 'visibility remains private even if the publish date is in the future', async ( {
		page,
		admin,
		editor,
	} ) => {
		await admin.createNewPost();

		// Enter a title for this post.
		await page.type( '.editor-post-title__input', 'Title' );

		await editor.openDocumentSettingsSidebar();

		// Set a publish date for the next month.
		await page.click(
			'.components-button.edit-post-post-schedule__toggle.is-tertiary'
		);

		await page.click(
			'div.DayPickerNavigation.DayPickerNavigation_1.DayPickerNavigation__horizontal.DayPickerNavigation__horizontal_2 > div.DayPickerNavigation_button.DayPickerNavigation_button_1.DayPickerNavigation_button__default.DayPickerNavigation_button__default_2.DayPickerNavigation_button__horizontal.DayPickerNavigation_button__horizontal_3.DayPickerNavigation_button__horizontalDefault.DayPickerNavigation_button__horizontalDefault_4.DayPickerNavigation_rightButton__horizontalDefault.DayPickerNavigation_rightButton__horizontalDefault_5'
		);

		await page.click( 'text=15  >> nth=1' );

		await page.click(
			'.components-button.edit-post-post-visibility__toggle.is-tertiary'
		);

		await page.click( '#editor-post-private-0' );

		await page.click( 'role=button[name="OK"i]' );

		// Enter a title for this post.
		await page.type( '.editor-post-title__input', ' Changed' );

		// Wait for the button to be clickable before attempting to click.
		// This could cause errors when we try to click before changes are registered.
		await page.waitForSelector(
			'.editor-post-publish-button[aria-disabled="false"]'
		);
		await page.click( '.editor-post-publish-button' );

		const currentStatus = await page.evaluate( () => {
			return wp.data
				.select( 'core/editor' )
				.getEditedPostAttribute( 'status' );
		} );

		expect( currentStatus ).toBe( 'private' );
	} );
} );
