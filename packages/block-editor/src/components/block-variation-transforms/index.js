/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DropdownMenu,
	MenuGroup,
	MenuItemsChoice,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { chevronDown } from '@wordpress/icons';

function __experimentalBlockVariationTransforms( { selectedBlockClientId } ) {
	const [ selectedValue, setSelectedValue ] = useState( '' );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const { variations } = useSelect(
		( select ) => {
			const { getBlockVariations } = select( 'core/blocks' );
			const { getBlockName } = select( 'core/block-editor' );
			const blockName =
				selectedBlockClientId && getBlockName( selectedBlockClientId );
			return {
				variations:
					blockName && getBlockVariations( blockName, 'transform' ),
			};
		},
		[ selectedBlockClientId ]
	);
	if ( ! variations?.length ) return null;

	const selectOptions = [
		...variations.map( ( { name, title, description } ) => ( {
			value: name,
			label: title,
			info: description,
		} ) ),
	];
	const onSelectVariation = ( variationName ) => {
		setSelectedValue( variationName );
		updateBlockAttributes( selectedBlockClientId, {
			...variations.find( ( { name } ) => name === variationName )
				.attributes,
		} );
	};
	const baseClass = 'block-editor-block-variation-transforms';
	return (
		<DropdownMenu
			className={ baseClass }
			label={ __( 'Transform to variation' ) }
			text={ __( 'Transform to variation' ) }
			popoverProps={ {
				position: 'bottom center',
				className: `${ baseClass }__popover`,
			} }
			icon={ chevronDown }
			iconPosition="right"
		>
			{ () => (
				<div className={ `${ baseClass }__container` }>
					<MenuGroup>
						<MenuItemsChoice
							choices={ selectOptions }
							value={ selectedValue }
							onSelect={ onSelectVariation }
						/>
					</MenuGroup>
				</div>
			) }
		</DropdownMenu>
	);
}

export default __experimentalBlockVariationTransforms;
