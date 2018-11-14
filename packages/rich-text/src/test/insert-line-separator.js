/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */

import { insertLineSeparator } from '../insert-line-separator';
import { LINE_SEPARATOR } from '../special-characters';
import { getSparseArrayLength } from './helpers';

describe( 'insertLineSeparator', () => {
	const ol = { type: 'ol' };

	it( 'should insert line separator at end', () => {
		const value = {
			formats: [ , ],
			text: '1',
			start: 1,
			end: 1,
		};
		const expected = {
			formats: [ , , ],
			text: `1${ LINE_SEPARATOR }`,
			start: 2,
			end: 2,
		};
		const result = insertLineSeparator( deepFreeze( value ) );

		expect( result ).not.toBe( value );
		expect( result ).toEqual( expected );
		expect( getSparseArrayLength( result.formats ) ).toBe( 0 );
	} );

	it( 'should insert line separator at start', () => {
		const value = {
			formats: [ , ],
			text: '1',
			start: 0,
			end: 0,
		};
		const expected = {
			formats: [ , , ],
			text: `${ LINE_SEPARATOR }1`,
			start: 1,
			end: 1,
		};
		const result = insertLineSeparator( deepFreeze( value ) );

		expect( result ).not.toBe( value );
		expect( result ).toEqual( expected );
		expect( getSparseArrayLength( result.formats ) ).toBe( 0 );
	} );

	it( 'should insert line separator in nested item', () => {
		const value = {
			formats: [ , , , [ ol ], , ],
			text: `1${ LINE_SEPARATOR }2${ LINE_SEPARATOR }a`,
			start: 5,
			end: 5,
		};
		const expected = {
			formats: [ , , , [ ol ], , [ ol ] ],
			text: `1${ LINE_SEPARATOR }2${ LINE_SEPARATOR }a${ LINE_SEPARATOR }`,
			start: 6,
			end: 6,
		};
		const result = insertLineSeparator( deepFreeze( value ) );

		expect( result ).not.toBe( value );
		expect( result ).toEqual( expected );
		expect( getSparseArrayLength( result.formats ) ).toBe( 2 );
	} );
} );
