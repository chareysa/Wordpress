/**
 * WordPress dependencies
 */
import {
	__unstableCreateStoreDefinition,
	registerStore,
} from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

const STORE_NAME = 'core/notices';

/**
 * Store definition for the notices namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/data/README.md#createStoreDefinition
 *
 * @type {Object}
 */
export const storeDefinition = __unstableCreateStoreDefinition( STORE_NAME );

export default registerStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );
