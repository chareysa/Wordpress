/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, memo } from '@wordpress/element';
import { SearchControl } from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';

const Search = memo( function Search( { label, view, onChangeView } ) {
	const [ search, setSearch, debouncedSearch ] = useDebouncedInput(
		view.search
	);
	useEffect( () => {
		setSearch( view.search );
	}, [ view ] );
	const onChangeViewRef = useRef( onChangeView );
	useEffect( () => {
		onChangeViewRef.current = onChangeView;
	}, [ onChangeView ] );
	useEffect( () => {
		if ( debouncedSearch !== view.search ) {
			onChangeViewRef.current( {
				...view,
				page: 1,
				search: debouncedSearch,
			} );
		}
	}, [ debouncedSearch, view ] );
	const searchLabel = label || __( 'Search' );
	return (
		<SearchControl
			__nextHasNoMarginBottom
			onChange={ setSearch }
			value={ search }
			label={ searchLabel }
			placeholder={ searchLabel }
			size="compact"
		/>
	);
} );

export default Search;
