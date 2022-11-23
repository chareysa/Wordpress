/**
 * External dependencies
 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import ColorPalette from '..';

describe( 'ColorPalette', () => {
	const colors = [
		{ name: 'red', color: '#f00' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];
	const currentColor = '#f00';

	it( 'should render a dynamic toolbar of colors', () => {
		const onChange = jest.fn();

		const { container } = render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		expect( container ).toMatchSnapshot();
	} );

	it( 'should render three color button options', () => {
		const onChange = jest.fn();

		render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		expect(
			screen.getAllByRole( 'button', { name: /^Color:/ } )
		).toHaveLength( 3 );
	} );

	it( 'should call onClick on an active button with undefined', async () => {
		const user = userEvent.setup( {
			advanceTimers: jest.advanceTimersByTime,
		} );
		const onChange = jest.fn();

		render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		await user.click(
			screen.getByRole( 'button', { name: /^Color:/, pressed: true } )
		);

		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( undefined );
	} );

	it( 'should call onClick on an inactive button', async () => {
		const user = userEvent.setup( {
			advanceTimers: jest.advanceTimersByTime,
		} );
		const onChange = jest.fn();

		render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		await user.click(
			screen.getAllByRole( 'button', {
				name: /^Color:/,
				pressed: false,
			} )[ 0 ]
		);

		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( '#fff', 1 );
	} );

	it( 'should call onClick with undefined, when the clearButton onClick is triggered', async () => {
		const user = userEvent.setup( {
			advanceTimers: jest.advanceTimersByTime,
		} );
		const onChange = jest.fn();

		render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		await user.click( screen.getByRole( 'button', { name: 'Clear' } ) );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( undefined );
	} );

	it( 'should allow disabling custom color picker', () => {
		const onChange = jest.fn();

		const { container } = render(
			<ColorPalette
				colors={ colors }
				disableCustomColors
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		expect( container ).toMatchSnapshot();
	} );

	it( 'should render dropdown and its content', async () => {
		const user = userEvent.setup( {
			advanceTimers: jest.advanceTimersByTime,
		} );
		const onChange = jest.fn();

		render(
			<ColorPalette
				colors={ colors }
				value={ currentColor }
				onChange={ onChange }
			/>
		);

		await user.click(
			screen.getByRole( 'button', {
				name: /^Custom color picker/,
				expanded: false,
			} )
		);

		const dropdownButton = screen.getByRole( 'button', {
			name: /^Custom color picker/,
			expanded: true,
		} );

		expect( dropdownButton ).toBeVisible();

		expect(
			within( dropdownButton ).getByText( colors[ 0 ].name )
		).toBeVisible();
		expect(
			within( dropdownButton ).getByText(
				colors[ 0 ].color.replace( '#', '' )
			)
		).toBeVisible();
	} );
} );
