/**
 * External dependencies
 */
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { ColorPalette } from '../';

describe( 'ColorPalette', () => {
	const colors = [ 'red', 'white', 'blue' ];
	const currentColor = 'red';
	const currentColorWithAlpha = { r: 255, g: 0, b: 0, a: 0.5 };
	const onChange = jest.fn();

	const wrapper = shallow( <ColorPalette colors={ colors } value={ currentColor } onChange={ onChange } /> );
	const wrapperWithAlpha = shallow( <ColorPalette colors={ colors } value={ currentColor } onChange={ onChange } disableAlpha={ false } /> );
	const buttons = wrapper.find( '.blocks-color-palette__item-wrapper > button' );

	beforeEach( () => {
		onChange.mockClear();
	} );

	test( 'should render a dynamic toolbar of colors', () => {
		expect( wrapper ).toMatchSnapshot();
	} );

	test( 'should render three color button options', () => {
		expect( buttons ).toHaveLength( 3 );
	} );

	test( 'should call onClick on an active button with undefined', () => {
		const activeButton = buttons.findWhere( ( button ) => button.hasClass( 'is-active' ) );
		activeButton.simulate( 'click' );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( undefined );
	} );

	test( 'should call onClick on an inactive button', () => {
		const inactiveButton = buttons.findWhere( ( button ) => ! button.hasClass( 'is-active' ) ).first();
		inactiveButton.simulate( 'click' );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );

	test( 'should call onClick with undefined, when the clearButton onClick is triggered', () => {
		const clearButton = wrapper.find( '.button-link.blocks-color-palette__clear' );
		
		expect( clearButton ).toHaveLength( 1 );
		
		clearButton.simulate( 'click' );
		
		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( undefined );
	} );
	
	test( 'should allow disabling custom color picker', () => {
		expect( shallow( <ColorPalette colors={ colors } disableCustomColors={ true } value={ currentColor } onChange={ onChange } /> ) ).toMatchSnapshot();
	} );
	
	describe( 'Dropdown', () => {
		const dropdown = wrapper.find( 'Dropdown' );

		test( 'should render it correctly', () => {
			expect( dropdown ).toMatchSnapshot();
		} );

		describe( '.renderToggle', () => {
			const isOpen = true;
			const onToggle = jest.fn();

			const renderedToggle = shallow( dropdown.props().renderToggle( { isOpen, onToggle } ) );

			test( 'should render dropdown content', () => {
				expect( renderedToggle ).toMatchSnapshot();
			} );

			test( 'should call onToggle on click.', () => {
				renderedToggle.simulate( 'click' );

				expect( onToggle ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( '.renderContent', () => {
			const renderedContent = shallow( dropdown.props().renderContent() );
			const dropdownWithAlpha = wrapperWithAlpha.find( 'Dropdown' );
			const renderedContentWithAlpha = shallow( dropdownWithAlpha.props().renderContent() );

			test( 'should render dropdown content', () => {
				expect( renderedContent ).toMatchSnapshot();
			} );

			test( 'should call onToggle on click.', () => {
				renderedContent.simulate( 'changeComplete', { hex: currentColor } );

				expect( onChange ).toHaveBeenCalledTimes( 1 );
				expect( onChange ).toHaveBeenCalledWith( currentColor );
			} );

			test( 'should enable alpha channel inside color picker', () => {
				expect( renderedContentWithAlpha ).toMatchSnapshot();
			} );

			test( 'should return an rgba value on click.', () => {
				renderedContentWithAlpha.simulate( 'changeComplete', { rgb: currentColorWithAlpha } );

				expect( onChange ).toHaveBeenCalledTimes( 1 );
				expect( onChange ).toHaveBeenCalledWith( currentColorWithAlpha );
			} );
		} );
	} );

} );
