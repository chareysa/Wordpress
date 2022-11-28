/**
 * WordPress dependencies
 */
import {
	createReduxStore,
	register,
	experiments as dataExperiments,
} from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { STORE_NAME } from './constants';

import { unlock } from '../experiments';
const { __experimentalHasContentRoleAttribute, ...stableSelectors } = selectors;

/**
 * Store definition for the blocks namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
export const store = createReduxStore( STORE_NAME, {
	reducer,
	selectors: stableSelectors,
	actions,
} );

const { registerPrivateSelectors } = unlock( dataExperiments );
registerPrivateSelectors( store, { __experimentalHasContentRoleAttribute } );

register( store );
