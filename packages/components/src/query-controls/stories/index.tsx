/**
 * External dependencies
 */
import type { ComponentMeta, ComponentStory } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import QueryControls from '..';
import type {
	Entity,
	QueryControlsProps,
	QueryControlsWithSingleCategorySelectionProps,
	QueryControlsWithMultipleCategorySelectionProps,
} from '../types';

const meta: ComponentMeta< typeof QueryControls > = {
	title: 'Components/QueryControls',
	component: QueryControls,
	argTypes: {
		numberOfItems: { control: { type: null } },
		order: { control: { type: null } },
		orderBy: { control: { type: null } },
		selectedAuthorId: { control: { type: null } },
		selectedCategories: { control: { type: null } },
		selectedCategoryId: { control: { type: null } },
	},
	parameters: {
		actions: { argTypesRegex: '^on.*' },
		controls: { expanded: true },
		docs: { source: { state: 'open' } },
	},
};
export default meta;

export const Default: ComponentStory< typeof QueryControls > = ( args ) => {
	const {
		onAuthorChange,
		onCategoryChange,
		onNumberOfItemsChange,
		onOrderByChange,
		onOrderChange,
		...props
	} = args as QueryControlsWithMultipleCategorySelectionProps;
	const [ ownNumberOfItems, setOwnNumberOfItems ] = useState(
		props.numberOfItems
	);
	const [ ownOrder, setOwnOrder ] = useState( props.order );
	const [ ownOrderBy, setOwnOrderBy ] = useState( props.orderBy );
	const [ ownSelectedAuthorId, setOwnSelectedAuthorId ] = useState(
		props.selectedAuthorId
	);
	const [ ownSelectedCategories, setOwnSelectedCategories ] = useState(
		props.selectedCategories
	);

	const handleCategoryChange: QueryControlsWithMultipleCategorySelectionProps[ 'onCategoryChange' ] =
		( tokens ) => {
			onCategoryChange?.( tokens );

			const hasNoSuggestion = tokens.some(
				( token ) =>
					typeof token === 'string' &&
					! props.categorySuggestions?.[ token ]
			);
			if ( hasNoSuggestion ) {
				return;
			}
			const allCategories = tokens
				.map( ( token ) => {
					return typeof token === 'string'
						? props.categorySuggestions?.[ token ]
						: token;
				} )
				.filter( Boolean ) as Array< Required< Entity > >;

			setOwnSelectedCategories( allCategories );
		};

	return (
		<QueryControls
			{ ...props }
			numberOfItems={ ownNumberOfItems }
			onCategoryChange={ handleCategoryChange }
			onOrderByChange={ ( newOrderBy ) => {
				onOrderByChange?.( newOrderBy );
				setOwnOrderBy( newOrderBy );
			} }
			onOrderChange={ ( newOrder ) => {
				onOrderChange?.( newOrder );
				setOwnOrder( newOrder );
			} }
			order={ ownOrder }
			orderBy={ ownOrderBy }
			onNumberOfItemsChange={ ( newNumber ) => {
				onNumberOfItemsChange?.( newNumber );
				setOwnNumberOfItems( newNumber );
			} }
			onAuthorChange={ ( newAuthor ) => {
				onAuthorChange?.( newAuthor );
				setOwnSelectedAuthorId( Number( newAuthor ) );
			} }
			selectedAuthorId={ ownSelectedAuthorId }
			selectedCategories={ ownSelectedCategories }
		/>
	);
};

Default.args = {
	authorList: [
		{
			id: 1,
			name: 'admin',
		},
		{
			id: 2,
			name: 'editor',
		},
	],
	categorySuggestions: {
		TypeScript: {
			id: 11,
			name: 'TypeScript',
		},
		JavaScript: {
			id: 12,
			name: 'JavaScript',
		},
	},
	selectedCategories: [
		{
			id: 11,
			name: 'TypeScript',
			value: 'TypeScript',
		},
		{
			id: 12,
			name: 'JavaScript',
			value: 'JavaScript',
		},
	],
	numberOfItems: 5,
	order: 'desc',
	orderBy: 'date',
	selectedAuthorId: 1,
};

const SingleCategoryTemplate: ComponentStory< typeof QueryControls > = (
	args
) => {
	const {
		onAuthorChange,
		onCategoryChange,
		onNumberOfItemsChange,
		onOrderByChange,
		onOrderChange,
		...props
	} = args as QueryControlsWithSingleCategorySelectionProps;
	const [ ownOrder, setOwnOrder ] = useState( props.order );
	const [ ownOrderBy, setOwnOrderBy ] = useState( props.orderBy );
	const [ ownSelectedCategoryId, setSelectedCategoryId ] = useState(
		props.selectedCategoryId
	);

	const handleCategoryChange: QueryControlsWithSingleCategorySelectionProps[ 'onCategoryChange' ] =
		( newCategory ) => {
			onCategoryChange?.( newCategory );
			setSelectedCategoryId( Number( newCategory ) );
		};

	return (
		<QueryControls
			{ ...props }
			onCategoryChange={ handleCategoryChange }
			onOrderByChange={ ( newOrderBy ) => {
				setOwnOrderBy( newOrderBy as QueryControlsProps[ 'orderBy' ] );
			} }
			onOrderChange={ ( newOrder ) => {
				onOrderChange?.( newOrder );
				setOwnOrder( newOrder as QueryControlsProps[ 'order' ] );
			} }
			order={ ownOrder }
			orderBy={ ownOrderBy }
			selectedCategoryId={ ownSelectedCategoryId }
		/>
	);
};
export const SelectSingleCategory: ComponentStory< typeof QueryControls > =
	SingleCategoryTemplate.bind( {} );
SelectSingleCategory.args = {
	categoriesList: [
		{
			id: 11,
			name: 'TypeScript',
		},
		{
			id: 12,
			name: 'JavaScript',
		},
	],
	selectedCategoryId: 11,
};
