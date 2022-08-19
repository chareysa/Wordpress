/**
 * External dependencies
 */
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import Picker from '../index.js';

describe( 'FocalPointPicker', () => {
	describe( 'focus and blur', () => {
		it( 'clicking the draggable area should focus it', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			const mockOnChange = jest.fn();

			render( <Picker onChange={ mockOnChange } /> );

			const draggableArea = screen.getByRole( 'button' );

			await user.click( draggableArea );

			expect( draggableArea ).toHaveFocus();
		} );

		it( 'should stop a drag operation when focus is lost', () => {
			const mockOnDrag = jest.fn();
			const mockOnDragEnd = jest.fn();
			const mockOnChange = jest.fn();

			render(
				<Picker
					onChange={ mockOnChange }
					onDrag={ mockOnDrag }
					onDragEnd={ mockOnDragEnd }
				/>
			);

			const draggableArea = screen.getByRole( 'button' );

			fireEvent.mouseDown( draggableArea );

			expect( mockOnDrag ).not.toHaveBeenCalled();
			expect( mockOnDragEnd ).not.toHaveBeenCalled();

			fireEvent.blur( draggableArea );
			fireEvent.mouseMove( draggableArea );

			expect( mockOnDrag ).not.toHaveBeenCalled();
			expect( mockOnDragEnd ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( 'drag gestures', () => {
		it( 'should call onDragStart, onDrag, onDragEnd and onChange in that order', () => {
			const logs = [];
			const eventLogger = ( name, args ) => logs.push( { name, args } );
			const events = [ 'onDragStart', 'onDrag', 'onDragEnd', 'onChange' ];
			const handlers = {};
			events.forEach( ( name ) => {
				handlers[ name ] = ( ...all ) => eventLogger( name, all );
			} );

			render( <Picker { ...handlers } /> );

			const dragArea = screen.getByRole( 'button' );

			fireEvent.mouseDown( dragArea );
			fireEvent.mouseMove( dragArea );
			fireEvent.mouseUp( dragArea );

			expect(
				events.reduce( ( last, eventName, index ) => {
					return last && logs[ index ].name === eventName;
				}, true )
			).toBe( true );
		} );
	} );

	describe( 'resolvePoint handling', () => {
		it( 'should allow value altering', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			const spyChange = jest.fn();
			const spy = jest.fn();

			render(
				<Picker
					value={ { x: 0.25, y: 0.25 } }
					onChange={ spyChange }
					resolvePoint={ () => {
						spy();
						return { x: 0.91, y: 0.42 };
					} }
				/>
			);

			// Click and press arrow up
			const dragArea = screen.getByRole( 'button' );

			await user.click( dragArea );
			await user.keyboard( '[ArrowUp]' );

			expect( spy ).toHaveBeenCalled();
			expect( spyChange ).toHaveBeenCalledWith( {
				x: '0.91',
				y: '0.42',
			} );
		} );
	} );

	describe( 'controllability', () => {
		it( 'should update value from props', () => {
			const { rerender } = render(
				<Picker value={ { x: 0.25, y: 0.5 } } />
			);
			const xInput = screen.getByRole( 'spinbutton', { name: 'Left' } );
			rerender( <Picker value={ { x: 0.93, y: 0.5 } } /> );
			expect( xInput.value ).toBe( '93' );
		} );
		it( 'call onChange with the expected values', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );

			const spyChange = jest.fn();
			render(
				<Picker value={ { x: 0.14, y: 0.62 } } onChange={ spyChange } />
			);
			// Click and press arrow up
			const dragArea = screen.getByRole( 'button' );

			await user.click( dragArea );
			await user.keyboard( '[ArrowDown]' );

			expect( spyChange ).toHaveBeenCalledWith( {
				x: '0.14',
				y: '0.63',
			} );
		} );
	} );
} );
