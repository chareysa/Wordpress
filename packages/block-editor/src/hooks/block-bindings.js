/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { privateApis as blocksPrivateApis } from '@wordpress/blocks';
import {
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalText as Text,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { useSelect, useDispatch, useRegistry } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	canBindAttribute,
	getBindableAttributes,
} from '../hooks/use-bindings-attributes';
import { store as blockEditorStore } from '../store';
import { unlock } from '../lock-unlock';
import InspectorControls from '../components/inspector-controls';
import BlockContext from '../components/block-context';

const {
	DropdownMenuV2: DropdownMenu,
	DropdownMenuGroupV2: DropdownMenuGroup,
	DropdownMenuCheckboxItemV2: DropdownMenuCheckboxItem,
	DropdownMenuItemLabelV2: DropdownMenuItemLabel,
	DropdownMenuItemHelpTextV2: DropdownMenuItemHelpText,
} = unlock( componentsPrivateApis );

const useToolsPanelDropdownMenuProps = () => {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
					offset: 259,
				},
		  }
		: {};
};

function BlockBindingsPanelDropdown( {
	fieldsList,
	addConnection,
	attribute,
	binding,
} ) {
	const currentKey = binding?.args?.key;
	return (
		<>
			{ Object.entries( fieldsList ).map( ( [ label, fields ] ) => (
				<DropdownMenuGroup
					key={ label }
					label={
						Object.keys( fieldsList ).length > 1 ? label : null
					}
				>
					{ Object.entries( fields ).map( ( [ key, value ] ) => (
						<DropdownMenuCheckboxItem
							key={ key }
							onClick={ () => addConnection( key, attribute ) }
							name={ attribute + '-binding' }
							value={ key }
							checked={ key === currentKey }
							hideOnClick
						>
							<DropdownMenuItemLabel>
								{ key }
							</DropdownMenuItemLabel>
							<DropdownMenuItemHelpText>
								{ value }
							</DropdownMenuItemHelpText>
						</DropdownMenuCheckboxItem>
					) ) }
				</DropdownMenuGroup>
			) ) }
		</>
	);
}

function BlockBindingsAttribute( {
	fieldsList,
	addConnection,
	attribute,
	binding,
} ) {
	const { source: sourceName, args } = binding || {};
	const sourceProps =
		unlock( blocksPrivateApis ).getBlockBindingsSource( sourceName );
	return (
		<DropdownMenu
			placement="left-start"
			gutter={ 36 }
			style={ { width: '360px' } }
			trigger={
				<Item>
					<DropdownMenuItemLabel>{ attribute }</DropdownMenuItemLabel>
					{ !! binding && (
						<DropdownMenuItemHelpText className="block-editor-bindings__item-explanation">
							{ args?.key || sourceProps?.label || sourceName }
						</DropdownMenuItemHelpText>
					) }
				</Item>
			}
		>
			<BlockBindingsPanelDropdown
				fieldsList={ fieldsList }
				addConnection={ addConnection }
				attribute={ attribute }
				binding={ binding }
			/>
		</DropdownMenu>
	);
}

export const BlockBindingsPanel = ( { name, metadata } ) => {
	const registry = useRegistry();
	const context = useContext( BlockContext );
	const { bindings } = metadata || {};

	const bindableAttributes = getBindableAttributes( name );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const filteredBindings = { ...bindings };
	Object.keys( filteredBindings ).forEach( ( key ) => {
		if (
			! canBindAttribute( name, key ) ||
			filteredBindings[ key ].source === 'core/pattern-overrides'
		) {
			delete filteredBindings[ key ];
		}
	} );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { _id } = useSelect( ( select ) => {
		const { getSelectedBlockClientId } = select( blockEditorStore );

		return {
			_id: getSelectedBlockClientId(),
		};
	}, [] );

	if ( ! bindableAttributes || bindableAttributes.length === 0 ) {
		return null;
	}

	const removeAllConnections = () => {
		const newMetadata = { ...metadata };
		delete newMetadata.bindings;
		updateBlockAttributes( _id, {
			metadata:
				Object.keys( newMetadata ).length === 0
					? undefined
					: newMetadata,
		} );
	};

	const addConnection = ( value, attribute ) => {
		// Assuming the block expects a flat structure for its metadata attribute
		const newMetadata = {
			...metadata,
			// Adjust this according to the actual structure expected by your block
			bindings: {
				...metadata?.bindings,
				[ attribute ]: {
					source: 'core/post-meta',
					args: { key: value },
				},
			},
		};
		// Update the block's attributes with the new metadata
		updateBlockAttributes( _id, {
			metadata: newMetadata,
		} );
	};

	const removeConnection = ( key ) => {
		const newMetadata = { ...metadata };
		if ( ! newMetadata.bindings ) {
			return;
		}

		delete newMetadata.bindings[ key ];
		if ( Object.keys( newMetadata.bindings ).length === 0 ) {
			delete newMetadata.bindings;
		}
		updateBlockAttributes( _id, {
			metadata:
				Object.keys( newMetadata ).length === 0
					? undefined
					: newMetadata,
		} );
	};

	const fieldsList = {};
	const { getBlockBindingsSources } = unlock( blocksPrivateApis );
	const registeredSources = getBlockBindingsSources();
	Object.values( registeredSources ).forEach(
		( { getFieldsList, label } ) => {
			if ( getFieldsList ) {
				// TODO: Filter only the needed context defined in usesContext.
				const sourceList = getFieldsList( {
					registry,
					context,
				} );
				// Only add source if the list is not empty.
				if ( sourceList ) {
					fieldsList[ label ] = { ...sourceList };
				}
			}
		}
	);

	if ( Object.keys( fieldsList ).length === 0 ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Attributes' ) }
				resetAll={ () => {
					removeAllConnections();
				} }
				dropdownMenuProps={ dropdownMenuProps }
				className="block-editor-bindings__panel"
				hasInnerWrapper
			>
				<ItemGroup isBordered isSeparated style={ { rowGap: 0 } }>
					{ bindableAttributes.map( ( attribute ) => (
						<ToolsPanelItem
							key={ attribute }
							hasValue={ () => !! filteredBindings[ attribute ] }
							label={ attribute }
							onDeselect={ () => {
								removeConnection( attribute );
							} }
						>
							<BlockBindingsAttribute
								fieldsList={ fieldsList }
								addConnection={ addConnection }
								attribute={ attribute }
								binding={ filteredBindings[ attribute ] }
							/>
						</ToolsPanelItem>
					) ) }
				</ItemGroup>
				{ /* TODO: Add a helper to ToolPanel item */ }
				<Text variant="muted" className="block-editor-bindings__helper">
					{ __( 'Attributes connected to various sources.' ) }
				</Text>
			</ToolsPanel>
		</InspectorControls>
	);
};

export default {
	edit: BlockBindingsPanel,
	attributeKeys: [ 'metadata' ],
	hasSupport() {
		return true;
	},
};
