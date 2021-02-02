/**
 * WordPress dependencies
 */
import {
	visitAdminPage,
	trashAllPosts,
	activateTheme,
} from '@wordpress/e2e-test-utils';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { navigationPanel } from '../../experimental-features';

async function getDocumentSettingsTitle() {
	const titleElement = await page.waitForSelector(
		'.edit-site-document-actions__title'
	);

	return titleElement.evaluate( ( el ) => el.innerText );
}

async function getDocumentSettingsSecondaryTitle() {
	const secondaryTitleElement = await page.waitForSelector(
		'.edit-site-document-actions__secondary-item'
	);

	return secondaryTitleElement.evaluate( ( el ) => el.innerText );
}

describe( 'Document Settings', () => {
	beforeAll( async () => {
		await activateTheme( 'tt1-blocks' );
		await trashAllPosts( 'wp_template' );
		await trashAllPosts( 'wp_template_part' );
	} );
	afterAll( async () => {
		await trashAllPosts( 'wp_template' );
		await trashAllPosts( 'wp_template_part' );
		await activateTheme( 'twentytwentyone' );
	} );

	beforeEach( async () => {
		await visitAdminPage(
			'admin.php',
			addQueryArgs( '', {
				page: 'gutenberg-edit-site',
			} ).slice( 1 )
		);
		await page.waitForSelector( '.edit-site-visual-editor' );
	} );

	describe( 'when a template is selected from the navigation sidebar', () => {
		it( 'should display the selected templates name in the document header', async () => {
			// Navigate to a template
			await navigationPanel.open();
			await navigationPanel.backToRoot();
			await navigationPanel.navigate( 'Templates' );
			await navigationPanel.clickItemByText( 'Front Page' );

			// Evaluate the document settings title
			const actual = await getDocumentSettingsTitle();

			expect( actual ).toEqual( 'Front Page' );
		} );

		describe( 'and a template part is clicked in the template', () => {
			it( "should display the selected template part's name in the document header", async () => {
				// Click on a template part in the template
				await page.waitForSelector(
					'.site-header[data-type="core/template-part"]'
				);
				await page.click(
					'.site-header[data-type="core/template-part"]'
				);

				// Evaluate the document settings secondary title
				const actual = await getDocumentSettingsSecondaryTitle();

				expect( actual ).toEqual( 'Header' );
			} );
		} );
	} );

	describe( 'when a template part is selected from the navigation sidebar', () => {
		it( "should display the selected template part's name in the document header", async () => {
			// Navigate to a template part
			await navigationPanel.open();
			await navigationPanel.backToRoot();
			await navigationPanel.navigate( 'Template Parts' );
			await navigationPanel.clickItemByText( 'header' );

			// TODO: Remove when toolbar supports text fields
			expect( console ).toHaveWarnedWith(
				'Using custom components as toolbar controls is deprecated. Please use ToolbarItem or ToolbarButton components instead. See: https://developer.wordpress.org/block-editor/components/toolbar-button/#inside-blockcontrols'
			);

			// Evaluate the document settings title
			const actual = await getDocumentSettingsTitle();

			expect( actual ).toEqual( 'header' );
		} );
	} );
} );
