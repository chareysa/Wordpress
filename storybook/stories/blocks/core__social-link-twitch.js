/**
 * Internal dependencies
 */
import core__social_link_twitch from '../../../test/integration/fixtures/blocks/core__social-link-twitch.serialized.html';

export default {
	title: 'Blocks/core__social_link_twitch',
};

export const _default = () => {
	return (
		<div
			dangerouslySetInnerHTML={ { __html: core__social_link_twitch } }
		></div>
	);
};
