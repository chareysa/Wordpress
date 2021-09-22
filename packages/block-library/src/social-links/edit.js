/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { getBlockSupport } from '@wordpress/blocks';
import { Fragment, useEffect } from '@wordpress/element';
import {
	BlockControls,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	useBlockProps,
	InspectorControls,
	ContrastChecker,
	PanelColorSettings,
	withColors,
} from '@wordpress/block-editor';
import {
	MenuGroup,
	MenuItem,
	PanelBody,
	ToggleControl,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';

const ALLOWED_BLOCKS = [ 'core/social-link' ];

const sizeOptions = [
	{ name: __( 'Small' ), value: 'has-small-icon-size' },
	{ name: __( 'Normal' ), value: 'has-normal-icon-size' },
	{ name: __( 'Large' ), value: 'has-large-icon-size' },
	{ name: __( 'Huge' ), value: 'has-huge-icon-size' },
];

const getDefaultBlockLayout = ( blockTypeOrName ) => {
	const layoutBlockSupportConfig = getBlockSupport(
		blockTypeOrName,
		'__experimentalLayout'
	);
	return layoutBlockSupportConfig?.default;
};

export function SocialLinksEdit( props ) {
	const {
		name,
		attributes,
		iconBackgroundColor,
		iconColor,
		isSelected,
		setAttributes,
		setIconBackgroundColor,
		setIconColor,
	} = props;

	const {
		iconBackgroundColorValue,
		iconColorValue,
		preveIconBackgroundColorValue,
		openInNewTab,
		size,
		layout,
	} = attributes;
	const usedLayout = layout || getDefaultBlockLayout( name );

	// Remove icon background color if logos only style selected.
	const logosOnly = attributes.className
		?	attributes.className.indexOf( 'is-style-logos-only' ) >= 0
		:	false;
	useEffect( () => {
		if ( logosOnly ) {
			setAttributes( {
				iconBackgroundColor: undefined,
				customIconBackgroundColor: undefined,
				preveIconBackgroundColorValue: iconBackgroundColorValue,
				iconBackgroundColorValue: undefined,
			} );
		}
	}, [ logosOnly, setAttributes ] );

	// Set the previsiounly selected bckground values of the logo for default.
	const defaultAgain = attributes.className
		?	attributes.className.indexOf( 'is-style-default' ) >= 0
		:	false;
	useEffect( () => {
		if ( defaultAgain ) {
			setAttributes( {
				iconBackgroundColorValue: preveIconBackgroundColorValue
					? preveIconBackgroundColorValue
					: undefined,
			} );
		}
	}, [ defaultAgain, setAttributes ] );

	// Set the previsiounly selected bckground values of the logo for Pill.
	const pillStyle = attributes.className
		?	attributes.className.indexOf( 'is-style-pill-shape' ) >= 0
		:	false;
	useEffect( () => {
		if ( pillStyle ) {
			setAttributes( {
				iconBackgroundColorValue: preveIconBackgroundColorValue
					? preveIconBackgroundColorValue
					: undefined,
			} );
		}
	}, [ pillStyle, setAttributes ] );

	const SocialPlaceholder = (
		<li className="wp-block-social-links__social-placeholder">
			<div className="wp-social-link"></div>
			<div className="wp-block-social-links__social-placeholder-icons">
				<div className="wp-social-link wp-social-link-twitter"></div>
				<div className="wp-social-link wp-social-link-facebook"></div>
				<div className="wp-social-link wp-social-link-instagram"></div>
			</div>
		</li>
	);

	const SelectedSocialPlaceholder = (
		<li className="wp-block-social-links__social-prompt">
			{ __( 'Click plus to add' ) }
		</li>
	);

	// Fallback color values are used maintain selections in case switching
	// themes and named colors in palette do not match.
	const className = classNames( size, {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-icon-background-color':
			iconBackgroundColor.color || iconBackgroundColorValue,
	} );

	const blockProps = useBlockProps( { className } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		placeholder: isSelected ? SelectedSocialPlaceholder : SocialPlaceholder,
		templateLock: false,
		__experimentalAppenderTagName: 'li',
		__experimentalLayout: usedLayout,
	} );

	const POPOVER_PROPS = {
		position: 'bottom right',
	};

	return (
		<Fragment>
			<BlockControls group="other">
				<ToolbarDropdownMenu
					label={ __( 'Size' ) }
					text={ __( 'Size' ) }
					icon={ null }
					popoverProps={ POPOVER_PROPS }
				>
					{ ( { onClose } ) => (
						<MenuGroup>
							{ sizeOptions.map( ( entry ) => {
								return (
									<MenuItem
										icon={
											( size === entry.value ||
												( ! size &&
													entry.value ===
														'has-normal-icon-size' ) ) &&
											check
										}
										isSelected={ size === entry.value }
										key={ entry.value }
										onClick={ () => {
											setAttributes( {
												size: entry.value,
											} );
										} }
										onClose={ onClose }
										role="menuitemradio"
									>
										{ entry.name }
									</MenuItem>
								);
							} ) }
						</MenuGroup>
					) }
				</ToolbarDropdownMenu>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Link settings' ) }>
					<ToggleControl
						label={ __( 'Open links in new tab' ) }
						checked={ openInNewTab }
						onChange={ () =>
							setAttributes( { openInNewTab: ! openInNewTab } )
						}
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color' ) }
					colorSettings={ [
						{
							// Use custom attribute as fallback to prevent loss of named color selection when
							// switching themes to a new theme that does not have a matching named color.
							value: iconColor.color || iconColorValue,
							onChange: ( colorValue ) => {
								setIconColor( colorValue );
								setAttributes( { iconColorValue: colorValue } );
							},
							label: __( 'Icon color' ),
						},
						! logosOnly && {
							// Use custom attribute as fallback to prevent loss of named color selection when
							// switching themes to a new theme that does not have a matching named color.
							value:
								iconBackgroundColor.color ||
								iconBackgroundColorValue,
							onChange: ( colorValue ) => {
								setIconBackgroundColor( colorValue );
								setAttributes( {
									iconBackgroundColorValue: colorValue,
								} );
							},
							label: __( 'Icon background color' ),
						},
					] }
				/>
				{ ! logosOnly && (
					<ContrastChecker
						{ ...{
							textColor: iconColorValue,
							backgroundColor: iconBackgroundColorValue,
						} }
						isLargeText={ false }
					/>
				) }
			</InspectorControls>
			<ul { ...innerBlocksProps } />
		</Fragment>
	);
}

const iconColorAttributes = {
	iconColor: 'icon-color',
	iconBackgroundColor: 'icon-background-color',
};

export default withColors( iconColorAttributes )( SocialLinksEdit );
