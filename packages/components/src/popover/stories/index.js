/**
 * External dependencies
 */
import { boolean, select, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { DraggableWrapper } from './_utils';
import Popover from '../';

export default { title: 'Components/Popover', component: Popover };

export const _default = () => {
	const show = boolean( 'Example: Show', true );
	const children = text( 'children', 'Popover Content' );
	const animate = boolean( 'animate', false );
	const focusOnMount = select(
		'focusOnMount',
		{
			firstElement: 'firstElement',
			container: 'container',
		},
		'firstElement'
	);
	const noArrow = boolean( 'noArrow', false );

	const props = {
		animate,
		children,
		focusOnMount,
		noArrow,
	};

	if ( ! show ) {
		return null;
	}

	return <Popover { ...props } />;
};

const DragExample = ( props ) => {
	const { label, content, ...restProps } = props;

	return (
		<div>
			<div style={ { position: 'absolute', color: '#555' } }>
				<p>Move the gray box around.</p>
				<p>
					The <strong style={ { background: 'pink' } }>pink bordered</strong> element is a parent.
				</p>
				<p>
					The <strong style={ { background: 'cyan' } }>cyan bordered</strong> element is a sibling
					to <strong>Popover</strong>.
				</p>
				<p>
					<strong>Popover</strong> aligns to the content within parent.
				</p>
			</div>
			<div
				style={ {
					height: '100vh',
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				} }
			>
				<DraggableWrapper
					style={ {
						background: '#ddd',
						border: '2px solid pink',
						borderRadius: 4,
						padding: 10,
						userSelect: 'none',
					} }
				>
					<div style={ { border: '2px solid cyan' } }>{ label }</div>
					<Popover { ...restProps }>{ content }</Popover>
				</DraggableWrapper>
			</div>
		</div>
	);
};

export const positioning = () => {
	const label = text( 'Example: Label', 'Drag Me!' );
	const content = text( 'Example: Content', 'Popover' );
	const noArrow = boolean( 'noArrow', false );

	return <DragExample label={ label } content={ content } noArrow={ noArrow } />;
};
