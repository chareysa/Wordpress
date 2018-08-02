/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { compose, ifCondition } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Dashicon, PanelBody } from '@wordpress/components';

import FlatTermSelector from '../post-taxonomies/flat-term-selector';

const TagsPanel = () => <PanelBody initialOpen={ false } title={ [
	<Dashicon
		key={ 'dashicon-lightbulb' }
		icon={ 'lightbulb' }
		className={ 'post-publish-panel__tip' }
		size={ 18 }
	/>,
	<span className="editor-post-publish-panel__link" key="label">{
		__( 'Add tags to your post' )
	}</span>,
] }>
	<p>Your readers will be able to find your posts more easily.</p>
	<FlatTermSelector slug={ 'post_tag' } />
</PanelBody>;

class MaybeTagsPanel extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			hadTags: props.hasTags,
		};
	}

	render() {
		if ( this.state.hadTags ) {
			return null;
		}
		return ( <TagsPanel /> );
	}
}

export default compose(
	withSelect( ( select ) => {
		const postType = select( 'core/editor' ).getCurrentPostType();
		const tagsTaxonomy = select( 'core' ).getTaxonomy( 'post_tag' );
		return {
			areTagsFetched: tagsTaxonomy !== undefined,
			isPostTypeSupported: tagsTaxonomy && tagsTaxonomy.types.some( ( type ) => type === postType ),
			hasTags: tagsTaxonomy ? select( 'core/editor' ).getEditedPostAttribute( tagsTaxonomy.rest_base ).length > 0 : false,
		};
	} ),
	ifCondition( ( { areTagsFetched, isPostTypeSupported } ) => isPostTypeSupported && areTagsFetched ),
)( MaybeTagsPanel );
