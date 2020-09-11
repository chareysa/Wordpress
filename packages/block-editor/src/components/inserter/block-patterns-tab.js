/**
 * External dependencies
 */
import { fromPairs } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo, useCallback, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAsyncList } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import InserterPanel from './panel';
import PatternInserterPanel from './pattern-panel';
import { searchItems } from './search-items';
import InserterNoResults from './no-results';
import usePatternsState from './hooks/use-patterns-state';
import BlockPatternList from '../block-patterns-list';

function BlockPatternsSearchResults( { filterValue, onInsert } ) {
	const [ allPatterns, , onClick ] = usePatternsState( onInsert, 'all' );

	const [ currentfilteredPatterns, setfilteredPatterns ] = useState( [] );

	useEffect( () => {
		setfilteredPatterns( searchItems( allPatterns, filterValue ) );
	}, [ allPatterns, filterValue ] );

	const currentShownPatterns = useAsyncList( currentfilteredPatterns );

	if ( filterValue ) {
		return !! currentfilteredPatterns.length ? (
			<InserterPanel title={ __( 'Search Results' ) }>
				<BlockPatternList
					shownPatterns={ currentShownPatterns }
					blockPatterns={ currentfilteredPatterns }
					onClickPattern={ onClick }
				/>
			</InserterPanel>
		) : (
			<InserterNoResults />
		);
	}
}

function BlockPatternsCategory( {
	selectedCategory,
	onClickCategory,
	onInsert,
} ) {
	const [ allPatterns, allCategories, onClick ] = usePatternsState(
		onInsert,
		selectedCategory
	);

	const [ currentCategorypatterns, setCategoryPatterns ] = useState( [] );

	const patternCategory = selectedCategory
		? selectedCategory
		: allCategories[ 0 ];

	useEffect( () => {
		setCategoryPatterns(
			allPatterns.filter(
				( pattern ) =>
					pattern.categories &&
					pattern.categories.includes( patternCategory.name )
			)
		);
	}, [ selectedCategory ] );

	const getPatternIndex = useCallback(
		( pattern ) => {
			if ( ! pattern.categories || ! pattern.categories.length ) {
				return Infinity;
			}
			const indexedCategories = fromPairs(
				allCategories.map( ( { name }, index ) => [ name, index ] )
			);
			return Math.min(
				...pattern.categories.map( ( cat ) =>
					indexedCategories[ cat ] !== undefined
						? indexedCategories[ cat ]
						: Infinity
				)
			);
		},
		[ allCategories ]
	);

	// Ordering the patterns is important for the async rendering.
	const orderedPatterns = useMemo( () => {
		return currentCategorypatterns.sort( ( a, b ) => {
			return getPatternIndex( a ) - getPatternIndex( b );
		} );
	}, [ currentCategorypatterns, getPatternIndex ] );

	const currentShownPatterns = useAsyncList( orderedPatterns );

	return (
		<>
			{ !! currentCategorypatterns.length && (
				<PatternInserterPanel
					key={ patternCategory.name }
					title={ patternCategory.title }
					selectedCategory={ patternCategory }
					patternCategories={ allCategories }
					onClickCategory={ onClickCategory }
				>
					<BlockPatternList
						shownPatterns={ currentShownPatterns }
						blockPatterns={ currentCategorypatterns }
						onClickPattern={ onClick }
					/>
				</PatternInserterPanel>
			) }
		</>
	);
}

function BlockPatternsTabs( {
	onInsert,
	onClickCategory,
	filterValue,
	selectedCategory,
} ) {
	return filterValue ? (
		<BlockPatternsSearchResults
			onInsert={ onInsert }
			filterValue={ filterValue }
		/>
	) : (
		<BlockPatternsCategory
			selectedCategory={ selectedCategory }
			onInsert={ onInsert }
			onClickCategory={ onClickCategory }
		/>
	);
}

export default BlockPatternsTabs;
