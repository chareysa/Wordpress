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
const THEME_JSON_SCHEMA_URL = new URL(
	'../../schemas/json/theme.json',
	import.meta.url
);

/**
 * Path to docs file.
 *
 * @type {URL}
 */
const REFERENCE_DOC_URL = new URL(
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
 * @typedef {(schema: JSONSchema) => boolean} PredicateFunction
 */

/**
 * @typedef {(schema: JSONSchema) => string} SerializerFunction
 */

/**
 * Create a serializer function for a type. Supports merging one level of anyOf and oneOf subschemas.
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
 * @param {JSONSchema} themeJson theme.json JSON schema
 * @return {string} generated documentation
 */
function generateDocs( themeJson ) {
	/** Markdown content. */
	let md = '';

	/* --------------- *
	 * Settings        *
	 * --------------- */
	md += '## settings\n\n';
	md += `${ themeJson.properties.settings.description }\n\n`;
	const settings = [
		// Top-level only properties.
		...Object.entries( themeJson.properties.settings.allOf[ 1 ].properties )
			.filter( ( [ property ] ) => property !== 'blocks' )
			.map( ( [ property, subschema ] ) => [
				property,
				{
					...subschema,
					description: `${ subschema.description }\n\n**Note:** Top-level only property. Not available in blocks.`,
				},
			] ),
		// Top-level and blocks properties.
		...themeJson.properties.settings.allOf[ 0 ].allOf.flatMap(
			( subschema ) => Object.entries( subschema.properties )
		),
	];
	for ( const [ section, schema ] of settings ) {
		md += `### ${ section }\n\n`;
		md += `${ schema.description }\n\n`;
		if ( schema.properties ) {
			md += '| Property | Description | Type | Default |\n';
			md += '| -------- | ----------- | ---- | ------- |\n';
			const properties = Object.entries( schema.properties );
			for ( const [ property, subschema ] of properties ) {
				const description =
					subschema.description?.split( '\n', 1 )[ 0 ] ?? '';
				const types = generateTypes( subschema );
				const defaultValue =
					'default' in subschema
						? `\`${ JSON.stringify( subschema.default ) }\``
						: '';
				md += `| ${ property } | ${ description } | ${ types } | ${ defaultValue } |\n`;
			}
			md += '\n';
		}
		md += `---\n\n`;
	}

	/* --------------- *
	 * Styles          *
	 * --------------- */
	md += '## styles\n\n';
	md += `${ themeJson.properties.styles.description }\n\n`;
	const styles = Object.entries(
		themeJson.properties.styles.allOf[ 0 ].properties
	);
	for ( const [ section, schema ] of styles ) {
		md += `### ${ section }\n\n`;
		md += `${ schema.description }\n\n`;
		if ( schema.properties ) {
			md += '| Property | Description | Type |\n';
			md += '| -------- | ----------- | ---- |\n';
			const properties = Object.entries( schema.properties );
			for ( const [ property, subschema ] of properties ) {
				// Assuming that the first line of a description is a summary.
				const description =
					subschema.description?.split( '\n', 1 )[ 0 ] ?? '';
				const types = generateTypes( subschema );
				md += `| ${ property } | ${ description } | ${ types } |\n`;
			}
			md += '\n';
		}
		md += `---\n\n`;
	}

	/* --------------- *
	 * customTemplates *
	 * --------------- */
	md += '## customTemplates\n\n';
	md += `${ themeJson.properties.customTemplates.description }\n\n`;
	md += '| Property | Description | Type |\n';
	md += '| -------- | ----------- | ---- |\n';
	const customTemplatesProperties = Object.entries(
		themeJson.properties.customTemplates.items.properties
	);
	for ( const [ property, subschema ] of customTemplatesProperties ) {
		const { description } = subschema;
		const types = generateTypes( subschema );
		md += `| ${ property } | ${ description } | ${ types } |\n`;
	}
	md += '\n';

	/* --------------- *
	 * templateParts   *
	 * --------------- */
	md += '## templateParts\n\n';
	md += `${ themeJson.properties.templateParts.description }\n\n`;
	md += '| Property | Description | Type |\n';
	md += '| -------- | ----------- | ---- |\n';
	const templatePartsProperties = Object.entries(
		themeJson.properties.templateParts.items.properties
	);
	for ( const [ property, subschema ] of templatePartsProperties ) {
		const { description } = subschema;
		const types = generateTypes( subschema );
		md += `| ${ property } | ${ description } | ${ types } |\n`;
	}
	md += '\n';

	/* --------------- *
	 * patterns        *
	 * --------------- */
	md += '## patterns\n\n';
	md += themeJson.properties.patterns.description + '\n\n';
	md += `Type: ${ generateTypes( themeJson.properties.patterns ) }.\n`;

	return md;
}

/**
 * Main function.
 */
async function main() {
	const themeJson = await $RefParser.dereference(
		THEME_JSON_SCHEMA_URL.pathname,
		{
			parse: { binary: false, text: false, yaml: false },
			resolve: { external: false },
		}
	);

	const themeJsonReference = await fs.readFile( REFERENCE_DOC_URL, {
		encoding: 'utf8',
		flag: 'r',
	} );

	const generatedDocs = generateDocs( themeJson );
	const updatedThemeJsonReference = themeJsonReference.replace(
		// `.` does not match new lines, but `[^]` will.
		new RegExp( `${ START_TOKEN }[^]*${ END_TOKEN }` ),
		`${ START_TOKEN }\n${ generatedDocs }\n${ END_TOKEN }`
	);

	await fs.writeFile( REFERENCE_DOC_URL, updatedThemeJsonReference, {
		encoding: 'utf8',
	} );
}

main().catch( ( error ) => {
	console.error( error );
	process.exit( 1 );
} );
