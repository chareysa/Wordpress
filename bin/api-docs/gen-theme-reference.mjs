/**
 * Generates theme.json documentation using theme.json schema.
 * Reads from  : schemas/json/theme.json
 * Publishes to: docs/reference-guides/theme-json-reference/theme-json-living.md
 */

/**
 * External dependencies
 */
import fs from 'node:fs/promises';
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
 * @typedef {(schema: JSONSchema) => boolean} PredicateFunction
 */

/**
 * @typedef {(schema: JSONSchema) => string} SerializerFunction
 */

/**
 * Create a serializer function for a type. Supports merging anyOf and oneOf subschemas.
 *
 * @see {@link https://json-schema.org/understanding-json-schema/reference/combining.html}
 *
 * @param {PredicateFunction}  predicate  Type predicate function to match a type.
 * @param {SerializerFunction} serializer Serializer function to format a type.
 * @return {SerializerFunction} Serializer function for the give type.
 */
function createSerializer( predicate, serializer ) {
	return ( schema ) => {
		const schemas = predicate( schema )
			? [ schema ]
			: schema.anyOf || schema.oneOf || [];
		const formatted = schemas.filter( predicate ).map( serializer );
		return [ ...new Set( formatted ) ].join( ', ' );
	};
}

/**
 * Serialize primitive types.
 *
 * @type {SerializerFunction}
 */
const serializePrimitiveTypes = createSerializer(
	( schema ) =>
		schema.type && ! [ 'object', 'array' ].includes( schema.type ),
	( schema ) => `\`${ schema.type }\``
);

/**
 * Serialize object types.
 *
 * @type {SerializerFunction}
 */
const serializeObjectTypes = createSerializer(
	( schema ) => schema.properties,
	( schema ) => `\`{ ${ Object.keys( schema.properties ).join( ', ' ) } }\``
);

/**
 * Serialize object array types.
 *
 * @type {SerializerFunction}
 */
const serializeObjectArrayTypes = createSerializer(
	( schema ) => schema.items && schema.items.properties,
	( schema ) =>
		`\`[ { ${ Object.keys( schema.items.properties ).join( ', ' ) } } ]\``
);

/**
 * Serialize primitive array types.
 *
 * @type {SerializerFunction}
 */
const serializePrimitiveArrayTypes = createSerializer(
	( schema ) =>
		schema.items &&
		schema.items.type &&
		! [ 'object', 'array' ].includes( schema.items.type ),
	( schema ) => `\`[ ${ schema.items.type } ]\``
);

/**
 * Generate types from schema.
 *
 * @param {JSONSchema} schema JSON schema
 * @return {string} serialized types
 */
function generateTypes( schema ) {
	return [
		serializePrimitiveTypes( schema ),
		serializeObjectTypes( schema ),
		serializePrimitiveArrayTypes( schema ),
		serializeObjectArrayTypes( schema ),
	]
		.filter( Boolean )
		.join( ', ' );
}

/**
 * Generate documentation from theme.json schema.
 *
 * @param {JSONSchema} themejson JSON schema
 * @return {string} generated documentation
 */
function generateDocs( themejson ) {
	let autogen = '';

	/* --------------- *
	 * Settings        *
	 * --------------- */
	autogen += '## settings\n\n';
	autogen += `${ themejson.properties.settings.description }\n\n`;
	const settings = themejson.definitions.settingsProperties.allOf.flatMap(
		( settingsProperties ) =>
			Object.entries( settingsProperties.properties )
	);
	// This property is only available at the root level, so it isn't included in the settingsProperties.
	settings.unshift( [
		'useRootPaddingAwareAlignments',
		themejson.properties.settings.allOf[ 1 ].properties
			.useRootPaddingAwareAlignments,
	] );
	for ( const [ section, schema ] of settings ) {
		autogen += `### ${ section }\n\n`;
		autogen += `${ schema.description }\n\n`;
		if ( schema.properties ) {
			autogen += '| Property | Description | Type | Default |\n';
			autogen += '| -------- | ----------- | ---- | ------- |\n';
			const properties = Object.entries( schema.properties );
			for ( const [ property, subschema ] of properties ) {
				const description =
					subschema.description?.split( '\n', 1 )[ 0 ] ?? '';
				const types = generateTypes( subschema );
				const defaultValue =
					'default' in subschema
						? `\`${ JSON.stringify( subschema.default ) }\``
						: '';
				autogen += `| ${ property } | ${ description } | ${ types } | ${ defaultValue } |\n`;
			}
			autogen += '\n';
		}
		autogen += `---\n\n`;
	}

	/* --------------- *
	 * Styles          *
	 * --------------- */
	autogen += '## styles\n\n';
	autogen += `${ themejson.properties.styles.description }\n\n`;
	const styles = Object.entries(
		themejson.definitions.stylesProperties.properties
	);
	for ( const [ section, schema ] of styles ) {
		autogen += `### ${ section }\n\n`;
		autogen += `${ schema.description }\n\n`;
		if ( schema.properties ) {
			autogen += '| Property | Description | Type |\n';
			autogen += '| -------- | ----------- | ---- |\n';
			const properties = Object.entries( schema.properties );
			for ( const [ property, subschema ] of properties ) {
				const description =
					subschema.description?.split( '\n', 1 )[ 0 ] ?? '';
				const types = generateTypes( subschema );
				autogen += `| ${ property } | ${ description } | ${ types } |\n`;
			}
			autogen += '\n';
		}
		autogen += `---\n\n`;
	}

	/* --------------- *
	 * customTemplates *
	 * --------------- */
	autogen += '## customTemplates\n\n';
	autogen += `${ themejson.properties.customTemplates.description }\n\n`;
	autogen += '| Property | Description | Type |\n';
	autogen += '| -------- | ----------- | ---- |\n';
	const customTemplatesProperties = Object.entries(
		themejson.properties.customTemplates.items.properties
	);
	for ( const [ property, subschema ] of customTemplatesProperties ) {
		const { description } = subschema;
		const types = generateTypes( subschema );
		autogen += `| ${ property } | ${ description } | ${ types } |\n`;
	}
	autogen += '\n';

	/* --------------- *
	 * templateParts   *
	 * --------------- */
	autogen += '## templateParts\n\n';
	autogen += `${ themejson.properties.templateParts.description }\n\n`;
	autogen += '| Property | Description | Type |\n';
	autogen += '| -------- | ----------- | ---- |\n';
	const templatePartsProperties = Object.entries(
		themejson.properties.templateParts.items.properties
	);
	for ( const [ property, subschema ] of templatePartsProperties ) {
		const { description } = subschema;
		const types = generateTypes( subschema );
		autogen += `| ${ property } | ${ description } | ${ types } |\n`;
	}
	autogen += '\n';

	/* --------------- *
	 * patterns        *
	 * --------------- */
	autogen += '## patterns\n\n';
	autogen += `Type: ${ generateTypes( themejson.properties.patterns ) }.\n\n`;
	autogen += themejson.properties.patterns.description + '\n';

	return `${ START_TOKEN }\n${ autogen }\n${ END_TOKEN }`;
}

/**
 * Main function.
 */
async function main() {
	const themejson = await $RefParser.dereference(
		THEME_JSON_SCHEMA_FILE.pathname,
		{
			parse: { binary: false, text: false, yaml: false },
			resolve: { external: false },
		}
	);

	let docsContent = await fs.readFile( THEME_JSON_REF_DOC, {
		encoding: 'utf8',
		flag: 'r',
	} );

	// Replace auto generated part with new generated docs.
	const autogen = generateDocs( themejson );
	docsContent = docsContent.replace( TOKEN_PATTERN, autogen );

	// Write back out.
	await fs.writeFile( THEME_JSON_REF_DOC, docsContent, { encoding: 'utf8' } );
}

main().catch( ( error ) => {
	console.error( error );
	process.exit( 1 );
} );
