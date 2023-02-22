/**
 * External dependencies
 */
import type { ComponentType, HTMLProps, SVGProps } from 'react';

/**
 * WordPress dependencies
 */
import {
	cloneElement,
	createElement,
	Component,
	isValidElement,
} from '@wordpress/element';
import { SVG } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import Dashicon from '../dashicon';
import type { IconKey as DashiconIconKey } from '../dashicon/types';

export type IconType< P extends {} > =
	| DashiconIconKey
	| ComponentType< P >
	| JSX.Element;

interface BaseProps< P extends {} > {
	/**
	 * The icon to render. Supported values are: Dashicons (specified as
	 * strings), functions, Component instances and `null`.
	 *
	 * @default null
	 */
	icon?: IconType< P > | null;
	/**
	 * The size (width and height) of the icon.
	 *
	 * @default `20` when a Dashicon is rendered, `24` for all other icons.
	 */
	size?: number;
}

type AdditionalProps< T > = T extends ComponentType< infer U >
	? U
	: T extends DashiconIconKey
	? SVGProps< SVGSVGElement >
	: {};

export type Props< P extends {} > = BaseProps< P > &
	AdditionalProps< IconType< P > >;

function Icon< P extends {} >( {
	icon = null,
	size = 'string' === typeof icon ? 20 : 24,
	...additionalProps
}: Props< P > ) {
	if ( 'string' === typeof icon ) {
		return (
			<Dashicon
				icon={ icon }
				size={ size }
				{ ...( additionalProps as HTMLProps< HTMLSpanElement > ) }
			/>
		);
	}

	if ( isValidElement( icon ) && Dashicon === icon.type ) {
		return cloneElement( icon, {
			...additionalProps,
		} );
	}

	if ( 'function' === typeof icon ) {
		if ( icon.prototype instanceof Component ) {
			return createElement( icon, {
				size,
				...additionalProps,
			} as unknown as P );
		}

		return ( icon as ( ...args: any[] ) => JSX.Element )( {
			size,
			...additionalProps,
		} );
	}

	if ( icon && ( icon.type === 'svg' || icon.type === SVG ) ) {
		const appliedProps = {
			...icon.props,
			width: size,
			height: size,
			...additionalProps,
		};

		return <SVG { ...appliedProps } />;
	}

	if ( isValidElement( icon ) ) {
		return cloneElement( icon, {
			// @ts-ignore Just forwarding the size prop along
			size,
			...additionalProps,
		} );
	}

	return icon;
}

export default Icon;
