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
import * as selectors from './selectors';
import * as actions from './actions';

const STORE_NAME = 'core/blocks';

/**
 * Store definition for the blocks namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/data/README.md#createStoreDefinition
 *
 * @type {Object}
 */
export const storeDefinition = __unstableCreateStoreDefinition( STORE_NAME );

export default registerStore( STORE_NAME, { reducer, selectors, actions } );
