/**
 * External dependencies
 */
import { isFinite } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BaseControl, Button, Dashicon } from '../';
import withInstanceId from '../higher-order/with-instance-id';
import './style.scss';

function RangeControl( {
	className,
	label,
	value,
	instanceId,
	onChange,
	beforeIcon,
	afterIcon,
	help,
	allowReset,
	initialPosition,
	...props
} ) {
	const id = `inspector-range-control-${ instanceId }`;
	const onChangeValue = ( event ) => onChange( Number( event.target.value ) );
	const initialSliderValue = isFinite( value ) ? value : initialPosition || '';

	// remove any forwardedRef that may be in here.  This is because leaf
	// components cannot have non native props with camelCase and it'll throw a
	// warning if present.
	const forwardedProps = { ...props };
	delete( forwardedProps.forwardedRef );

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
				{ ...forwardedProps } />
			{ afterIcon && <Dashicon icon={ afterIcon } /> }
			<input
				className="components-range-control__number"
				type="number"
				onChange={ onChangeValue }
				aria-label={ label }
				value={ value }
				{ ...forwardedProps }
			/>
			{ allowReset &&
				<Button onClick={ () => onChange() } disabled={ value === undefined }>
					{ __( 'Reset' ) }
				</Button>
			}
		</BaseControl>
	);
}

export default withInstanceId( RangeControl );
