/**
 * External dependencies
 */
import 'react-native-gesture-handler/jestSetup';
import { Image, NativeModules as RNNativeModules } from 'react-native';

// React Native sets up a global navigator, but that is not executed in the
// testing environment: https://github.com/facebook/react-native/blob/6c19dc3266b84f47a076b647a1c93b3c3b69d2c5/Libraries/Core/setUpNavigator.js#L17
global.navigator = global.navigator ?? {};

/**
 * Whether to allow the same experiment to be registered multiple times.
 * This is useful for development purposes, but should be set to false
 * during the unit tests to ensure the Gutenberg plugin can be cleanly
 * merged into WordPress core where this is false.
 */
global.process.env.ALLOW_EXPERIMENT_REREGISTRATION = true;

// Set up the app runtime globals for the test environment, which includes
// modifying the above `global.navigator`
require( '../../packages/react-native-editor/src/globals' );

// Set up Reanimated library for testing
require( 'react-native-reanimated/lib/reanimated2/jestUtils' ).setUpTests();
global.__reanimatedWorkletInit = jest.fn();
global.ReanimatedDataMock = {
	now: () => 0,
};

RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule =
	RNNativeModules.RNGestureHandlerModule || {
		State: {
			BEGAN: 'BEGAN',
			FAILED: 'FAILED',
			ACTIVE: 'ACTIVE',
			END: 'END',
		},
		attachGestureHandler: jest.fn(),
		createGestureHandler: jest.fn(),
		dropGestureHandler: jest.fn(),
		updateGestureHandler: jest.fn(),
	};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
	forceTouchAvailable: false,
};

// Mock component to render with props rather than merely a string name so that
// we may assert against it. ...args is used avoid warnings about ignoring
// forwarded refs if React.forwardRef happens to be used.
const mockComponent =
	( element ) =>
	( ...args ) => {
		const [ props ] = args;
		const React = require( 'react' );
		return React.createElement( element, props, props.children );
	};

jest.mock( '@wordpress/element', () => {
	return {
		__esModule: true,
		...jest.requireActual( '@wordpress/element' ),
		render: jest.fn(),
	};
} );

jest.mock( '@wordpress/api-fetch', () => {
	const apiFetchMock = jest.fn();
	apiFetchMock.setFetchHandler = jest.fn();

	return apiFetchMock;
} );

jest.mock( '@wordpress/react-native-bridge', () => {
	return {
		addEventListener: jest.fn(),
		mediaUploadSync: jest.fn(),
		removeEventListener: jest.fn(),
		requestBlockTypeImpressions: jest.fn( ( callback ) => {
			callback( {} );
		} ),
		requestFocalPointPickerTooltipShown: jest.fn( () => true ),
		sendMediaUpload: jest.fn(),
		sendMediaSave: jest.fn(),
		setBlockTypeImpressions: jest.fn(),
		setFeaturedImage: jest.fn(),
		subscribeParentToggleHTMLMode: jest.fn(),
		subscribeSetTitle: jest.fn(),
		subscribeSetFocusOnTitle: jest.fn(),
		subscribeUpdateHtml: jest.fn(),
		subscribeFeaturedImageIdNativeUpdated: jest.fn(),
		subscribeMediaAppend: jest.fn(),
		subscribeAndroidModalClosed: jest.fn(),
		subscribeUpdateEditorSettings: jest.fn(),
		subscribePreferredColorScheme: () => 'light',
		subscribeUpdateCapabilities: jest.fn(),
		subscribeShowNotice: jest.fn(),
		subscribeParentGetHtml: jest.fn(),
		subscribeShowEditorHelp: jest.fn(),
		editorDidMount: jest.fn(),
		editorDidAutosave: jest.fn(),
		subscribeMediaUpload: jest.fn(),
		subscribeMediaSave: jest.fn(),
		getOtherMediaOptions: jest.fn(),
		provideToNative_Html: jest.fn(),
		requestImageFailedRetryDialog: jest.fn(),
		requestImageUploadCancelDialog: jest.fn(),
		requestMediaEditor: jest.fn(),
		requestMediaPicker: jest.fn(),
		requestUnsupportedBlockFallback: jest.fn(),
		subscribeReplaceBlock: jest.fn(),
		mediaSources: {
			deviceLibrary: 'DEVICE_MEDIA_LIBRARY',
			deviceCamera: 'DEVICE_CAMERA',
			siteMediaLibrary: 'SITE_MEDIA_LIBRARY',
		},
		fetchRequest: jest.fn(),
		requestPreview: jest.fn(),
		generateHapticFeedback: jest.fn(),
	};
} );

jest.mock(
	'react-native-modal',
	() => ( props ) =>
		props.isVisible ? mockComponent( 'Modal' )( props ) : null
);

jest.mock( 'react-native-hr', () => () => 'Hr' );

jest.mock( 'react-native-svg', () => {
	return {
		Svg: () => 'Svg',
		Path: () => 'Path',
		Circle: () => 'Circle',
		G: () => 'G',
		Polygon: () => 'Polygon',
		Rect: () => 'Rect',
	};
} );

jest.mock( 'react-native-safe-area', () => {
	const addEventListener = jest.fn();
	addEventListener.mockReturnValue( { remove: () => {} } );
	return {
		getSafeAreaInsetsForRootView: () => {
			return new Promise( ( accept ) => {
				accept( { safeAreaInsets: { bottom: 34 } } );
			} );
		},
		addEventListener,
		removeEventListener: jest.fn(),
	};
} );

// To be replaced with built in mocks when we upgrade to the latest version
jest.mock( 'react-native-safe-area-context', () => {
	const inset = { top: 0, right: 0, bottom: 0, left: 0 };
	const frame = { x: 0, y: 0, width: 0, height: 0 };
	return {
		SafeAreaProvider: jest
			.fn()
			.mockImplementation( ( { children } ) => children ),
		SafeAreaConsumer: jest
			.fn()
			.mockImplementation( ( { children } ) => children( inset ) ),
		useSafeAreaInsets: jest.fn().mockImplementation( () => inset ),
		useSafeAreaFrame: jest.fn().mockImplementation( () => frame ),
	};
} );

jest.mock(
	'@react-native-community/slider',
	() => {
		const { forwardRef } = require( 'react' );
		return forwardRef( mockComponent( 'Slider' ) );
	},
	{ virtual: true }
);

jest.mock( 'react-native-linear-gradient', () => () => 'LinearGradient', {
	virtual: true,
} );

jest.mock( 'react-native-hsv-color-picker', () => () => 'HsvColorPicker', {
	virtual: true,
} );

jest.mock( '@react-native-community/blur', () => () => 'BlurView', {
	virtual: true,
} );

// Silence the warning: Animated: `useNativeDriver` is not supported because the
// native animated module is missing. This was added per React Navigation docs.
// https://reactnavigation.org/docs/testing/#mocking-native-modules
jest.mock( 'react-native/Libraries/Animated/NativeAnimatedHelper' );

// We currently reference TextStateInput (a private module) within
// react-native-aztec/src/AztecView. Doing so requires that we mock it via its
// internal path to avoid "TypeError: Cannot read property 'Commands' of
// undefined." The private module referenced could possibly be replaced with
// a React ref instead. We could then remove this internal mock.
jest.mock( 'react-native/Libraries/Components/TextInput/TextInputState' );

// Mock native modules incompatible with testing environment.
jest.mock( 'react-native/Libraries/LayoutAnimation/LayoutAnimation' );
jest.mock(
	'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
	() => ( {
		__esModule: true,
		default: {
			addEventListener: jest.fn( () => ( { remove: jest.fn() } ) ),
			announceForAccessibility: jest.fn(),
			isBoldTextEnabled: jest.fn(),
			isGrayscaleEnabled: jest.fn(),
			isInvertColorsEnabled: jest.fn(),
			isReduceMotionEnabled: jest.fn(),
			isReduceTransparencyEnabled: jest.fn(),
			isScreenReaderEnabled: jest.fn( () => Promise.resolve( false ) ),
			removeEventListener: jest.fn(),
			setAccessibilityFocus: jest.fn(),
			sendAccessibilityEvent_unstable: jest.fn(),
			getRecommendedTimeoutMillis: jest.fn(),
		},
	} )
);

// The mock provided by the package itself does not appear to work correctly.
// Specifically, the mock provides a named export, where the module itself uses
// a default export.
jest.mock( '@react-native-clipboard/clipboard', () => ( {
	getString: jest.fn( () => Promise.resolve( '' ) ),
	setString: jest.fn(),
} ) );

// Silences the warning: dispatchCommand was called with a ref that isn't a native
// component. Use React.forwardRef to get access to the underlying native component.
// This is a known bug of react-native-testing-library package:
// https://github.com/callstack/react-native-testing-library/issues/329#issuecomment-737307473
jest.mock( 'react-native/Libraries/Components/Switch/Switch', () => {
	const jestMockComponent = require( 'react-native/jest/mockComponent' );
	return {
		__esModule: true,
		default: jestMockComponent(
			'react-native/Libraries/Components/Switch/Switch'
		),
	};
} );

jest.mock( '@wordpress/compose', () => {
	return {
		...jest.requireActual( '@wordpress/compose' ),
		useViewportMatch: jest.fn(),
		useResizeObserver: jest.fn( () => [
			mockComponent( 'ResizeObserverMock' )( {} ),
			{ width: 100, height: 100 },
		] ),
	};
} );

jest.spyOn( Image, 'getSize' ).mockImplementation( ( url, success ) =>
	success( 0, 0 )
);
