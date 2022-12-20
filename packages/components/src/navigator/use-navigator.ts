/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { NavigatorContext } from './context';
import type { Navigator } from './types';

/**
 * Retrieves a `navigator` instance.
 */
function useNavigator(): Navigator {
	const { location, goTo, goBack, animationSettings } =
		useContext( NavigatorContext );

	return {
		location,
		goTo,
		goBack,
		animationSettings,
	};
}

export default useNavigator;
