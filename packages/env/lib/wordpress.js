/**
 * External dependencies
 */
const dockerCompose = require( 'docker-compose' );
const util = require( 'util' );
const fs = require( 'fs' ).promises;
const path = require( 'path' );

/**
 * Promisified dependencies
 */
const copyDir = util.promisify( require( 'copy-dir' ) );

/**
 * @typedef {import('./config').WPConfig} WPConfig
 * @typedef {import('./config').WPServiceConfig} WPServiceConfig
 * @typedef {'development'|'tests'} WPEnvironment
 * @typedef {'development'|'tests'|'all'} WPEnvironmentSelection
 */

/**
 * Makes the WordPress content directories (wp-content, wp-content/plugins,
 * wp-content/themes) owned by the www-data user. This ensures that WordPress
 * can write to these directories.
 *
 * This is necessary when running wp-env with `"core": null` because Docker
 * will automatically create these directories as the root user when binding
 * volumes during `docker-compose up`, and `docker-compose up` doesn't support
 * the `-u` option.
 *
 * See https://github.com/docker-library/wordpress/issues/436.
 *
 * @param {WPEnvironment} environment The environment to check. Either 'development' or 'tests'.
 * @param {WPConfig}      config      The wp-env config object.
 */
async function makeContentDirectoriesWritable(
	environment,
	{ dockerComposeConfigPath, debug }
) {
	await dockerCompose.exec(
		environment === 'development' ? 'wordpress' : 'tests-wordpress',
		'chown www-data:www-data wp-content wp-content/plugins wp-content/themes',
		{
			config: dockerComposeConfigPath,
			log: debug,
		}
	);
}

/**
 * Checks a WordPress database connection. An error is thrown if the test is
 * unsuccessful.
 *
 * @param {WPConfig} config The wp-env config object.
 */
async function checkDatabaseConnection( { dockerComposeConfigPath, debug } ) {
	await dockerCompose.run( 'cli', 'wp db check', {
		config: dockerComposeConfigPath,
		commandOptions: [ '--rm' ],
		log: debug,
	} );
}

/**
 * Configures WordPress for the given environment by installing WordPress,
 * activating all plugins, and activating the first theme. These steps are
 * performed sequentially so as to not overload the WordPress instance.
 *
 * @param {WPEnvironment} environment The environment to configure. Either 'development' or 'tests'.
 * @param {WPConfig}      config      The wp-env config object.
 */
async function configureWordPress( environment, config ) {
	const options = {
		config: config.dockerComposeConfigPath,
		commandOptions: [ '--rm' ],
		log: config.debug,
	};

	const port = config.env[ environment ].port;

	// Install WordPress.
	await dockerCompose.run(
		environment === 'development' ? 'cli' : 'tests-cli',
		[
			'wp',
			'core',
			'install',
			`--url=localhost:${ port }`,
			`--title=${ config.name }`,
			'--admin_user=admin',
			'--admin_password=password',
			'--admin_email=wordpress@example.com',
			'--skip-email',
		],
		options
	);

	// Set wp-config.php values.
	for ( const [ key, value ] of Object.entries(
		config.env[ environment ].config
	) ) {
		const command = [ 'wp', 'config', 'set', key, value ];
		if ( typeof value !== 'string' ) {
			command.push( '--raw' );
		}
		await dockerCompose.run(
			environment === 'development' ? 'cli' : 'tests-cli',
			command,
			options
		);
	}

	// Activate all plugins.
	for ( const pluginSource of config.env[ environment ].pluginSources ) {
		await dockerCompose.run(
			environment === 'development' ? 'cli' : 'tests-cli',
			`wp plugin activate ${ pluginSource.basename }`,
			options
		);
	}

	// Activate the first theme.
	const [ themeSource ] = config.env[ environment ].themeSources;
	if ( themeSource ) {
		await dockerCompose.run(
			environment === 'development' ? 'cli' : 'tests-cli',
			`wp theme activate ${ themeSource.basename }`,
			options
		);
	}

	// Since wp-phpunit loads wp-settings.php at the end of its wp-config.php
	// file, we need to avoid loading it too early in our own wp-config.php. If
	// we load it too early, then some things (like MULTISITE) will be defined
	// before wp-phpunit has a chance to configure them. To avoid this, create a
	// copy of wp-config.php for phpunit which doesn't require wp-settings.php.
	await dockerCompose.exec(
		environment === 'development' ? 'wordpress' : 'tests-wordpress',
		[
			'sh',
			'-c',
			'sed "/^require.*wp-settings.php/d" /var/www/html/wp-config.php > /var/www/html/phpunit-wp-config.php',
		],
		{
			config: config.dockerComposeConfigPath,
			log: config.debug,
		}
	);
}

/**
 * Resets the development server's database, the tests server's database, or both.
 *
 * @param {WPEnvironmentSelection} environment The environment to clean. Either 'development', 'tests', or 'all'.
 * @param {WPConfig}               config      The wp-env config object.
 */
async function resetDatabase(
	environment,
	{ dockerComposeConfigPath, debug }
) {
	const options = {
		config: dockerComposeConfigPath,
		commandOptions: [ '--rm' ],
		log: debug,
	};

	const tasks = [];

	if ( environment === 'all' || environment === 'development' ) {
		tasks.push( dockerCompose.run( 'cli', 'wp db reset --yes', options ) );
	}

	if ( environment === 'all' || environment === 'tests' ) {
		tasks.push(
			dockerCompose.run( 'tests-cli', 'wp db reset --yes', options )
		);
	}

	await Promise.all( tasks );
}

async function setupWordPressDirectories( config ) {
	if ( hasSameCoreSource( [ config.env.development, config.env.tests ] ) ) {
		await copyCoreFiles(
			config.coreSource.path,
			config.coreSource.testsPath
		);
		await createUploadsDir( config.coreSource.testsPath );
	}

	const checkedPaths = {};
	for ( const { coreSource } of Object.values( config.env ) ) {
		if ( coreSource && ! checkedPaths[ coreSource.path ] ) {
			await createUploadsDir( coreSource.path );
			checkedPaths[ coreSource.path ] = true;
		}
	}
}

async function createUploadsDir( corePath ) {
	// Ensure the tests uploads folder is writeable for travis,
	// creating the folder if necessary. @TODO move elsewhere.
	const uploadPath = path.join( corePath, 'wp-content/uploads' );
	await fs.mkdir( uploadPath, { recursive: true } );
	await fs.chmod( uploadPath, 0o0767 );
}

/**
 * Returns true if all given environment configs have the same core source.
 *
 * @param {WPServiceConfig} envs An array of environments to check.
 *
 * @return {boolean} True if all the environments have the same core source.
 */
function hasSameCoreSource( envs ) {
	if ( envs.length < 2 ) {
		return true;
	}
	const coreSource = envs[ 0 ].coreSource;
	for ( const env in envs ) {
		// If one does not have a core source but the other does.
		if (
			( ! coreSource && env.coreSource ) ||
			( coreSource && ! env.coreSource )
		) {
			return false;
		}
		// If both have core sources but the paths are different.
		if (
			coreSource &&
			env.coreSource &&
			coreSource.path !== env.coreSource.path
		) {
			return false;
		}
	}
	return true;
}

/**
 * Copies a WordPress installation, taking care to ignore large directories
 * (.git, node_modules) and configuration files (wp-config.php).
 *
 * @param {string} fromPath Path to the WordPress directory to copy.
 * @param {string} toPath Destination path.
 */
async function copyCoreFiles( fromPath, toPath ) {
	await copyDir( fromPath, toPath, {
		filter( stat, filepath, filename ) {
			if ( stat === 'symbolicLink' ) {
				return false;
			}
			if ( stat === 'directory' && filename === '.git' ) {
				return false;
			}
			if ( stat === 'directory' && filename === 'node_modules' ) {
				return false;
			}
			if ( stat === 'file' && filename === 'wp-config.php' ) {
				return false;
			}
			return true;
		},
	} );
}

module.exports = {
	hasSameCoreSource,
	makeContentDirectoriesWritable,
	checkDatabaseConnection,
	configureWordPress,
	resetDatabase,
	setupWordPressDirectories,
};
