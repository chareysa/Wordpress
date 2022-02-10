export interface NavMenuItem {
	/**
	 * The title for the object.
	 */
	title: RawData;
	/**
	 * Unique identifier for the object.
	 */
	id: number;
	/**
	 * The singular label used to describe this type of menu item.
	 */
	type_label: string;
	/**
	 * The family of objects originally represented, such as "post_type" or "taxonomy".
	 */
	type: 'taxonomy' | 'post_type' | 'post_type_archive' | 'custom';
	/**
	 * A named status for the object.
	 */
	status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
	/**
	 * The ID for the parent of the object.
	 */
	parent: number;
	/**
	 * Text for the title attribute of the link element for this menu item.
	 */
	attr_title: string;
	/**
	 * Class names for the link element of this menu item.
	 */
	classes: string[];
	/**
	 * The description of this menu item.
	 */
	description: string;
	/**
	 * The DB ID of the nav_menu_item that is this item's menu parent, if any, otherwise 0.
	 */
	menu_order: number;
	/**
	 * The type of object originally represented, such as "category", "post", or "attachment".
	 */
	object: string;
	/**
	 * The database ID of the original object this menu item represents, for example the ID for posts or the term_id for categories.
	 */
	object_id: number;
	/**
	 * The target attribute of the link element for this menu item.
	 */
	target: '_blank' | '';
	/**
	 * The URL to which this menu item points.
	 */
	url: string;
	/**
	 * The XFN relationship expressed in the link of this menu item.
	 */
	xfn: string[];
	/**
	 * Whether the menu item represents an object that no longer exists.
	 */
	invalid: boolean;
	/**
	 * The terms assigned to the object in the nav_menu taxonomy.
	 */
	menus?: number;
	/**
	 * Meta fields.
	 */
	meta?: {
		[ k: string ]: unknown;
	};
}

/**
 * The raw data representation.
 */
export interface RawData {
	/**
	 * Data as it exists in the database.
	 */
	raw?: string;
	/**
	 * Data transformed for display.
	 */
	rendered?: string;
}
