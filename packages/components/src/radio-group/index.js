/**
 * External dependencies
 */
import { useRadioState, RadioGroup as ReakitRadioGroup } from 'reakit/Radio';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ButtonGroup from '../button-group';
import RadioContext from '../radio-context';

function RadioGroup(
	{ accessibilityLabel, defaultChecked, checked, onChange, ...props },
	ref
) {
	const radioState = useRadioState( {
		state: defaultChecked,
		baseId: props.id,
	} );
	const radioContext = {
		...radioState,
		// controlled or uncontrolled
		state: checked || radioState.state,
		setState: onChange || radioState.setState,
	};

	return (
		<RadioContext.Provider value={ radioContext }>
			<ReakitRadioGroup
				ref={ ref }
				as={ ButtonGroup }
				aria-label={ accessibilityLabel }
				{ ...radioState }
				{ ...props }
			/>
		</RadioContext.Provider>
	);
}

export default forwardRef( RadioGroup );
