/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import { useCompositeContext } from './context';
import type { CompositeItemProps } from './types';

export const CompositeItem = forwardRef<
	HTMLButtonElement,
	WordPressComponentProps< CompositeItemProps, 'button', false >
>( function CompositeItem( props, ref ) {
	const context = useCompositeContext();
	const store = context.store as Ariakit.CompositeStore;

	// If the active item is not connected, Composite may end up in a state
	// where none of the items are tabbable. In this case, we force all items to
	// be tabbable, so that as soon as an item received focus, it becomes active
	// and Composite goes back to working as expected.
	const tabbable = Ariakit.useStoreState( store, ( state ) => {
		return (
			state?.activeId !== null &&
			! store?.item( state?.activeId )?.element?.isConnected
		);
	} );

	return (
		<Ariakit.CompositeItem
			store={ store }
			tabbable={ tabbable }
			{ ...props }
			ref={ ref }
		/>
	);
} );
