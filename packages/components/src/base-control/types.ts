/**
 * External dependencies
 */
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import type {
	Wrapper,
	StyledField,
	StyledVisualLabel,
} from './styles/base-control-styles';

export type BaseControlProps = {
	/**
	 * Start opting into the new margin-free styles that will become the default in a future version.
	 *
	 * @default false
	 */
	__nextHasNoMarginBottom?: boolean;
	/**
	 * The HTML `id` of the element (passed in as a child to `BaseControl`) to which labels and help text are being generated.
	 * This is necessary to accessibly associate the label with that element.
	 */
	id?: string;
	/**
	 * If this property is added, a help text will be generated using help property as the content.
	 */
	help?: ReactNode;
	/**
	 * If this property is added, a label will be generated using label property as the content.
	 */
	label?: ReactNode;
	/**
	 * If true, the label will only be visible to screen readers.
	 *
	 * @default false
	 */
	hideLabelFromVision?: boolean;
	className?: HTMLAttributes< typeof Wrapper >[ 'className' ];
	children?: HTMLAttributes< typeof StyledField >[ 'children' ];
};

export type BaseControlVisualLabelProps = Pick<
	HTMLAttributes< typeof StyledVisualLabel >,
	'className' | 'children'
>;
