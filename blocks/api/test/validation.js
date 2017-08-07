/**
 * Internal dependencies
 */
import {
	getTextPiecesSplitOnWhitespace,
	getTextWithCollapsedWhitespace,
	isEqualTextTokensWithCollapsedWhitespace,
	getNormalizedStyleValue,
	getStyleProperties,
	isEqualAttributesOfName,
	isEqualTagAttributePairs,
	isEqualTokensOfType,
	getNextNonWhitespaceToken,
	isEquivalentHTML,
	isValidBlock,
} from '../validation';
import {
	registerBlockType,
	unregisterBlockType,
	getBlockTypes,
	getBlockType,
	setUnknownTypeHandler,
} from '../registration';

describe( 'validation', () => {
	const defaultBlockSettings = {
		save: ( { attributes } ) => attributes.fruit,
	};

	afterEach( () => {
		setUnknownTypeHandler( undefined );
		getBlockTypes().forEach( ( block ) => {
			unregisterBlockType( block.name );
		} );
	} );

	describe( 'getTextPiecesSplitOnWhitespace()', () => {
		it( 'returns text pieces spilt on whitespace', () => {
			const pieces = getTextPiecesSplitOnWhitespace( '  a \t  b \n c' );

			expect( pieces ).toEqual( [ 'a', 'b', 'c' ] );
		} );
	} );

	describe( 'getTextWithCollapsedWhitespace()', () => {
		it( 'returns text with collapsed whitespace', () => {
			const pieces = getTextWithCollapsedWhitespace( '  a \t  b \n c' );

			expect( pieces ).toBe( 'a b c' );
		} );
	} );

	describe( 'isEqualTextTokensWithCollapsedWhitespace()', () => {
		it( 'should return false if not equal with collapsed whitespace', () => {
			const isEqual = isEqualTextTokensWithCollapsedWhitespace(
				{ chars: '  a \t  b \n c' },
				{ chars: 'a \n c \t b  ' },
			);

			expect( isEqual ).toBe( false );
		} );

		it( 'should return true if equal with collapsed whitespace', () => {
			const isEqual = isEqualTextTokensWithCollapsedWhitespace(
				{ chars: '  a \t  b \n c' },
				{ chars: 'a \n b \t c  ' },
			);

			expect( isEqual ).toBe( true );
		} );
	} );

	describe( 'getNormalizedStyleValue()', () => {
		it( 'omits whitespace and quotes from url value', () => {
			const normalizedValue = getNormalizedStyleValue(
				'url( "https://wordpress.org/img.png" )'
			);

			expect( normalizedValue ).toBe( 'url(https://wordpress.org/img.png)' );
		} );
	} );

	describe( 'getStyleProperties()', () => {
		it( 'returns style property pairs', () => {
			const pairs = getStyleProperties(
				'background-image: url( "https://wordpress.org/img.png" ); color: red;'
			);

			expect( pairs ).toEqual( {
				'background-image': 'url(https://wordpress.org/img.png)',
				color: 'red',
			} );
		} );
	} );

	describe( 'isEqualAttributesOfName', () => {
		describe( '.class()', () => {
			it( 'ignores ordering', () => {
				const isEqual = isEqualAttributesOfName.class(
					'a b c',
					'b a c',
				);

				expect( isEqual ).toBe( true );
			} );

			it( 'ignores whitespace', () => {
				const isEqual = isEqualAttributesOfName.class(
					'a  b    c',
					'b   a c',
				);

				expect( isEqual ).toBe( true );
			} );

			it( 'returns false if not equal', () => {
				const isEqual = isEqualAttributesOfName.class(
					'a b c',
					'b a c d',
				);

				expect( isEqual ).toBe( false );
			} );
		} );

		describe( '.style()', () => {
			it( 'returns true if the same style', () => {
				const isEqual = isEqualAttributesOfName.style(
					'background-image: url( "https://wordpress.org/img.png" ); color: red;',
					'color: red;   background-image: url(\'https://wordpress.org/img.png\n);'
				);

				expect( isEqual ).toBe( true );
			} );

			it( 'returns true if not same style', () => {
				const isEqual = isEqualAttributesOfName.style(
					'background-image: url( "https://wordpress.org/img.png" ); color: red;',
					'color: red;  font-size: 13px; background-image: url(\'https://wordpress.org/img.png\');'
				);

				expect( isEqual ).toBe( false );
			} );
		} );
	} );

	describe( 'isEqualTagAttributePairs()', () => {
		it( 'returns false if not equal pairs', () => {
			const isEqual = isEqualTagAttributePairs(
				[
					[ 'class', 'b   a c' ],
				],
				[
					[ 'class', 'c  a b' ],
					[ 'style', 'background-image: url( "https://wordpress.org/img.png" ); color: red;' ],
				]
			);

			expect( isEqual ).toBe( false );
		} );

		it( 'returns true if equal pairs', () => {
			const isEqual = isEqualTagAttributePairs(
				[
					[ 'class', 'b   a c' ],
					[ 'style', 'color: red;  background-image: url( "https://wordpress.org/img.png" );' ],
				],
				[
					[ 'class', 'c  a b' ],
					[ 'style', 'background-image: url( "https://wordpress.org/img.png" ); color: red;' ],
				]
			);

			expect( isEqual ).toBe( true );
		} );
	} );

	describe( 'isEqualTokensOfType', () => {
		describe( '.StartTag()', () => {
			it( 'returns false if tag name not the same', () => {
				const isEqual = isEqualTokensOfType.StartTag(
					{ tagName: 'p' },
					{ tagName: 'section' }
				);

				expect( isEqual ).toBe( false );
			} );

			it( 'returns false if tag name the same but attributes not', () => {
				const isEqual = isEqualTokensOfType.StartTag(
					{
						tagName: 'p',
						attributes: [
							[ 'class', 'b   a c' ],
						],
					},
					{
						tagName: 'p',
						attributes: [
							[ 'class', 'c  a b' ],
							[ 'style', 'background-image: url( "https://wordpress.org/img.png" ); color: red;' ],
						],
					}
				);

				expect( isEqual ).toBe( false );
			} );

			it( 'returns true if tag name the same and attributes the same', () => {
				const isEqual = isEqualTokensOfType.StartTag(
					{
						tagName: 'p',
						attributes: [
							[ 'class', 'b   a c' ],
							[ 'style', 'color: red;  background-image: url( "https://wordpress.org/img.png" );' ],
						],
					},
					{
						tagName: 'p',
						attributes: [
							[ 'class', 'c  a b' ],
							[ 'style', 'background-image: url( "https://wordpress.org/img.png" ); color: red;' ],
						],
					}
				);

				expect( isEqual ).toBe( true );
			} );
		} );
	} );

	describe( 'getNextNonWhitespaceToken()', () => {
		it( 'returns the next non-whitespace token, mutating array', () => {
			const tokens = [
				{ type: 'Chars', chars: '   \n\t' },
				{ type: 'StartTag', tagName: 'p' },
			];

			const token = getNextNonWhitespaceToken( tokens );

			expect( token ).toEqual( { type: 'StartTag', tagName: 'p' } );
			expect( tokens ).toHaveLength( 0 );
		} );

		it( 'returns undefined if token options exhausted', () => {
			const tokens = [
				{ type: 'Chars', chars: '   \n\t' },
			];

			const token = getNextNonWhitespaceToken( tokens );

			expect( token ).toBeUndefined();
			expect( tokens ).toHaveLength( 0 );
		} );
	} );

	describe( 'isEquivalentHTML()', () => {
		it( 'should return false for effectively inequivalent html', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello <span class="b">World!</span></div>',
				'<div>Hello <span class="a">World!</span></div>'
			);

			expect( isEquivalent ).toBe( false );
		} );

		it( 'should return true for effectively equivalent html', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello<span   class="b a" id="foo"> World!</  span>  </div>',
				'<div  >Hello\n<span id="foo" class="a  b">World!</span></div>'
			);

			expect( isEquivalent ).toBe( true );
		} );

		it( 'should return false when more tokens in first', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello</div>',
				'<div>Hello'
			);

			expect( isEquivalent ).toBe( false );
		} );

		it( 'should return false when more tokens in second', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello',
				'<div>Hello</div>'
			);

			expect( isEquivalent ).toBe( false );
		} );

		it( 'should return true when first has trailing whitespace', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello</div>  ',
				'<div>Hello</div>'
			);

			expect( isEquivalent ).toBe( true );
		} );

		it( 'should return true when second has trailing whitespace', () => {
			const isEquivalent = isEquivalentHTML(
				'<div>Hello</div>',
				'<div>Hello</div>  '
			);

			expect( isEquivalent ).toBe( true );
		} );
	} );

	describe( 'isValidBlock()', () => {
		it( 'returns false if block is not valid', () => {
			registerBlockType( 'not-core/test-block', defaultBlockSettings );

			expect( isValidBlock(
				'Apples',
				getBlockType( 'not-core/test-block' ),
				{ fruit: 'Bananas' }
			) ).toBe( false );
		} );

		it( 'returns true if block is valid', () => {
			registerBlockType( 'not-core/test-block', defaultBlockSettings );

			expect( isValidBlock(
				'Bananas',
				getBlockType( 'not-core/test-block' ),
				{ fruit: 'Bananas' }
			) ).toBe( true );
		} );
	} );
} );
