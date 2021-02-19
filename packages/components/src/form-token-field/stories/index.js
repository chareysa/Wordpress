/**
 * External dependencies
 */
import { boolean, text } from '@storybook/addon-knobs';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FormTokenField from '../';

export default {
	title: 'Components/FormTokenField',
	component: FormTokenField,
};

const continents = [
	'Africa',
	'America',
	'Antarctica',
	'Asia',
	'Europe',
	'Oceania',
];

const FormTokenFieldExample = () => {
	const showHowTo = boolean( 'Show how to instructions', true );
	const expandOnFocus = boolean( 'Expand on focus', false );
	const placeholder = text( 'Placeholder', '' );
	const enableValidation = boolean(
		'Validate that value is in suggestions',
		false
	);
	const [ selectedContinents, setSelectedContinents ] = useState( [] );

	return (
		<FormTokenField
			value={ selectedContinents }
			suggestions={ continents }
			onChange={ ( tokens ) => setSelectedContinents( tokens ) }
			label="Type a continent"
			placeholder={ placeholder }
			__experimentalExpandOnFocus={ expandOnFocus }
			__experimentalShowHowTo={ showHowTo }
			__experimentalValidateInput={
				enableValidation
					? ( newValue ) => continents.includes( newValue )
					: () => true
			}
		/>
	);
};

export const _default = () => {
	return <FormTokenFieldExample />;
};

const FormTokenFieldAsyncExample = () => {
	const showHowTo = boolean( 'Show how to instructions', true );
	const expandOnFocus = boolean( 'Expand on focus', false );
	const placeholder = text( 'Placeholder', '' );
	const enableValidation = boolean(
		'Validate that value is in suggestions',
		false
	);
	const [ selectedContinents, setSelectedContinents ] = useState( [] );
	const [ availableContinents, setAvailableContinents ] = useState( [] );
	const searchContinents = ( input ) => {
		const timeout = setTimeout( () => {
			const available = continents.filter( ( continent ) =>
				continent.toLowerCase().includes( input.toLowerCase() )
			);
			setAvailableContinents( available );
		}, 1000 );

		return () => clearTimeout( timeout );
	};

	return (
		<FormTokenField
			value={ selectedContinents }
			suggestions={ availableContinents }
			onChange={ ( tokens ) => setSelectedContinents( tokens ) }
			onInputChange={ searchContinents }
			label="Type a continent"
			placeholder={ placeholder }
			__experimentalExpandOnFocus={ expandOnFocus }
			__experimentalShowHowTo={ showHowTo }
			__experimentalValidateInput={
				enableValidation
					? ( newValue ) => continents.includes( newValue )
					: () => true
			}
		/>
	);
};

export const _async = () => {
	return <FormTokenFieldAsyncExample />;
};
