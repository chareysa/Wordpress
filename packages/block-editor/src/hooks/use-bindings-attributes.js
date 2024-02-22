/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useCallback } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { RichTextData } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../store';
import { unlock } from '../lock-unlock';

/** @typedef {import('@wordpress/compose').WPHigherOrderComponent} WPHigherOrderComponent */
/** @typedef {import('@wordpress/blocks').WPBlockSettings} WPBlockSettings */

/**
 * Given a binding of block attributes, returns a higher order component that
 * overrides its `attributes` and `setAttributes` props to sync any changes needed.
 *
 * @return {WPHigherOrderComponent} Higher-order component.
 */

const BLOCK_BINDINGS_ALLOWED_BLOCKS = {
	'core/paragraph': [ 'content' ],
	'core/heading': [ 'content' ],
	'core/image': [ 'url', 'title', 'alt' ],
	'core/button': [ 'url', 'text', 'linkTarget' ],
};

/**
 * Based on the given block name,
 * check if it is possible to bind the block.
 *
 * @param {string} blockName - The block name.
 * @return {boolean} Whether it is possible to bind the block to sources.
 */
export function canBindBlock( blockName ) {
	return blockName in BLOCK_BINDINGS_ALLOWED_BLOCKS;
}

/**
 * Based on the given block name and attribute name,
 * check if it is possible to bind the block attribute.
 *
 * @param {string} blockName     - The block name.
 * @param {string} attributeName - The attribute name.
 * @return {boolean} Whether it is possible to bind the block attribute.
 */
export function canBindAttribute( blockName, attributeName ) {
	return (
		canBindBlock( blockName ) &&
		BLOCK_BINDINGS_ALLOWED_BLOCKS[ blockName ].includes( attributeName )
	);
}

/**
 * This component is responsible for detecting and
 * propagating data changes from the source to the block.
 *
 * @param {Object} props            - The component props.
 * @param {string} props.attrName   - The attribute name.
 * @param {any}    props.attrValue  - The attribute value.
 * @param {Object} props.blockProps - The block props with bound attribute.
 * @param {Object} props.source     - Source handler.
 * @param {Object} props.args       - The arguments to pass to the source.
 * @return {null}                     This is a data-handling component. Render nothing.
 */
const BindingConnector = ( {
	args,
	attrName,
	attrValue,
	blockProps,
	source,
} ) => {
	const { placeholder, value: propValue } = source.useSource(
		blockProps,
		args
	);

	const blockName = blockProps.name;

	const setAttributes = blockProps.setAttributes;

	const { syncDerivedUpdates } = unlock( useDispatch( blockEditorStore ) );

	const updateBoundAttibute = useCallback(
		( newAttrValue, prevAttrValue ) => {
			/*
			 * If the attribute is a RichTextData instance,
			 * (core/paragraph, core/heading, etc.)
			 * convert it to HTML string.
			 *
			 * To do: it looks like a workaround.
			 * Consider improving the attribute and metadata fields types.
			 */
			if ( prevAttrValue instanceof RichTextData ) {
				prevAttrValue = prevAttrValue.toHTMLString();
			}

			syncDerivedUpdates( () => {
				setAttributes( {
					[ attrName ]: newAttrValue,
				} );
			} );
		},
		[ attrName, setAttributes, syncDerivedUpdates ]
	);

	useEffect( () => {
		if ( typeof propValue !== 'undefined' ) {
			updateBoundAttibute( propValue, attrValue );
		} else if ( placeholder ) {
			/*
			 * Placeholder fallback.
			 * If the attribute is `src` or `href`,
			 * a placeholder can't be used because it is not a valid url.
			 * Adding this workaround until
			 * attributes and metadata fields types are improved and include `url`.
			 */
			const htmlAttribute =
				getBlockType( blockName ).attributes[ attrName ].attribute;

			if ( htmlAttribute === 'src' || htmlAttribute === 'href' ) {
				updateBoundAttibute( null );
				return;
			}

			updateBoundAttibute( placeholder );
		}
	}, [
		updateBoundAttibute,
		propValue,
		attrValue,
		placeholder,
		blockName,
		attrName,
	] );

	return null;
};

function BlockBindingBridge( { bindings, props } ) {
	const blockBindingsSources = unlock(
		useSelect( blockEditorStore )
	).getAllBlockBindingsSources();

	const { name, attributes } = props;

	return (
		<>
			{ Object.entries( bindings ).map(
				( [ attrName, boundAttribute ], i ) => {
					// Bail early if the block doesn't have a valid source handler.
					const source =
						blockBindingsSources[ boundAttribute.source ];
					if ( ! source?.useSource ) {
						return null;
					}

					return (
						<BindingConnector
							key={ `${ boundAttribute.source }-${ name }-${ attrName }-${ i }` }
							attrName={ attrName }
							attrValue={ attributes[ attrName ] }
							source={ source }
							blockProps={ props }
							args={ boundAttribute.args }
						/>
					);
				}
			) }
		</>
	);
}

const withBlockBindingSupport = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { attributes } = props;

		/*
		 * Create binding object filtering
		 * only the attributes that can be bound.
		 */
		const bindings = Object.fromEntries(
			Object.entries( attributes.metadata?.bindings || {} ).filter(
				( [ attrName ] ) => canBindAttribute( props.name, attrName )
			)
		);

		// If the block doesn't have any bindings, render the original block edit.
		if ( ! Object.keys( bindings ).length ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockBindingBridge bindings={ bindings } props={ props } />
				<BlockEdit { ...props } />
			</>
		);
	},
	'withBlockBindingSupport'
);

/**
 * Filters a registered block's settings to enhance a block's `edit` component
 * to upgrade bound attributes.
 *
 * @param {WPBlockSettings} settings - Registered block settings.
 * @param {string}          name     - Block name.
 * @return {WPBlockSettings} Filtered block settings.
 */
function shimAttributeSource( settings, name ) {
	if ( ! canBindBlock( name ) ) {
		return settings;
	}

	return {
		...settings,
		edit: withBlockBindingSupport( settings.edit ),
	};
}

addFilter(
	'blocks.registerBlockType',
	'core/editor/custom-sources-backwards-compatibility/shim-attribute-source',
	shimAttributeSource
);
