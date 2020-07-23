/**
 * Internal dependencies
 */
import {
	createUpgradedEmbedBlock,
	getClassNames,
	fallback,
	getAttributesFromPreview,
	getEmbedInfoByProvider,
} from './util';
import EmbedControls from './embed-controls';
import EmbedLoading from './embed-loading';
import EmbedPlaceholder from './embed-placeholder';
import EmbedPreview from './embed-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

function getResponsiveHelp( checked ) {
	return checked
		? __(
				'This embed will preserve its aspect ratio when the browser is resized.'
		  )
		: __(
				'This embed may not preserve its aspect ratio when the browser is resized.'
		  );
}

const EmbedEdit = ( props ) => {
	const {
		attributes: {
			providerNameSlug,
			previewable,
			responsive,
			allowResponsive,
			caption,
			className,
			url: attributesUrl,
		},
		attributes,
		isSelected,
		onReplace,
		setAttributes,
		insertBlocksAfter,
	} = props;

	const { icon, title } = getEmbedInfoByProvider( providerNameSlug );
	const [ url, setURL ] = useState( attributesUrl );
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ mergedAttributes, setMergedAttributes ] = useState( attributes );
	const { invalidateResolution } = useDispatch( 'core/data' );

	const {
		preview,
		fetching,
		themeSupportsResponsive,
		cannotEmbed,
	} = useSelect(
		( select ) => {
			const {
				getEmbedPreview,
				isPreviewEmbedFallback,
				isRequestingEmbedPreview,
				getThemeSupports,
			} = select( 'core' );
			if ( ! attributesUrl ) {
				return { fetching: false, cannotEmbed: false };
			}

			const embedPreview = getEmbedPreview( attributesUrl );
			const previewIsFallback = isPreviewEmbedFallback( attributesUrl );

			// The external oEmbed provider does not exist. We got no type info and no html.
			const badEmbedProvider =
				embedPreview?.html === false &&
				embedPreview?.type === undefined;
			// Some WordPress URLs that can't be embedded will cause the API to return
			// a valid JSON response with no HTML and `data.status` set to 404, rather
			// than generating a fallback response as other embeds do.
			const wordpressCantEmbed = embedPreview?.data?.status === 404;
			const validPreview =
				!! embedPreview && ! badEmbedProvider && ! wordpressCantEmbed;
			return {
				preview: validPreview ? embedPreview : undefined,
				fetching: isRequestingEmbedPreview( attributesUrl ),
				themeSupportsResponsive: getThemeSupports()[
					'responsive-embeds'
				],
				cannotEmbed: ! validPreview || previewIsFallback,
			};
		},
		[ attributesUrl ]
	);

	/**
	 * @return {Object} Attributes derived from the preview, merged with the current attributes.
	 */
	const getMergedAttributes = () => {
		return {
			...attributes,
			...getAttributesFromPreview(
				preview,
				title,
				className,
				responsive,
				allowResponsive
			),
		};
	};

	const toggleResponsive = () => {
		const { html } = preview;
		const newAllowResponsive = ! allowResponsive;

		setAttributes( {
			allowResponsive: newAllowResponsive,
			className: getClassNames(
				html,
				className,
				responsive && newAllowResponsive
			),
		} );
	};

	useEffect( () => {
		if ( ! preview?.html || ! cannotEmbed || fetching ) {
			return;
		}
		// At this stage, we're not fetching the preview and know it can't be embedded,
		// so try removing any trailing slash, and resubmit.
		const newURL = attributesUrl.replace( /\/$/, '' );
		setURL( newURL );
		setIsEditingURL( false );
		setAttributes( { url: newURL } );
	}, [ preview?.html, attributesUrl ] );

	// Handle incoming preview
	useEffect( () => {
		if ( preview && ! isEditingURL ) {
			// Even though we set attributes that get derived from the preview,
			// we don't access them directly because for the initial render,
			// the `setAttributes` call will not have taken effect. If we're
			// rendering responsive content, setting the responsive classes
			// after the preview has been rendered can result in unwanted
			// clipping or scrollbars. The `getAttributesFromPreview` function
			// that `getMergedAttributes` uses is memoized so that we're not
			// calculating them on every render.
			setMergedAttributes( getMergedAttributes() );
			setAttributes( mergedAttributes );
			if ( onReplace ) {
				const upgradedBlock = createUpgradedEmbedBlock(
					props,
					mergedAttributes
				);

				if ( upgradedBlock ) {
					onReplace( upgradedBlock );
				}
			}
		}
	}, [ preview, isEditingURL ] );

	if ( fetching ) {
		return <EmbedLoading />;
	}

	// translators: %s: type of embed e.g: "YouTube", "Twitter", etc. "Embed" is used when no specific type exists
	const label = sprintf( __( '%s URL' ), title );

	// No preview, or we can't embed the current URL, or we've clicked the edit button.
	const showEmbedPlaceholder = ! preview || cannotEmbed || isEditingURL;
	if ( showEmbedPlaceholder ) {
		return (
			<EmbedPlaceholder
				icon={ icon }
				label={ label }
				onSubmit={ ( event ) => {
					if ( event ) {
						event.preventDefault();
					}

					setIsEditingURL( false );
					setAttributes( { url } );
				} }
				value={ url }
				cannotEmbed={ cannotEmbed }
				onChange={ ( event ) => setURL( event.target.value ) }
				fallback={ () => fallback( url, onReplace ) }
				tryAgain={ () => {
					invalidateResolution( 'core', 'getEmbedPreview', [ url ] );
				} }
			/>
		);
	}

	return (
		<>
			<EmbedControls
				showEditButton={ preview && ! cannotEmbed }
				themeSupportsResponsive={ themeSupportsResponsive }
				blockSupportsResponsive={ responsive }
				allowResponsive={ allowResponsive }
				getResponsiveHelp={ getResponsiveHelp }
				toggleResponsive={ toggleResponsive }
				switchBackToURLInput={ () => setIsEditingURL( true ) }
			/>
			<EmbedPreview
				preview={ preview }
				previewable={ previewable }
				className={ classnames(
					mergedAttributes.className,
					props.className
				) }
				url={ url }
				type={ mergedAttributes.type }
				caption={ caption }
				onCaptionChange={ ( value ) =>
					setAttributes( { caption: value } )
				}
				isSelected={ isSelected }
				icon={ icon }
				label={ label }
				insertBlocksAfter={ insertBlocksAfter }
			/>
		</>
	);
};

export default EmbedEdit;
