/**
 * WordPress dependencies
 */
import {
	createNewPost,
	createUser,
	deleteUser,
	insertBlock,
	loginUser,
	pressKeyWithModifier,
	switchUserToAdmin,
	switchUserToTest,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

async function getSetting( setting ) {
	await switchUserToAdmin();
	await visitAdminPage( 'options-general.php' );

	const value = await page.$eval(
		`#${ setting }`,
		( element ) => element.value
	);
	await switchUserToTest();
	return value;
}

async function setSetting( setting, value ) {
	await switchUserToAdmin();
	await visitAdminPage( 'options-general.php' );

	await page.focus( `#${ setting }` );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.type( `#${ setting }`, value );

	await Promise.all( [
		page.click( '#submit' ),
		page.waitForNavigation( { waitUntil: 'networkidle0' } ),
	] );

	await switchUserToTest();
}

const saveEntities = async () => {
	const savePostSelector = '.editor-post-publish-button__button';
	const savePanelSelector = '.entities-saved-states__panel';
	const entitiesSaveSelector = '.editor-entities-saved-states__save-button';
	const publishPanelSelector = '.editor-post-publish-panel';
	const closePanelButtonSelector =
		'.editor-post-publish-panel__header-cancel-button button';

	await page.click( savePostSelector );
	await page.waitForSelector( savePanelSelector );
	await page.click( entitiesSaveSelector );
	await page.waitForSelector( publishPanelSelector );
	await page.waitForSelector(
		'.editor-post-publish-panel__header-cancel-button button:not([disabled])'
	);
	await page.click( closePanelButtonSelector );
};

describe( 'Site Title block', () => {
	let originalSiteTitle, password;
	const username = 'testuser';
	beforeAll( async () => {
		originalSiteTitle = await getSetting( 'blogname' );
		password = await createUser( username, { role: 'editor' } );
	} );

	afterAll( async () => {
		await deleteUser( username );
		await setSetting( 'blogname', originalSiteTitle );
	} );

	it( 'Can edit the site title as admin', async () => {
		await createNewPost();
		await insertBlock( 'Site Title' );
		const editableSiteTitleSelector = '[aria-label="Block: Site Title"] a';
		await page.waitForSelector( editableSiteTitleSelector );
		await page.focus( editableSiteTitleSelector );
		await pressKeyWithModifier( 'primary', 'a' );

		const editable = await page.$eval(
			editableSiteTitleSelector,
			( element ) => element.contentEditable
		);
		expect( editable ).toBe( 'true' );

		await page.keyboard.type( 'New Site Title' );

		await saveEntities();

		const siteTitle = await getSetting( 'blogname' );
		expect( siteTitle ).toEqual( 'New Site Title' );
	} );

	it( 'Cannot edit the site title as editor', async () => {
		await loginUser( username, password );

		await createNewPost();
		await insertBlock( 'Site Title' );

		const editableSiteTitleSelector = '[aria-label="Block: Site Title"] a';
		await page.waitForSelector( editableSiteTitleSelector );

		const editable = await page.$eval(
			editableSiteTitleSelector,
			( element ) => element.contentEditable
		);
		expect( editable ).toBe( 'inherit' );

		// FIXME: Fix https://github.com/WordPress/gutenberg/issues/33003 and remove the following line.
		expect( console ).toHaveErroredWith(
			'Failed to load resource: the server responded with a status of 403 (Forbidden)'
		);
	} );
} );
