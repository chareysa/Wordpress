/**
 * External dependencies
 */
const { isPlainObject } = require( 'lodash' );
const request = require( 'request' );
const DecompressZip = require( 'decompress-zip' );
const chalk = require( 'chalk' );
const { sprintf } = require( 'sprintf-js' );
const getAppDataPath = require( 'appdata-path' );

/**
 * Node dependencies.
 */
const { execSync } = require( 'child_process' );
const { env, exit, stdout } = require( 'process' );
const { normalize } = require( 'path' );
const { createWriteStream, mkdirSync } = require( 'fs' );
const { tmpdir } = require( 'os' );

/**
 * Merges two YAML configs together.
 *
 * All new data from newConfig will be added to originalConfig. When arrays in newConfig look like lists of volume
 * mount instructions, it will attempt to replace items that mount from the same location. This allows the config
 * to be safely updated, and it'll be reflected in the updated config.
 *
 * @param {Object} originalConfig The original config object that we're overwriting.
 * @param {Object} newConfig      A new config object to merge into originalConfig.
 * @param {string} baseDir        The base directory of the plugin, volumes in this directory belong to the plugin.
 * @return {Object} The merged config object.
 */
function mergeYAMLConfigs( originalConfig, newConfig, baseDir ) {
	// Loop through each element of newConfig, and test what should be done with them.
	Object.keys( newConfig ).forEach( ( key ) => {
		if ( ! originalConfig[ key ] ) {
			// If the originalConfig object doesn't have this element, we can just add it.
			originalConfig[ key ] = newConfig[ key ];
		} else if ( Array.isArray( newConfig[ key ] ) ) {
			// If the newConfig element is an array, we need to try and merge them.
			// This is intended to merge Docker volume configs, which exist in the form:
			// /path/to/local/dir:/path/to/container/dir:config:stuff

			// Build an array from the original config, with items that belong to this plugin removed.
			const cleanOriginal = originalConfig[ key ].filter( ( element ) => {
				return ! element.startsWith( baseDir );
			} );

			// Append the newConfig to the remaining config.
			originalConfig[ key ] = [ ...cleanOriginal, ...newConfig[ key ] ];
		} else if ( isPlainObject( newConfig[ key ] ) ) {
			// If the newConfig element is an object, we need to recursively merge it.
			originalConfig[ key ] = mergeYAMLConfigs( originalConfig[ key ], newConfig[ key ], baseDir );
		} else {
			// Any other data types are overwritten by the newConfig.
			originalConfig[ key ] = newConfig[ key ];
		}
	} );

	return originalConfig;
}

/**
 * Installs the latest version of the WordPress nightly build in the managed WordPress directory.
 */
async function installManagedWordPress() {
	mkdirSync( getManagedWordPressPath(), { recursive: true } );
	let envVars = '';
	if ( env.PHP_FPM_UID ) {
		envVars += `--env PHP_FPM_UID=${ env.PHP_FPM_UID }`;
	}
	if ( env.PHP_FPM_GID ) {
		envVars += `--env PHP_FPM_GID=${ env.PHP_FPM_GID }`;
	}
	execSync( `docker run -it --rm ${ envVars } --volume "` + getManagedWordPressPath() + ':/var/www" docker.pkg.github.com/wordpress/wpdev-docker-images/cli:latest-16 core download --path=/var/www/src --version=nightly --force', { stdio: 'inherit' } );

	await new Promise( ( resolve ) => {
		const tmpZip = normalize( tmpdir() + '/wordpress-develop.zip' );
		const tmpZipWriter = createWriteStream( tmpZip );

		// Set up the unzipper to unzip the archive when it finishes downloading.
		tmpZipWriter.on( 'finish', () => {
			const unzipper = new DecompressZip( tmpZip );

			unzipper.on( 'error', ( error ) => {
				stdout.write( "ERROR: The zip file couldn't be unzipped.\n" );
				stdout.write( error.toString() );
				exit( 1 );
			} );

			unzipper.on( 'extract', resolve );

			stdout.write( 'Extracting...\n' );

			unzipper.extract( {
				path: getManagedWordPressPath(),
				strip: 1,
				filter: ( file ) => {
					if ( file.type === 'Directory' ) {
						return false;
					}

					const allowedFolders = [
						'tools',
						'tests',
					];
					const allowedFiles = [
						'.env',
						'docker-compose.yml',
						'package.json',
						'wp-cli.yml',
						'wp-tests-config-sample.php',
					];

					const path = file.path.replace( /[^\/]+\//, '' );

					if ( allowedFiles.includes( path ) ) {
						return true;
					}

					return allowedFolders.reduce( ( allowCopy, folder ) => {
						if ( allowCopy ) {
							return allowCopy;
						}

						return path.startsWith( folder + '/' );
					}, false );
				},
			} );
		} );

		stdout.write( 'Downloading...\n' );
		// Download the archive.
		request
			.get( 'https://github.com/WordPress/wordpress-develop/archive/master.zip' )
			.on( 'error', ( error ) => {
				stdout.write( "ERROR: The zip file couldn't be downloaded.\n" );
				stdout.write( error.toString() );
				exit( 1 );
			} )
			.pipe( tmpZipWriter );
	} );
}

/**
 * Runs the appropriate build/install commands in the WordPress directory.
 *
 * @param {boolean} newInstall  Flag whether to treat this as a new WordPress install or not.
 * @param {boolean} fastInstall When set, assumes NPM dependencies are already downloaded, and build commands have been run.
 */
async function buildWordPress( newInstall, fastInstall ) {
	// Mount the plugin into the WordPress install.
	execSync( 'npm run env connect -- --no-restart', { stdio: 'inherit' } );

	if ( ! fastInstall ) {
		execSync( 'npm install dotenv wait-on', { cwd: env.WP_DEVELOP_DIR, stdio: 'inherit' } );
		execSync( 'npm run env:start', { cwd: env.WP_DEVELOP_DIR, stdio: 'inherit' } );
		await new Promise( ( resolve ) => {
			setTimeout( resolve, 10000 );
		} );
	}

	if ( newInstall ) {
		execSync( 'npm run env:install', { cwd: env.WP_DEVELOP_DIR, stdio: 'inherit' } );
	}

	if ( newInstall ) {
		execSync( `npm run env cli plugin activate ${ env.npm_package_wp_env_plugin_dir }`, { stdio: 'inherit' } );

		const currentUrl = execSync( 'npm run --silent env cli option get siteurl' ).toString().trim();

		stdout.write( chalk.white( '\nWelcome to...\n' ) );
		for ( let ii = 0; env[ `npm_package_wp_env_welcome_logo_${ ii }` ]; ii++ ) {
			stdout.write( chalk.green( env[ `npm_package_wp_env_welcome_logo_${ ii }` ] ) + '\n' );
		}

		if ( env.npm_package_wp_env_welcome_build_command ) {
			const nextStep = sprintf(
				'\nRun %s to build the latest version of %s, then open %s to get started!\n',
				chalk.blue( env.npm_package_wp_env_welcome_build_command ),
				chalk.green( env.npm_package_wp_env_plugin_name ),
				chalk.blue( currentUrl )
			);
			stdout.write( chalk.white( nextStep ) );
		}

		stdout.write( chalk.white( '\nAccess the above install using the following credentials:\n' ) );

		const access = sprintf(
			'Default username: %s, password: %s\n',
			chalk.blue( 'admin' ),
			chalk.blue( 'password' )
		);

		stdout.write( chalk.white( access ) );
	}
}

/**
 * Returns the path to the managed WordPress install.
 *
 * @return {string} The path to WordPress.
 */
function getManagedWordPressPath() {
	return normalize( getAppDataPath() + '/wordpress-local-env' );
}

module.exports = {
	buildWordPress,
	getManagedWordPressPath,
	installManagedWordPress,
	mergeYAMLConfigs,
};
