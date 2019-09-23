/**
 * External dependencies
 */
import { Dimensions, View, ImageBackground, Text, TouchableWithoutFeedback, Platform } from 'react-native';
import {
	requestMediaImport,
	mediaUploadSync,
	requestImageFailedRetryDialog,
	requestImageUploadCancelDialog,
} from 'react-native-gutenberg-bridge';

/**
 * WordPress dependencies
 */
import {
	Icon,
	IconButton,
	Toolbar,
	withNotices,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	MEDIA_TYPE_IMAGE,
	MEDIA_TYPE_VIDEO,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadProgress,
	VideoPlayer,
} from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import icon from './media-container-icon';
import SvgIconRetry from './icon-retry';

/**
 * Constants
 */
// For Android it will only work with the first element of the array (images)
const ALLOWED_MEDIA_TYPES = [ MEDIA_TYPE_IMAGE, ...( Platform.OS === 'ios' ? [ MEDIA_TYPE_VIDEO ] : [] ) ];

// Default Video ratio 16:9
const VIDEO_ASPECT_RATIO = 16 / 9;

class MediaContainer extends Component {
	constructor() {
		super( ...arguments );
		this.onUploadError = this.onUploadError.bind( this );
		this.updateMediaProgress = this.updateMediaProgress.bind( this );
		this.finishMediaUploadWithSuccess = this.finishMediaUploadWithSuccess.bind( this );
		this.finishMediaUploadWithFailure = this.finishMediaUploadWithFailure.bind( this );
		this.mediaUploadStateReset = this.mediaUploadStateReset.bind( this );
		this.onSelectMediaUploadOption = this.onSelectMediaUploadOption.bind( this );
		this.onMediaPressed = this.onMediaPressed.bind( this );

		this.state = {
			isUploadInProgress: false,
		};
	}

	componentDidMount() {
		const { mediaId, mediaUrl, onSelectMedia } = this.props;

		if ( mediaId && mediaUrl && ! isURL( mediaUrl ) ) {
			if ( mediaUrl.indexOf( 'file:' ) === 0 ) {
				requestMediaImport( mediaUrl, ( id, url, type ) => {
					if ( url ) {
						onSelectMedia( {
							media_type: type || 'image', // image fallback for android
							id,
							url,
						} );
					}
				} );
			}
			mediaUploadSync();
		}
	}

	onUploadError( message ) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	onSelectMediaUploadOption( params ) {
		const { id, url, type } = params;
		const { onSelectMedia } = this.props;

		onSelectMedia( {
			media_type: type || 'image', // image fallback for android
			id,
			url,
		} );
	}

	onMediaPressed() {
		const { mediaId, mediaUrl } = this.props;

		if ( this.state.isUploadInProgress ) {
			requestImageUploadCancelDialog( mediaId );
		} else if ( mediaId && ! isURL( mediaUrl ) ) {
			requestImageFailedRetryDialog( mediaId );
		}
	}

	getIcon( isRetryIcon, isVideo ) {
		if ( isRetryIcon ) {
			return <Icon icon={ SvgIconRetry } { ...( styles.iconRetry, isVideo ? styles.iconRetryVideo : {} ) } />;
		}

		return <Icon icon={ icon } { ...styles.icon } />;
	}

	renderToolbarEditButton( open ) {
		return (
			<BlockControls>
				<Toolbar>
					<IconButton
						className="components-toolbar__control"
						label={ __( 'Edit media' ) }
						icon="edit"
						onClick={ open }
					/>
				</Toolbar>
			</BlockControls>
		);
	}

	updateMediaProgress() {
		if ( ! this.state.isUploadInProgress ) {
			this.setState( { isUploadInProgress: true } );
		}
	}

	finishMediaUploadWithSuccess( payload ) {
		const { onMediaUpdate } = this.props;

		onMediaUpdate( {
			id: payload.mediaServerId,
			url: payload.mediaUrl,
		} );
		this.setState( { isUploadInProgress: false } );
	}

	finishMediaUploadWithFailure() {
		this.setState( { isUploadInProgress: false } );
	}

	mediaUploadStateReset() {
		const { onMediaUpdate } = this.props;

		onMediaUpdate( { id: null, url: null } );
		this.setState( { isUploadInProgress: false } );
	}

	renderImage( params, openMediaOptions ) {
		const { isUploadInProgress } = this.state;
		const { mediaAlt, mediaUrl, isSelected } = this.props;
		const { finalWidth, finalHeight, imageWidthWithinContainer, isUploadFailed, retryMessage } = params;
		const opacity = isUploadInProgress ? 0.3 : 1;

		return (
			<TouchableWithoutFeedback
				accessible={ ! isSelected }
				onPress={ this.onMediaPressed }
				onLongPress={ openMediaOptions }
				disabled={ ! isSelected }
			>
				<View style={ styles.content } >
					{ ! imageWidthWithinContainer &&
						<View style={ styles.imageContainer } >
							{ this.getIcon( false ) }
						</View> }
					<ImageBackground
						accessible={ true }
						accessibilityLabel={ mediaAlt }
						accessibilityHint={ __( 'Double tap and hold to edit' ) }
						accessibilityRole={ 'imagebutton' }
						style={ { width: finalWidth, height: finalHeight, opacity } }
						resizeMethod="scale"
						source={ { uri: mediaUrl } }
						key={ mediaUrl }
					>
						{ isUploadFailed &&
							<View style={ [ styles.imageContainer, styles.uploadFailed ] } >
								<View style={ styles.modalIcon }>
									{ this.getIcon( isUploadFailed ) }
								</View>
								<Text style={ styles.uploadFailedText }>{ retryMessage }</Text>
							</View>
						}
					</ImageBackground>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	renderVideo( params, openMediaOptions ) {
		const { mediaUrl, isSelected } = this.props;
		const { isUploadInProgress } = this.state;
		const { isUploadFailed, retryMessage } = params;
		const videoHeight = ( Dimensions.get( 'window' ).width / 2 ) / VIDEO_ASPECT_RATIO;
		const showVideo = isURL( mediaUrl ) && ! isUploadInProgress && ! isUploadFailed;

		return (
			<TouchableWithoutFeedback
				accessible={ ! isSelected }
				onPress={ this.onMediaPressed }
				onLongPress={ openMediaOptions }
				disabled={ ! isSelected }
			>
				<View style={ styles.content } >
					{ showVideo &&
						<View style={ [ styles.videoContainer, { height: videoHeight } ] }>
							<VideoPlayer
								isSelected={ isSelected }
								style={ [ styles.video, { height: videoHeight } ] }
								source={ { uri: mediaUrl } }
								paused={ true }
							/>
						</View>
					}
					{ ! showVideo &&
						<View style={ styles.videoPlaceholder }>
							<View style={ styles.modalIcon } >
								{ isUploadFailed ? this.getIcon( isUploadFailed ) : this.getIcon( false ) }
							</View>
							{ isUploadFailed && <Text style={ [ styles.uploadFailedText, styles.uploadFailedTextVideo ] }>{ retryMessage }</Text> }
						</View>
					}
				</View>
			</TouchableWithoutFeedback>
		);
	}

	renderContent( params, openMediaOptions ) {
		const { mediaType } = this.props;
		let mediaElement = null;

		switch ( mediaType ) {
			case MEDIA_TYPE_IMAGE:
				mediaElement = this.renderImage( params, openMediaOptions );
				break;
			case MEDIA_TYPE_VIDEO:
				mediaElement = this.renderVideo( params, openMediaOptions );
				break;
		}
		return mediaElement;
	}

	renderPlaceholder() {
		return (
			<MediaPlaceholder
				icon={ <BlockIcon icon={ icon } /> }
				labels={ {
					title: __( 'Media area' ),
				} }
				onSelect={ this.onSelectMediaUploadOption }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				onFocus={ this.props.onFocus }
				onError={ this.onUploadError }
			/>
		);
	}

	render() {
		const { mediaUrl, mediaId, mediaType } = this.props;
		const coverUrl = mediaType === MEDIA_TYPE_IMAGE ? mediaUrl : null;

		if ( mediaUrl ) {
			return (
				<MediaUpload
					onSelect={ this.onSelectMediaUploadOption }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					value={ mediaId }
					render={ ( { open, getMediaOptions } ) => {
						return <>
							{ getMediaOptions() }
							{ this.renderToolbarEditButton( open ) }

							<MediaUploadProgress
								coverUrl={ coverUrl }
								mediaId={ mediaId }
								onUpdateMediaProgress={ this.updateMediaProgress }
								onFinishMediaUploadWithSuccess={ this.finishMediaUploadWithSuccess }
								onFinishMediaUploadWithFailure={ this.finishMediaUploadWithFailure }
								onMediaUploadStateReset={ this.mediaUploadStateReset }
								renderContent={ ( params ) => {
									return (
										<View style={ styles.content } >
											{ this.renderContent( params, open ) }
										</View>
									);
								} }
							/>
						</>;
					} }
				/>

			);
		}
		return this.renderPlaceholder();
	}
}

export default withNotices( MediaContainer );
