'use strict';
/* eslint-disable jest/no-conditional-expect */
/**
 * External dependencies
 */
const { stat } = require( 'fs' ).promises;
const { homedir } = require( 'os' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const parseConfig = require( '../parse-config' );
const readRawConfigFile = require( '../read-raw-config-file' );
const { getLatestWordPressVersion } = require( '../../wordpress' );
const { ValidationError } = require( '../validate-config' );
const detectDirectoryType = require( '../detect-directory-type' );

jest.mock( 'fs', () => ( {
	promises: {
		stat: jest.fn(),
	},
} ) );
jest.mock( 'os', () => ( {
	homedir: jest.fn().mockReturnValue( '/home/test' ),
} ) );
jest.mock( 'got', () => jest.fn() );
jest.mock( '../read-raw-config-file', () => jest.fn() );
jest.mock( '../detect-directory-type', () => jest.fn() );
jest.mock( '../../wordpress' );

/**
 * Since our configurations are merged, we will want to refer to the parsed default config frequently.
 */
const DEFAULT_CONFIG = {
	port: 8888,
	phpVersion: null,
	coreSource: {
		type: 'git',
		url: 'https://github.com/WordPress/WordPress.git',
		ref: '100.0.0',
		path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
		clonePath:
			'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
		basename: 'WordPress',
		testsPath:
			'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
	},
	pluginSources: [],
	themeSources: [],
	config: {
		WP_DEBUG: true,
		SCRIPT_DEBUG: true,
		WP_ENVIRONMENT_TYPE: 'local',
		WP_PHP_BINARY: 'php',
		WP_TESTS_EMAIL: 'admin@example.org',
		WP_TESTS_TITLE: 'Test Blog',
		WP_TESTS_DOMAIN: 'localhost',
		WP_SITEURL: 'http://localhost',
		WP_HOME: 'http://localhost',
	},
	mappings: {},
	env: {
		development: {},
		tests: {
			port: 8889,
			config: {
				WP_DEBUG: false,
				SCRIPT_DEBUG: false,
			},
		},
	},
};

describe( 'parseConfig', () => {
	beforeEach( () => {
		stat.mockReturnValue( Promise.reject( false ) );
		readRawConfigFile.mockReturnValue( null );
		getLatestWordPressVersion.mockReturnValue(
			Promise.resolve( '100.0.0' )
		);
		detectDirectoryType.mockReturnValue( Promise.resolve( null ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
		delete process.env.WP_ENV_HOME;
	} );

	it( 'should return default config', async () => {
		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( DEFAULT_CONFIG );
	} );

	it( 'should infer a core mounting default when ran from a WordPress directory', async () => {
		detectDirectoryType.mockReturnValue( Promise.resolve( 'core' ) );

		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( {
			...DEFAULT_CONFIG,
			coreSource: {
				basename: 'gutenberg',
				path: path.resolve( '.' ),
				testsPath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-gutenberg',
				type: 'local',
			},
		} );
	} );

	it( 'should infer a plugin mounting default when ran from a plugin directory', async () => {
		detectDirectoryType.mockReturnValue( Promise.resolve( 'plugin' ) );

		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( {
			...DEFAULT_CONFIG,
			pluginSources: [
				{
					basename: 'gutenberg',
					path: path.resolve( '.' ),
					type: 'local',
				},
			],
		} );
	} );

	it( 'should infer a theme mounting default when ran from a theme directory', async () => {
		detectDirectoryType.mockReturnValue( Promise.resolve( 'theme' ) );

		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( {
			...DEFAULT_CONFIG,
			themeSources: [
				{
					basename: 'gutenberg',
					path: path.resolve( '.' ),
					type: 'local',
				},
			],
		} );
	} );

	it( 'should merge configs with precedence', async () => {
		readRawConfigFile.mockImplementation( async ( configFile ) => {
			if ( configFile === './.wp-env.json' ) {
				return {
					core: 'WordPress/WordPress#Test',
					phpVersion: '1.0',
					env: {
						development: {
							port: 1234,
						},
						tests: {
							port: 5678,
						},
					},
				};
			}

			if ( configFile === './.wp-env.override.json' ) {
				return {
					phpVersion: '2.0',
					env: {
						tests: {
							port: 1011,
						},
					},
				};
			}

			throw new Error( 'Invalid File: ' + configFile );
		} );

		const parsed = await parseConfig( './' );

		const expected = {
			...DEFAULT_CONFIG,
			coreSource: {
				basename: 'WordPress',
				path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				clonePath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				ref: 'Test',
				testsPath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
				url: 'https://github.com/WordPress/WordPress.git',
				type: 'git',
			},
			phpVersion: '2.0',
		};
		expected.env.development.port = 1234;
		expected.env.tests.port = 1011;
		expect( parsed ).toEqual( expected );
	} );

	it( 'should parse core, plugin, theme, and mapping sources', async () => {
		readRawConfigFile.mockImplementation( async ( configFile ) => {
			if ( configFile === './.wp-env.json' ) {
				return {
					core: 'WordPress/WordPress#Test',
					plugins: [ 'WordPress/TestPlugin#Test' ],
					themes: [ 'WordPress/TestTheme#Test' ],
					mappings: {
						'/var/www/html/wp-content/plugins/test-mapping':
							'WordPress/TestMapping#Test',
					},
				};
			}

			if ( configFile === './.wp-env.override.json' ) {
				return {};
			}

			throw new Error( 'Invalid File: ' + configFile );
		} );

		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( {
			...DEFAULT_CONFIG,
			coreSource: {
				basename: 'WordPress',
				path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				clonePath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				ref: 'Test',
				testsPath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
				url: 'https://github.com/WordPress/WordPress.git',
				type: 'git',
			},
			pluginSources: [
				{
					basename: 'TestPlugin',
					path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestPlugin',
					clonePath:
						'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestPlugin',
					ref: 'Test',
					url: 'https://github.com/WordPress/TestPlugin.git',
					type: 'git',
				},
			],
			themeSources: [
				{
					basename: 'TestTheme',
					path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestTheme',
					clonePath:
						'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestTheme',
					ref: 'Test',
					url: 'https://github.com/WordPress/TestTheme.git',
					type: 'git',
				},
			],
			mappings: {
				'/var/www/html/wp-content/plugins/test-mapping': {
					basename: 'TestMapping',
					path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestMapping',
					clonePath:
						'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/TestMapping',
					ref: 'Test',
					url: 'https://github.com/WordPress/TestMapping.git',
					type: 'git',
				},
			},
		} );
	} );

	it( 'should override with environment variables', async () => {
		process.env.WP_ENV_PORT = 123;
		process.env.WP_ENV_TESTS_PORT = 456;
		process.env.WP_ENV_CORE = 'WordPress/WordPress#test';
		process.env.WP_ENV_PHP_VERSION = '3.0';

		const parsed = await parseConfig( './' );

		expect( parsed ).toEqual( {
			...DEFAULT_CONFIG,
			port: 123,
			testsPort: 456,
			coreSource: {
				basename: 'WordPress',
				path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				clonePath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
				ref: 'test',
				testsPath:
					'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
				url: 'https://github.com/WordPress/WordPress.git',
				type: 'git',
			},
			phpVersion: '3.0',
			env: {
				development: {
					port: 123,
					phpVersion: '3.0',
					coreSource: {
						basename: 'WordPress',
						path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
						clonePath:
							'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
						ref: 'test',
						testsPath:
							'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
						url: 'https://github.com/WordPress/WordPress.git',
						type: 'git',
					},
				},
				tests: {
					port: 456,
					phpVersion: '3.0',
					coreSource: {
						basename: 'WordPress',
						path: '/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
						clonePath:
							'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/WordPress',
						ref: 'test',
						testsPath:
							'/home/test/.wp-env/0afa32312977c8e3510775b85c20017d/tests-WordPress',
						url: 'https://github.com/WordPress/WordPress.git',
						type: 'git',
					},
					config: {
						WP_DEBUG: false,
						SCRIPT_DEBUG: false,
					},
				},
			},
		} );
	} );

	it( 'throws when latest WordPress version needed but not found', async () => {
		getLatestWordPressVersion.mockReturnValue( null );

		expect.assertions( 1 );
		try {
			const parsed = await parseConfig( './' );
			console.log( parsed );
		} catch ( e ) {
			expect( e ).toEqual(
				new ValidationError(
					'Could not find the latest WordPress version. There may be a network issue.'
				)
			);
		}
	} );

	it( 'uses WP_ENV_HOME for cache directory when set', async () => {
		process.env.WP_ENV_HOME = '/test';

		const parsed = await parseConfig( './' );

		expect( homedir ).not.toHaveBeenCalled();
		expect( parsed.coreSource.path ).toEqual(
			'/test/0afa32312977c8e3510775b85c20017d/WordPress'
		);
	} );

	it( 'uses non-hidden cache directory when using Snao-installed Docker', async () => {
		stat.mockReturnValue( Promise.resolve( true ) );

		const parsed = await parseConfig( './' );

		expect( homedir ).toHaveBeenCalled();
		expect( parsed.coreSource.path ).toEqual(
			'/home/test/wp-env/0afa32312977c8e3510775b85c20017d/WordPress'
		);
	} );
} );
/* eslint-enable jest/no-conditional-expect */
