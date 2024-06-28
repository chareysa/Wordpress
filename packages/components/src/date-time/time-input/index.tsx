/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	TimeWrapper,
	TimeSeparator,
	HoursInput,
	MinutesInput,
} from '../time/styles';
import { HStack } from '../../h-stack';
import Button from '../../button';
import ButtonGroup from '../../button-group';
import {
	from12hTo24h,
	from24hTo12h,
	buildPadInputStateReducer,
	validateInputElementTarget,
} from '../utils';
import type { TimeInputProps } from '../types';
import type { InputChangeCallback } from '../../input-control/types';

export function TimeInput( {
	value: entryValue,
	is12Hour,
	minutesProps,
	onChange,
}: TimeInputProps ) {
	const value = useMemo(
		() =>
			entryValue || {
				hours: new Date().getHours(),
				minutes: new Date().getMinutes(),
			},
		[ entryValue ]
	);
	const [ hours, setHours ] = useState( value.hours );
	const [ hours12Format, setHours12Format ] = useState(
		from24hTo12h( value.hours )
	);
	const [ minutes, setMinutes ] = useState( value.minutes );
	const [ dayPeriod, setDayPeriod ] = useState(
		parseDayPeriod( value.hours )
	);

	const prevValues = useRef( value );

	const buildNumberControlChangeCallback = (
		method: 'hours' | 'minutes'
	) => {
		const callback: InputChangeCallback = ( _value, { event } ) => {
			if ( ! validateInputElementTarget( event ) ) {
				return;
			}

			// We can safely assume value is a number if target is valid.
			const numberValue = Number( _value );

			switch ( method ) {
				case 'hours':
					if ( is12Hour ) {
						setHours(
							from12hTo24h( numberValue, dayPeriod === 'PM' )
						);
						setHours12Format( numberValue );
					} else {
						setHours( numberValue );
						setHours12Format( from24hTo12h( numberValue ) );
						setDayPeriod( parseDayPeriod( numberValue ) );
					}
					break;

				case 'minutes':
					setMinutes( numberValue );
					break;
			}
		};

		return callback;
	};

	const buildAmPmChangeCallback = ( _value: 'AM' | 'PM' ) => {
		return () => {
			if ( dayPeriod === _value ) {
				return;
			}

			setDayPeriod( _value );
			setHours( from12hTo24h( hours12Format, _value === 'PM' ) );
		};
	};

	function parseDayPeriod( _hours: number ) {
		return _hours < 12 ? 'AM' : 'PM';
	}

	useEffect( () => {
		setHours( value.hours );
		setMinutes( value.minutes );

		setDayPeriod( parseDayPeriod( value.hours ) );
		setHours12Format( from24hTo12h( value.hours ) );
	}, [ value ] );

	useEffect( () => {
		if (
			( prevValues.current.hours !== hours ||
				prevValues.current.minutes !== minutes ) &&
			( entryValue?.hours !== hours || entryValue?.minutes !== minutes )
		) {
			onChange?.( { hours, minutes } );
		}

		prevValues.current.hours = hours;
		prevValues.current.minutes = minutes;
	}, [ onChange, entryValue, hours, minutes ] );

	return (
		<HStack alignment="left">
			<TimeWrapper
				className="components-datetime__time-field components-datetime__time-field-time" // Unused, for backwards compatibility.
			>
				<HoursInput
					className="components-datetime__time-field-hours-input" // Unused, for backwards compatibility.
					label={ __( 'Hours' ) }
					hideLabelFromVision
					__next40pxDefaultSize
					value={ String( is12Hour ? hours12Format : hours ).padStart(
						2,
						'0'
					) }
					step={ 1 }
					min={ is12Hour ? 1 : 0 }
					max={ is12Hour ? 12 : 23 }
					required
					spinControls="none"
					isPressEnterToChange
					isDragEnabled={ false }
					isShiftStepEnabled={ false }
					onChange={ buildNumberControlChangeCallback( 'hours' ) }
					__unstableStateReducer={ buildPadInputStateReducer( 2 ) }
				/>
				<TimeSeparator
					className="components-datetime__time-separator" // Unused, for backwards compatibility.
					aria-hidden="true"
				>
					:
				</TimeSeparator>
				<MinutesInput
					className={ clsx(
						'components-datetime__time-field-minutes-input', // Unused, for backwards compatibility.
						minutesProps?.className
					) }
					label={ __( 'Minutes' ) }
					hideLabelFromVision
					__next40pxDefaultSize
					value={ String( minutes ).padStart( 2, '0' ) }
					step={ 1 }
					min={ 0 }
					max={ 59 }
					required
					spinControls="none"
					isPressEnterToChange
					isDragEnabled={ false }
					isShiftStepEnabled={ false }
					onChange={ ( ...args ) => {
						buildNumberControlChangeCallback( 'minutes' )(
							...args
						);
						minutesProps?.onChange?.( ...args );
					} }
					__unstableStateReducer={ buildPadInputStateReducer( 2 ) }
					{ ...minutesProps }
				/>
			</TimeWrapper>
			{ is12Hour && (
				<ButtonGroup
					className="components-datetime__time-field components-datetime__time-field-am-pm" // Unused, for backwards compatibility.
				>
					<Button
						className="components-datetime__time-am-button" // Unused, for backwards compatibility.
						variant={ dayPeriod === 'AM' ? 'primary' : 'secondary' }
						__next40pxDefaultSize
						onClick={ buildAmPmChangeCallback( 'AM' ) }
					>
						{ __( 'AM' ) }
					</Button>
					<Button
						className="components-datetime__time-pm-button" // Unused, for backwards compatibility.
						variant={ dayPeriod === 'PM' ? 'primary' : 'secondary' }
						__next40pxDefaultSize
						onClick={ buildAmPmChangeCallback( 'PM' ) }
					>
						{ __( 'PM' ) }
					</Button>
				</ButtonGroup>
			) }
		</HStack>
	);
}
export default TimeInput;
