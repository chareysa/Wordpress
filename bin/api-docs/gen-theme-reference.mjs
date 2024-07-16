/**
 * Generates theme.json documentation using theme.json schema.
 * Reads from  : schemas/json/theme.json
 * Publishes to: docs/reference-guides/theme-json-reference/theme-json-living.md
 */

/**
 * External dependencies
 */
import fs from 'fs';
import $RefParser from '@apidevtools/json-schema-ref-parser';

/**
 * @typedef {import('@apidevtools/json-schema-ref-parser').JSONSchema} JSONSchema
 */

/**
 * Path to theme json schema file.
 *
 * @type {URL}
 */
const THEME_JSON_SCHEMA_FILE = new URL(
	'../../schemas/json/theme.json',
	import.meta.url
);

/**
 * Path to docs file.
 *
 * @type {URL}
 */
const THEME_JSON_REF_DOC = new URL(
	'../../docs/reference-guides/theme-json-reference/theme-json-living.md',
	import.meta.url
);

/**
 * Start token for matching string in doc file.
 *
 * @type {string}
 */
const START_TOKEN = '<!-- START TOKEN Autogenerated - DO NOT EDIT -->';

/**
 * Start token for matching string in doc file.
 *
 * @type {string}
 */
const END_TOKEN = '<!-- END TOKEN Autogenerated - DO NOT EDIT -->';

/**
 * Regular expression using tokens for matching in doc file.
 * Note: `.` does not match new lines, so [^] is used.
 *
 * @type {RegExp}
 */
const TOKEN_PATTERN = new RegExp( START_TOKEN + '[^]*' + END_TOKEN );

/**
 * Dereferenced theme.json schema.
 *
 * @type {JSONSchema}
 */
const themejson = await $RefParser.dereference(
	THEME_JSON_SCHEMA_FILE.pathname,
	{
		parse: { binary: false, text: false, yaml: false },
		resolve: { external: false },
	}
);

/**
 * Convert settings properties to markup.
 *
 * @param {JSONSchema} schema
 * @return {string} markup
 */
function getSettingsPropertiesMarkup( { properties } ) {
	if ( ! properties || typeof properties !== 'object' ) {
		return '';
	}

	let markup = '';
	markup += '| Property  | Type   | Default | Props  |\n';
	markup += '| ---       | ---    | ---     | ---    |\n';
	Object.entries( properties ).forEach( ( [ property, subschema ] ) => {
		const defaultValue = subschema.default ?? '';
		let type = subschema.type ?? '';
		let props = subschema.items?.properties
			? Object.keys( subschema.items.properties ).join( ', ' )
			: '';

		/*
		 * Handle`oneOf` type definitions - extract the type and properties.
		 * See: https://json-schema.org/understanding-json-schema/reference/combining#oneOf
		 */
		if ( Array.isArray( subschema.oneOf ) ) {
			if ( ! type ) {
				type = subschema.oneOf
					.map( ( item ) => item.type )
					.join( ', ' );
			}

			if ( ! props ) {
				props = subschema.oneOf
					.map( ( item ) =>
						item?.type === 'object' && item?.properties
							? '_{' +
							  Object.keys( item.properties ).join( ', ' ) +
							  '}_'
							: ''
					)
					.join( ' ' );
			}
		}

		markup += `| ${ property } | ${ type } | ${ defaultValue } | ${ props } |\n`;
	} );

	return markup + '\n';
}

/**
 * Convert style properties to markup.
 *
 * @param {JSONSchema} schema
 * @return {string} markup
 */
function getStylePropertiesMarkup( { properties } ) {
	if ( ! properties || typeof properties !== 'object' ) {
		return '';
	}

	let markup = '';
	markup += '| Property  | Type   | Props  |\n';
	markup += '| ---       | ---    | ---    |\n';
	Object.entries( properties ).forEach( ( [ property, subschema ] ) => {
		const props = subschema.properties
			? Object.keys( subschema.properties ).join( ', ' )
			: '';
		const type = formatType( subschema );
		markup += `| ${ property } | ${ type } | ${ props } |\n`;
	} );

	return markup + '\n';
}

/**
 * Convert template properties to markup.
 *
 * @param {JSONSchema} schema
 * @return {string} markup
 */
function getTemplatePropertiesMarkup( { properties } ) {
	if ( ! properties || typeof properties !== 'object' ) {
		return '';
	}

	let markup = '';
	markup += '| Property | Description | Type |\n';
	markup += '| ---      | ---         | ---  |\n';
	Object.entries( properties ).forEach( ( [ property, subschema ] ) => {
		const { description, type } = subschema;
		markup += `| ${ property } | ${ description } | ${ type } |\n`;
	} );
	return markup + '\n';
}

/**
 * Format list of types.
 *
 * @param {Object} prop
 * @return {string} type
 */
function formatType( prop ) {
	let type = prop.type || '';

	if ( prop.hasOwnProperty( 'anyOf' ) || prop.hasOwnProperty( 'oneOf' ) ) {
		const propTypes = prop.anyOf || prop.oneOf;
		const types = [];

		propTypes.forEach( ( item ) => {
			if ( item.type ) {
				types.push( item.type );
			}
		} );

		type = [ ...new Set( types ) ].join( ', ' );
	}

	return type;
}

let autogen = '';

// Settings
const settings = themejson.definitions.settingsProperties.allOf.flatMap(
	( settingsProperties ) => Object.entries( settingsProperties.properties )
);
// This property is only available at the root level, so it isn't included in the settingsProperties.
settings.unshift( [
	'useRootPaddingAwareAlignments',
	themejson.properties.settings.allOf[ 1 ].properties
		.useRootPaddingAwareAlignments,
] );
autogen += '## Settings\n\n';
settings.forEach( ( [ section, data ] ) => {
	autogen += `### ${ section }\n\n`;
	autogen += `${ data.description }\n\n`;
	autogen += getSettingsPropertiesMarkup( data );
	autogen += `---\n\n`;
} );

// Styles
const styles = Object.entries(
	themejson.definitions.stylesProperties.properties
);
autogen += '## Styles\n\n';
styles.forEach( ( [ section, data ] ) => {
	autogen += `### ${ section }\n\n`;
	autogen += `${ data.description }\n\n`;
	autogen += getStylePropertiesMarkup( data );
	autogen += `---\n\n`;
} );

// customTemplates
autogen += '## customTemplates\n\n';
autogen += `${ themejson.properties.customTemplates.description }\n\n`;
autogen += `Type: \`${ themejson.properties.customTemplates.items.type }\`.\n\n`;
autogen += getTemplatePropertiesMarkup(
	themejson.properties.customTemplates.items
);

// templateParts
autogen += '## templateParts\n\n';
autogen += `${ themejson.properties.templateParts.description }\n\n`;
autogen += `Type: \`${ themejson.properties.templateParts.items.type }\`.\n\n`;
autogen += getTemplatePropertiesMarkup(
	themejson.properties.templateParts.items
);

// Patterns
autogen += '## patterns' + '\n\n';
autogen += themejson.properties.patterns.description + '\n';
autogen += 'Type: `' + themejson.properties.patterns.type + '`.\n\n';

// Read existing file to wrap auto generated content.
let docsContent = fs.readFileSync( THEME_JSON_REF_DOC, {
	encoding: 'utf8',
	flag: 'r',
} );

// Replace auto generated part with new generated docs.
autogen = START_TOKEN + '\n' + autogen + '\n' + END_TOKEN;
docsContent = docsContent.replace( TOKEN_PATTERN, autogen );

// Write back out.
fs.writeFileSync( THEME_JSON_REF_DOC, docsContent, { encoding: 'utf8' } );
