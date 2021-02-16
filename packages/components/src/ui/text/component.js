/**
 * Internal dependencies
 */
import { createComponent } from '../utils';
import useText from './hook';

const Text = createComponent( {
	as: 'span',
	useHook: useText,
	name: 'Text',
} );

export default Text;
