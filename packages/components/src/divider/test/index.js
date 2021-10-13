/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Divider } from '../index';

describe( 'props', () => {
	let base;
	beforeEach( () => {
		base = render( <Divider /> );
	} );

	test( 'should render correctly', () => {
		expect( base.container.firstChild ).toMatchSnapshot();
	} );

	test( 'should render marginTop', () => {
		const { container } = render( <Divider marginTop={ 5 } /> );
		expect( container.firstChild ).toMatchStyleDiffSnapshot(
			base.container.firstChild
		);
	} );

	test( 'should render marginBottom', () => {
		const { container } = render( <Divider marginBottom={ 5 } /> );
		expect( container.firstChild ).toMatchStyleDiffSnapshot(
			base.container.firstChild
		);
	} );

	test( 'should render margin', () => {
		const { container } = render( <Divider margin={ 7 } /> );
		expect( container.firstChild ).toMatchStyleDiffSnapshot(
			base.container.firstChild
		);
	} );
} );
