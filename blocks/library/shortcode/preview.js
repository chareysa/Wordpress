/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { withAPIData, Spinner, SandBox } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getCurrentPostId } from '../../../editor/store/selectors';

function ShortcodePreview( { response } ) {
	if ( response.isLoading || ! response.data ) {
		return (
			<div key="loading" className="wp-block-embed is-loading">
				<Spinner />
				<p>{ __( 'Loading...' ) }</p>
			</div>
		);
	}

	const html = response.data.html + ' ' + response.data.js + ' ' + response.data.style;
	return (
		<figure className="wp-block-embed" key="embed">
			<SandBox
				html={ html }
				title="Preview"
				type={ response.data.type }
			/>
		</figure>
	);
}

const applyConnect = connect(
	( state ) => {
		return {
			postId: getCurrentPostId( state ),
		};
	},
);

const applyWithAPIData = withAPIData( ( props ) => {
	const { shortcode, postId } = props;
	return {
		response: `/gutenberg/v1/shortcodes?shortcode=${ encodeURIComponent( shortcode ) }&postId=${ postId }`,
	};
} );

export default compose( [
	applyConnect,
	applyWithAPIData,
] )( ShortcodePreview );
