/**
 * External dependencies
 */
import type { StoryContext } from '@storybook/react';

/**
 * Internal dependencies
 */
import type { CompositeStoreProps } from '../types';

/**
 * Renders a composite widget.
 *
 * ```jsx
 * const store = useCompositeStore();
 * <Composite store={ store }>
 *   <Composite.Item>Item 1</Composite.Item>
 *   <Composite.Item>Item 2</Composite.Item>
 * </Composite>
 * ```
 */
export function UseCompositeStorePlaceholder( props: CompositeStoreProps ) {
	return (
		<dl>
			{ Object.entries( props ).map( ( [ name, value ] ) => (
				<>
					<dt>{ name }</dt>
					<dd>{ JSON.stringify( value ) }</dd>
				</>
			) ) }
		</dl>
	);
}
UseCompositeStorePlaceholder.displayName = 'useCompositeStore';

// The output generated by Storybook for these components is
// messy, so we apply this transform to make it more useful
// for anyone reading the docs.
export function transform( code: string, context: StoryContext ) {
	const storeConfig = ` ${ JSON.stringify( context.args, null, 2 ) } `;
	const formattedStoreConfig = storeConfig.replace( ' {} ', '' );
	return [
		// Include a setup line, showing how to make use of
		// `useCompositeStore` to convert store options into
		// a composite store prop.
		`const store = useCompositeStore(${ formattedStoreConfig });`,
		'',
		'return (',
		'  ' +
			code
				// The generated output includes a full dump of everything
				// in the store; the reader probably isn't interested in
				// what that looks like, so instead we drop all of that
				// in favor of the store generated above.
				.replaceAll( /store=\{\{[\s\S]*?\}\}/g, 'store={ store }' )
				// Now we tidy the output by removing any unnecessary
				// whitespace...
				.replaceAll( /<Composite\w+[\s\S]*?>/g, ( match ) =>
					match.replaceAll( /\s+\s/g, ' ' )
				)
				// ...including around <Composite*> children...
				.replaceAll(
					/>\s*(\w[\w ]*?)\s*<\//g,
					( _, value ) => `>${ value }</`
				)
				// ...and inside JSX definitions.
				.replaceAll( '} >', '}>' )
				// Finally we indent everything to make it more readable.
				.replaceAll( /\n/g, '\n  ' ),
		');',
	].join( '\n' );
}
