/**
 * External dependencies
 */
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { PostVisibility } from '../';

describe( 'PostVisibility', () => {
	const user = {
		data: {
			post_type_capabilities: {
				publish_posts: true,
			},
		},
	};

	it( 'should not render the edit link if the user doesn\'t have the right capability', () => {
		let wrapper = shallow( <PostVisibility user={ {} } /> );
		expect( wrapper.find( 'a' ) ).toHaveLength( 0 );
		wrapper = shallow( <PostVisibility postType="post" user={
			{ data: { post_type_capabilities: { publish_posts: false } } }
		} /> );
		expect( wrapper.find( 'Dropdown' ) ).toHaveLength( 0 );
	} );

	it( 'should render if the user has the correct capability', () => {
		const wrapper = shallow( <PostVisibility user={ user } /> );
		expect( wrapper.find( 'Dropdown' ) ).not.toHaveLength( 0 );
	} );
} );
