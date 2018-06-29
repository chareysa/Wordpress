/**
 * Node dependencies
 */
const { kebabCase } = require( 'lodash' );

/**
 * Generates the manifest for the given namespaces.
 *
 * @param {Object} parsedNamespaces Parsed Namespace Object.
 * @param {Object} packagesConfig   Packages Docs Config.
 *
 * @return {Array} manifest.
 */
module.exports = function( parsedNamespaces, packagesConfig ) {
	const dataManifest = [ {
		title: 'Data Package Reference',
		slug: 'data',
		markdown_source: 'https://raw.githubusercontent.com/WordPress/gutenberg/master/docs/data/README.md',
		parent: null,
	} ].concat(
		Object.values( parsedNamespaces ).map( ( parsedNamespace ) => {
			const slug = kebabCase( parsedNamespace.name );
			return {
				title: parsedNamespace.title,
				slug: 'data-' + slug,
				markdown_source: 'https://raw.githubusercontent.com/WordPress/gutenberg/master/docs/data/' + slug + '.md',
				parent: 'data',
			};
		} )
	);

	const packagesManifest = Object.entries( packagesConfig ).map( ( [ packageSlug, config ] ) => {
		const path = config.isNpmReady === false ?
			'https://raw.githubusercontent.com/WordPress/gutenberg/master/' + packageSlug + '/README.md' :
			'https://raw.githubusercontent.com/WordPress/gutenberg/master/packages/' + packageSlug + '/README.md';
		return {
			title: '@wordpress/' + packageSlug,
			slug: 'packages-' + packageSlug,
			markdown_source: path,
			parent: 'packages',
		};
	} );

	return packagesManifest.concat( dataManifest );
};
