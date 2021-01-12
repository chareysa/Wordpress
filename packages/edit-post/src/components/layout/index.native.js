/**
 * External dependencies
 */
import { Platform, SafeAreaView, View } from 'react-native';
import SafeArea from 'react-native-safe-area';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { BottomSheetSettings, FloatingToolbar } from '@wordpress/block-editor';
import { compose, withPreferredColorScheme } from '@wordpress/compose';
import {
	HTMLTextInput,
	KeyboardAvoidingView,
	NoticeList,
} from '@wordpress/components';
import { AutosaveMonitor } from '@wordpress/editor';
import {
	sendNativeEditorDidLayout,
	requestStarterPageTemplatesTooltipShown,
	setStarterPageTemplatesTooltipShown,
} from '@wordpress/react-native-bridge';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import headerToolbarStyles from '../header/header-toolbar/style.scss';
import Header from '../header';
import VisualEditor from '../visual-editor';
import { store as editPostStore } from '../../store';
import Tooltip from '../../../../components/src/focal-point-picker/tooltip';

class Layout extends Component {
	constructor() {
		super( ...arguments );

		this.onSafeAreaInsetsUpdate = this.onSafeAreaInsetsUpdate.bind( this );
		this.onRootViewLayout = this.onRootViewLayout.bind( this );

		this.state = {
			rootViewHeight: 0,
			safeAreaInsets: { top: 0, bottom: 0, right: 0, left: 0 },
			tooltipVisible: false,
		};

		SafeArea.getSafeAreaInsetsForRootView().then(
			this.onSafeAreaInsetsUpdate
		);
	}

	componentDidMount() {
		this._isMounted = true;
		SafeArea.addEventListener(
			'safeAreaInsetsForRootViewDidChange',
			this.onSafeAreaInsetsUpdate
		);
		this.shouldShowTooltip();
	}

	componentWillUnmount() {
		SafeArea.removeEventListener(
			'safeAreaInsetsForRootViewDidChange',
			this.onSafeAreaInsetsUpdate
		);
		this._isMounted = false;
	}

	onSafeAreaInsetsUpdate( result ) {
		const { safeAreaInsets } = result;
		if ( this._isMounted ) {
			this.setState( { safeAreaInsets } );
		}
	}

	onRootViewLayout( event ) {
		if ( this._isMounted ) {
			this.setHeightState( event );
		}
	}

	setHeightState( event ) {
		const { height } = event.nativeEvent.layout;
		this.setState( { rootViewHeight: height }, sendNativeEditorDidLayout );
	}

	shouldShowTooltip = () => {
		requestStarterPageTemplatesTooltipShown( ( tooltipShown ) => {
			if ( ! tooltipShown ) {
				this.setState( { tooltipVisible: true } );
				setStarterPageTemplatesTooltipShown( true );
			}
		} );
	};

	onTooltipHidden = () => {
		this.setState( { tooltipVisible: false } );
	};

	renderHTML() {
		return <HTMLTextInput parentHeight={ this.state.rootViewHeight } />;
	}

	renderVisual() {
		const { isReady } = this.props;

		if ( ! isReady ) {
			return null;
		}

		return <VisualEditor setTitleRef={ this.props.setTitleRef } />;
	}

	render() {
		const { getStylesFromColorScheme, mode } = this.props;

		const isHtmlView = mode === 'text';

		// add a margin view at the bottom for the header
		const marginBottom =
			Platform.OS === 'android' && ! isHtmlView
				? headerToolbarStyles.container.height
				: 0;

		const toolbarKeyboardAvoidingViewStyle = {
			...styles.toolbarKeyboardAvoidingView,
			left: this.state.safeAreaInsets.left,
			right: this.state.safeAreaInsets.right,
			bottom: this.state.safeAreaInsets.bottom,
		};

		return (
			<SafeAreaView
				style={ getStylesFromColorScheme(
					styles.container,
					styles.containerDark
				) }
				onLayout={ this.onRootViewLayout }
			>
				<Tooltip
					onPress={ this.onTooltipHidden }
					style={ styles.tooltipContainer }
					visible={ this.state.tooltipVisible }
				>
					<AutosaveMonitor disableIntervalChecks />
					<View
						style={ getStylesFromColorScheme(
							styles.background,
							styles.backgroundDark
						) }
					>
						{ isHtmlView ? this.renderHTML() : this.renderVisual() }
						{ ! isHtmlView && Platform.OS === 'android' && (
							<FloatingToolbar />
						) }
						<NoticeList />
					</View>
					<View
						style={ {
							flex: 0,
							flexBasis: marginBottom,
							height: marginBottom,
						} }
					/>
					<Tooltip.Label
						align="left"
						xOffset={ 12 }
						yOffset={ -96 }
						text={ __( 'Try a starter layout' ) }
					/>
				</Tooltip>
				{ ! isHtmlView && (
					<KeyboardAvoidingView
						parentHeight={ this.state.rootViewHeight }
						style={ toolbarKeyboardAvoidingViewStyle }
						withAnimatedHeight
					>
						{ Platform.OS === 'ios' && <FloatingToolbar /> }
						<Header />
						<BottomSheetSettings />
					</KeyboardAvoidingView>
				) }
			</SafeAreaView>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { __unstableIsEditorReady: isEditorReady } = select(
			'core/editor'
		);
		const { getEditorMode } = select( editPostStore );
		return {
			isReady: isEditorReady(),
			mode: getEditorMode(),
		};
	} ),
	withPreferredColorScheme,
] )( Layout );
