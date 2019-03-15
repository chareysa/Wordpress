/**
 * External dependencies
 */
import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import Popover from '../';

/**
 * The @wordpress/dom focusable's find function needs to be mocked because
 * `TestUtils.renderIntoDocument` does not actually render into a document.
 * This causes problems with a check for an element's offset width and height to
 * determine if the element is visible. So here we simply return all found
 * elements.
 */
const { SELECTOR: mockSELECTOR } = require.requireActual( '../../../../dom/src/focusable' );
jest.mock( '../../../../dom/src/focusable', () => ( {
	find: ( context ) => [ ...context.querySelectorAll( mockSELECTOR ) ],
} ) );

describe( 'Popover', () => {
	describe( '#componentDidUpdate()', () => {
		let wrapper;
		beforeEach( () => {
			jest.spyOn( Popover.prototype, 'computePopoverPosition' ).mockImplementation( noop );
			jest.spyOn( Popover.prototype, 'toggleAutoRefresh' ).mockImplementation( noop );
		} );

		afterEach( () => {
			jest.restoreAllMocks();

			// Resetting keyboard state is deferred, so ensure that timers are
			// consumed to avoid leaking into other tests.
			jest.runAllTimers();

			if ( document.activeElement ) {
				document.activeElement.blur();
			}
		} );

		it( 'should turn on auto refresh', () => {
			wrapper = TestUtils.renderIntoDocument( <Popover /> );
			expect( Popover.prototype.toggleAutoRefresh ).toHaveBeenCalledWith( true );
			expect( Popover.prototype.computePopoverPosition ).toHaveBeenCalled();
		} );

		it( 'should turn off auto refresh', () => {
			wrapper = TestUtils.renderIntoDocument( <Popover /> );
			/* eslint-disable react/no-find-dom-node */
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( wrapper ).parentNode );
			/* eslint-enable react/no-find-dom-node */

			expect( Popover.prototype.toggleAutoRefresh ).toHaveBeenCalledWith( false );
		} );

		it( 'should set offset and forced positions on changed position', () => {
			const node = document.createElement( 'div' );
			wrapper = ReactDOM.render( <Popover />, node );
			jest.clearAllMocks();

			ReactDOM.render( <Popover position={ 'bottom right' } />, node );

			expect( Popover.prototype.toggleAutoRefresh ).not.toHaveBeenCalled();
			expect( Popover.prototype.computePopoverPosition ).toHaveBeenCalled();
		} );

		it( 'should focus when opening in response to keyboard event', ( done ) => {
			// As in the real world, these occur in sequence before the popover
			// has been mounted. Keyup's resetting is deferred.
			document.dispatchEvent( new window.KeyboardEvent( 'keydown' ) );
			document.dispatchEvent( new window.KeyboardEvent( 'keyup' ) );

			// An ideal test here would mount with an input child and focus the
			// child, but in context of JSDOM the inputs are not visible and
			// are therefore skipped as tabbable, defaulting to popover.
			wrapper = TestUtils.renderIntoDocument( <Popover /> );

			setTimeout( () => {
				const content = TestUtils.findRenderedDOMComponentWithClass(
					wrapper,
					'components-popover__content'
				);
				expect( document.activeElement ).toBe( content );
				done();
			}, 1 );

			jest.runAllTimers();
		} );

		it( 'should allow focus-on-open behavior to be disabled', ( done ) => {
			const activeElement = document.activeElement;

			wrapper = TestUtils.renderIntoDocument( <Popover focusOnMount={ false } /> );

			setTimeout( () => {
				expect( document.activeElement ).toBe( activeElement );
				done();
			} );

			jest.runAllTimers();
		} );

		it( 'should focus the first focusable element by default', ( done ) => {
			wrapper = TestUtils.renderIntoDocument(
				<Popover>
					<div>
						<button>One</button>
						<button>Two</button>
						<button>Three</button>
						<button>Four</button>
						<button>Five</button>
					</div>
				</Popover>
			);

			setTimeout( () => {
				expect( 'One' ).toBe( document.activeElement.textContent );
				done();
			} );

			jest.runAllTimers();
		} );

		it( 'should allow an index to be passed to focusOnMount to select the focused element', ( done ) => {
			wrapper = TestUtils.renderIntoDocument(
				<Popover focusOnMount={ 2 } >
					<div>
						<button>One</button>
						<button>Two</button>
						<button>Three</button>
						<button>Four</button>
						<button>Five</button>
					</div>
				</Popover>
			);

			setTimeout( () => {
				expect( 'Three' ).toBe( document.activeElement.textContent );
				done();
			} );

			jest.runAllTimers();
		} );

		it( 'should allow an index value of zero to be passed to focusOnMount to focus the first element', ( done ) => {
			wrapper = TestUtils.renderIntoDocument(
				<Popover focusOnMount={ 0 } >
					<div>
						<button>One</button>
						<button>Two</button>
						<button>Three</button>
						<button>Four</button>
						<button>Five</button>
					</div>
				</Popover>
			);

			setTimeout( () => {
				expect( 'One' ).toBe( document.activeElement.textContent );
				done();
			} );

			jest.runAllTimers();
		} );
	} );

	describe( '#render()', () => {
		it( 'should render content', () => {
			const wrapper = TestUtils.renderIntoDocument( <Popover>Hello</Popover> );
			const content = TestUtils.findRenderedDOMComponentWithTag( wrapper, 'span' );

			expect( content ).toMatchSnapshot();
		} );

		it( 'should pass additional props to portaled element', () => {
			const wrapper = TestUtils.renderIntoDocument( <Popover role="tooltip">Hello</Popover> );
			const content = TestUtils.findRenderedDOMComponentWithTag( wrapper, 'span' );

			expect( content ).toMatchSnapshot();
		} );
	} );
} );
