/**
 * External dependencies
 */
import { isFinite } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose, withInstanceId, withState } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { BaseControl, Button, Dashicon, NumberControl } from '../';

function RangeControl( {
	className,
	currentInput,
	label,
	value,
	instanceId,
	onChange,
	beforeIcon,
	afterIcon,
	help,
	allowReset,
	initialPosition,
	min,
	max,
	setState,
	...props
} ) {
	const id = `inspector-range-control-${ instanceId }`;
	const currentInputValue = currentInput === null ? value : currentInput;
	const resetValue = () => {
		resetCurrentInput();
		onChange();
	};
	const resetCurrentInput = () => {
		if ( currentInput !== null ) {
			setState( {
				currentInput: null,
			} );
		}
	};

	const onChangeValue = ( event ) => {
		const newValue = event.target.value;
		const newNumericValue = parseInt( newValue, 10 );
		// If the input value is invalid temporarily save it to the state,
		// without calling on change.
		if (
			isNaN( newNumericValue ) ||
			( min !== undefined && newNumericValue < min ) ||
			( max !== undefined && newNumericValue > max )
		) {
			setState( {
				currentInput: newValue,
			} );
			return;
		}
		// The input is valid, reset the local state property used to temporaly save the value,
		// and call onChange with the new value as a number.
		resetCurrentInput();
		onChange( newNumericValue );
	};
	const initialSliderValue = isFinite( value ) ?
		currentInputValue :
		initialPosition || '';

	return (
		<BaseControl
			label={ label }
			id={ id }
			help={ help }
			className={ classnames( 'components-range-control', className ) }
		>
			{ beforeIcon && <Dashicon icon={ beforeIcon } /> }
			<input
				className="components-range-control__slider"
				id={ id }
				type="range"
				value={ initialSliderValue }
				onChange={ onChangeValue }
				aria-describedby={ !! help ? id + '__help' : undefined }
				min={ min }
				max={ max }
				{ ...props } />
			{ afterIcon && <Dashicon icon={ afterIcon } /> }
			<NumberControl
				className="components-range-control__number"
				onChange={ onChange }
				aria-label={ label }
				value={ currentInputValue }
				min={ min }
				max={ max }
				onBlur={ resetCurrentInput }
				{ ...props }
			/>
			{ allowReset &&
				<Button onClick={ resetValue } disabled={ value === undefined }>
					{ __( 'Reset' ) }
				</Button>
			}
		</BaseControl>
	);
}

export default compose( [
	withInstanceId,
	withState( {
		currentInput: null,
	} ),
] )( RangeControl );
