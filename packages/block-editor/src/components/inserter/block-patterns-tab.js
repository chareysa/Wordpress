/**
 * External dependencies
 */
import { fromPairs } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo, useCallback, useEffect } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import { useAsyncList } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import PatternInserterPanel from './pattern-panel';
import usePatternsState from './hooks/use-patterns-state';
import BlockPatternList from '../block-patterns-list';

function BlockPatternsCategory( {
	onInsert,
	selectedCategory,
	onClickCategory,
} ) {
	const [ allPatterns, allCategories, onClick ] = usePatternsState(
		onInsert
	);

	// Remove any empty categories
	const populatedCategories = useMemo(
		() =>
			allCategories.filter( ( category ) =>
				allPatterns.some( ( pattern ) =>
					pattern.categories.includes( category.name )
				)
			),
		[ allPatterns, allCategories ]
	);

	const patternCategory = selectedCategory
		? selectedCategory
		: populatedCategories[ 0 ];

	useEffect( () => {
		if (
			allPatterns.some(
				( pattern ) => getPatternIndex( pattern ) === Infinity
			) &&
			! populatedCategories.find(
				( category ) => category.name === 'uncategorized'
			)
		) {
			populatedCategories.push( {
				name: 'uncategorized',
				label: _x( 'Uncategorized' ),
			} );
		}
	}, [ populatedCategories, allPatterns ] );

	const getPatternIndex = useCallback(
		( pattern ) => {
			if ( ! pattern.categories || ! pattern.categories.length ) {
				return Infinity;
			}
			const indexedCategories = fromPairs(
				populatedCategories.map( ( { name }, index ) => [
					name,
					index,
				] )
			);
			return Math.min(
				...pattern.categories.map( ( cat ) =>
					indexedCategories[ cat ] !== undefined
						? indexedCategories[ cat ]
						: Infinity
				)
			);
		},
		[ populatedCategories ]
	);

	const currentCategoryPatterns = useMemo(
		() =>
			allPatterns.filter( ( pattern ) =>
				patternCategory.name === 'uncategorized'
					? getPatternIndex( pattern ) === Infinity
					: pattern.categories &&
					  pattern.categories.includes( patternCategory.name )
			),
		[ allPatterns, patternCategory ]
	);

	// Ordering the patterns is important for the async rendering.
	const orderedPatterns = useMemo( () => {
		return currentCategoryPatterns.sort( ( a, b ) => {
			return getPatternIndex( a ) - getPatternIndex( b );
		} );
	}, [ currentCategoryPatterns, getPatternIndex ] );

	const currentShownPatterns = useAsyncList( orderedPatterns );

	return (
		<>
			{ !! currentCategoryPatterns.length && (
				<PatternInserterPanel
					title={ patternCategory.title }
					selectedCategory={ patternCategory }
					patternCategories={ populatedCategories }
					onClickCategory={ onClickCategory }
				>
					<BlockPatternList
						shownPatterns={ currentShownPatterns }
						blockPatterns={ currentCategoryPatterns }
						onClickPattern={ onClick }
						isDraggable
					/>
				</PatternInserterPanel>
			) }
		</>
	);
}

function BlockPatternsTabs( { onInsert, onClickCategory, selectedCategory } ) {
	return (
		<BlockPatternsCategory
			selectedCategory={ selectedCategory }
			onInsert={ onInsert }
			onClickCategory={ onClickCategory }
		/>
	);
}

export default BlockPatternsTabs;
