/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getBlobByURL, revokeBlobURL } from '@wordpress/utils';
import {
	Button,
	FormFileUpload,
	IconButton,
	Placeholder,
	Toolbar,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import {
	MediaUpload,
	BlockControls,
	InspectorControls,
	editorMediaUpload,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import './editor.scss';

export default class FileEdit extends Component {
	constructor() {
		super( ...arguments );

		const { href, fileName, id } = this.props.attributes;

		this.onSelectFile = this.onSelectFile.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );

		// edit component has its own attributes in the state so it can be edited
		// without setting the actual values outside of the edit UI
		this.state = {
			editing: ! href,
			href,
			fileName,
			attachmentPage: undefined,
		};

		const getAttachmentPageURL = ( mediaId ) => {
			return wp.apiRequest( {
				path: `/wp/v2/media/${ mediaId }`,
				method: 'GET',
			} )
				.then(
					( result ) => {
						this.setState( { attachmentPage: result.link } );
					},
					() => {
						this.setState( { attachmentPage: undefined } );
					}
				);
		};

		if ( id !== undefined ) {
			getAttachmentPageURL( id );
		}
	}

	componentDidMount() {
		const { href } = this.state;

		if ( this.isBlobURL( href ) ) {
			getBlobByURL( href )
				.then( ( file ) => {
					this.uploadFromFiles( [ file ] );
					revokeBlobURL( href );
				} );
		}
	}

	onSelectFile( media ) {
		const { fileName } = this.props.attributes;

		if ( media && media.url ) {
			// sets the block's attributes and updates the edit component from the
			// selected media, then switches off the editing UI
			this.props.setAttributes( {
				href: media.url,
				fileName: media.title || fileName,
				textLinkHref: media.url,
				id: media.id,
			} );
			this.setState( {
				href: media.url,
				fileName: media.title || fileName,
				attachmentPage: media.link,
				editing: false,
			} );
		}
	}

	uploadFromFiles( files ) {
		editorMediaUpload( files, ( [ media ] ) => this.onSelectFile( media ), '*' );
	}

	isBlobURL( url = '' ) {
		return url.indexOf( 'blob:' ) === 0;
	}

	render() {
		const { id, textLinkHref } = this.props.attributes;
		const { setAttributes } = this.props;
		const { editing, href, fileName, attachmentPage } = this.state;

		const classNames = [
			this.props.className,
			`${ this.props.className }__editing`,
			this.isBlobURL( href ) ? 'is-transient' : '',
		].join( ' ' );

		const switchToEditing = () => {
			this.setState( { editing: true } );
		};

		const onSelectUrl = ( event ) => {
			event.preventDefault();
			if ( href ) {
				// set the block's href from the edit component's state, and switch off the editing UI
				setAttributes( {
					href,
					textLinkHref: href,
					id: undefined,
				} );
				this.setState( { editing: false, attachmentPage: undefined } );
			}
			return false;
		};

		const uploadFilesFromInput = ( event ) => {
			this.uploadFromFiles( event.target.files );
		};

		const onChangeLinkDestinationOption = ( newHref ) => {
			setAttributes( {
				textLinkHref: newHref,
			} );
		};

		const linkDestinationOptions = ( () => {
			if ( attachmentPage ) {
				return [
					{ value: href, label: __( 'Media File' ) },
					{ value: attachmentPage, label: __( 'Attachment Page' ) },
				];
			}
			return [ { value: href, label: __( 'URL' ) } ];
		} )();

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Text Link Settings' ) }>
					<SelectControl
						label={ __( 'Link To' ) }
						value={ textLinkHref }
						options={ linkDestinationOptions }
						onChange={ onChangeLinkDestinationOption }
					/>
				</PanelBody>
			</InspectorControls>
		);

		if ( editing ) {
			return (
				<Placeholder
					icon="media-default"
					label={ __( 'File' ) }
					instructions={ __( 'Select a file from your library, or upload a new one' ) }
					className={ classNames }>
					<form onSubmit={ onSelectUrl }>
						<input
							type="url"
							className="components-placeholder__input"
							placeholder={ __( 'Enter URL of file here…' ) }
							onChange={ ( event ) => this.setState( { href: event.target.value } ) }
							value={ href || '' } />
						<Button
							isLarge
							type="submit">
							{ __( 'Use URL' ) }
						</Button>
					</form>
					<FormFileUpload
						isLarge
						className="wp-block-file__upload-button"
						onChange={ uploadFilesFromInput }
						accept="*"
					>
						{ __( 'Upload' ) }
					</FormFileUpload>
					<MediaUpload
						onSelect={ this.onSelectFile }
						type="*"
						value={ id }
						render={ ( { open } ) => (
							<Button isLarge onClick={ open }>
								{ __( 'Media Library' ) }
							</Button>
						) }
					/>
				</Placeholder>
			);
		}

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-icon-button components-toolbar__control"
							label={ __( 'Edit file' ) }
							onClick={ switchToEditing }
							icon="edit"
						/>
					</Toolbar>
				</BlockControls>
				<div className={ classNames }>
					<a href={ textLinkHref }>
						{ fileName }
					</a>
					<a
						href={ href }
						className="wp-block-file__button"
						download={ fileName }>
						{ __( 'Download' ) }
					</a>
				</div>
			</Fragment>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}
