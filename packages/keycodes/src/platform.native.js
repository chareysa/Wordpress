/**
 * External dependencies
 */
import { Platform } from 'react-native';

/**
 * Return true if platform is MacOS.
 *
 *
 * @return {boolean}         True if iOS; false otherwise.
 */
// eslint-disable-next-line no-unused-vars
export function isAppleOS() {
	return Platform.OS === 'ios';
}
