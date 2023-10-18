/**
 * WordPress dependencies
 */
import {
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, useCallback } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import Page from '../page';
import Link from '../routes/link';
import { DataViews, coreFieldTypes } from '../dataviews';
import useTrashPostAction from '../actions/trash-post';
import Media from '../media';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const defaultConfigPerViewType = {
	list: {},
	grid: {
		mediaField: 'featured-image',
	},
};

export default function PagePages() {
	const [ view, setView ] = useState( {
		type: 'list',
		filters: {
			search: '',
			status: 'publish, draft',
		},
		page: 1,
		perPage: 5,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		visibleFilters: [ 'search', 'author', 'status' ],
		// All fields are visible by default, so it's
		// better to keep track of the hidden ones.
		hiddenFields: [ 'date', 'featured-image' ],
		layout: {},
	} );
	// Request post statuses to get the proper labels.
	const { records: statuses } = useEntityRecords( 'root', 'status' );
	const postStatuses = useMemo(
		() =>
			statuses === null
				? EMPTY_OBJECT
				: Object.fromEntries(
						statuses.map( ( { slug, name } ) => [ slug, name ] )
				  ),
		[ statuses ]
	);

	const queryArgs = useMemo(
		() => ( {
			per_page: view.perPage,
			page: view.page,
			_embed: 'author',
			order: view.sort?.direction,
			orderby: view.sort?.field,
			...view.filters,
		} ),
		[ view ]
	);
	const {
		records: pages,
		isResolving: isLoadingPages,
		totalItems,
		totalPages,
	} = useEntityRecords( 'postType', 'page', queryArgs );

	const { records: authors } = useEntityRecords( 'root', 'user', {
		who: 'authors',
	} );

	const paginationInfo = useMemo(
		() => ( {
			totalItems,
			totalPages,
		} ),
		[ totalItems, totalPages ]
	);

	const fields = useMemo(
		() => [
			{
				id: 'featured-image',
				header: __( 'Featured Image' ),
				getValue: ( { item } ) => item.featured_media,
				enableSorting: false,
			},
			{
				header: __( 'Title' ),
				id: 'title',
				getValue: ( { item } ) => item.title?.rendered || item.slug,
				filters: [ { id: 'search', type: 'search' } ],
				maxWidth: 400,
				sortingFn: 'alphanumeric',
				enableHiding: false,
			},
			{
				header: __( 'Author' ),
				id: 'author',
				getValue: ( { item } ) => item._embedded?.author[ 0 ]?.name,
				filters: [ { id: 'author', type: 'enumeration' } ],
				elements: [
					{
						value: '',
						label: __( 'All' ),
					},
					...( authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ) || [] ),
				],
			},
			{
				header: __( 'Status' ),
				id: 'status',
				getValue: ( { item } ) =>
					postStatuses[ item.status ] ?? item.status,
				filters: [ { type: 'enumeration', id: 'status' } ],
				elements: [
					{ label: __( 'All' ), value: 'publish,draft' },
					...( ( postStatuses &&
						Object.entries( postStatuses )
							.filter( ( [ slug ] ) =>
								[ 'publish', 'draft' ].includes( slug )
							)
							.map( ( [ slug, name ] ) => ( {
								value: slug,
								label: name,
							} ) ) ) ||
						[] ),
				],
				enableSorting: false,
			},
			{
				header: __( 'Date' ),
				id: 'date',
				getValue: ( { item } ) => item.date,
				enableSorting: false,
			},
		],
		[ postStatuses, authors ]
	);

	const dataConfig = {
		'featured-image': {
			...coreFieldTypes.image,
			view:
				( getValue ) =>
				( { item, view: currentView } ) => {
					const value = getValue( { item } );
					if ( ! value ) {
						return null;
					}
					return (
						<Media
							className="edit-site-page-pages__featured-image"
							id={ value }
							size={
								currentView.type === 'list'
									? [ 'thumbnail', 'medium', 'large', 'full' ]
									: [ 'large', 'full', 'medium', 'thumbnail' ]
							}
						/>
					);
				},
		},
		title: {
			...coreFieldTypes.string,
			view:
				( getValue ) =>
				( { item } ) => {
					return (
						<VStack spacing={ 1 }>
							<Heading as="h3" level={ 5 }>
								<Link
									params={ {
										postId: item.id,
										postType: item.type,
										canvas: 'edit',
									} }
								>
									{ decodeEntities( getValue( { item } ) ) ||
										__( '(no title)' ) }
								</Link>
							</Heading>
						</VStack>
					);
				},
		},
		// For now we treat author as a string, but we should have a way
		// to create a relation field type.
		author: {
			...coreFieldTypes.string,
			view:
				( getValue ) =>
				( { item } ) => {
					const author = item._embedded?.author[ 0 ];
					return (
						<a href={ `user-edit.php?user_id=${ author.id }` }>
							{ getValue( { item } ) }
						</a>
					);
				},
		},
		status: {
			...coreFieldTypes.string,
		},
		date: {
			...coreFieldTypes.date,
			view:
				( getValue ) =>
				( { item } ) => {
					const formattedDate = dateI18n(
						getSettings().formats.datetimeAbbreviated,
						getDate( getValue( { item } ) )
					);
					return <time>{ formattedDate }</time>;
				},
		},
	};

	const trashPostAction = useTrashPostAction();
	const actions = useMemo( () => [ trashPostAction ], [ trashPostAction ] );
	const onChangeView = useCallback(
		( viewUpdater ) => {
			let updatedView =
				typeof viewUpdater === 'function'
					? viewUpdater( view )
					: viewUpdater;
			if ( updatedView.type !== view.type ) {
				updatedView = {
					...updatedView,
					layout: {
						...defaultConfigPerViewType[ updatedView.type ],
					},
				};
			}

			setView( updatedView );
		},
		[ view ]
	);

	// TODO: we need to handle properly `data={ data || EMPTY_ARRAY }` for when `isLoading`.
	return (
		<Page title={ __( 'Pages' ) }>
			<DataViews
				paginationInfo={ paginationInfo }
				fields={ fields }
				actions={ actions }
				data={ pages || EMPTY_ARRAY }
				dataConfig={ dataConfig }
				isLoading={ isLoadingPages }
				view={ view }
				onChangeView={ onChangeView }
			/>
		</Page>
	);
}
