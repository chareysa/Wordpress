/**
 * External dependencies
 */
import classnames from 'classnames';
import { findKey } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { concatChildren, Component, RawHTML } from '@wordpress/element';
import {
	Autocomplete,
	PanelBody,
	PanelColor,
	RangeControl,
	ToggleControl,
	Button,
	ButtonGroup,
	withFallbackStyles,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { createBlock } from '../../api';
import { blockAutocompleter, userAutocompleter } from '../../autocompleters';
import AlignmentToolbar from '../../alignment-toolbar';
import BlockAlignmentToolbar from '../../block-alignment-toolbar';
import BlockControls from '../../block-controls';
import RichText from '../../rich-text';
import InspectorControls from '../../inspector-controls';
import ColorPalette from '../../color-palette';
import ContrastChecker from '../../contrast-checker';

const { getComputedStyle } = window;

const ContrastCheckerWithFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps;
	//avoid the use of querySelector if both colors are known and verify if node is available.
	const editableNode = ( ! textColor || ! backgroundColor ) && node ? node.querySelector( '[contenteditable="true"]' ) : null;
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
	};
} )( ContrastChecker );

const FONT_SIZES = {
	small: 14,
	regular: 16,
	large: 36,
	larger: 48,
};

class ParagraphBlock extends Component {
	constructor() {
		super( ...arguments );
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
		this.onReplace = this.onReplace.bind( this );
		this.toggleDropCap = this.toggleDropCap.bind( this );
	}

	onReplace( blocks ) {
		const { attributes, onReplace } = this.props;
		onReplace( blocks.map( ( block, index ) => (
			index === 0 && block.name === name ?
				{ ...block,
					attributes: {
						...attributes,
						...block.attributes,
					},
				} :
				block
		) ) );
	}

	toggleDropCap() {
		const { attributes, setAttributes } = this.props;
		setAttributes( { dropCap: ! attributes.dropCap } );
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	setFontSize( fontSize ) {
		const { setAttributes } = this.props;
		const size = findKey( FONT_SIZES, ( value ) => value === fontSize );

		let textClass;
		if ( size ) {
			textClass = `is-${ size }-text`;
		}

		setAttributes( { fontSize, textClass } );
	}

	getFontSize() {
		const { fontSize, textClass } = this.props.attributes;
		return FONT_SIZES[ textClass ] || fontSize;
	}

	render() {
		const {
			attributes,
			setAttributes,
			insertBlocksAfter,
			isSelected,
			mergeBlocks,
			onReplace,
			className,
		} = this.props;

		const {
			align,
			content,
			dropCap,
			placeholder,
			fontSize,
			backgroundColor,
			textColor,
			width,
		} = attributes;

		return [
			isSelected && (
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls key="inspector">
					<PanelBody title={ __( 'Text Settings' ) } className="blocks-font-size">
						<div className="blocks-font-size__main">
							<ButtonGroup aria-label={ __( 'Font Size' ) }>
								<Button
									isLarge
									isPrimary={ attributes.textClass === 'is-small-text' }
									aria-pressed={ attributes.textClass === 'is-small-text' }
									onClick={ () => this.setFontSize( FONT_SIZES.small ) }
								>
									S
								</Button>
								<Button
									isLarge
									isPrimary={ attributes.textClass === 'is-regular-text' }
									aria-pressed={ attributes.textClass === 'is-regular-text' }
									onClick={ () => this.setFontSize( FONT_SIZES.regular ) }
								>
									M
								</Button>
								<Button
									isLarge
									isPrimary={ attributes.textClass === 'is-large-text' }
									aria-pressed={ attributes.textClass === 'is-large-text' }
									onClick={ () => this.setFontSize( FONT_SIZES.large ) }
								>
									L
								</Button>
								<Button
									isLarge
									isPrimary={ attributes.textClass === 'is-larger-text' }
									aria-pressed={ attributes.textClass === 'is-larger-text' }
									onClick={ () => this.setFontSize( FONT_SIZES.larger ) }
								>
									XL
								</Button>
							</ButtonGroup>
							<Button
								isLarge
								onClick={ () => this.setFontSize( null ) }
							>
								{ __( 'Reset' ) }
							</Button>
						</div>
						<RangeControl
							label={ __( 'Custom Size' ) }
							value={ this.getFontSize() || '' }
							onChange={ ( value ) => this.setFontSize( value ) }
							min={ 12 }
							max={ 100 }
							beforeIcon="editor-textcolor"
							afterIcon="editor-textcolor"
						/>
						<span>{ attributes.textClass }</span>
						<ToggleControl
							label={ __( 'Drop Cap' ) }
							checked={ !! dropCap }
							onChange={ this.toggleDropCap }
						/>
					</PanelBody>
					<PanelColor title={ __( 'Background Color' ) } colorValue={ backgroundColor } initialOpen={ false }>
						<ColorPalette
							value={ backgroundColor }
							onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
						/>
					</PanelColor>
					<PanelColor title={ __( 'Text Color' ) } colorValue={ textColor } initialOpen={ false }>
						<ColorPalette
							value={ textColor }
							onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
						/>
					</PanelColor>
					{ this.nodeRef && <ContrastCheckerWithFallbackStyles
						node={ this.nodeRef }
						textColor={ textColor }
						backgroundColor={ backgroundColor }
						isLargeText={ fontSize >= 18 }
					/> }
					<PanelBody title={ __( 'Block Alignment' ) }>
						<BlockAlignmentToolbar
							value={ width }
							onChange={ ( nextWidth ) => setAttributes( { width: nextWidth } ) }
						/>
					</PanelBody>
				</InspectorControls>
			),
			<div key="editable" ref={ this.bindRef }>
				<Autocomplete completers={ [
					blockAutocompleter( { onReplace } ),
					userAutocompleter(),
				] }>
					{ ( { isExpanded, listBoxId, activeId } ) => (
						<RichText
							tagName="p"
							className={ classnames( 'wp-block-paragraph', className, {
								'has-background': backgroundColor,
								'has-drop-cap': dropCap,
							} ) }
							style={ {
								backgroundColor: backgroundColor,
								color: textColor,
								fontSize: fontSize ? fontSize + 'px' : undefined,
								textAlign: align,
							} }
							value={ content }
							onChange={ ( nextContent ) => {
								setAttributes( {
									content: nextContent,
								} );
							} }
							onSplit={ insertBlocksAfter ?
								( before, after, ...blocks ) => {
									setAttributes( { content: before } );
									insertBlocksAfter( [
										...blocks,
										createBlock( 'core/paragraph', { content: after } ),
									] );
								} :
								undefined
							}
							onMerge={ mergeBlocks }
							onReplace={ this.onReplace }
							onRemove={ () => onReplace( [] ) }
							placeholder={ placeholder || __( 'Add text or type / to add content' ) }
							aria-autocomplete="list"
							aria-expanded={ isExpanded }
							aria-owns={ listBoxId }
							aria-activedescendant={ activeId }
							isSelected={ isSelected }
						/>
					) }
				</Autocomplete>
			</div>,
		];
	}
}

const supports = {
	className: false,
};

const schema = {
	content: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: [],
	},
	align: {
		type: 'string',
	},
	dropCap: {
		type: 'boolean',
		default: false,
	},
	placeholder: {
		type: 'string',
	},
	width: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	fontSize: {
		type: 'number',
	},
	textClass: {
		type: 'string',
	},
};

export const name = 'core/paragraph';

export const settings = {
	title: __( 'Paragraph' ),

	description: __( 'This is a simple text only block for adding a single paragraph of content.' ),

	icon: 'editor-paragraph',

	category: 'common',

	keywords: [ __( 'text' ) ],

	supports,

	attributes: schema,

	transforms: {
		from: [
			{
				type: 'raw',
				isMatch: ( node ) => (
					node.nodeName === 'P' &&
					// Do not allow embedded content.
					! node.querySelector( 'audio, canvas, embed, iframe, img, math, object, svg, video' )
				),
			},
		],
	},

	deprecated: [
		{
			supports,
			attributes: {
				...schema,
				content: {
					type: 'string',
					source: 'html',
				},
			},
			save( { attributes } ) {
				return attributes.content;
			},
			migrate( attributes ) {
				return {
					...attributes,
					content: [
						<RawHTML key="html">{ attributes.content }</RawHTML>,
					],
				};
			},
		},
	],

	merge( attributes, attributesToMerge ) {
		return {
			content: concatChildren( attributes.content, attributesToMerge.content ),
		};
	},

	getEditWrapperProps( attributes ) {
		const { width } = attributes;
		if ( [ 'wide', 'full', 'left', 'right' ].indexOf( width ) !== -1 ) {
			return { 'data-align': width };
		}
	},

	edit: ParagraphBlock,

	save( { attributes } ) {
		const {
			width,
			align,
			content,
			dropCap,
			backgroundColor,
			textColor,
			textClass,
			fontSize,
		} = attributes;

		const className = classnames( {
			[ `align${ width }` ]: width,
			'has-background': backgroundColor,
			'has-drop-cap': dropCap,
		}, textClass );

		const styles = {
			backgroundColor: backgroundColor,
			color: textColor,
			fontSize: textClass ? null : fontSize,
			textAlign: align,
		};

		return <p style={ styles } className={ className ? className : undefined }>{ content }</p>;
	},
};
