'use strict';
/**
 * External dependencies
 */
const SimpleGit = require( 'simple-git' );
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * @typedef {import('./config').WPConfig} WPConfig
 */

/**
 * Downloads the WordPress PHPUnit files for each environment into the appropriate directories.
 * 
 * @param {WPConfig} config     The wp-env config object. 
 * @param {Object}   wpVersions The WordPress versions for each environment.
 * @param {Object}   spinner    The spinner object to show progress.
 * @param {boolean}  debug      Indicates whether or not debug mode is active.
 * @return {Promise} Returns a promise which resolves when the downloads finish.
 */
module.exports = function downloadWPPHPUnit( config, wpVersions, spinner, debug ) {
    const progresses = {};
	const getProgressSetter = ( id ) => ( progress ) => {
		progresses[ id ] = progress;
		spinner.text =
			'Downloading WordPress PHPUnit Suite.\n' +
			Object.entries( progresses )
				.map(
					( [ key, value ] ) =>
						`  - ${ key }: ${ ( value * 100 ).toFixed( 0 ) }/100%`
				)
				.join( '\n' );
	};

    const promises = [];
    for ( const env in config.env ) {
        const wpVersion = wpVersions[ env ] ? wpVersions[ env ] : null;
        const directory = path.join( config.workDirectoryPath, env === 'development' ? 'WordPress-PHPUnit' : 'tests-WordPress-PHPUnit')
        promises.push(
            downloadTestSuite( 
                directory, 
                wpVersion, 
                { onProgress: getProgressSetter, spinner, debug } 
            )
        );
    }

    return Promise.all(promises);
}

/**
 * Downloads the PHPUnit tests for a given WordPress version into the appropriate directory.
 * 
 * @param {string}   directory          The directory to place the PHPUnit tests in.
 * @param {string}   wpVersion          The version of WordPress to install PHPUnit tests for. Trunk when empty.
 * @param {Object}   options
 * @param {Function} options.onProgress A function called with download progress. Will be invoked with one argument: a number that ranges from 0 to 1 which indicates current download progress for this source.
 * @param {Object}   options.spinner    A CLI spinner which indicates progress.
 * @param {boolean}  options.debug      True if debug mode is enabled.
 */
async function downloadTestSuite( directory, wpVersion, { onProgress, spinner, debug } ) {
    const log = debug
    ? ( message ) => {
            spinner.info( `SimpleGit: ${ message }` );
            spinner.start();
      }
    : () => {};
    onProgress( 0 );

    const progressHandler = ( { progress } ) => {
		onProgress( progress / 100 );
	};

    log( 'Cloning or getting the PHPUnit suite from GitHub.' );
	const git = SimpleGit( { progress: progressHandler } );

    const isRepo =
		fs.existsSync( directory ) &&
		( await git.cwd( directory ).checkIsRepo( 'root' ) );

	if ( isRepo ) {
		log( 'Repo already exists, using it.' );
	} else {
		await git.clone( 'https://github.com/WordPress/wordpress-develop.git', directory, {
			'--depth': '1',
			'--no-single-branch': null,
		} );
		await git.cwd( directory );
	}
    
    log( 'Fetching.' );
	await git.fetch( 'origin' );

    // Alpha, Beta, and RC versions are bleeding edge.
    let ref;
    if ( ! wpVersion || wpVersion.match(/-(?:alpha|beta|rc)/)) {
        ref = 'origin/trunk'
    } else {
        ref = `origin/tags/${ wpVersion }`
    }
    
    log( `Checking out ${ ref }.` );
    await git.raw('sparse-checkout', 'set', 'tests/phpunit');

    onProgress( 1 );
}