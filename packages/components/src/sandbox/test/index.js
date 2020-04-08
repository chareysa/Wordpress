/**
 * External dependencies
 */
import { act, fireEvent, render } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Sandbox from '../';

describe( 'Sandbox', () => {
	global.window.MutationObserver = null;

	const TestWrapper = () => {
		const [ html, setHtml ] = useState(
			'<iframe class="mock-iframe" src="https://super.embed"></iframe>'
		);

		const updateHtml = () => {
			setHtml(
				'<iframe class="mock-iframe" src="https://another.super.embed"></iframe>'
			);
		};

		return (
			<div>
				<button onClick={ updateHtml } className="mock-button">
					Mock Button
				</button>
				<Sandbox html={ html } />
			</div>
		);
	};

	it( 'should rerender with new emdeded content if html prop changes', () => {
		let result;
		act( () => {
			result = render( <TestWrapper /> );
		} );

		const iframe = result.container.querySelector( '.components-sandbox' );

		let sandboxedIframe = iframe.contentWindow.document.body.querySelector(
			'.mock-iframe'
		);

		expect( sandboxedIframe.getAttribute( 'src' ) ).toBe(
			'https://super.embed'
		);

		act( () => {
			fireEvent.click( result.getByRole( 'button' ) );
		} );

		sandboxedIframe = iframe.contentWindow.document.body.querySelector(
			'.mock-iframe'
		);

		expect( sandboxedIframe.getAttribute( 'src' ) ).toBe(
			'https://another.super.embed'
		);
	} );
} );
