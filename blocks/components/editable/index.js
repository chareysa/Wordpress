/**
 * External dependencies
 */
import classnames from 'classnames';
import { last, isEqual, capitalize, omitBy, forEach, merge } from 'lodash';
import { nodeListToReact } from 'dom-react';
import { Fill } from 'react-slot-fill';
import 'element-closest';

/**
 * Internal dependencies
 */
import './style.scss';
import FormatToolbar from './format-toolbar';
import TinyMCE from './tinymce';
 // TODO: We mustn't import by relative path traversing from blocks to editor
 // as we're doing here; instead, we should consider a common components path.
import Toolbar from '../../../editor/components/toolbar';

const KEYCODE_BACKSPACE = 8;

const alignmentMap = {
	alignleft: 'left',
	alignright: 'right',
	aligncenter: 'center'
};

const ALIGNMENT_CONTROLS = [
	{
		icon: 'editor-alignleft',
		title: wp.i18n.__( 'Align left' ),
		align: 'left'
	},
	{
		icon: 'editor-aligncenter',
		title: wp.i18n.__( 'Align center' ),
		align: 'center'
	},
	{
		icon: 'editor-alignright',
		title: wp.i18n.__( 'Align right' ),
		align: 'right'
	}
];

function createElement( type, props, ...children ) {
	if ( props[ 'data-mce-bogus' ] === 'all' ) {
		return null;
	}

	if ( props.hasOwnProperty( 'data-mce-bogus' ) ) {
		return children;
	}

	return wp.element.createElement(
		type,
		omitBy( props, ( value, key ) => key.indexOf( 'data-mce-' ) === 0 ),
		...children
	);
}

export default class Editable extends wp.element.Component {
	constructor() {
		super( ...arguments );

		this.onInit = this.onInit.bind( this );
		this.onSetup = this.onSetup.bind( this );
		this.onChange = this.onChange.bind( this );
		this.onNewBlock = this.onNewBlock.bind( this );
		this.onFocus = this.onFocus.bind( this );
		this.onNodeChange = this.onNodeChange.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.changeFormats = this.changeFormats.bind( this );
		this.state = {
			formats: {},
			alignment: null,
			bookmark: null
		};
	}

	onSetup( editor ) {
		this.editor = editor;
		editor.on( 'init', this.onInit );
		editor.on( 'focusout', this.onChange );
		editor.on( 'NewBlock', this.onNewBlock );
		editor.on( 'focusin', this.onFocus );
		editor.on( 'nodechange', this.onNodeChange );
		editor.on( 'keydown', this.onKeyDown );
	}

	onInit() {
		this.focus();
	}

	onFocus() {
		if ( ! this.props.onFocus ) {
			return;
		}

		// TODO: We need a way to save the focus position ( bookmark maybe )
		this.props.onFocus();
	}

	onChange() {
		if ( ! this.editor.isDirty() ) {
			return;
		}

		this.savedContent = this.getContent();
		this.editor.save();
		this.props.onChange( this.savedContent );
	}

	getRelativePosition( node ) {
		const position = node.getBoundingClientRect();

		// Find the parent "relative" positioned container
		const container = this.props.inlineToolbar
			? this.editor.getBody().closest( '.blocks-editable' )
			: this.editor.getBody().closest( '.editor-visual-editor__block' );
		const editorPosition = container.getBoundingClientRect();

		// The margins are different depending on the container
		return {
			top: position.top - editorPosition.top + position.height + ( this.props.inlineToolbar ? 50 : 40 ),
			left: position.left - editorPosition.left - ( this.props.inlineToolbar ? 100 : 157 )
		};
	}

	isStartOfEditor() {
		const range = this.editor.selection.getRng();
		if ( range.startOffset !== 0 || ! range.collapsed ) {
			return false;
		}
		const start = range.startContainer;
		const body = this.editor.getBody();
		let element = start;
		while ( element !== body ) {
			const child = element;
			element = element.parentNode;
			if ( element.firstChild !== child ) {
				return false;
			}
		}
		return true;
	}

	onKeyDown( event ) {
		if ( this.props.onMerge && event.keyCode === KEYCODE_BACKSPACE && this.isStartOfEditor() ) {
			this.onChange();
			this.props.onMerge( this.editor.getContent() );
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	}

	onNewBlock() {
		if ( this.props.tagName || ! this.props.onSplit ) {
			return;
		}

		// Getting the content before and after the cursor
		const childNodes = Array.from( this.editor.getBody().childNodes );
		let selectedChild = this.editor.selection.getStart();
		while ( childNodes.indexOf( selectedChild ) === -1 && selectedChild.parentNode ) {
			selectedChild = selectedChild.parentNode;
		}
		const splitIndex = childNodes.indexOf( selectedChild );
		if ( splitIndex === -1 ) {
			return;
		}
		const beforeNodes = childNodes.slice( 0, splitIndex );
		const lastNodeBeforeCursor = last( beforeNodes );
		// Avoid splitting on single enter
		if (
			! lastNodeBeforeCursor ||
			beforeNodes.length < 2 ||
			!! lastNodeBeforeCursor.textContent
		) {
			return;
		}

		const before = beforeNodes.slice( 0, beforeNodes.length - 1 );

		// Removing empty nodes from the beginning of the "after"
		// avoids empty paragraphs at the beginning of newly created blocks.
		const after = childNodes.slice( splitIndex ).reduce( ( memo, node ) => {
			if ( ! memo.length && ! node.textContent ) {
				return memo;
			}

			memo.push( node );
			return memo;
		}, [] );

		// Splitting into two blocks
		this.setContent( this.props.value );

		this.props.onSplit(
			nodeListToReact( before, createElement ),
			nodeListToReact( after, createElement )
		);
	}

	onNodeChange( { element, parents } ) {
		const formats = {};
		const link = parents.find( ( node ) => node.nodeName.toLowerCase() === 'a' );
		if ( link ) {
			formats.link = { value: link.getAttribute( 'href' ), link };
		}
		const activeFormats = this.editor.formatter.matchAll( [	'bold', 'italic', 'strikethrough' ] );
		activeFormats.forEach( ( activeFormat ) => formats[ activeFormat ] = true );
		const alignments = this.editor.formatter.matchAll( [ 'alignleft', 'aligncenter', 'alignright' ] );
		const alignment = alignments.length > 0 ? alignmentMap[ alignments[ 0 ] ] : null;

		const focusPosition = this.getRelativePosition( element );
		const bookmark = this.editor.selection.getBookmark( 2, true );
		this.setState( { alignment, bookmark, formats, focusPosition } );
	}

	updateContent() {
		const bookmark = this.editor.selection.getBookmark( 2, true );
		this.savedContent = this.props.value;
		this.setContent( this.savedContent );
		this.editor.selection.moveToBookmark( bookmark );
		// Saving the editor on updates avoid unecessary onChanges calls
		// These calls can make the focus jump

		this.editor.save();
	}

	setContent( content ) {
		if ( ! content ) {
			content = '';
		}

		content = wp.element.renderToString( content );
		this.editor.setContent( content );
	}

	getContent() {
		return nodeListToReact( this.editor.getBody().childNodes || [], createElement );
	}

	focus() {
		const { focus } = this.props;
		if ( focus ) {
			this.editor.focus();
			// Offset = -1 means we should focus the end of the editable
			if ( focus.offset === -1 ) {
				this.editor.selection.select( this.editor.getBody(), true );
				this.editor.selection.collapse( false );
			}
		}
	}

	componentWillUnmount() {
		this.onChange();
	}

	componentDidUpdate( prevProps ) {
		if ( !! this.props.focus && ! prevProps.focus ) {
			this.focus();
		}

		// The savedContent var allows us to avoid updating the content right after an onChange call
		if (
			this.props.tagName === prevProps.tagName &&
			this.props.value !== prevProps.value &&
			this.props.value !== this.savedContent &&
			! isEqual( this.props.value, prevProps.value ) &&
			! isEqual( this.props.value, this.savedContent )
		) {
			this.updateContent();
		}
	}

	isFormatActive( format ) {
		return !! this.state.formats[ format ];
	}

	changeFormats( formats ) {
		if ( this.state.bookmark ) {
			this.editor.selection.moveToBookmark( this.state.bookmark );
		}

		forEach( formats, ( formatValue, format ) => {
			if ( format === 'link' ) {
				if ( formatValue !== undefined ) {
					const anchor = this.editor.dom.getParent( this.editor.selection.getNode(), 'a' );
					if ( ! anchor ) {
						this.editor.formatter.remove( 'link' );
					}
					this.editor.formatter.apply( 'link', { href: formatValue.value }, anchor );
				} else {
					this.editor.execCommand( 'Unlink' );
				}
			} else {
				const isActive = this.isFormatActive( format );
				if ( isActive && ! formatValue ) {
					this.editor.formatter.remove( format );
				} else if ( ! isActive && formatValue ) {
					this.editor.formatter.apply( format );
				}
			}
		} );

		this.setState( {
			formats: merge( {}, this.state.formats, formats )
		} );

		this.editor.setDirty( true );
	}

	isAlignmentActive( align ) {
		return this.state.alignment === align;
	}

	toggleAlignment( align ) {
		this.editor.focus();

		if ( this.isAlignmentActive( align ) ) {
			this.editor.execCommand( 'JustifyNone' );
		} else {
			this.editor.execCommand( 'Justify' + capitalize( align ) );
		}
	}

	render() {
		const {
			tagName,
			style,
			value,
			focus,
			className,
			showAlignments = false,
			inlineToolbar = false,
			inline,
			formattingControls
		} = this.props;
		const classes = classnames( 'blocks-editable', className );

		// Generating a key that includes `tagName` ensures that if the tag
		// changes, we unmount (+ destroy) the previous TinyMCE element, then
		// mount (+ initialize) a new child element in its place.
		const key = [ 'editor', tagName ].join();
		const classes = classnames( className, 'blocks-editable' );

		const formatToolbar = (
			<FormatToolbar
				focusPosition={ this.state.focusPosition }
				formats={ this.state.formats }
				onChange={ this.changeFormats }
				enabledControls={ formattingControls }
			/>
		);

		return (
			<div className={ classes }>
				{ focus &&
					<Fill name="Formatting.Toolbar">
						{ showAlignments &&
							<Toolbar
								controls={ ALIGNMENT_CONTROLS.map( ( control ) => ( {
									...control,
									onClick: () => this.toggleAlignment( control.align ),
									isActive: this.isAlignmentActive( control.align )
								} ) ) } />
						}
						{ ! inlineToolbar && formatToolbar }
					</Fill>
				}

				{ focus && inlineToolbar &&
					<div className="block-editable__inline-toolbar">
						{ formatToolbar }
					</div>
				}

				<TinyMCE
					tagName={ tagName }
					onSetup={ this.onSetup }
					style={ style }
					className={ classes }
					defaultValue={ value }
					settings={ {
						forced_root_block: inline ? false : 'p'
					} }
					key={ key } />
			</div>
		);
	}
}
