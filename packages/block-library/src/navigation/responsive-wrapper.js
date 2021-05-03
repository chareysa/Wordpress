/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { close, Icon } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { SVG, Rect } from '@wordpress/primitives';

export default function ResponsiveWrapper( props ) {
	if ( ! props.isResponsive ) {
		return props.children;
	}
	const responsiveContainerClasses = classnames(
		'wp-block-navigation__responsive-container',
		{
			'is-menu-open': props.isOpen,
		}
	);

	const modalId = `${ props.id }-modal`;

	return (
		<>
			<Button
				aria-haspopup="true"
				aria-expanded={ props.isOpen }
				aria-label="Close menu"
				className="wp-block-navigation__responsive-container-open"
				onClick={ () => props.onToggle( true ) }
			>
				<SVG
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					role="img"
					aria-hidden="true"
					focusable="false"
				>
					<Rect x="4" y="7.5" width="16" height="1.5" />
					<Rect x="4" y="15" width="16" height="1.5" />
				</SVG>
			</Button>

			<div
				className={ responsiveContainerClasses }
				id={ modalId }
				aria-hidden={ ! props.isOpen }
			>
				<div
					className="wp-block-navigation__responsive-close"
					tabIndex="-1"
				>
					<div
						className="wp-block-navigation__responsive-dialog"
						role="dialog"
						aria-modal="true"
						aria-labelledby={ `${ modalId }-title` }
					>
						<Button
							className="wp-block-navigation__responsive-container-close"
							aria-label="Close menu"
							onClick={ () => props.onToggle( false ) }
						>
							<Icon icon={ close } />
						</Button>
						<div
							className="wp-block-navigation__responsive-container-content"
							id={ `${ modalId }-content` }
						>
							{ props.children }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
