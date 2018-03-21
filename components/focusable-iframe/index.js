/**
 * External dependencies
 */
import { omit } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import withGlobalEvents from '../higher-order/with-global-events';

class FocusableIframe extends Component {
	constructor() {
		super( ...arguments );

		this.checkFocus = this.checkFocus.bind( this );

		this.node = createRef();
	}

	/**
	 * Checks whether the iframe is the activeElement, inferring that it has
	 * then received focus, and calls the `onFocus` prop callback.
	 */
	checkFocus() {
		const { onFocus } = this.props;
		if ( onFocus && document.activeElement === this.node.current ) {
			onFocus();
		}
	}

	render() {
		// Disable reason: The rendered iframe is a pass-through component,
		// assigning props inherited from the rendering parent. It's the
		// responsibility of the parent to assign a title.

		/* eslint-disable jsx-a11y/iframe-has-title */
		return (
			<iframe
				ref={ this.node }
				{ ...omit( this.props, [ 'onFocus' ] ) }
			/>
		);
		/* eslint-enable jsx-a11y/iframe-has-title */
	}
}

export default withGlobalEvents( {
	blur: 'checkFocus',
} )( FocusableIframe );
