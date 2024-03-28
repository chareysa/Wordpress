/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	__experimentalGrid as Grid,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Spinner,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useAsyncList } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import ItemActions from './item-actions';
import SingleSelectionCheckbox from './single-selection-checkbox';

import { useHasAPossibleBulkAction } from './bulk-actions';

function GridItem( {
	selection,
	data,
	onSelectionChange,
	getItemId,
	item,
	actions,
	mediaField,
	primaryField,
	visibleFields,
	displayAsColumnFields,
	displayAsBadgeFields,
} ) {
	const hasBulkAction = useHasAPossibleBulkAction( actions, item );
	const id = getItemId( item );
	const isSelected = selection.includes( id );
	return (
		<VStack
			spacing={ 0 }
			key={ id }
			className={ classnames( 'dataviews-view-grid__card', {
				'is-selected': hasBulkAction && isSelected,
			} ) }
			onClickCapture={ ( event ) => {
				if ( event.ctrlKey || event.metaKey ) {
					event.stopPropagation();
					event.preventDefault();
					if ( ! hasBulkAction ) {
						return;
					}
					if ( ! isSelected ) {
						onSelectionChange(
							data.filter( ( _item ) => {
								const itemId = getItemId?.( _item );
								return (
									itemId === id ||
									selection.includes( itemId )
								);
							} )
						);
					} else {
						onSelectionChange(
							data.filter( ( _item ) => {
								const itemId = getItemId?.( _item );
								return (
									itemId !== id &&
									selection.includes( itemId )
								);
							} )
						);
					}
				}
			} }
		>
			<div className="dataviews-view-grid__media">
				{ mediaField?.render( { item } ) }
			</div>
			<HStack
				justify="space-between"
				className="dataviews-view-grid__title-actions"
			>
				<SingleSelectionCheckbox
					id={ id }
					item={ item }
					selection={ selection }
					onSelectionChange={ onSelectionChange }
					getItemId={ getItemId }
					data={ data }
					primaryField={ primaryField }
					disabled={ ! hasBulkAction }
				/>
				<HStack className="dataviews-view-grid__primary-field">
					{ primaryField?.render( { item } ) }
				</HStack>
				<ItemActions item={ item } actions={ actions } isCompact />
			</HStack>
			<HStack
				className="dataviews-view-grid__badge-fields"
				spacing={ 2 }
				wrap
				align="top"
				justify="flex-start"
			>
				{ visibleFields.map( ( field ) => {
					const renderedValue = field.render( {
						item,
					} );
					if ( ! renderedValue ) {
						return null;
					}
					return (
						displayAsBadgeFields?.includes( field.id ) && (
							<FlexItem
								className={ classnames(
									'dataviews-view-grid__field-value',
									'dataviews-view-grid__field-' + field.id,
									'is-badge'
								) }
							>
								{ renderedValue }
							</FlexItem>
						)
					);
				} ) }
			</HStack>

			<VStack className="dataviews-view-grid__fields" spacing={ 3 }>
				{ visibleFields.map( ( field ) => {
					const renderedValue = field.render( {
						item,
					} );
					if ( ! renderedValue ) {
						return null;
					}
					return (
						! displayAsBadgeFields?.includes( field.id ) && (
							<Flex
								className={ classnames(
									'dataviews-view-grid__field',
									displayAsColumnFields?.includes( field.id )
										? 'is-column'
										: 'is-row'
								) }
								key={ field.id }
								gap={ 1 }
								justify="flex-start"
								expanded
								style={ { height: 'auto' } }
								direction={
									displayAsColumnFields?.includes( field.id )
										? 'column'
										: 'row'
								}
							>
								<>
									<FlexItem className="dataviews-view-grid__field-name">
										{ field.header }
									</FlexItem>
									<FlexItem
										className="dataviews-view-grid__field-value"
										style={ { maxHeight: 'none' } }
									>
										{ renderedValue }
									</FlexItem>
								</>
							</Flex>
						)
					);
				} ) }
			</VStack>
		</VStack>
	);
}

export default function ViewGrid( {
	data,
	fields,
	view,
	actions,
	isLoading,
	getItemId,
	deferredRendering,
	selection,
	onSelectionChange,
} ) {
	const mediaField = fields.find(
		( field ) => field.id === view.layout.mediaField
	);
	const primaryField = fields.find(
		( field ) => field.id === view.layout.primaryField
	);
	const visibleFields = fields.filter(
		( field ) =>
			! view.hiddenFields.includes( field.id ) &&
			! [ view.layout.mediaField, view.layout.primaryField ].includes(
				field.id
			)
	);
	const shownData = useAsyncList( data, { step: 3 } );
	const usedData = deferredRendering ? shownData : data;
	const hasData = !! usedData?.length;
	return (
		<>
			{ hasData && (
				<Grid
					gap={ 6 }
					columns={ 2 }
					alignment="top"
					className="dataviews-view-grid"
					aria-busy={ isLoading }
				>
					{ usedData.map( ( item ) => {
						return (
							<GridItem
								key={ getItemId( item ) }
								selection={ selection }
								data={ data }
								onSelectionChange={ onSelectionChange }
								getItemId={ getItemId }
								item={ item }
								actions={ actions }
								mediaField={ mediaField }
								primaryField={ primaryField }
								visibleFields={ visibleFields }
								displayAsColumnFields={
									view.layout.displayAsColumnFields
								}
								displayAsBadgeFields={
									view.layout.displayAsBadgeFields
								}
							/>
						);
					} ) }
				</Grid>
			) }
			{ ! hasData && (
				<div
					className={ classnames( {
						'dataviews-loading': isLoading,
						'dataviews-no-results': ! isLoading,
					} ) }
				>
					<p>{ isLoading ? <Spinner /> : __( 'No results' ) }</p>
				</div>
			) }
		</>
	);
}
