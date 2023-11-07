/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { createRegistry } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';
import { store as noticesStore } from '@wordpress/notices';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '..';
import { setHasPageContentFocus } from '../actions';

const ENTITY_TYPES = {
	wp_template: {
		description: 'Templates to include in your theme.',
		hierarchical: false,
		name: 'Templates',
		rest_base: 'templates',
		rest_namespace: 'wp/v2',
		slug: 'wp_template',
		taxonomies: [],
	},
};

function createRegistryWithStores() {
	// create a registry
	const registry = createRegistry();

	// register stores
	registry.register( blockEditorStore );
	registry.register( coreStore );
	registry.register( editSiteStore );
	registry.register( interfaceStore );
	registry.register( noticesStore );
	registry.register( preferencesStore );

	return registry;
}

describe( 'actions', () => {
	describe( 'toggleFeature', () => {
		it( 'should toggle a feature flag', () => {
			const registry = createRegistryWithStores();

			// Should default to false.
			expect(
				registry.select( editSiteStore ).isFeatureActive( 'name' )
			).toBe( false );

			// Toggle on.
			registry.dispatch( editSiteStore ).toggleFeature( 'name' );
			expect(
				registry.select( editSiteStore ).isFeatureActive( 'name' )
			).toBe( true );

			// Toggle off again.
			registry.dispatch( editSiteStore ).toggleFeature( 'name' );
			expect(
				registry.select( editSiteStore ).isFeatureActive( 'name' )
			).toBe( false );

			// Expect a deprecation warning.
			expect( console ).toHaveWarned();
		} );
	} );

	describe( 'addTemplate', () => {
		it( 'should issue a REST request to create the template and then set it', async () => {
			const registry = createRegistryWithStores();

			const ID = 1;
			const SLUG = 'index';

			apiFetch.setFetchHandler( async ( options ) => {
				const { method = 'GET', path, data } = options;

				if ( method === 'GET' && path.startsWith( '/wp/v2/types' ) ) {
					return ENTITY_TYPES;
				}

				if (
					method === 'POST' &&
					path.startsWith( '/wp/v2/templates' )
				) {
					return { id: ID, slug: data.slug };
				}

				throw {
					code: 'unknown_path',
					message: `Unknown path: ${ method } ${ path }`,
				};
			} );

			await registry
				.dispatch( editSiteStore )
				.addTemplate( { slug: SLUG } );

			const select = registry.select( editSiteStore );
			expect( select.getEditedPostId() ).toBe( ID );
			expect( select.getEditedPostContext().templateSlug ).toBe( SLUG );
		} );
	} );

	describe( 'setTemplatePart', () => {
		it( 'should set template part', () => {
			const registry = createRegistryWithStores();

			const ID = 1;
			registry.dispatch( editSiteStore ).setTemplatePart( ID );

			const select = registry.select( editSiteStore );
			expect( select.getEditedPostId() ).toBe( ID );
			expect( select.getEditedPostType() ).toBe( 'wp_template_part' );
		} );
	} );

	describe( 'setIsListViewOpened', () => {
		it( 'should set the list view opened state', () => {
			const registry = createRegistryWithStores();

			registry.dispatch( editSiteStore ).setIsListViewOpened( true );
			expect( registry.select( editSiteStore ).isListViewOpened() ).toBe(
				true
			);

			registry.dispatch( editSiteStore ).setIsListViewOpened( false );
			expect( registry.select( editSiteStore ).isListViewOpened() ).toBe(
				false
			);
		} );
		it( 'should turn off distraction free mode when opening the list view', () => {
			const registry = createRegistryWithStores();
			registry
				.dispatch( preferencesStore )
				.set( 'core/edit-site', 'distractionFree', true );
			registry.dispatch( editSiteStore ).setIsListViewOpened( true );
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'distractionFree' )
			).toBe( false );
		} );
	} );

	describe( 'openGeneralSidebar', () => {
		it( 'should turn off distraction free mode when opening a general sidebar', () => {
			const registry = createRegistryWithStores();
			registry
				.dispatch( preferencesStore )
				.set( 'core/edit-site', 'distractionFree', true );
			registry
				.dispatch( editSiteStore )
				.openGeneralSidebar( 'edit-site/global-styles' );
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'distractionFree' )
			).toBe( false );
		} );
	} );

	describe( 'switchEditorMode', () => {
		it( 'should turn off distraction free mode when switching to code editor', () => {
			const registry = createRegistryWithStores();
			registry
				.dispatch( preferencesStore )
				.set( 'core/edit-site', 'distractionFree', true );
			registry.dispatch( editSiteStore ).switchEditorMode( 'visual' );
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'distractionFree' )
			).toBe( true );
			registry.dispatch( editSiteStore ).switchEditorMode( 'text' );
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'distractionFree' )
			).toBe( false );
		} );
	} );

	describe( 'toggleDistractionFree', () => {
		it( 'should properly update settings to prevent layout corruption when enabling distraction free mode', () => {
			const registry = createRegistryWithStores();
			// Enable everything that shouldn't be enabled in distraction free mode.
			registry
				.dispatch( preferencesStore )
				.set( 'core/edit-site', 'fixedToolbar', true );
			registry.dispatch( editSiteStore ).setIsListViewOpened( true );
			registry
				.dispatch( editSiteStore )
				.openGeneralSidebar( 'edit-site/global-styles' );
			// Initial state is falsy.
			registry.dispatch( editSiteStore ).toggleDistractionFree();
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'fixedToolbar' )
			).toBe( false );
			expect( registry.select( editSiteStore ).isListViewOpened() ).toBe(
				false
			);
			expect( registry.select( editSiteStore ).isInserterOpened() ).toBe(
				false
			);
			expect(
				registry
					.select( interfaceStore )
					.getActiveComplementaryArea( editSiteStore.name )
			).toBeNull();
			expect(
				registry
					.select( preferencesStore )
					.get( 'core/edit-site', 'distractionFree' )
			).toBe( true );
		} );
	} );

	describe( 'setHasPageContentFocus', () => {
		it( 'toggles the page content lock on', () => {
			const dispatch = jest.fn();
			const clearSelectedBlock = jest.fn();
			const registry = {
				dispatch: () => ( { clearSelectedBlock } ),
			};
			setHasPageContentFocus( true )( { dispatch, registry } );
			expect( clearSelectedBlock ).toHaveBeenCalled();
			expect( dispatch ).toHaveBeenCalledWith( {
				type: 'SET_HAS_PAGE_CONTENT_FOCUS',
				hasPageContentFocus: true,
			} );
		} );

		it( 'toggles the page content lock off', () => {
			const dispatch = jest.fn();
			const clearSelectedBlock = jest.fn();
			const registry = {
				dispatch: () => ( { clearSelectedBlock } ),
			};
			setHasPageContentFocus( false )( { dispatch, registry } );
			expect( clearSelectedBlock ).not.toHaveBeenCalled();
			expect( dispatch ).toHaveBeenCalledWith( {
				type: 'SET_HAS_PAGE_CONTENT_FOCUS',
				hasPageContentFocus: false,
			} );
		} );
	} );
} );
