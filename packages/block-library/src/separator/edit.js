/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __experimentalBoxControl as BoxControl } from '@wordpress/components';
import { withColors, useBlockProps } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import SeparatorSettings from './separator-settings';

const { __Visualizer: BoxControlVisualizer } = BoxControl;

function SeparatorEdit( { attributes, color, setColor, className } ) {
	return (
		<>
			<div
				{ ...useBlockProps( {
					className: classnames( className, {
						'has-background': color.color,
						[ color.class ]: color.class,
					} ),
					style: {
						backgroundColor: color.color,
						color: color.color,
					},
				} ) }
			>
				<BoxControlVisualizer
					values={ attributes.style?.spacing }
					showValues={ attributes.style?.visualizers }
				/>
			</div>
			<SeparatorSettings color={ color } setColor={ setColor } />
		</>
	);
}

export default withColors( 'color', { textColor: 'color' } )( SeparatorEdit );
