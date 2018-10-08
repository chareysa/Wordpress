/**
 * Internal dependencies
 */
import {
	toggleGeneralSidebarEditorPanel,
	openGeneralSidebar,
	closeGeneralSidebar,
	openPublishSidebar,
	closePublishSidebar,
	togglePublishSidebar,
	openModal,
	closeModal,
	toggleFeature,
	togglePinnedPluginItem,
	requestMetaBoxUpdates,
} from '../actions';

describe( 'actions', () => {
	describe( 'openGeneralSidebar', () => {
		it( 'should return OPEN_GENERAL_SIDEBAR action', () => {
			const name = 'plugin/my-name';
			expect( openGeneralSidebar( name ) ).toEqual( {
				type: 'OPEN_GENERAL_SIDEBAR',
				name,
			} );
		} );
	} );

	describe( 'closeGeneralSidebar', () => {
		it( 'should return CLOSE_GENERAL_SIDEBAR action', () => {
			expect( closeGeneralSidebar() ).toEqual( {
				type: 'CLOSE_GENERAL_SIDEBAR',
			} );
		} );
	} );

	describe( 'openPublishSidebar', () => {
		it( 'should return an OPEN_PUBLISH_SIDEBAR action', () => {
			expect( openPublishSidebar() ).toEqual( {
				type: 'OPEN_PUBLISH_SIDEBAR',
			} );
		} );
	} );

	describe( 'closePublishSidebar', () => {
		it( 'should return an CLOSE_PUBLISH_SIDEBAR action', () => {
			expect( closePublishSidebar() ).toEqual( {
				type: 'CLOSE_PUBLISH_SIDEBAR',
			} );
		} );
	} );

	describe( 'togglePublishSidebar', () => {
		it( 'should return an TOGGLE_PUBLISH_SIDEBAR action', () => {
			expect( togglePublishSidebar() ).toEqual( {
				type: 'TOGGLE_PUBLISH_SIDEBAR',
			} );
		} );
	} );

	describe( 'toggleSidebarPanel', () => {
		it( 'should return TOGGLE_GENERAL_SIDEBAR_EDITOR_PANEL action', () => {
			const panel = 'panelName';
			expect( toggleGeneralSidebarEditorPanel( panel ) ).toEqual( {
				type: 'TOGGLE_GENERAL_SIDEBAR_EDITOR_PANEL',
				panel,
			} );
		} );
	} );

	describe( 'openModal', () => {
		it( 'should return OPEN_MODAL action', () => {
			const name = 'plugin/my-name';
			expect( openModal( name ) ).toEqual( {
				type: 'OPEN_MODAL',
				name,
			} );
		} );
	} );

	describe( 'closeModal', () => {
		it( 'should return CLOSE_MODAL action', () => {
			expect( closeModal() ).toEqual( {
				type: 'CLOSE_MODAL',
			} );
		} );
	} );

	describe( 'toggleFeature', () => {
		it( 'should return TOGGLE_FEATURE action', () => {
			const feature = 'name';
			expect( toggleFeature( feature ) ).toEqual( {
				type: 'TOGGLE_FEATURE',
				feature,
			} );
		} );
	} );

	describe( 'togglePinnedPluginItem', () => {
		it( 'should return TOGGLE_PINNED_PLUGIN_ITEM action', () => {
			const pluginName = 'foo/bar';

			expect( togglePinnedPluginItem( pluginName ) ).toEqual( {
				type: 'TOGGLE_PINNED_PLUGIN_ITEM',
				pluginName,
			} );
		} );
	} );

	describe( 'requestMetaBoxUpdates', () => {
		it( 'should return the REQUEST_META_BOX_UPDATES action', () => {
			expect( requestMetaBoxUpdates() ).toEqual( {
				type: 'REQUEST_META_BOX_UPDATES',
			} );
		} );
	} );
} );
