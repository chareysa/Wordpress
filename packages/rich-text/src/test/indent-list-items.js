/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */

import { indentListItems } from '../indent-list-items';
import { getSparseArrayLength } from './helpers';
import { LINE_SEPARATOR } from '../special-characters';

describe( 'indentListItems', () => {
	const ul = { type: 'ul' };
	const ol = { type: 'ol' };

	it( 'should not indent only item', () => {
		const record = {
			formats: [ , ],
			lines: [ , ],
			objects: [ , ],
			text: '1',
			start: 1,
			end: 1,
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( record );
		expect( result ).toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 0 );
	} );

	it( 'should indent', () => {
		// As we're testing list formats, the text should remain the same.
		const text = `1${ LINE_SEPARATOR }`;
		const record = {
			formats: [ , , ],
			lines: [ , , ],
			objects: [ , , ],
			text,
			start: 2,
			end: 2,
		};
		const expected = {
			...record,
			lines: [ , [ ul ] ],
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 1 );
	} );

	it( 'should not indent without target list', () => {
		const record = {
			formats: [ , , ],
			lines: [ , [ ul ] ],
			objects: [ , , ],
			text: `1${ LINE_SEPARATOR }`,
			start: 2,
			end: 2,
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( record );
		expect( result ).toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 1 );
	} );

	it( 'should indent and merge with previous list', () => {
		// As we're testing list formats, the text should remain the same.
		const text = `1${ LINE_SEPARATOR }${ LINE_SEPARATOR }`;
		const record = {
			formats: [ , , , ],
			lines: [ , [ ol ], , ],
			objects: [ , , , ],
			text,
			start: 3,
			end: 3,
		};
		const expected = {
			...record,
			lines: [ , [ ol ], [ ol ] ],
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 2 );
	} );

	it( 'should indent already indented item', () => {
		// As we're testing list formats, the text should remain the same.
		const text = `1${ LINE_SEPARATOR }2${ LINE_SEPARATOR }3`;
		const record = {
			formats: [ , , , , , ],
			lines: [ , [ ul ], , [ ul ], , ],
			objects: [ , , , , , ],
			text,
			start: 5,
			end: 5,
		};
		const expected = {
			...record,
			lines: [ , [ ul ], , [ ul, ul ], , ],
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 2 );
	} );

	it( 'should indent with multiple lines selected', () => {
		// As we're testing list formats, the text should remain the same.
		const text = `1${ LINE_SEPARATOR }2${ LINE_SEPARATOR }3`;
		const record = {
			formats: [ , , , , , ],
			lines: [ , , , [ ul ], , ],
			objects: [ , , , , , ],
			text,
			start: 2,
			end: 5,
		};
		const expected = {
			...record,
			lines: [ , [ ul ], , [ ul, ul ], , ],
		};
		const result = indentListItems( deepFreeze( record ), ul );

		expect( result ).toEqual( expected );
		expect( result ).not.toBe( record );
		expect( getSparseArrayLength( result.lines ) ).toBe( 2 );
	} );

	it( 'should indent one level at a time', () => {
		// As we're testing list formats, the text should remain the same.
		const text = `1${ LINE_SEPARATOR }2${ LINE_SEPARATOR }3${ LINE_SEPARATOR }4`;
		const record = {
			formats: Array( text.length ),
			lines: [ , [ ul ], , [ ul, ul ], , , , ],
			objects: Array( text.length ),
			text,
			start: 6,
			end: 6,
		};

		const result1 = indentListItems( deepFreeze( record ), ul );

		expect( result1 ).not.toBe( record );
		expect( getSparseArrayLength( result1.lines ) ).toBe( 3 );
		expect( result1 ).toEqual( {
			...record,
			lines: [ , [ ul ], , [ ul, ul ], , [ ul ], , ],
		} );

		const result2 = indentListItems( deepFreeze( result1 ), ul );

		expect( result2 ).not.toBe( result1 );
		expect( getSparseArrayLength( result2.lines ) ).toBe( 3 );
		expect( result2 ).toEqual( {
			...record,
			lines: [ , [ ul ], , [ ul, ul ], , [ ul, ul ], , ],
		} );

		const result3 = indentListItems( deepFreeze( result2 ), ul );

		expect( result3 ).not.toBe( result2 );
		expect( getSparseArrayLength( result3.lines ) ).toBe( 3 );
		expect( result3 ).toEqual( {
			...record,
			lines: [ , [ ul ], , [ ul, ul ], , [ ul, ul, ul ], , ],
		} );
	} );
} );
