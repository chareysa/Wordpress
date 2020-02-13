'use strict';
/**
 * External dependencies
 */
const { readFile } = require( 'fs' ).promises;

/**
 * Internal dependencies
 */
const { readConfig, ValidationError } = require( '../lib/config' );
const detectDirectoryType = require( '../lib/detect-directory-type' );

jest.mock( 'fs', () => ( {
	promises: {
		readFile: jest.fn(),
	},
} ) );

jest.mock( '../lib/detect-directory-type', () => jest.fn() );

describe( 'readConfig', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'should throw a validation error if config is invalid JSON', async () => {
		readFile.mockImplementation( () => Promise.resolve( '{' ) );
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain( 'Invalid .wp-env.json' );
		}
	} );

	it( 'should throw a validation error if config cannot be read', async () => {
		readFile.mockImplementation( () =>
			Promise.reject( { message: 'Uh oh!' } )
		);
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain( 'Could not read .wp-env.json' );
		}
	} );

	it( 'should infer a core config when ran from a core directory', async () => {
		readFile.mockImplementation( () =>
			Promise.reject( { code: 'ENOENT' } )
		);
		detectDirectoryType.mockImplementation( () => 'core' );
		const config = await readConfig( '.wp-env.json' );
		expect( config.coreSource ).not.toBeNull();
		expect( config.pluginSources ).toHaveLength( 0 );
		expect( config.themeSources ).toHaveLength( 0 );
	} );

	it( 'should infer a plugin config when ran from a plugin directory', async () => {
		readFile.mockImplementation( () =>
			Promise.reject( { code: 'ENOENT' } )
		);
		detectDirectoryType.mockImplementation( () => 'plugin' );
		const config = await readConfig( '.wp-env.json' );
		expect( config.coreSource ).toBeNull();
		expect( config.pluginSources ).toHaveLength( 1 );
		expect( config.themeSources ).toHaveLength( 0 );
	} );

	it( 'should infer a theme config when ran from a theme directory', async () => {
		readFile.mockImplementation( () =>
			Promise.reject( { code: 'ENOENT' } )
		);
		detectDirectoryType.mockImplementation( () => 'theme' );
		const config = await readConfig( '.wp-env.json' );
		expect( config.coreSource ).toBeNull();
		expect( config.pluginSources ).toHaveLength( 0 );
		expect( config.themeSources ).toHaveLength( 1 );
	} );

	it( "should throw a validation error if 'core' is not a string", async () => {
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { core: 123 } ) )
		);
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain( 'must be null or a string' );
		}
	} );

	it( "should throw a validation error if 'plugins' is not an array of strings", async () => {
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { plugins: [ 'test', 123 ] } ) )
		);
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain( 'must be an array of strings' );
		}
	} );

	it( "should throw a validation error if 'themes' is not an array of strings", async () => {
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { themes: [ 'test', 123 ] } ) )
		);
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain( 'must be an array of strings' );
		}
	} );

	it( 'should parse local sources', async () => {
		readFile.mockImplementation( () =>
			Promise.resolve(
				JSON.stringify( {
					plugins: [ './relative', '../parent', '~/home' ],
				} )
			)
		);
		const config = await readConfig( '.wp-env.json' );
		expect( config ).toMatchObject( {
			pluginSources: [
				{
					type: 'local',
					path: expect.stringMatching( /^\/.*relative$/ ),
					basename: 'relative',
				},
				{
					type: 'local',
					path: expect.stringMatching( /^\/.*parent$/ ),
					basename: 'parent',
				},
				{
					type: 'local',
					path: expect.stringMatching( /^\/.*home$/ ),
					basename: 'home',
				},
			],
		} );
	} );

	it( "should set testsPath on the 'core' source", async () => {
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { core: './relative' } ) )
		);
		const config = await readConfig( '.wp-env.json' );
		expect( config ).toMatchObject( {
			coreSource: {
				type: 'local',
				path: expect.stringMatching( /^\/.*relative$/ ),
				testsPath: expect.stringMatching( /^\/.*tests-relative$/ ),
			},
		} );
	} );

	it( 'should parse GitHub sources', async () => {
		readFile.mockImplementation( () =>
			Promise.resolve(
				JSON.stringify( {
					plugins: [
						'WordPress/gutenberg',
						'WordPress/gutenberg#master',
						'WordPress/gutenberg#5.0',
					],
				} )
			)
		);
		const config = await readConfig( '.wp-env.json' );
		expect( config ).toMatchObject( {
			pluginSources: [
				{
					type: 'git',
					url: 'https://github.com/WordPress/gutenberg.git',
					ref: 'master',
					path: expect.stringMatching( /^\/.*gutenberg$/ ),
					basename: 'gutenberg',
				},
				{
					type: 'git',
					url: 'https://github.com/WordPress/gutenberg.git',
					ref: 'master',
					path: expect.stringMatching( /^\/.*gutenberg$/ ),
					basename: 'gutenberg',
				},
				{
					type: 'git',
					url: 'https://github.com/WordPress/gutenberg.git',
					ref: '5.0',
					path: expect.stringMatching( /^\/.*gutenberg$/ ),
					basename: 'gutenberg',
				},
			],
		} );
	} );

	it( 'should throw a validaton error if there is an unknown source', async () => {
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { plugins: [ 'invalid' ] } ) )
		);
		expect.assertions( 2 );
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain(
				'Invalid or unrecognized source'
			);
		}
	} );

	it( 'should throw a validaton error if the ports are not numbers', async () => {
		expect.assertions( 10 );
		testPortNumberValidation( 'port', 'string' );
		testPortNumberValidation( 'testsPort', [] );
		testPortNumberValidation( 'port', {} );
		testPortNumberValidation( 'testsPort', false );
		testPortNumberValidation( 'port', null );
	} );

	it( 'should throw a validaton error if the ports are the same', async () => {
		expect.assertions( 2 );
		readFile.mockImplementation( () =>
			Promise.resolve( JSON.stringify( { port: 8888, testsPort: 8888 } ) )
		);
		try {
			await readConfig( '.wp-env.json' );
		} catch ( error ) {
			expect( error ).toBeInstanceOf( ValidationError );
			expect( error.message ).toContain(
				'Invalid .wp-env.json: "testsPort" and "port" must be different.'
			);
		}
	} );

	it( 'should parse custom ports', async () => {
		readFile.mockImplementation( () =>
			Promise.resolve(
				JSON.stringify( {
					port: 1000,
				} )
			)
		);
		const config = await readConfig( '.wp-env.json' );
		// Custom port is overriden while testsPort gets the deault value.
		expect( config ).toMatchObject( {
			port: 1000,
			testsPort: 8889,
		} );
	} );
} );

/**
 * Tests that readConfig will throw errors when invalid port numbers are passed.
 *
 * @param {string} portName The name of the port to test ('port' or 'testsPort')
 * @param {any} value A value which should throw an error.
 */
async function testPortNumberValidation( portName, value ) {
	readFile.mockImplementation( () =>
		Promise.resolve( JSON.stringify( { [ portName ]: value } ) )
	);
	try {
		await readConfig( '.wp-env.json' );
	} catch ( error ) {
		expect( error ).toBeInstanceOf( ValidationError );
		expect( error.message ).toContain(
			`Invalid .wp-env.json: "${ portName }" must be an integer.`
		);
	}
	jest.clearAllMocks();
}
