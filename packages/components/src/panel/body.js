/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';
import {
	useDisclosureState,
	Disclosure,
	DisclosureContent,
} from 'reakit/Disclosure';

/**
 * WordPress dependencies
 */
import { useReducedMotion } from '@wordpress/compose';
import { forwardRef, useRef } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Button from '../button';
import Icon from '../icon';
import { useCombinedRefs, useUpdateEffect } from '../utils';

export function PanelBody(
	{
		children,
		className,
		disableSmoothScrollIntoView,
		focusable,
		icon,
		initialOpen: initialOpenProp,
		onToggle = noop,
		opened,
		title,
	},
	ref
) {
	const initialOpen = useRef( initialOpenProp ).current;
	const disclosure = useDisclosureState( { visible: initialOpen || opened } );
	const nodeRef = useRef();
	const combinedRefs = useCombinedRefs( ref, nodeRef );

	// Defaults to 'smooth' scrolling
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	let scrollBehavior = useReducedMotion() ? 'auto' : 'smooth';

	// However, this behavior can be overridden by prop
	if ( disableSmoothScrollIntoView ) {
		scrollBehavior = 'auto';
	}

	const isOpened = disclosure.visible;

	// Runs after initial render
	useUpdateEffect( () => {
		if ( disclosure.visible ) {
			/*
			 * Scrolls the content into view when visible.
			 * This improves the UX when there are multiple stacking <PanelBody />
			 * components in a scrollable container.
			 */
			nodeRef.current.scrollIntoView( {
				inline: 'nearest',
				block: 'nearest',
				behavior: scrollBehavior,
			} );
		}

		onToggle( disclosure.visible );
	}, [ disclosure.visible, onToggle, scrollBehavior ] );

	const classes = classnames( 'components-panel__body', className, {
		'is-opened': isOpened,
	} );

	return (
		<div className={ classes } ref={ combinedRefs }>
			<PanelHeader
				focusable={ focusable }
				title={ title }
				icon={ icon }
				{ ...disclosure }
			/>
			<DisclosureContent { ...disclosure }>
				{ children }
			</DisclosureContent>
		</div>
	);
}

function PanelHeader( { focusable, isOpened, icon, title, ...props } ) {
	if ( ! title ) return null;

	return (
		<h2 className="components-panel__body-title">
			<Disclosure
				as={ Button }
				className="components-panel__body-toggle"
				focusable={ focusable }
				{ ...props }
			>
				{ /*
					Firefox + NVDA don't announce aria-expanded because the browser
					repaints the whole element, so this wrapping span hides that.
				*/ }
				<span aria-hidden="true">
					<Icon
						className="components-panel__arrow"
						icon={ isOpened ? chevronUp : chevronDown }
					/>
				</span>
				{ title }
				{ icon && (
					<Icon
						icon={ icon }
						className="components-panel__icon"
						size={ 20 }
					/>
				) }
			</Disclosure>
		</h2>
	);
}

const ForwardedComponent = forwardRef( PanelBody );

export default ForwardedComponent;
