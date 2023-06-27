/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { forwardRef, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { View } from '../../view';
import { useControlledValue } from '../../utils';
import type { WordPressComponentProps } from '../../ui/context';
import ToggleGroupControlContext from '../context';
import { useAdjustUndefinedValue } from './utils';
import type {
	ToggleGroupControlMainControlProps,
	ToggleGroupControlContextProps,
} from '../types';

function UnforwardedToggleGroupControlAsButtonGroup(
	{
		children,
		isAdaptiveWidth,
		label,
		onChange,
		size,
		value: valueProp,
		defaultValue,
		id: idProp,
		...otherProps
	}: WordPressComponentProps<
		ToggleGroupControlMainControlProps,
		'div',
		false
	>,
	forwardedRef: React.ForwardedRef< HTMLDivElement >
) {
	const generatedId = useInstanceId(
		ToggleGroupControlAsButtonGroup,
		'toggle-group-control-as-button-group'
	).toString();
	const baseId = idProp || generatedId;

	// Use a heuristic to understand if an `undefined` value should be intended as
	// "no value" for controlled mode, or that the component is being used in
	// an uncontrolled way.
	const adjustedValueProp = useAdjustUndefinedValue( valueProp );

	const [ selectedValue, setSelectedValue ] = useControlledValue( {
		defaultValue,
		value: adjustedValueProp,
		onChange,
	} );

	const groupContextValue = useMemo(
		() =>
			( {
				baseId,
				value: selectedValue,
				setValue: setSelectedValue,
				isBlock: ! isAdaptiveWidth,
				isDeselectable: true,
				size,
			} as ToggleGroupControlContextProps ),
		[ baseId, selectedValue, setSelectedValue, isAdaptiveWidth, size ]
	);

	return (
		<ToggleGroupControlContext.Provider value={ groupContextValue }>
			<View
				aria-label={ label }
				{ ...otherProps }
				ref={ forwardedRef }
				role="group"
			>
				{ children }
			</View>
		</ToggleGroupControlContext.Provider>
	);
}

export const ToggleGroupControlAsButtonGroup = forwardRef(
	UnforwardedToggleGroupControlAsButtonGroup
);
