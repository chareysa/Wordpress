/**
 * External dependencies
 */
import type { ReactElement, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import type { SetSelection } from './private-types';

export type SortDirection = 'asc' | 'desc';

/**
 * Generic option type.
 */
export interface Option< Value extends any = any > {
	value: Value;
	label: string;
	description?: string;
}

interface FilterByConfig {
	/**
	 * The list of operators supported by the field.
	 */
	operators?: Operator[];

	/**
	 * Whether it is a primary filter.
	 *
	 * A primary filter is always visible and is not listed in the "Add filter" component,
	 * except for the list layout where it behaves like a secondary filter.
	 */
	isPrimary?: boolean;
}

export type Operator =
	| 'is'
	| 'isNot'
	| 'isAny'
	| 'isNone'
	| 'isAll'
	| 'isNotAll';

export type ItemRecord = Record< string, unknown >;

export type FieldType = 'text';

/**
 * A dataview field for a specific property of a data type.
 */
export type Field< Item > = {
	/**
	 * Type of the fields.
	 */
	type?: FieldType;

	/**
	 * The unique identifier of the field.
	 */
	id: string;

	/**
	 * The label of the field. Defaults to the id.
	 */
	header?: string;

	/**
	 * Placeholder for the field.
	 */
	placeholder?: string;

	/**
	 * Callback used to render the field. Defaults to `field.getValue`.
	 */
	render?: ( args: { item: Item } ) => ReactNode;

	/**
	 * The width of the field column.
	 */
	width?: string | number;

	/**
	 * The minimum width of the field column.
	 */
	maxWidth?: string | number;

	/**
	 * The maximum width of the field column.
	 */
	minWidth?: string | number;

	/**
	 * Whether the field is sortable.
	 */
	enableSorting?: boolean;

	/**
	 * Whether the field is searchable.
	 */
	enableGlobalSearch?: boolean;

	/**
	 * Whether the field is filterable.
	 */
	enableHiding?: boolean;

	/**
	 * The list of options to pick from when using the field as a filter.
	 */
	elements?: Option[];

	/**
	 * Filter config for the field.
	 */
	filterBy?: FilterByConfig | undefined;
} & ( Item extends ItemRecord
	? {
			/**
			 * Callback used to retrieve the value of the field from the item.
			 * Defaults to `item[ field.id ]`.
			 */
			getValue?: ( args: { item: Item } ) => any;
	  }
	: {
			/**
			 * Callback used to retrieve the value of the field from the item.
			 * Defaults to `item[ field.id ]`.
			 */
			getValue: ( args: { item: Item } ) => any;
	  } );

export type NormalizedField< Item > = Field< Item > & {
	header: string;
	getValue: ( args: { item: Item } ) => any;
	render: ( args: { item: Item } ) => ReactNode;
};

/**
 * A collection of dataview fields for a data type.
 */
export type Fields< Item > = Field< Item >[];

export type Data< Item > = Item[];

/**
 * The form configuration.
 */
export type Form = {
	visibleFields?: string[];
};

/**
 * The filters applied to the dataset.
 */
export interface Filter {
	/**
	 * The field to filter by.
	 */
	field: string;

	/**
	 * The operator to use.
	 */
	operator: Operator;

	/**
	 * The value to filter by.
	 */
	value: any;
}

export interface NormalizedFilter {
	/**
	 * The field to filter by.
	 */
	field: string;

	/**
	 * The field name.
	 */
	name: string;

	/**
	 * The list of options to pick from when using the field as a filter.
	 */
	elements: Option[];

	/**
	 * Is a single selection filter.
	 */
	singleSelection: boolean;

	/**
	 * The list of operators supported by the field.
	 */
	operators: Operator[];

	/**
	 * Whether the filter is visible.
	 */
	isVisible: boolean;

	/**
	 * Whether it is a primary filter.
	 */
	isPrimary: boolean;
}

export interface NormalizedFieldRenderConfig {
	format: 'primary' | 'badge' | 'media' | 'column' | 'default';
	field: string;
}

export type FieldRenderConfig =
	| string
	| {
			format: 'primary' | 'badge' | 'media' | 'column' | 'default';
			field: string;
	  };

export interface View {
	/**
	 * The layout of the view.
	 */
	type: 'table' | 'grid' | 'list';

	/**
	 * The global search term.
	 */
	search?: string;

	/**
	 * The filters to apply.
	 */
	filters: Filter[];

	/**
	 * The sorting configuration.
	 */
	sort?: {
		/**
		 * The field to sort by.
		 */
		field: string;

		/**
		 * The direction to sort by.
		 */
		direction: SortDirection;
	};

	/**
	 * The active page
	 */
	page?: number;

	/**
	 * The number of items per page
	 */
	perPage?: number;

	/**
	 * The hidden fields.
	 */
	fields?: FieldRenderConfig[];
}

interface ActionBase< Item > {
	/**
	 * The unique identifier of the action.
	 */
	id: string;

	/**
	 * The label of the action.
	 * In case we want to adjust the label based on the selected items,
	 * a function can be provided.
	 */
	label: string | ( ( items: Item[] ) => string );

	/**
	 * The icon of the action. (Either a string or an SVG element)
	 * This should be IconType from the components package
	 * but that import is breaking typescript build for the moment.
	 */
	icon?: any;

	/**
	 * Whether the action is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the action is destructive.
	 */
	isDestructive?: boolean;

	/**
	 * Whether the action is a primary action.
	 */
	isPrimary?: boolean;

	/**
	 * Whether the item passed as an argument supports the current action.
	 */
	isEligible?: ( item: Item ) => boolean;

	/**
	 * Whether the action can be used as a bulk action.
	 */
	supportsBulk?: boolean;
}

export interface ActionModal< Item > extends ActionBase< Item > {
	/**
	 * Modal to render when the action is triggered.
	 */
	RenderModal: ( {
		items,
		closeModal,
		onActionPerformed,
	}: {
		items: Item[];
		closeModal?: () => void;
		onActionPerformed?: ( items: Item[] ) => void;
	} ) => ReactElement;

	/**
	 * Whether to hide the modal header.
	 */
	hideModalHeader?: boolean;

	/**
	 * The header of the modal.
	 */
	modalHeader?: string;
}

export interface ActionButton< Item > extends ActionBase< Item > {
	/**
	 * The callback to execute when the action is triggered.
	 */
	callback: (
		items: Item[],
		context: {
			registry: any;
			onActionPerformed?: ( items: Item[] ) => void;
		}
	) => void;
}

export type Action< Item > = ActionModal< Item > | ActionButton< Item >;

export interface ViewProps< Item > {
	actions: Action< Item >[];
	data: Item[];
	fields: NormalizedField< Item >[];
	getItemId: ( item: Item ) => string;
	isLoading?: boolean;
	onChangeView: ( view: View ) => void;
	onSelectionChange: SetSelection;
	selection: string[];
	setOpenedFilter: ( fieldId: string ) => void;
	view: View;
}
