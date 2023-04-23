'use strict';

/**
 * @typedef {import('./parse-config').WPServiceConfig} WPServiceConfig
 * @typedef {import('./parse-source-string').WPSource} WPSource
 */

/**
 * Error subtype which indicates that an expected validation erorr occurred
 * while reading wp-env configuration.
 */
class ValidationError extends Error {}

/**
 * Validates the port and throws if it isn't valid.
 *
 * @param {string} configFile The configuration file we're validating.
 * @param {string} configKey  The configuration key we're validating.
 * @param {number} port       The port to check.
 */
function checkPort( configFile, configKey, port ) {
	if ( port === undefined ) {
		return;
	}

	if ( ! Number.isInteger( port ) ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be an integer.`
		);
	}

	port = parseInt( port );

	if ( port < 0 || port > 65535 ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be a valid port.`
		);
	}
}

/**
 * Validates the array and throws if it isn't valid.
 *
 * @param {string}   configFile The config file we're validating.
 * @param {string}   configKey  The configuration key we're validating.
 * @param {string[]} array      The array that we're checking.
 */
function checkStringArray( configFile, configKey, array ) {
	if ( array === undefined ) {
		return;
	}

	if ( ! Array.isArray( array ) ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be an array.`
		);
	}

	if ( array.some( ( value ) => typeof value !== 'string' ) ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be an array of strings.`
		);
	}
}

/**
 * Validates the object and throws if it isn't valid.
 *
 * @param {string}   configFile The config file we're validating.
 * @param {string}   configKey  The configuration key we're validating.
 * @param {string[]} obj        The object that we're checking.
 * @param {string[]} allowTypes The types that are allowed.
 */
function checkObjectWithValues( configFile, configKey, obj, allowTypes ) {
	if ( obj === undefined ) {
		return;
	}

	if ( typeof obj !== 'object' ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be an object.`
		);
	}

	if ( ! allowTypes ) {
		return;
	}

	for ( const key in obj ) {
		if ( ! obj[ key ] && ! allowTypes.includes( 'empty' ) ) {
			throw new ValidationError(
				`Invalid ${ configFile }: "${ configKey }.${ key }" must not be empty..`
			);
		}

		if ( ! allowTypes.includes( typeof obj[ key ] ) ) {
			throw new ValidationError(
				`Invalid ${ configFile }: "${ configKey }.${ key }" must be a ${ allowTypes.join(
					' or '
				) }.`
			);
		}
	}
}

/**
 * Validates the version and throws if it isn't valid.
 *
 * @param {string} configFile The config file we're validating.
 * @param {string} configKey  The configuration key we're validating.
 * @param {string} version    The version that we're checking.
 */
function checkVersion( configFile, configKey, version ) {
	if ( version === undefined || version === null ) {
		return;
	}

	if ( typeof version !== 'string' ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be a string.`
		);
	}

	if ( ! version.match( /[0-9]+\.[0-9]+/ ) ) {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be a string of the format "0.0".`
		);
	}
}

/**
 * Validates the url and throws if it isn't valid.
 *
 * @param {string} configFile The config file we're validating.
 * @param {string} configKey  The configuration key we're validating.
 * @param {string} url        The URL that we're checking.
 */
function checkValidURL( configFile, configKey, url ) {
	if ( url === undefined ) {
		return;
	}

	try {
		new URL( url );
	} catch {
		throw new ValidationError(
			`Invalid ${ configFile }: "${ configKey }" must be a valid URL.`
		);
	}
}

module.exports = {
	ValidationError,
	checkPort,
	checkStringArray,
	checkObjectWithValues,
	checkVersion,
	checkValidURL,
};
