/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import type { Action } from '@wordpress/dataviews';
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import duplicatePattern from '../actions/duplicate-pattern';
import exportPattern from '../actions/export-pattern';
import reorderPage from '../actions/reorder-page';
import type { PostType } from '../types';
import duplicatePost from '../actions/duplicate-post';
import viewPostRevisions from '../actions/view-post-revisions';
import viewPost from '../actions/view-post';
import { store } from '.';

export function registerEntityAction< Item >(
	kind: string,
	name: string,
	config: Action< Item >
) {
	return {
		type: 'REGISTER_ENTITY_ACTION' as const,
		kind,
		name,
		config,
	};
}

export function unregisterEntityAction(
	kind: string,
	name: string,
	actionId: string
) {
	return {
		type: 'UNREGISTER_ENTITY_ACTION' as const,
		kind,
		name,
		actionId,
	};
}

export function setIsReady( kind: string, name: string ) {
	return {
		type: 'SET_IS_READY' as const,
		kind,
		name,
	};
}

export const registerPostTypeActions =
	( postType: string ) =>
	async ( { registry }: { registry: any } ) => {
		const isReady = registry
			.select( store )
			.isEntityReady( 'postType', postType );
		if ( isReady ) {
			return;
		}

		registry.dispatch( store ).setIsReady( 'postType', postType );

		const postTypeConfig = ( await registry
			.resolveSelect( coreStore )
			.getPostType( postType ) ) as PostType;

		const canCreate = await registry
			.resolveSelect( coreStore )
			.canUser( 'create', {
				kind: 'postType',
				name: postType,
			} );
		// const currentTheme = await registry
		// 	.resolveSelect( coreStore )
		// 	.getCurrentTheme();

		const actions = [
			postTypeConfig.viewable ? viewPost : undefined,
			!! postTypeConfig?.supports?.revisions
				? viewPostRevisions
				: undefined,
			// @ts-ignore
			globalThis.IS_GUTENBERG_PLUGIN
				? ! [ 'wp_template', 'wp_block', 'wp_template_part' ].includes(
						postTypeConfig.slug
				  ) &&
				  canCreate &&
				  duplicatePost
				: undefined,
			// postTypeConfig.slug === 'wp_template_part' &&
			// canCreate &&
			// currentTheme?.is_block_theme
			// 	? duplicateTemplatePart
			// 	: undefined,
			canCreate && postTypeConfig.slug === 'wp_block'
				? duplicatePattern
				: undefined,
			// postTypeConfig.supports?.title ? renamePost : undefined,
			postTypeConfig?.supports?.[ 'page-attributes' ]
				? reorderPage
				: undefined,
			postTypeConfig.slug === 'wp_block' ? exportPattern : undefined,
			// resetPost,
			// restorePost,
			// deletePost,
			// trashPost,
			// permanentlyDeletePost,
		];

		registry.batch( () => {
			actions.forEach( ( action ) => {
				if ( ! action ) {
					return;
				}
				registry
					.dispatch( store )
					.registerEntityAction( 'postType', postType, action );
			} );
		} );

		doAction( 'core.registerPostTypeActions', postType );
	};
