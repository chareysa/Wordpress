/**
 * External dependencies
 */
import { map, filter } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Flex,
	FlexItem,
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	__experimentalInputControl as InputControl,
	__experimentalSpacer as Spacer,
	__experimentalText as Text,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Minimum number of tags a user can show using this block.
 *
 * @type {number}
 */
const MIN_TAGS = 1;

/**
 * Maximum number of tags a user can show using this block.
 *
 * @type {number}
 */
const MAX_TAGS = 100;

function TagCloudEdit( { attributes, setAttributes, taxonomies } ) {
	const {
		taxonomy,
		showTagCounts,
		numberOfTags,
		smallestFontSize,
		largestFontSize,
	} = attributes;

	const getTaxonomyOptions = () => {
		const selectOption = {
			label: __( '- Select -' ),
			value: '',
			disabled: true,
		};
		const taxonomyOptions = map(
			filter( taxonomies, 'show_cloud' ),
			( item ) => {
				return {
					value: item.slug,
					label: item.name,
				};
			}
		);

		return [ selectOption, ...taxonomyOptions ];
	};

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Tag Cloud settings' ) }>
				<SelectControl
					label={ __( 'Taxonomy' ) }
					options={ getTaxonomyOptions() }
					value={ taxonomy }
					onChange={ ( selectedTaxonomy ) =>
						setAttributes( { taxonomy: selectedTaxonomy } )
					}
				/>
				<ToggleControl
					label={ __( 'Show post counts' ) }
					checked={ showTagCounts }
					onChange={ () =>
						setAttributes( { showTagCounts: ! showTagCounts } )
					}
				/>
				<RangeControl
					label={ __( 'Number of tags' ) }
					value={ numberOfTags }
					onChange={ ( value ) =>
						setAttributes( { numberOfTags: value } )
					}
					min={ MIN_TAGS }
					max={ MAX_TAGS }
					required
				/>
				<Flex>
					<FlexItem isBlock>
						<InputControl
							type="number"
							label={ __( 'Smallest size' ) }
							value={ smallestFontSize }
							onChange={ ( value ) => {
								const newValue =
									value && +value >= 8 ? +value : 8;
								setAttributes( {
									smallestFontSize: newValue,
								} );
							} }
							min={ 8 }
							max={ 60 }
							suffix={
								<Spacer
									as={ Text }
									marginTop={ 2 }
									marginRight={ 3 }
								>
									px
								</Spacer>
							}
						/>
					</FlexItem>
					<FlexItem isBlock>
						<InputControl
							type="number"
							label={ __( 'Largest size' ) }
							value={ largestFontSize }
							onChange={ ( value ) => {
								const newValue =
									value && +value >= 8 ? +value : 60;
								setAttributes( { largestFontSize: newValue } );
							} }
							min={ 8 }
							max={ 60 }
							suffix={
								<Spacer
									as={ Text }
									marginTop={ 2 }
									marginRight={ 3 }
								>
									px
								</Spacer>
							}
						/>
					</FlexItem>
				</Flex>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			<div { ...useBlockProps() }>
				<ServerSideRender
					key="tag-cloud"
					block="core/tag-cloud"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

export default withSelect( ( select ) => {
	return {
		taxonomies: select( coreStore ).getTaxonomies( { per_page: -1 } ),
	};
} )( TagCloudEdit );
