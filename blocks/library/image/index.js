/**
 * WordPress dependencies
 */
import { Placeholder } from 'components';

/**
 * Internal dependencies
 */
import './style.scss';
import { registerBlock } from '../../api';
import { findNodeAttribute, getEditableContent } from '../../api/source';
import Editable from '../../editable';
import MediaUploadButton from '../../media-upload-button';

/**
 * Returns an attribute setter with behavior that if the target value is
 * already the assigned attribute value, it will be set to undefined.
 *
 * @param  {string}   align Alignment value
 * @return {Function}       Attribute setter
 */
function toggleAlignment( align ) {
	return ( attributes, setAttributes ) => {
		const nextAlign = attributes.align === align ? undefined : align;
		setAttributes( { align: nextAlign } );
	};
}

registerBlock( 'core/image', {
	title: wp.i18n.__( 'Image' ),

	icon: 'format-image',

	category: 'common',

	getInitialAttributes( node, encodedAttributes ) {
		return {
			align: 'none',
			...encodedAttributes,
			url: findNodeAttribute( node, 'img', 'src' ),
			alt: findNodeAttribute( node, 'img', 'alt' ),
			content: getEditableContent( node, [ 'figure', 'figcaption' ] ),
		};
	},

	encodeAttributes( attributes ) {
		const { align } = attributes;

		return { align };
	},

	controls: [
		{
			icon: 'align-left',
			title: wp.i18n.__( 'Align left' ),
			isActive: ( { align } ) => 'left' === align,
			onClick: toggleAlignment( 'left' ),
		},
		{
			icon: 'align-center',
			title: wp.i18n.__( 'Align center' ),
			isActive: ( { align } ) => ! align || 'center' === align,
			onClick: toggleAlignment( 'center' ),
		},
		{
			icon: 'align-right',
			title: wp.i18n.__( 'Align right' ),
			isActive: ( { align } ) => 'right' === align,
			onClick: toggleAlignment( 'right' ),
		},
		{
			icon: 'align-full-width',
			title: wp.i18n.__( 'Wide width' ),
			isActive: ( { align } ) => 'wide' === align,
			onClick: toggleAlignment( 'wide' ),
		},
	],

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( 'left' === align || 'right' === align || 'wide' === align ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, focus, setFocus } ) {
		const { url, alt, caption } = attributes;

		if ( ! url ) {
			const uploadButtonProps = { isLarge: true };
			const setMediaURL = ( media ) => setAttributes( { url: media.url } );
			return (
				<Placeholder
					instructions={ wp.i18n.__( 'Drag image here or insert from media library' ) }
					icon="format-image"
					label={ wp.i18n.__( 'Image' ) }
					className="blocks-image">
					<MediaUploadButton
						buttonProps={ uploadButtonProps }
						onSelect={ setMediaURL }
						type="image"
						auto-open
					>
						{ wp.i18n.__( 'Insert from Media Library' ) }
					</MediaUploadButton>
				</Placeholder>
			);
		}

		const focusCaption = ( focusValue ) => setFocus( { editable: 'caption', ...focusValue } );

		// Disable reason: Each block can be selected by clicking on it

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<figure className="blocks-image">
				<img src={ url } alt={ alt } onClick={ setFocus } />
				{ ( caption && caption.length > 0 ) || !! focus ? (
					<Editable
						tagName="figcaption"
						placeholder={ wp.i18n.__( 'Write caption…' ) }
						value={ caption }
						focus={ focus && focus.editable === 'caption' ? focus : undefined }
						onFocus={ focusCaption }
						onChange={ ( value ) => setAttributes( { caption: value } ) }
						inline
						inlineToolbar
					/>
				) : null }
			</figure>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	},

	save( { attributes } ) {
		const { url, alt, caption, align } = attributes;
		const img = <img src={ url } alt={ alt } className={ `align${ align }` } />;

		if ( ! caption || ! caption.length ) {
			return img;
		}

		return (
			<figure>
				{ img }
				<figcaption>{ caption }</figcaption>
			</figure>
		);
	},
} );
