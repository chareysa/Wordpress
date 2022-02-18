/**
 * Internal dependencies
 */
import { Attachment } from './attachment';
import { Comment } from './comment';
import { MenuLocation } from './menu-location';
import { NavMenu } from './nav-menu';
import { NavMenuItem } from './nav-menu-item';
import { NavigationArea } from './navigation-area';
import { Page } from './page';
import { Plugin } from './plugin';
import { Post } from './post';
import { Settings } from './settings';
import { Sidebar } from './sidebar';
import { Taxonomy } from './taxonomy';
import { Theme } from './theme';
import { User } from './user';
import { Type } from './type';
import { Widget } from './widget';
import { WidgetType } from './widget-type';
import { WpTemplate } from './wp-template';
import { WpTemplatePart } from './wp-template-part';
import { Context, Updatable } from './helpers';

export {
	Updatable,
	Attachment,
	Comment,
	MenuLocation,
	NavMenu,
	NavMenuItem,
	NavigationArea,
	Page,
	Plugin,
	Post,
	Settings,
	Sidebar,
	Taxonomy,
	Theme,
	User,
	Type,
	Widget,
	WidgetType,
	WpTemplate,
	WpTemplatePart,
};

export type EntityRecord< C extends Context > =
	| Attachment< C >
	| Comment< C >
	| MenuLocation< C >
	| NavMenu< C >
	| NavMenuItem< C >
	| NavigationArea< C >
	| Page< C >
	| Plugin< C >
	| Post< C >
	| Settings< C >
	| Sidebar< C >
	| Taxonomy< C >
	| Theme< C >
	| Type< C >
	| User< C >
	| Widget< C >
	| WidgetType< C >
	| WpTemplate< C >
	| WpTemplatePart< C >;

export type UpdatableEntityRecord = Updatable< EntityRecord< 'edit' > >;
