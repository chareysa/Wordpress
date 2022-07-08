/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@wordpress/e2e-test-utils-playwright').RequestUtils} RequestUtils
 */

test.describe( 'Comments', () => {
	let previousPageComments,
		previousCommentsPerPage,
		previousDefaultCommentsPage;

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'emptytheme' );
	} );

	test.beforeEach( async ( { admin } ) => {
		// Ideally, we'd set options in beforeAll. Unfortunately, these
		// aren't exposed via the REST API, so we have to set them through the
		// relevant wp-admin screen, which involves page utils; but those are
		// prohibited from beforeAll.
		previousPageComments = await admin.setOption( 'page_comments', '1' );
		previousCommentsPerPage = await admin.setOption(
			'comments_per_page',
			'1'
		);
		previousDefaultCommentsPage = await admin.setOption(
			'default_comments_page',
			'newest'
		);
	} );

	test( 'We show no results message if there are no comments', async ( {
		admin,
		editor,
		page,
		requestUtils,
	} ) => {
		await requestUtils.deleteAllComments();
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/comments-query-loop' } );
		await page.waitForSelector(
			'xpath=//p[contains(text(), "No results found.")]'
		);
	} );

	test( 'Pagination links are working as expected', async ( {
		admin,
		editor,
		page,
		pageUtils,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/comments-query-loop' } );
		await editor.publishPost();
		// Visit the post that was just published.
		await page.click(
			'role=region[name="Editor publish"i] >> "View Post"'
		);

		// TODO: We can extract this into a util once we find we need it elsewhere.
		// Create three comments for that post.
		for ( let i = 0; i < 3; i++ ) {
			await page.waitForSelector( 'textarea#comment' );
			await page.click( 'textarea#comment' );
			await page.type(
				`textarea#comment`,
				`This is an automated comment - ${ i }`
			);
			await pageUtils.pressKeyTimes( 'Tab', 1 );
			await Promise.all( [
				page.keyboard.press( 'Enter' ),
				page.waitForNavigation( { waitUntil: 'networkidle0' } ),
			] );
		}

		// We check that there is a previous comments page link.
		await expect(
			await page.locator( '.wp-block-comments-pagination-previous' )
		).toHaveCount( 1 );
		await expect(
			await page.locator( '.wp-block-comments-pagination-next' )
		).toHaveCount( 0 );

		await Promise.all( [
			page.click( '.wp-block-comments-pagination-previous' ),
			page.waitForNavigation( { waitUntil: 'networkidle0' } ),
		] );

		// We check that there are a previous and a next link.
		await expect(
			await page.locator( '.wp-block-comments-pagination-previous' )
		).toHaveCount( 1 );
		await expect(
			await page.locator( '.wp-block-comments-pagination-next' )
		).toHaveCount( 1 );

		await Promise.all( [
			page.click( '.wp-block-comments-pagination-previous' ),
			page.waitForNavigation( { waitUntil: 'networkidle0' } ),
		] );

		// We check that there is only have a next link
		await expect(
			await page.locator( '.wp-block-comments-pagination-previous' )
		).toHaveCount( 0 );
		await expect(
			await page.locator( '.wp-block-comments-pagination-next' )
		).toHaveCount( 1 );
	} );
	test( 'Pagination links are not appearing if break comments is not enabled', async ( {
		admin,
		editor,
		page,
		pageUtils,
	} ) => {
		await admin.setOption( 'page_comments', '0' );
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/comments-query-loop' } );
		await editor.publishPost();

		// Visit the post that was just published.
		await page.click(
			'role=region[name="Editor publish"i] >> "View Post"'
		);

		// Create three comments for that post.
		for ( let i = 0; i < 3; i++ ) {
			await page.waitForSelector( 'textarea#comment' );
			await page.click( 'textarea#comment' );
			await page.type(
				`textarea#comment`,
				`This is an automated comment - ${ i }`
			);
			await pageUtils.pressKeyTimes( 'Tab', 1 );
			await Promise.all( [
				page.keyboard.press( 'Enter' ),
				page.waitForNavigation( { waitUntil: 'networkidle0' } ),
			] );
		}
		// We check that there are no comments page link.
		await expect(
			await page.locator( '.wp-block-comments-pagination-previous' )
		).toHaveCount( 0 );
		await expect(
			await page.locator( '.wp-block-comments-pagination-next' )
		).toHaveCount( 0 );
	} );

	test.afterEach( async ( { admin } ) => {
		// Ideally, we'd set options in afterAll. Unfortunately, these
		// aren't exposed via the REST API, so we have to set them through the
		// relevant wp-admin screen, which involves page utils; but those are
		// prohibited from beforeAll.
		await admin.setOption( 'page_comments', previousPageComments );
		await admin.setOption( 'comments_per_page', previousCommentsPerPage );
		await admin.setOption(
			'default_comments_page',
			previousDefaultCommentsPage
		);
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllComments();
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );
} );
