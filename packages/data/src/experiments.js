/**
 * WordPress dependencies
 */
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/experiments';

export const { lock, unlock } =
	__dangerousOptInToUnstableAPIsOnlyForCoreModules(
		'I know using unstable features means my plugin or theme will inevitably break on the next WordPress release.',
		'@wordpress/data'
	);

/**
 * Enables registering private actions and selectors on a store without exposing
 * them as public API.
 *
 * Use it with the store descriptor object:
 *
 * ```js
 * const store = createReduxStore( 'my-store', { ... } );
 * registerPrivateActionsAndSelectors( store, {
 *     __experimentalAction: ( state ) => state.value,
 * }, {
 *     __experimentalSelector: ( state ) => state.value,
 * } );
 * ```
 *
 * Once the selectors are registered, they can be accessed using the
 * `unlock()` utility:
 *
 * ```js
 * unlock( registry.dispatch( blockEditorStore ) ).__experimentalAction();
 * unlock( registry.select( blockEditorStore ) ).__experimentalSelector();
 * ```
 *
 * Note the objects returned by select() and dispatch() have the good old public
 * methods, but the modules that opted-in to the private APIs can also "unlock"
 * additional private selectors and actions.
 *
 * @example
 *
 * ```js
 * // In the package exposing the private selectors:
 *
 * import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/experiments';
 * export const { lock, unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules( /* ... *\/ );
 *
 * import { experiments as dataExperiments } from '@wordpress/data';
 * const { registerPrivateActionsAndSelectors } = unlock( dataExperiments );
 *
 * const store = registerStore( 'my-store', { /* ... *\/ } );
 * registerPrivateActionsAndSelectors( store, {
 *     __experimentalAction: ( state ) => state.value,
 * }, {
 *     __experimentalSelector: ( state ) => state.value,
 * } );
 *
 * // In the package using the private selectors:
 * import { store as blockEditorStore } from '@wordpress/block-editor';
 * unlock( registry.select( blockEditorStore ) ).__experimentalSelector();
 *
 * // Or in a React component:
 * useSelect( ( select ) => (
 *     unlock( select( blockEditorStore ) ).__experimentalSelector()
 * ) );
 * useDispatch( ( dispatch ) => {
 *     unlock( dispatch( blockEditorStore ) ).__experimentalAction()
 * } );
 * ```
 *
 * @param {Object} store     The store descriptor to register the private selectors on.
 * @param {Object} actions   The private actions to register in a { actionName: ( ...args ) => action } format.
 * @param {Object} selectors The private selectors to register in a { selectorName: ( state, ...args ) => data } format.
 */
export function registerPrivateActionsAndSelectors(
	store,
	actions = {},
	selectors = {}
) {
	lock( store, { actions, selectors } );
}

/**
 * The experimental APIs exposed by the `@wordpress/data` package.
 * Only available to core packages. These APIs are not stable and may
 * change without notice. Do not use outside of core.
 *
 * @example
 *
 * ```js
 * import { unlock } from '../experiments';
 * import { experiments as dataExperiments } from '@wordpress/data';
 * const { registerPrivateSelectors } = unlock( dataExperiments );
 *
 * import { store as blockEditorStore } from './store';
 * import { __unstableSelectionHasUnmergeableBlock } from './store/selectors';
 * registerPrivateSelectors( store, {
 * __experimentalHasContentRoleAttribute
 * } );
 * ```
 */
export const experiments = {};
lock( experiments, {
	registerPrivateActionsAndSelectors,
} );
