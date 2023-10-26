/**
 * External dependencies
 */
// eslint-disable-next-line no-restricted-imports
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { DisclosureContentProps } from './types';

/**
 * Accessible Disclosure component that controls visibility of a section of
 * content. It follows the WAI-ARIA Disclosure Pattern.
 *
 * @see https://ariakit.org/reference/disclosure-content
 *
 * The plan is to build own API that accounts for future breaking changes
 * in Reakit (https://github.com/WordPress/gutenberg/pull/28085).
 */
const UnforwardedDisclosureContent = (
	{ visible, children }: DisclosureContentProps,
	ref: React.ForwardedRef< any >
) => {
	const disclosure = Ariakit.useDisclosureStore( { open: visible } );

	return (
		<Ariakit.DisclosureContent store={ disclosure } ref={ ref }>
			{ children }
		</Ariakit.DisclosureContent>
	);
};

export const DisclosureContent = forwardRef( UnforwardedDisclosureContent );
export default DisclosureContent;
