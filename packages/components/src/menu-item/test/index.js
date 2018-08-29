/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import { noop } from 'lodash-es';

/**
 * Internal dependencies
 */
import MenuItem from '../';

jest.mock( '../../button' );

describe( 'MenuItem', () => {
	test( 'should match snapshot when only label provided', () => {
		const wrapper = shallow(
			<MenuItem>
				My item
			</MenuItem>
		);

		expect( wrapper ).toMatchSnapshot();
	} );

	test( 'should match snapshot when all props provided', () => {
		const wrapper = shallow(
			<MenuItem
				className="my-class"
				icon="wordpress"
				isSelected={ true }
				role="menuitemcheckbox"
				onClick={ noop }
				shortcut="mod+shift+alt+w"
			>
				My item
			</MenuItem>
		);

		expect( wrapper ).toMatchSnapshot();
	} );

	test( 'should match snapshot when isSelected and role are optionally provided', () => {
		const wrapper = shallow(
			<MenuItem
				className="my-class"
				icon="wordpress"
				onClick={ noop }
				shortcut="mod+shift+alt+w"
			>
				My item
			</MenuItem>
		);

		expect( wrapper ).toMatchSnapshot();
	} );
} );
