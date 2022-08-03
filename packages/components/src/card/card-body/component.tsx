/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import { contextConnect, WordPressComponentProps } from '../../ui/context';
import { Scrollable } from '../../scrollable';
import { View } from '../../view';
import { useCardBody } from './hook';
import type { BodyProps } from '../types';

function CardBody(
	props: WordPressComponentProps< BodyProps, 'div' >,
	forwardedRef: ForwardedRef< HTMLDivElement >
) {
	const { isScrollable, ...otherProps } = useCardBody( props );

	if ( isScrollable ) {
		return <Scrollable { ...otherProps } ref={ forwardedRef } />;
	}

	return <View { ...otherProps } ref={ forwardedRef } />;
}

/**
 * `CardBody` renders an optional content area for a `Card`.
 * Multiple `CardBody` components can be used within `Card` if needed.
 *
 * @example
 * ```jsx
 * import { Card, CardBody } from `@wordpress/components`;
 *
 * <Card>
 * 	<CardBody>
 * 		...
 * 	</CardBody>
 * </Card>
 * ```
 */
const ConnectedCardBody = contextConnect( CardBody, 'CardBody' );

export default ConnectedCardBody;
