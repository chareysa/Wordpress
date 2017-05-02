/**
 * External dependencies
 */
import uuid from 'uuid/v4';
import { get, castArray, findIndex } from 'lodash';

/**
 * Internal dependencies
 */
import { getBlockSettings } from './registration';

/**
 * Returns a block object given its type and attributes
 *
 * @param  {String} blockType   BlockType
 * @param  {Object} attributes  Block attributes
 * @return {Object}             Block object
 */
export function createBlock( blockType, attributes = {} ) {
	return {
		uid: uuid(),
		blockType,
		attributes
	};
}

/**
 * Switch a block into one or more blocks of the new block type
 *
 * @param  {Object} block      Block object
 * @param  {string} blockType  BlockType
 * @return {Array}             Block object
 */
export function switchToBlockType( block, blockType ) {
	// Find the right transformation by giving priority to the "to" transformation
	const destinationSettings = getBlockSettings( blockType );
	const sourceSettings = getBlockSettings( block.blockType );
	const transformationsFrom = get( destinationSettings, 'transforms.from', [] );
	const transformationsTo = get( sourceSettings, 'transforms.to', [] );
	const transformation =
		transformationsTo.find( t => t.blocks.indexOf( blockType ) !== -1 ) ||
		transformationsFrom.find( t => t.blocks.indexOf( block.blockType ) !== -1 );

	if ( ! transformation ) {
		return null;
	}

	const transformationResults = castArray( transformation.transform( block.attributes ) );
	const firstSwitchedBlock = findIndex( transformationResults, ( result ) => result.blockType === blockType );

	return transformationResults.map( ( result, index ) => {
		return {
			uid: index === firstSwitchedBlock ? block.uid : uuid(),
			blockType: result.blockType,
			attributes: result.attributes
		};
	} );
}
