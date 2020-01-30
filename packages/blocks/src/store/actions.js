/**
 * External dependencies
 */
import { castArray } from 'lodash';

/**
 * Returns an action object used in signalling that block types have been added.
 *
 * @param {Array|Object} blockTypes Block types received.
 *
 * @return {Object} Action object.
 */
export function addBlockTypes( blockTypes ) {
	return {
		type: 'ADD_BLOCK_TYPES',
		blockTypes: castArray( blockTypes ),
	};
}

/**
 * Returns an action object used to remove a registered block type.
 *
 * @param {string|Array} names Block name.
 *
 * @return {Object} Action object.
 */
export function removeBlockTypes( names ) {
	return {
		type: 'REMOVE_BLOCK_TYPES',
		names: castArray( names ),
	};
}

/**
 * Returns an action object used in signalling that new block styles have been added.
 *
 * @param {string}       blockName  Block name.
 * @param {Array|Object} styles     Block styles.
 *
 * @return {Object} Action object.
 */
export function addBlockStyles( blockName, styles ) {
	return {
		type: 'ADD_BLOCK_STYLES',
		styles: castArray( styles ),
		blockName,
	};
}

/**
 * Returns an action object used in signalling that block styles have been removed.
 *
 * @param {string}       blockName  Block name.
 * @param {Array|string} styleNames Block style names.
 *
 * @return {Object} Action object.
 */
export function removeBlockStyles( blockName, styleNames ) {
	return {
		type: 'REMOVE_BLOCK_STYLES',
		styleNames: castArray( styleNames ),
		blockName,
	};
}

/**
 * Returns an action object used in signalling that new block variations have been added.
 *
 * @param {string}                              blockName  Block name.
 * @param {WPBlockVariation|WPBlockVariation[]} variations Block variations.
 *
 * @return {Object} Action object.
 */
export function __experimentalAddBlockVariations( blockName, variations ) {
	return {
		type: 'ADD_BLOCK_VARIATIONS',
		variations: castArray( variations ),
		blockName,
	};
}

/**
 * Returns an action object used in signalling that block variations have been removed.
 *
 * @param {string}          blockName      Block name.
 * @param {string|string[]} variationNames Block variation names.
 *
 * @return {Object} Action object.
 */
export function __experimentalRemoveBlockVariations( blockName, variationNames ) {
	return {
		type: 'REMOVE_BLOCK_VARIATIONS',
		variationNames: castArray( variationNames ),
		blockName,
	};
}

/**
 * Returns an action object used to set the default block name.
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */
export function setDefaultBlockName( name ) {
	return {
		type: 'SET_DEFAULT_BLOCK_NAME',
		name,
	};
}

/**
 * Returns an action object used to set the name of the block used as a fallback
 * for non-block content.
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */
export function setFreeformFallbackBlockName( name ) {
	return {
		type: 'SET_FREEFORM_FALLBACK_BLOCK_NAME',
		name,
	};
}

/**
 * Returns an action object used to set the name of the block used as a fallback
 * for unregistered blocks.
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */
export function setUnregisteredFallbackBlockName( name ) {
	return {
		type: 'SET_UNREGISTERED_FALLBACK_BLOCK_NAME',
		name,
	};
}

/**
 * Returns an action object used to set the name of the block used
 * when grouping other blocks
 * eg: in "Group/Ungroup" interactions
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */
export function setGroupingBlockName( name ) {
	return {
		type: 'SET_GROUPING_BLOCK_NAME',
		name,
	};
}

/**
 * Returns an action object used to set block categories.
 *
 * @param {Object[]} categories Block categories.
 *
 * @return {Object} Action object.
 */
export function setCategories( categories ) {
	return {
		type: 'SET_CATEGORIES',
		categories,
	};
}

/**
 * Returns an action object used to update a category.
 *
 * @param {string} slug     Block category slug.
 * @param {Object} category Object containing the category properties that should be updated.
 *
 * @return {Object} Action object.
 */
export function updateCategory( slug, category ) {
	return {
		type: 'UPDATE_CATEGORY',
		slug,
		category,
	};
}

/**
 * Returns an action object used to add block collections
 *
 * @param {string} namespace       The namespace of the blocks to put in the collection
 * @param {string} title           The title to display in the block inserter
 * @param {Object} icon (optional) The icon to display in the block inserter
 *
 * @return {Object} Action object.
 */
export function addBlockCollection( namespace, title, icon ) {
	return {
		type: 'ADD_BLOCK_COLLECTION',
		namespace,
		title,
		icon,
	};
}

/**
 * Returns an action object used to remove block collections
 *
 * @param {string} namespace       The namespace of the blocks to put in the collection
 *
 * @return {Object} Action object.
 */
export function removeBlockCollection( namespace ) {
	return {
		type: 'REMOVE_BLOCK_COLLECTION',
		namespace,
	};
}
