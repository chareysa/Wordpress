'use strict';
/**
 * External dependencies
 */
const path = require( 'path' );
const fs = require( 'fs' ).promises;
const os = require( 'os' );

/**
 * Internal dependencies
 */
const md5 = require( '../md5' );
const readRawConfigFile = require( './read-raw-config-file' );
const {
	parseSourceString,
	includeTestsPath,
} = require( './parse-source-string' );
const {
	ValidationError,
	checkPort,
	checkStringArray,
	checkObjectWithValues,
	checkVersion,
	checkValidURL,
} = require( './validate-config' );
const parseConfigFromEnvironmentVars = require( './parse-config-from-environment-vars' );
const detectDirectoryType = require( './detect-directory-type' );
const { getLatestWordPressVersion } = require( '../wordpress' );
const mergeConfigs = require( './merge-configs' );
const postProcessConfig = require( './post-process-config' );

/**
 * @typedef {import('./parse-source-string').WPSource} WPSource
 */

/**
 * Base-level config for any particular environment. (development/tests/etc)
 *
 * @typedef WPServiceConfig
 * @property {WPSource}                  coreSource    The WordPress installation to load in the environment.
 * @property {WPSource[]}                pluginSources Plugins to load in the environment.
 * @property {WPSource[]}                themeSources  Themes to load in the environment.
 * @property {number}                    port          The port to use.
 * @property {Object}                    config        Mapping of wp-config.php constants to their desired values.
 * @property {Object.<string, WPSource>} mappings      Mapping of WordPress directories to local directories which should be mounted.
 * @property {string}                    phpVersion    Version of PHP to use in the environments, of the format 0.0.
 */

/**
 * A WordPress installation, plugin or theme to be loaded into the environment.
 *
 * @typedef WPSource
 * @property {'local'|'git'|'zip'} type     The source type.
 * @property {string}              path     The path to the WordPress installation, plugin or theme.
 * @property {?string}             url      The URL to the source download if the source type is not local.
 * @property {?string}             ref      The git ref for the source if the source type is 'git'.
 * @property {string}              basename Name that identifies the WordPress installation, plugin or theme.
 */

/**
 * Given a directory, this parses any relevant config files and
 * constructs an object in the format used internally.
 *
 * @param {string} configDirectoryPath A path to the directory we are parsing the config for.
 *
 * @return {WPServiceConfig} Parsed config.
 */
module.exports = async function parseConfig( configDirectoryPath ) {
	const configFile = configDirectoryPath + '.wp-env.json';
	const overrideConfigFile = configDirectoryPath + '.wp-env.override.json';

	const cacheDirectoryPath = path.resolve(
		await getCacheDirectory(),
		md5( configFile )
	);

	// The local config will be used to override any defaults.
	const localConfig = await parseConfigFile( configFile, {
		cacheDirectoryPath,
	} );

	// The default config will be used when no local config
	// file is present in this directory. We should also
	// infer the project type when there is no local
	// config file present to use.
	const defaultConfig = await getDefaultConfig( configDirectoryPath, {
		shouldInferType: !! localConfig,
		cacheDirectoryPath,
	} );

	// Any overrides that can be used in place
	// of properties set by the local config.
	const overrideConfig = await parseConfigFile( overrideConfigFile, {
		cacheDirectoryPath,
	} );

	// Users can provide overrides in environment
	// variables that supercede all other options.
	const environmentVarOverrides =
		getEnvironmentVarOverrides( cacheDirectoryPath );

	// Merge all of our configs so that we have a complete object
	// containing the desired options in order of precedence.
	const mergedConfig = mergeConfigs(
		defaultConfig,
		localConfig,
		overrideConfig,
		environmentVarOverrides
	);

	// Make sure to perform any additional post-processing that
	// may be needed before the config object is ready for
	// consumption elsewhere in the tool.
	return postProcessConfig( mergedConfig );
};

/**
 * Gets the default config that can be overridden.
 *
 * @param {string} configDirectoryPath        A path to the config file's directory.
 * @param {Object} options
 * @param {string} options.shouldInferType    Indicates whether or not we should infer the type of project wp-env is being used in.
 * @param {string} options.cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {Promise<WPServiceConfig>} The default config object.
 */
async function getDefaultConfig(
	configDirectoryPath,
	{ shouldInferType, cacheDirectoryPath }
) {
	// Our default config should try to infer what type of project
	// this is in order to automatically map the current directory.
	const type = shouldInferType
		? await detectDirectoryType( configDirectoryPath )
		: null;

	const rawConfig = {
		core: type === 'core' ? '.' : null,
		phpVersion: null,
		plugins: type === 'plugin' ? [ '.' ] : [],
		themes: type === 'theme' ? [ '.' ] : [],
		port: 8888,
		mappings: {},
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
		env: {
			development: {}, // No overrides needed, but it should exist.
			tests: {
				config: { WP_DEBUG: false, SCRIPT_DEBUG: false },
				port: 8889,
			},
		},
	};

	return await parseRootConfig( 'default', rawConfig, {
		cacheDirectoryPath,
	} );
}

/**
 * Gets a service configuration object containing overrides from our environment variables.
 *
 * @param {string} cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {WPServiceConfig} An object containing the environment variable overrides.
 */
function getEnvironmentVarOverrides( cacheDirectoryPath ) {
	const overrides = parseConfigFromEnvironmentVars( cacheDirectoryPath );

	// Create a service config object so we can merge it with the others
	// and override anything that the configuration options need to.
	const overrideConfig = {
		env: {
			development: {},
			tests: {},
		},
	};

	// We're going to take care to set it at both the root-level and the
	// environment level. This is not totally necessary, but, it's a
	// better representation of how broad the override is.

	if ( overrides.port ) {
		overrideConfig.port = overrides.port;
		overrideConfig.env.development.port = overrides.port;
	}

	if ( overrides.testsPort ) {
		overrideConfig.testsPort = overrides.testsPort;
		overrideConfig.env.tests.port = overrides.testsPort;
	}

	if ( overrides.coreSource ) {
		overrideConfig.coreSource = overrides.coreSource;
		overrideConfig.env.development.coreSource = overrides.coreSource;
		overrideConfig.env.tests.coreSource = overrides.coreSource;
	}

	if ( overrides.phpVersion ) {
		overrideConfig.phpVersion = overrides.phpVersion;
		overrideConfig.env.development.phpVersion = overrides.phpVersion;
		overrideConfig.env.tests.phpVersion = overrides.phpVersion;
	}

	return overrideConfig;
}

/**
 * Gets the directory in which generated files are created.
 *
 * By default: '~/.wp-env/'. On Linux with snap packages: '~/wp-env/'. Can be
 * overridden with the WP_ENV_HOME environment variable.
 *
 * @return {Promise<string>} The absolute path to the `wp-env` home directory.
 */
async function getCacheDirectory() {
	// Allow user to override download location.
	if ( process.env.WP_ENV_HOME ) {
		return path.resolve( process.env.WP_ENV_HOME );
	}

	/**
	 * Installing docker with Snap Packages on Linux is common, but does not
	 * support hidden directories. Therefore we use a public directory when
	 * snap packages exist.
	 *
	 * @see https://github.com/WordPress/gutenberg/issues/20180#issuecomment-587046325
	 */
	let usesSnap;
	try {
		await fs.stat( '/snap' );
		usesSnap = true;
	} catch {
		usesSnap = false;
	}

	return path.resolve( os.homedir(), usesSnap ? 'wp-env' : '.wp-env' );
}

/**
 * Parses a raw config into an unvalidated service config.
 *
 * @param {string} configFile                 The config file that we're parsing.
 * @param {Object} options
 * @param {string} options.cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {Promise<WPServiceConfig>} The config service object.
 */
async function parseConfigFile( configFile, options ) {
	const rawConfig = await readRawConfigFile( configFile );
	if ( ! rawConfig ) {
		return {};
	}

	return await parseRootConfig( configFile, rawConfig, options );
}

/**
 * Parses the root config object.
 *
 * @param {string} configFile                 The config file we're parsing.
 * @param {Object} rawConfig                  The raw config we're parsing.
 * @param {Object} options
 * @param {string} options.cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {Promise<WPServiceConfig>} The root config object.
 */
async function parseRootConfig( configFile, rawConfig, options ) {
	const parsedConfig = await parseServiceConfig(
		configFile,
		null,
		rawConfig,
		options
	);

	// Parse the environment-specific configs so they're accessible to the root.
	parsedConfig.env = {};
	if ( rawConfig.env ) {
		checkObjectWithValues( configFile, 'env', rawConfig.env, [ 'object' ] );
		for ( const env in rawConfig.env ) {
			parsedConfig.env[ env ] = await parseServiceConfig(
				configFile,
				env,
				rawConfig.env[ env ],
				options
			);
		}
	}

	return parsedConfig;
}

/**
 * Parses and validates a raw config object and returns a validated service config to use internally.
 *
 * @param {string}      configFile                 The config file that we're parsing.
 * @param {string|null} environment                If set, the environment that we're parsing the config for.
 * @param {Object}      config                     A config object to parse.
 * @param {Object}      options
 * @param {string}      options.cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {Promise<WPServiceConfig>} The config service object.
 */
async function parseServiceConfig( configFile, environment, config, options ) {
	if ( ! config ) {
		return {};
	}

	const environmentPrefix = environment ? environment + '.' : '';

	const parsedConfig = {};

	if ( config.port !== undefined ) {
		checkPort( configFile, `${ environmentPrefix }port`, config.port );
		parsedConfig.port = config.port;
	}

	if ( config.phpVersion !== undefined ) {
		checkVersion(
			configFile,
			`${ environmentPrefix }phpVersion`,
			config.phpVersion
		);
		parsedConfig.phpVersion = config.phpVersion;
	}

	if ( config.core !== undefined ) {
		parsedConfig.coreSource = includeTestsPath(
			await parseCoreSource( config.core, options ),
			options
		);
	}

	if ( config.plugins !== undefined ) {
		checkStringArray(
			configFile,
			`${ environmentPrefix }plugins`,
			config.plugins
		);
		parsedConfig.pluginSources = config.plugins.map( ( sourceString ) =>
			parseSourceString( sourceString, options )
		);
	}

	if ( config.themes !== undefined ) {
		checkStringArray(
			configFile,
			`${ environmentPrefix }themes`,
			config.themes
		);
		parsedConfig.themeSources = config.themes.map( ( sourceString ) =>
			parseSourceString( sourceString, options )
		);
	}

	if ( config.config !== undefined ) {
		checkObjectWithValues(
			configFile,
			`${ environmentPrefix }config`,
			config.config,
			[ 'string', 'number', 'boolean', 'empty' ]
		);
		parsedConfig.config = config.config;

		// There are some configuration options that have a special purpose and need to be validated too.
		for ( const key in parsedConfig.config ) {
			switch ( key ) {
				case 'WP_HOME':
				case 'WP_SITEURL': {
					checkValidURL(
						configFile,
						`${ environmentPrefix }config.${ key }`,
						parsedConfig[ key ]
					);
					break;
				}
			}
		}
	}

	if ( config.mappings !== undefined ) {
		checkObjectWithValues(
			configFile,
			`${ environmentPrefix }mappings`,
			config.mappings,
			[ 'string' ]
		);
		parsedConfig.mappings = Object.entries( config.mappings ).reduce(
			( result, [ wpDir, localDir ] ) => {
				const source = parseSourceString( localDir, options );
				result[ wpDir ] = source;
				return result;
			},
			{}
		);
	}

	return parsedConfig;
}

/**
 * Parses a WordPress Core source string or defaults to the latest version.
 *
 * @param {string|null} coreSource The WordPress course source string to parse.
 * @param {Object}      options    Options to use while parsing.
 * @return {Promise<Object>} The parsed source object.
 */
async function parseCoreSource( coreSource, options ) {
	// An empty source means we should use the latest version of WordPress.
	if ( ! coreSource ) {
		const wpVersion = await getLatestWordPressVersion();
		if ( ! wpVersion ) {
			throw new ValidationError(
				'Could not find the latest WordPress version. There may be a network issue.'
			);
		}

		coreSource = `WordPress/WordPress#${ wpVersion }`;
	}
	return parseSourceString( coreSource, options );
}
