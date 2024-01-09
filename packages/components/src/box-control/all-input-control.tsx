/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
/**
 * Internal dependencies
 */
import type { UnitControlProps } from '../unit-control/types';
import { FlexedRangeControl, UnitControl } from './styles/box-control-styles';
import { HStack } from '../h-stack';
import type { BoxControlInputControlProps } from './types';
import { parseQuantityAndUnitFromRawValue } from '../unit-control';
import {
	LABELS,
	applyValueToSides,
	getAllValue,
	isValuesMixed,
	isValuesDefined,
	CUSTOM_VALUE_SETTINGS,
} from './utils';

const noop = () => {};

export default function AllInputControl( {
	onChange = noop,
	onFocus = noop,
	values,
	sides,
	selectedUnits,
	setSelectedUnits,
	...props
}: BoxControlInputControlProps ) {
	const inputId = useInstanceId( AllInputControl, 'box-control-input-all' );

	const allValue = getAllValue( values, selectedUnits, sides );
	const hasValues = isValuesDefined( values );
	const isMixed = hasValues && isValuesMixed( values, selectedUnits, sides );
	const allPlaceholder = isMixed ? LABELS.mixed : undefined;

	const [ parsedQuantity, parsedUnit ] =
		parseQuantityAndUnitFromRawValue( allValue );

	const handleOnFocus: React.FocusEventHandler< HTMLInputElement > = (
		event
	) => {
		onFocus( event, { side: 'all' } );
	};

	const onValueChange = ( next?: string ) => {
		const isNumeric = next !== undefined && ! isNaN( parseFloat( next ) );
		const nextValue = isNumeric ? next : undefined;
		const nextValues = applyValueToSides( values, nextValue, sides );

		onChange( nextValues );
	};

	const unitControlOnChange: UnitControlProps[ 'onChange' ] = ( next ) => {
		onValueChange( next );
	};

	const sliderOnChange = ( next?: number ) => {
		onValueChange(
			next !== undefined ? [ next, parsedUnit ].join( '' ) : undefined
		);
	};

	// Set selected unit so it can be used as fallback by unlinked controls
	// when individual sides do not have a value containing a unit.
	const handleOnUnitChange: UnitControlProps[ 'onUnitChange' ] = ( unit ) => {
		const newUnits = applyValueToSides( selectedUnits, unit, sides );
		setSelectedUnits( newUnits );
	};

	return (
		<HStack>
			<UnitControl
				{ ...props }
				className="component-box-control__unit-control"
				disableUnits={ isMixed }
				id={ inputId }
				isPressEnterToChange
				value={ allValue }
				onChange={ unitControlOnChange }
				onUnitChange={ handleOnUnitChange }
				onFocus={ handleOnFocus }
				placeholder={ allPlaceholder }
				label={ LABELS.all }
				hideLabelFromVision
			/>

			<FlexedRangeControl
				__nextHasNoMarginBottom
				aria-controls={ inputId }
				onChange={ sliderOnChange }
				min={ 0 }
				max={ CUSTOM_VALUE_SETTINGS[ parsedUnit ?? 'px' ]?.max ?? 10 }
				step={
					CUSTOM_VALUE_SETTINGS[ parsedUnit ?? 'px' ]?.step ?? 0.1
				}
				value={ parsedQuantity ?? 0 }
				withInputField={ false }
			/>
		</HStack>
	);
}
