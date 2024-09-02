/**
 * Internal dependencies
 */
import { flattenFormData } from '../flatten-form-data';

describe( 'flattenFormData', () => {
	it( 'should flatten nested data structure', () => {
		const data = new FormData();

		const additionalData = {
			foo: null,
			bar: 1234,
			meta: {
				nested: 'foo',
				dothis: true,
				dothat: false,
				supermeta: {
					nested: 'baz',
				},
			},
		};

		for ( const [ key, value ] of Object.entries( additionalData ) ) {
			flattenFormData(
				data,
				key,
				value as Parameters< typeof flattenFormData >[ 2 ]
			);
		}

		const actual = Object.fromEntries( data.entries() );
		expect( actual ).toStrictEqual( {
			bar: '1234',
			foo: 'null',
			'meta[dothat]': 'false',
			'meta[dothis]': 'true',
			'meta[nested]': 'foo',
			'meta[supermeta][nested]': 'baz',
		} );
	} );
} );
