/**
 * Internal dependencies
 */
import { kebabCase, setImmutably } from '../object';

describe( 'kebabCase', () => {
	it( 'separates lowercase letters, followed by uppercase letters', () => {
		expect( kebabCase( 'fooBar' ) ).toEqual( 'foo-bar' );
	} );

	it( 'separates numbers, followed by uppercase letters', () => {
		expect( kebabCase( '123FOO' ) ).toEqual( '123-foo' );
	} );

	it( 'separates numbers, followed by lowercase characters', () => {
		expect( kebabCase( '123bar' ) ).toEqual( '123-bar' );
	} );

	it( 'separates uppercase letters, followed by numbers', () => {
		expect( kebabCase( 'FOO123' ) ).toEqual( 'foo-123' );
	} );

	it( 'separates lowercase letters, followed by numbers', () => {
		expect( kebabCase( 'foo123' ) ).toEqual( 'foo-123' );
	} );

	it( 'separates uppercase groups from capitalized groups', () => {
		expect( kebabCase( 'FOOBar' ) ).toEqual( 'foo-bar' );
	} );

	it( 'removes any non-dash special characters', () => {
		expect(
			kebabCase( 'foo±§!@#$%^&*()-_=+/?.>,<\\|{}[]`~\'";:bar' )
		).toEqual( 'foo-bar' );
	} );

	it( 'removes any spacing characters', () => {
		expect( kebabCase( ' foo \t \n \r \f \v bar ' ) ).toEqual( 'foo-bar' );
	} );

	it( 'groups multiple dashes into a single one', () => {
		expect( kebabCase( 'foo---bar' ) ).toEqual( 'foo-bar' );
	} );

	it( 'returns an empty string unchanged', () => {
		expect( kebabCase( '' ) ).toEqual( '' );
	} );

	it( 'returns an existing kebab case string unchanged', () => {
		expect( kebabCase( 'foo-123-bar' ) ).toEqual( 'foo-123-bar' );
	} );
} );

describe( 'setImmutably', () => {
	describe( 'handling falsy values properly', () => {
		it( 'should create a new object if `undefined` is passed', () => {
			const result = setImmutably( undefined, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'should create a new object if `null` is passed', () => {
			const result = setImmutably( null, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'should create a new object if `false` is passed', () => {
			const result = setImmutably( false, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'should create a new object if `0` is passed', () => {
			const result = setImmutably( 0, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'should create a new object if an empty string is passed', () => {
			const result = setImmutably( '', 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'should create a new object if a NaN is passed', () => {
			const result = setImmutably( NaN, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );
	} );

	describe( 'manages data assignment properly', () => {
		it( 'assigns value properly when it does not exist', () => {
			const result = setImmutably( {}, 'test', 1 );

			expect( result ).toEqual( { test: 1 } );
		} );

		it( 'overrides existing values', () => {
			const result = setImmutably( { test: 1 }, 'test', 2 );

			expect( result ).toEqual( { test: 2 } );
		} );

		describe( 'with array notation access', () => {
			it( 'assigns values at deeper levels', () => {
				const result = setImmutably( {}, [ 'foo', 'bar', 'baz' ], 5 );

				expect( result ).toEqual( { foo: { bar: { baz: 5 } } } );
			} );

			it( 'overrides existing values at deeper levels', () => {
				const result = setImmutably(
					{ foo: { bar: { baz: 1 } } },
					[ 'foo', 'bar', 'baz' ],
					5
				);

				expect( result ).toEqual( { foo: { bar: { baz: 5 } } } );
			} );

			it( 'keeps other properties intact', () => {
				const result = setImmutably(
					{ foo: { bar: { baz: 1 } } },
					[ 'foo', 'bar', 'test' ],
					5
				);

				expect( result ).toEqual( {
					foo: { bar: { baz: 1, test: 5 } },
				} );
			} );
		} );

		describe( 'for nested falsey values', () => {
			it( 'overwrites undefined values', () => {
				const result = setImmutably( { test: undefined }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );

			it( 'overwrites null values', () => {
				const result = setImmutably( { test: null }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );

			it( 'overwrites false values', () => {
				const result = setImmutably( { test: false }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );

			it( 'overwrites `0` values', () => {
				const result = setImmutably( { test: 0 }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );

			it( 'overwrites empty string values', () => {
				const result = setImmutably( { test: '' }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );

			it( 'overwrites NaN values', () => {
				const result = setImmutably( { test: NaN }, 'test', 1 );

				expect( result ).toEqual( { test: 1 } );
			} );
		} );
	} );

	describe( 'does not mutate the original object', () => {
		it( 'clones the object at the first level', () => {
			const input = {};
			const result = setImmutably( input, 'test', 1 );

			expect( result ).not.toBe( input );
		} );

		it( 'clones the object at deeper levels', () => {
			const input = { foo: { bar: { baz: 1 } } };
			const result = setImmutably( input, [ 'foo', 'bar', 'baz' ], 2 );

			expect( result ).not.toBe( input );
			expect( result.foo ).not.toBe( input.foo );
			expect( result.foo.bar ).not.toBe( input.foo.bar );
			expect( result.foo.bar.baz ).not.toBe( input.foo.bar.baz );
		} );
	} );
} );
