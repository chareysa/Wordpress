/**
 * WordPress dependencies
 */
import { useCommand } from '@wordpress/commands';
import { __ } from '@wordpress/i18n';
import { external, plus, symbol } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { addQueryArgs, getPath } from '@wordpress/url';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from './lock-unlock';

const { useHistory } = unlock( routerPrivateApis );

export function useAdminNavigationCommands() {
	const history = useHistory();

	const { isBlockTheme, canAccessSiteEditor } = useSelect( ( select ) => {
		return {
			isBlockTheme:
				select( blockEditorStore ).getSettings()
					.__unstableIsBlockBasedTheme,
			canAccessSiteEditor: select( coreStore ).canUser(
				'read',
				'templates'
			),
		};
	}, [] );

	const isSiteEditor = getPath( window.location.href )?.includes(
		'site-editor.php'
	);

	useCommand( {
		name: 'core/add-new-post',
		label: __( 'Add new post' ),
		icon: plus,
		callback: () => {
			document.location.href = 'post-new.php';
		},
	} );
	useCommand( {
		name: 'core/add-new-page',
		label: __( 'Add new page' ),
		icon: plus,
		callback: () => {
			document.location.href = 'post-new.php?post_type=page';
		},
	} );
	useCommand( {
		name: 'core/manage-reusable-blocks',
		label: __( 'Manage all of my patterns' ),
		callback: ( { close } ) => {
			if (
				( ! isSiteEditor && ! isBlockTheme ) ||
				! canAccessSiteEditor
			) {
				document.location.href = 'edit.php?post_type=wp_block';
			} else {
				const args = {
					path: '/patterns',
				};
				const targetUrl = addQueryArgs( 'site-editor.php', args );
				if ( isSiteEditor ) {
					history.push( args );
				} else {
					document.location = targetUrl;
				}
				close();
			}
		},
		icon: isSiteEditor ? symbol : external,
	} );
}
