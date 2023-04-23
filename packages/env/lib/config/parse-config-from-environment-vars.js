'use strict';
/**
 * Internal dependencies
 */
const {
	parseSourceString,
	includeTestsPath,
} = require( './parse-source-string' );
const { checkPort, checkVersion } = require( './validate-config' );

/**
 * @typedef {import('./parse-source-string').WPSource} WPSource
 */

/**
 * Environment variable configuration.
 *
 * @typedef WPEnvironmentVariableConfig
 * @property {?number}   port       An override for the development environment's port.
 * @property {?number}   testsPort  An override for the testing environment's port.
 * @property {?WPSource} coreSource An override for all environment's coreSource.
 * @property {?string}   phpVersion An override for all environment's PHP version.
 */

/**
 * Parses configuration options from environment variables.
 *
 * @param {string} cacheDirectoryPath Path to the work directory located in ~/.wp-env.
 *
 * @return {WPEnvironmentVariableConfig} Any configuration options parsed from the environment variables.
 */
module.exports = function parseConfigFromEnvironmentVars( cacheDirectoryPath ) {
	const environmentConfig = {
		port: getPortFromEnvironmentVariable( 'WP_ENV_PORT' ),
		testsPort: getPortFromEnvironmentVariable( 'WP_ENV_TESTS_PORT' ),
	};

	if ( process.env.WP_ENV_CORE ) {
		environmentConfig.coreSource = includeTestsPath(
			parseSourceString( process.env.WP_ENV_CORE, {
				cacheDirectoryPath,
			} ),
			{ cacheDirectoryPath }
		);
	}

	if ( process.env.WP_ENV_PHP_VERSION ) {
		checkVersion(
			'environment variable',
			'WP_ENV_PHP_VERSION',
			process.env.WP_ENV_PHP_VERSION
		);
		environmentConfig.phpVersion = process.env.WP_ENV_PHP_VERSION;
	}

	return environmentConfig;
};

/**
 * Parses an environment variable which should be a port.
 *
 * @param {string} varName The environment variable to check (e.g. WP_ENV_PORT).
 *
 * @return {number} The parsed port number
 */
function getPortFromEnvironmentVariable( varName ) {
	if ( ! process.env[ varName ] ) {
		return undefined;
	}

	const port = parseInt( process.env[ varName ] );

	// Throw an error if it is not parseable as a number.
	checkPort( 'environment variable', varName, port );

	return port;
}
