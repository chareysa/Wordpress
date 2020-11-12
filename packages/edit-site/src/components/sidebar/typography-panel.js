/**
 * WordPress dependencies
 */
import {
	LineHeightControl,
	__experimentalFontFamilyControl as FontFamilyControl,
	__experimentalFontAppearanceControl as FontAppearanceControl,
} from '@wordpress/block-editor';
import { PanelBody, FontSizePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useEditorFeature, getValueFromVariable } from '../editor/utils';

export function useHasTypographyPanel( { supports, name } ) {
	const hasLineHeight = useHasLineHeightControl( { supports, name } );
	const hasFontAppearence = useHasAppearenceControl( { supports, name } );
	return (
		hasLineHeight || hasFontAppearence || supports.includes( 'fontSize' )
	);
}

function useHasLineHeightControl( { supports, name } ) {
	return (
		useEditorFeature( 'typography.customLineHeight', name ) &&
		supports.includes( 'lineHeight' )
	);
}

function useHasAppearenceControl( { supports, name } ) {
	const fontStyles = useEditorFeature( 'typography.fontStyles', name );
	const fontWeights = useEditorFeature( 'typography.fontWeights', name );
	const hasFontAppearance = !! fontStyles?.length && !! fontWeights?.length;

	return (
		hasFontAppearance &&
		supports.includes( 'fontStyle' ) &&
		supports.includes( 'fontWeight' )
	);
}

export default function TypographyPanel( {
	context: { supports, name },
	getStyleProperty,
	setStyleProperty,
} ) {
	const features = useSelect( ( select ) => {
		return select( 'core/edit-site' ).getSettings().__experimentalFeatures;
	} );
	const fontSizes = useEditorFeature( 'typography.fontSizes', name );
	const disableCustomFontSizes = ! useEditorFeature(
		'typography.customFontSize',
		name
	);
	const fontFamilies = useEditorFeature( 'typography.fontFamilies', name );
	const fontStyles = useEditorFeature( 'typography.fontStyles', name );
	const fontWeights = useEditorFeature( 'typography.fontWeights', name );
	const hasLineHeightEnabled = useHasLineHeightControl( { supports, name } );
	const hasAppearenceControl = useHasAppearenceControl( { supports, name } );

	const fontFamily = getStyleProperty( name, 'fontFamily' );
	const fontSize = getStyleProperty( name, 'fontSize' );
	const lineHeight = getStyleProperty( name, 'lineHeight' );
	return (
		<PanelBody title={ __( 'Typography' ) } initialOpen={ true }>
			{ supports.includes( 'fontFamily' ) && (
				<FontFamilyControl
					fontFamilies={ fontFamilies }
					value={
						getValueFromVariable( features, name, fontFamily ) ||
						fontFamily
					}
					onChange={ ( value ) =>
						setStyleProperty( name, 'fontFamily', value )
					}
				/>
			) }
			{ supports.includes( 'fontSize' ) && (
				<FontSizePicker
					value={
						getValueFromVariable( features, name, fontSize ) ||
						fontSize
					}
					onChange={ ( value ) =>
						setStyleProperty( name, 'fontSize', value )
					}
					fontSizes={ fontSizes }
					disableCustomFontSizes={ disableCustomFontSizes }
				/>
			) }
			{ hasLineHeightEnabled && (
				<LineHeightControl
					value={
						getValueFromVariable( features, name, lineHeight ) ||
						lineHeight
					}
					onChange={ ( value ) =>
						setStyleProperty( name, 'lineHeight', value )
					}
				/>
			) }
			{ hasAppearenceControl && (
				<FontAppearanceControl
					value={ {
						fontStyle: getStyleProperty( name, 'fontStyle' ),
						fontWeight: getStyleProperty( name, 'fontWeight' ),
					} }
					options={ { fontStyles, fontWeights } }
					onChange={ ( { fontStyle, fontWeight } ) => {
						setStyleProperty( name, 'fontStyle', fontStyle );
						setStyleProperty( name, 'fontWeight', fontWeight );
					} }
				/>
			) }
		</PanelBody>
	);
}
