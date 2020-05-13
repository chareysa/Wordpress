/**
 * External dependencies
 */
import { boolean, number, text } from '@storybook/addon-knobs';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import NumberControl from '../';

export default {
	title: 'Components/NumberControl',
	component: NumberControl,
};

function Example() {
	const [ value, setValue ] = useState( '0' );

	const props = {
		disabled: boolean( 'disabled', false ),
		hideLabelFromVision: boolean( 'hideLabelFromVision', false ),
		isFloatingLabel: boolean( 'isFloatingLabel', false ),
		isShiftStepEnabled: boolean( 'isShiftStepEnabled', true ),
		label: text( 'label', 'Number' ),
		min: number( 'min', 0 ),
		max: number( 'max', 100 ),
		placeholder: text( 'placeholder', 0 ),
		shiftStep: number( 'shiftStep', 10 ),
		step: number( 'step', 1 ),
	};

	return (
		<NumberControl
			{ ...props }
			value={ value }
			onChange={ ( v ) => setValue( v ) }
		/>
	);
}

export const _default = () => {
	return <Example />;
};
