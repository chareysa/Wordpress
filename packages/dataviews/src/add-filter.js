/**
 * WordPress dependencies
 */
import {
	privateApis as componentsPrivateApis,
	Button,
	Icon,
} from '@wordpress/components';
import { funnel, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { Children, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from './lock-unlock';
import { LAYOUT_LIST, OPERATOR_IN, OPERATOR_NOT_IN } from './constants';

const {
	DropdownMenuV2Ariakit: DropdownMenu,
	DropdownMenuGroupV2Ariakit: DropdownMenuGroup,
	DropdownMenuItemV2Ariakit: DropdownMenuItem,
	DropdownMenuSeparatorV2Ariakit: DropdownMenuSeparator,
} = unlock( componentsPrivateApis );

function WithSeparators( { children } ) {
	return Children.toArray( children )
		.filter( Boolean )
		.map( ( child, i ) => (
			<Fragment key={ i }>
				{ i > 0 && <DropdownMenuSeparator /> }
				{ child }
			</Fragment>
		) );
}

export default function AddFilter( { filters, view, onChangeView } ) {
	if ( filters.length === 0 ) {
		return null;
	}

	const filterCount = view.filters.reduce( ( acc, filter ) => {
		if ( filter.value !== undefined ) {
			return acc + 1;
		}
		return acc;
	}, 0 );

	return (
		<DropdownMenu
			label={ __( 'Filters' ) }
			trigger={
				<Button
					__experimentalIsFocusable
					label={ __( 'Filters' ) }
					size="compact"
					icon={ funnel }
					className="dataviews-filters-button"
				>
					{ view.type === LAYOUT_LIST && filterCount > 0 ? (
						<span className="dataviews-filters-count">
							{ filterCount }
						</span>
					) : null }
				</Button>
			}
		>
			<WithSeparators>
				<DropdownMenuGroup>
					{ filters.map( ( filter ) => {
						const filterInView = view.filters.find(
							( f ) => f.field === filter.field
						);
						const otherFilters = view.filters.filter(
							( f ) => f.field !== filter.field
						);
						const activeElement = filter.elements.find(
							( element ) => element.value === filterInView?.value
						);
						const activeOperator =
							filterInView?.operator || filter.operators[ 0 ];
						return (
							<DropdownMenu
								key={ filter.field }
								trigger={
									<DropdownMenuItem
										suffix={
											<>
												{ activeElement &&
													activeOperator ===
														OPERATOR_IN &&
													__( 'Is' ) }
												{ activeElement &&
													activeOperator ===
														OPERATOR_NOT_IN &&
													__( 'Is not' ) }
												{ activeElement && ' ' }
												{ activeElement?.label }
											</>
										}
									>
										{ filter.name }
									</DropdownMenuItem>
								}
							>
								<WithSeparators>
									<DropdownMenuGroup>
										{ filter.elements.map( ( element ) => {
											const isActive =
												activeElement?.value ===
												element.value;
											return (
												<DropdownMenuItem
													key={ element.value }
													role="menuitemradio"
													aria-checked={ isActive }
													prefix={
														isActive && (
															<Icon
																icon={ check }
															/>
														)
													}
													onClick={ ( event ) => {
														event.preventDefault();
														onChangeView( {
															...view,
															page: 1,
															filters: [
																...otherFilters,
																{
																	field: filter.field,
																	operator:
																		activeOperator,
																	value: isActive
																		? undefined
																		: element.value,
																},
															],
														} );
													} }
												>
													{ element.label }
												</DropdownMenuItem>
											);
										} ) }
									</DropdownMenuGroup>
									{ filter.operators.length > 1 && (
										<DropdownMenu
											trigger={
												<DropdownMenuItem
													suffix={
														<>
															{ activeOperator ===
																OPERATOR_IN &&
																__( 'Is' ) }
															{ activeOperator ===
																OPERATOR_NOT_IN &&
																__(
																	'Is not'
																) }{ ' ' }
														</>
													}
												>
													{ __( 'Conditions' ) }
												</DropdownMenuItem>
											}
										>
											<DropdownMenuItem
												key="in-filter"
												role="menuitemradio"
												aria-checked={
													activeOperator ===
													OPERATOR_IN
												}
												prefix={
													activeOperator ===
														OPERATOR_IN && (
														<Icon icon={ check } />
													)
												}
												onClick={ ( event ) => {
													event.preventDefault();
													onChangeView( {
														...view,
														page: 1,
														filters: [
															...otherFilters,
															{
																field: filter.field,
																operator:
																	OPERATOR_IN,
																value: filterInView?.value,
															},
														],
													} );
												} }
											>
												{ __( 'Is' ) }
											</DropdownMenuItem>
											<DropdownMenuItem
												key="not-in-filter"
												role="menuitemradio"
												aria-checked={
													activeOperator ===
													OPERATOR_NOT_IN
												}
												prefix={
													activeOperator ===
														OPERATOR_NOT_IN && (
														<Icon icon={ check } />
													)
												}
												onClick={ ( event ) => {
													event.preventDefault();
													onChangeView( {
														...view,
														page: 1,
														filters: [
															...otherFilters,
															{
																field: filter.field,
																operator:
																	OPERATOR_NOT_IN,
																value: filterInView?.value,
															},
														],
													} );
												} }
											>
												{ __( 'Is not' ) }
											</DropdownMenuItem>
										</DropdownMenu>
									) }
									<DropdownMenuItem
										key={ 'reset-filter-' + filter.name }
										disabled={ ! activeElement }
										onClick={ ( event ) => {
											event.preventDefault();
											onChangeView( ( currentView ) => ( {
												...currentView,
												page: 1,
												filters:
													currentView.filters.filter(
														( f ) =>
															f.field !==
															filter.field
													),
											} ) );
										} }
									>
										{ sprintf(
											/* translators: 1: Filter name. e.g.: "Reset Author". */
											__( 'Reset %1$s' ),
											filter.name.toLowerCase()
										) }
									</DropdownMenuItem>
								</WithSeparators>
							</DropdownMenu>
						);
					} ) }
				</DropdownMenuGroup>
				<DropdownMenuItem
					disabled={
						view.search === '' && view.filters?.length === 0
					}
					onClick={ ( event ) => {
						event.preventDefault();
						onChangeView( ( currentView ) => ( {
							...currentView,
							page: 1,
							filters: [],
						} ) );
					} }
				>
					{ __( 'Reset filters' ) }
				</DropdownMenuItem>
			</WithSeparators>
		</DropdownMenu>
	);
}
