/**
 * External dependencies
 */
import { isArray, isEmpty, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { ButtonGroup, Button, Slot, Fill } from '@wordpress/components';
import deprecated from '@wordpress/deprecated';
import { Children } from '@wordpress/element';

function ActionItemSlot( {
	name,
	as: Component = ButtonGroup,
	fillProps = {},
	bubblesVirtually,
	...props
} ) {
	if ( isArray( Component ) ) {
		deprecated(
			'Passing a tuple of components with `as` prop to `ActionItem.Slot` component',
			{
				since: '10.2',
				plugin: 'Gutenberg',
				alternative: 'a component with `as` prop',
				version: '10.3',
			}
		);
		Component = Component[ 0 ];
	}
	return (
		<Slot
			name={ name }
			bubblesVirtually={ bubblesVirtually }
			fillProps={ fillProps }
		>
			{ ( fills ) => {
				if ( isEmpty( Children.toArray( fills ) ) ) {
					return null;
				}

				// Special handling exists for backward compatibility.
				// It ensures that menu items created by plugin authors aren't
				// duplicated with automatically injected menu items coming
				// from pinnable plugin sidebars.
				// @see https://github.com/WordPress/gutenberg/issues/14457
				const initializedByPlugins = [];
				Children.forEach(
					fills,
					( {
						props: { __unstableExplicitMenuItem, __unstableTarget },
					} ) => {
						if ( __unstableTarget && __unstableExplicitMenuItem ) {
							initializedByPlugins.push( __unstableTarget );
						}
					}
				);
				const children = Children.map( fills, ( child ) => {
					if (
						! child.props.__unstableExplicitMenuItem &&
						initializedByPlugins.includes(
							child.props.__unstableTarget
						)
					) {
						return null;
					}
					return child;
				} );

				return <Component { ...props }>{ children }</Component>;
			} }
		</Slot>
	);
}

function ActionItem( { name, as: Component = Button, onClick, ...props } ) {
	return (
		<Fill name={ name }>
			{ ( { onClick: fpOnClick } ) => {
				return (
					<Component
						onClick={
							onClick || fpOnClick
								? ( ...args ) => {
										( onClick || noop )( ...args );
										( fpOnClick || noop )( ...args );
								  }
								: undefined
						}
						{ ...props }
					/>
				);
			} }
		</Fill>
	);
}

ActionItem.Slot = ActionItemSlot;

export default ActionItem;
