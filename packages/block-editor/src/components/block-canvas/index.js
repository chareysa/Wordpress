/**
 * Internal dependencies
 */
import BlockList from '../block-list';
import EditorStyles from '../editor-styles';
import Iframe from '../iframe';
import WritingFlow from '../writing-flow';
import { useMouseMoveTypingReset } from '../observe-typing';

export function ExperimentalBlockCanvas( {
	shouldIframe = true,
	height = '300px',
	children = <BlockList />,
	styles,
	contentRef,
	iframeProps,
} ) {
	const resetTypingRef = useMouseMoveTypingReset();

	if ( ! shouldIframe ) {
		return (
			<>
				<EditorStyles styles={ styles } />
				<WritingFlow
					ref={ contentRef }
					className="editor-styles-wrapper"
					tabIndex={ -1 }
					style={ { height } }
				>
					{ children }
				</WritingFlow>
			</>
		);
	}

	return (
		<Iframe
			{ ...iframeProps }
			ref={ resetTypingRef }
			contentRef={ contentRef }
			style={ {
				width: '100%',
				height,
				...iframeProps?.style,
			} }
			name="editor-canvas"
		>
			<EditorStyles styles={ styles } />
			{ children }
		</Iframe>
	);
}

function BlockCanvas( { children, height, styles } ) {
	return (
		<ExperimentalBlockCanvas height={ height } styles={ styles }>
			{ children }
		</ExperimentalBlockCanvas>
	);
}

export default BlockCanvas;
