/**
 * External dependencies
 */
import { parse } from 'url';

/**
 * Internal dependencies
 */
import {
	newPost,
	getUrl,
	publishPost,
} from '../support/utils';

describe( 'Preview', () => {
	beforeEach( async () => {
		await newPost();
	} );

	/**
	 * Clicks the preview button and returns the generated preview window page,
	 * either the newly created tab or the redirected existing target. This is
	 * required because Chromium infuriatingly disregards same target name in
	 * specific undetermined circumstances, else our efforts to reuse the same
	 * popup have been fruitless and exhausting. It is worth exploring further,
	 * perhaps considering factors such as origin of the interstitial page (the
	 * about:blank placeholder screen), or whether the preview link default
	 * behavior is used / prevented by the display of the popup window of the
	 * same target name. Resolves only once the preview page has finished
	 * loading.
	 *
	 * @param {Promise} editorPage   Editor's page.
	 * @param {Page} lastPreviewPage Last preview page.
	 *
	 * @return {Promise} Promise resolving with focused, loaded preview page.
	 */
	async function getOpenedPreviewPage( editorPage, lastPreviewPage ) {
		const eventHandlers = [];

		const race = [
			new Promise( ( resolve ) => {
				async function onBrowserTabOpened( target ) {
					const targetPage = await target.page();
					if ( targetPage.url() === 'about:blank' ) {
						await targetPage.waitForNavigation();
					}
					if ( lastPreviewPage ) {
						// If a new preview tab is opened and there was a previous one, close
						// the previous tab.
						lastPreviewPage.close();
					}
					resolve( targetPage );
				}
				browser.once( 'targetcreated', onBrowserTabOpened );
				eventHandlers.push( [ browser, 'targetcreated', onBrowserTabOpened ] );
			} ),
		];

		if ( lastPreviewPage ) {
			race.push( new Promise( async ( resolve ) => {
				async function onLastPreviewPageLoaded() {
					await lastPreviewPage.reload();
					resolve( lastPreviewPage );
				}
				lastPreviewPage.once( 'load', onLastPreviewPageLoaded );
				eventHandlers.push( [ lastPreviewPage, 'load', onLastPreviewPageLoaded ] );
			} ) );
		}

		editorPage.click( '.editor-post-preview' );

		// The preview page is whichever of the two resolves first:
		//  - A new tab has opened.
		//  - An existing tab is reused and navigates.
		const previewPage = await Promise.race( race );

		if ( lastPreviewPage ) {
			expect( previewPage ).toBe( lastPreviewPage );
		}

		// Since there may be lingering event handlers from whichever of the
		// race candidates had lost, remove all handlers.
		eventHandlers.forEach( ( [ target, event, handler ] ) => {
			target.removeListener( event, handler );
		} );

		previewPage.bringToFront();

		return previewPage;
	}

	it( 'Should open a preview window for a new post', async () => {
		const editorPage = page;
		let previewPage;

		// Disabled until content present.
		const isPreviewDisabled = await editorPage.$$eval(
			'.editor-post-preview:not( :disabled )',
			( enabledButtons ) => ! enabledButtons.length,
		);
		expect( isPreviewDisabled ).toBe( true );

		await editorPage.type( '.editor-post-title__input', 'Hello World' );

		previewPage = await getOpenedPreviewPage( editorPage );

		// When autosave completes for a new post, the URL of the editor should
		// update to include the ID. Use this to assert on preview URL.
		const [ , postId ] = await ( await editorPage.waitForFunction( () => {
			return window.location.search.match( /[\?&]post=(\d+)/ );
		} ) ).jsonValue();

		let expectedPreviewURL = getUrl( '', `?p=${ postId }&preview=true` );
		expect( previewPage.url() ).toBe( expectedPreviewURL );

		// Title in preview should match input.
		let previewTitle = await previewPage.$eval( '.entry-title', ( node ) => node.textContent );
		expect( previewTitle ).toBe( 'Hello World' );

		// Return to editor to change title.
		await editorPage.bringToFront();
		await editorPage.type( '.editor-post-title__input', '!' );
		previewPage = await getOpenedPreviewPage( editorPage, previewPage );

		// Title in preview should match updated input.
		previewTitle = await previewPage.$eval( '.entry-title', ( node ) => node.textContent );
		expect( previewTitle ).toBe( 'Hello World!' );

		// Pressing preview without changes should bring same preview window to
		// front and reload, but should not show interstitial.
		await editorPage.bringToFront();
		previewPage = await getOpenedPreviewPage( editorPage, previewPage );
		previewTitle = await previewPage.$eval( '.entry-title', ( node ) => node.textContent );
		expect( previewTitle ).toBe( 'Hello World!' );

		// Preview for published post (no unsaved changes) directs to canonical
		// URL for post.
		await editorPage.bringToFront();
		await publishPost();
		await Promise.all( [
			editorPage.waitForFunction( () => ! document.querySelector( '.editor-post-preview' ) ),
			editorPage.click( '.editor-post-publish-panel__header button' ),
		] );
		expectedPreviewURL = await editorPage.$eval( '.notice-success a', ( node ) => node.href );
		previewPage = await getOpenedPreviewPage( editorPage, previewPage );
		expect( previewPage.url() ).toBe( expectedPreviewURL );

		// Return to editor to change title.
		await editorPage.bringToFront();
		await editorPage.type( '.editor-post-title__input', ' And more.' );

		// Published preview should reuse same popup frame.
		// TODO: Fix code to reuse the same frame!
		previewPage = await getOpenedPreviewPage( editorPage );

		// Title in preview should match updated input.
		previewTitle = await previewPage.$eval( '.entry-title', ( node ) => node.textContent );
		expect( previewTitle ).toBe( 'Hello World! And more.' );

		// Published preview URL should include ID and nonce parameters.
		const { query } = parse( previewPage.url(), true );
		expect( query ).toHaveProperty( 'preview_id' );
		expect( query ).toHaveProperty( 'preview_nonce' );

		// Return to editor. Previewing already-autosaved preview tab should
		// reuse the opened tab, skipping interstitial. This resolves an edge
		// cases where the post is dirty but not autosaveable (because the
		// autosave is already up-to-date).
		//
		// See: https://github.com/WordPress/gutenberg/issues/7561
		await editorPage.bringToFront();
		previewPage = await getOpenedPreviewPage( editorPage, previewPage );

		// Title in preview should match updated input.
		previewTitle = await previewPage.$eval( '.entry-title', ( node ) => node.textContent );
		expect( previewTitle ).toBe( 'Hello World! And more.' );
	} );
} );
