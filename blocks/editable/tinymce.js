/**
 * External dependencies
 */
import tinymce from 'tinymce';

/**
 * Internal dependencies
 */
import paste from './paste';

export default class TinyMCE extends wp.element.Component {
	componentDidMount() {
		this.initialize();
	}

	shouldComponentUpdate() {
		// We must prevent rerenders because TinyMCE will modify the DOM, thus
		// breaking React's ability to reconcile changes.
		//
		// See: https://github.com/facebook/react/issues/6802
		return false;
	}

	componentWillReceiveProps( nextProps ) {
		const isEmpty = String( nextProps.isEmpty );

		if ( this.editorNode.getAttribute( 'data-is-empty' ) !== isEmpty ) {
			this.editorNode.setAttribute( 'data-is-empty', isEmpty );
		}
	}

	componentWillUnmount() {
		if ( ! this.editor ) {
			return;
		}

		this.editor.destroy();
		delete this.editor;
	}

	initialize() {
		const { focus, insertBlocksAfter } = this.props;

		const settings = this.props.getSettings( {
			theme: false,
			inline: true,
			toolbar: false,
			browser_spellcheck: true,
			entity_encoding: 'raw',
			convert_urls: false,
			formats: {
				strikethrough: { inline: 'del' },
			},
			plugins: [],
		} );

		tinymce.init( {
			...settings,
			plugins: [ ...settings.plugins, 'paste' ],
			target: this.editorNode,
			setup: ( editor ) => {
				this.editor = editor;
				this.props.onSetup( editor );

				paste( { editor, insertBlocksAfter } );
			},
		} );

		if ( focus ) {
			this.editorNode.focus();
		}
	}

	render() {
		const { tagName = 'div', style, defaultValue, placeholder } = this.props;

		// If a default value is provided, render it into the DOM even before
		// TinyMCE finishes initializing. This avoids a short delay by allowing
		// us to show and focus the content before it's truly ready to edit.
		let children;
		if ( defaultValue ) {
			children = wp.element.Children.toArray( defaultValue );
		}

		return wp.element.createElement( tagName, {
			ref: ( node ) => this.editorNode = node,
			contentEditable: true,
			suppressContentEditableWarning: true,
			className: 'blocks-editable__tinymce',
			style,
			'data-placeholder': placeholder,
		}, children );
	}
}
