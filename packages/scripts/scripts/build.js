/**
 * External dependencies
 */
const { sync: spawn } = require( 'cross-spawn' );
const { sync: resolveBin } = require( 'resolve-bin' );

/**
 * Internal dependencies
 */
const { getWebpackArgs } = require( '../utils' );

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const { status } = spawn( resolveBin( 'webpack' ), getWebpackArgs(), {
	stdio: 'inherit',
} );
process.exit( status );
