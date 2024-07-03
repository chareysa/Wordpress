/**
 * Internal dependencies
 */
import type { WordPressPolymorphicComponentProps } from '../../context';
import { useContextSystem } from '../../context';
import { useFlexItem } from '../flex-item';
import type { FlexBlockProps } from '../types';

export function useFlexBlock(
	props: WordPressPolymorphicComponentProps< FlexBlockProps, 'div' >
) {
	const otherProps = useContextSystem( props, 'FlexBlock' );
	const flexItemProps = useFlexItem( { isBlock: true, ...otherProps } );

	return flexItemProps;
}
