/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { SlugItem } from './types';

const SlugView = ( { item }: { item: SlugItem } ) => {
	const slug = item.slug;
	const originalSlug = useRef( slug );

	useEffect( () => {
		if ( slug && originalSlug.current === undefined ) {
			originalSlug.current = slug;
		}
	}, [ slug ] );

	const slugToDisplay = slug || originalSlug.current;

	return `/${ slugToDisplay ?? '' }`;
};

export default SlugView;
