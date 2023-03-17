/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockTools,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';
import { Popover, SlotFillProvider } from '@wordpress/components';
import { registerCoreBlocks } from '@wordpress/block-library';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import '@wordpress/format-library';
import {
	createBlock,
	unregisterBlockType,
	getBlockTypes,
} from '@wordpress/blocks';

// Polyfill for String.prototype.replaceAll until CI is runnig Node 15 or higher.
if ( ! String.prototype.replaceAll ) {
	String.prototype.replaceAll = function ( str, newStr ) {
		// If a regex pattern
		if (
			Object.prototype.toString.call( str ).toLowerCase() ===
			'[object regexp]'
		) {
			return this.replace( str, newStr );
		}

		// If a string
		return this.replace( new RegExp( str, 'g' ), newStr );
	};
}

export function registerAllCoreBlocks() {
	registerCoreBlocks();
}

export function unRegisterAllBlocks() {
	getBlockTypes().forEach( ( { name } ) => unregisterBlockType( name ) );
}

export function createTestBlock( name, attributes ) {
	return createBlock( name, attributes || {} );
}

/**
 * Internal dependencies
 */
import { waitForStoreResolvers } from './wait-for-store-resolvers';

export function Editor( { testBlocks, settings = {} } ) {
	const [ blocks, updateBlocks ] = useState( testBlocks );

	return (
		<ShortcutProvider>
			<SlotFillProvider>
				<BlockEditorProvider
					value={ blocks }
					onInput={ updateBlocks }
					onChange={ updateBlocks }
					settings={ settings }
				>
					<BlockInspector />
					<BlockTools>
						<BlockEditorKeyboardShortcuts.Register />
						<WritingFlow>
							<ObserveTyping>
								<BlockList />
							</ObserveTyping>
						</WritingFlow>
					</BlockTools>

					<Popover.Slot />
				</BlockEditorProvider>
			</SlotFillProvider>
		</ShortcutProvider>
	);
}

export async function initializeEditor( props ) {
	return waitForStoreResolvers( () => {
		return render( <Editor { ...props } /> );
	} );
}
