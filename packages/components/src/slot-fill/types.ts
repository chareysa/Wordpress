/**
 * External dependencies
 */
import type { Component, MutableRefObject, ReactNode, RefObject } from 'react';

export type DistributiveOmit< T, K extends keyof any > = T extends any
	? Omit< T, K >
	: never;

export type SlotKey = string | symbol;

export type FillProps = Record< string, any >;

type SlotPropBase = {
	/**
	 * Slot name.
	 */
	name: SlotKey;

	/**
	 * props to pass from `Slot` to `Fill`.
	 *
	 * @default {}
	 */
	fillProps?: FillProps;
};

export type SlotComponentProps =
	| ( SlotPropBase & {
			/**
			 * By default, events will bubble to their parents on the DOM hierarchy (native event bubbling).
			 * If set to true, events will bubble to their virtual parent in the React elements hierarchy instead,
			 * also accept an optional `className`, `id`, etc.  to add to the slot container.
			 */
			bubblesVirtually: true;

			/**
			 * A function that returns nodes to be rendered.
			 * Not supported when `bubblesVirtually` is `true`.
			 */
			children?: never;

			/**
			 * className.
			 * Not supported when `bubblesVirtually` is `false`.
			 */
			className?: string;

			/**
			 * styles.
			 * Not supported when `bubblesVirtually` is `false`.
			 */
			style?: React.CSSProperties;
	  } )
	| ( SlotPropBase & {
			/**
			 * By default, events will bubble to their parents on the DOM hierarchy (native event bubbling).
			 * If set to true, events will bubble to their virtual parent in the React elements hierarchy instead,
			 * also accept an optional `className`, `id`, etc.  to add to the slot container.
			 */
			bubblesVirtually?: false;

			/**
			 * A function that returns nodes to be rendered.
			 * Not supported when `bubblesVirtually` is `true`.
			 */
			children?: ( fills: ReactNode ) => ReactNode;

			/**
			 * className.
			 * Not supported when `bubblesVirtually` is `false`.
			 */
			className?: never;

			/**
			 * styles.
			 * Not supported when `bubblesVirtually` is `false`.
			 */
			style?: never;
	  } );

export type FillComponentProps = {
	/**
	 * The name of the slot to fill into.
	 */
	name: SlotKey;

	/**
	 * Children elements or render function.
	 */
	children?: ReactNode | ( ( fillProps: FillProps ) => ReactNode );
};

export type SlotFillProviderProps = {
	/**
	 * The children elements.
	 */
	children: ReactNode;
};

export type SlotFillBubblesVirtuallySlotRef = RefObject< HTMLElement >;
export type SlotFillBubblesVirtuallyFillRef = MutableRefObject< {
	rerender: () => void;
} >;

export type SlotFillBubblesVirtuallyContext = {
	slots: Map<
		SlotKey,
		{
			ref: SlotFillBubblesVirtuallySlotRef;
			fillProps: FillProps;
		}
	>;
	fills: Map< SlotKey, SlotFillBubblesVirtuallyFillRef[] >;
	registerSlot: (
		name: SlotKey,
		ref: SlotFillBubblesVirtuallySlotRef,
		fillProps: FillProps
	) => void;
	unregisterSlot: (
		name: SlotKey,
		ref: SlotFillBubblesVirtuallySlotRef
	) => void;
	updateSlot: ( name: SlotKey, fillProps: FillProps ) => void;
	registerFill: (
		name: SlotKey,
		ref: SlotFillBubblesVirtuallyFillRef
	) => void;
	unregisterFill: (
		name: SlotKey,
		ref: SlotFillBubblesVirtuallyFillRef
	) => void;

	/**
	 * This helps the provider know if it's using the default context value or not.
	 */
	isDefault?: boolean;
};

export type BaseSlotFillContext = {
	registerSlot: (
		name: SlotKey,
		slot: Component< BaseSlotComponentProps >
	) => void;
	unregisterSlot: (
		name: SlotKey,
		slot: Component< BaseSlotComponentProps >
	) => void;
	registerFill: ( name: SlotKey, instance: FillComponentProps ) => void;
	unregisterFill: ( name: SlotKey, instance: FillComponentProps ) => void;
	getSlot: (
		name: SlotKey
	) => Component< BaseSlotComponentProps > | undefined;
	getFills: (
		name: SlotKey,
		slotInstance: Component< BaseSlotComponentProps >
	) => FillComponentProps[];
	subscribe: ( listener: () => void ) => () => void;
};

export type BaseSlotComponentProps = Pick<
	BaseSlotFillContext,
	'registerSlot' | 'unregisterSlot' | 'getFills'
> &
	Omit< SlotComponentProps, 'bubblesVirtually' > & {
		children?: ( fills: ReactNode ) => ReactNode;
	};
