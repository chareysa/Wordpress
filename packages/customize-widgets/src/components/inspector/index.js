/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect, createPortal } from '@wordpress/element';
import { BlockInspector } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export { default as BlockInspectorButton } from './block-inspector-button';

const container = document.createElement( 'div' );

function InspectorSectionMeta( { closeInspector } ) {
	return (
		<div className="customize-section-description-container section-meta">
			<div className="customize-section-title">
				{ /* Disable reason: We want to use the exiting style of the back button. */ }
				<button // eslint-disable-line react/forbid-elements
					type="button"
					className="customize-section-back"
					tabIndex="0"
					onClick={ closeInspector }
				>
					<span className="screen-reader-text">Back</span>
				</button>
				<h3>
					<span className="customize-action">
						{ __( 'Customizing ▸ Widgets' ) }
					</span>
					{ __( 'Block Settings' ) }
				</h3>
			</div>
		</div>
	);
}

export default function Inspector( {
	isOpened,
	isAnimating,
	close,
	setIsAnimating,
} ) {
	useEffect( () => {
		const parent = document.getElementById( 'customize-theme-controls' );

		parent.appendChild( container );

		return () => {
			parent.removeChild( container );
		};
	}, [] );

	useEffect( () => {
		setIsAnimating( true );

		const openedSidebarSection = document.querySelector(
			'.control-section-sidebar.open'
		);

		if ( isOpened ) {
			openedSidebarSection.classList.add( 'is-inspector-open' );
		} else {
			openedSidebarSection.classList.remove( 'is-inspector-open' );
		}

		// In case the "transitionend" event for some reasons doesn't fire.
		// (Like when it's set to "display: none", or when the transition property is removed.)
		// See https://github.com/w3c/csswg-drafts/issues/3043
		const timer = setTimeout( () => {
			setIsAnimating( false );
		}, 180 );

		return () => {
			openedSidebarSection.classList.remove( 'is-inspector-open' );
			clearTimeout( timer );
		};
	}, [ isOpened ] );

	return createPortal(
		<div
			className={ classnames(
				'customize-pane-child',
				'accordion-section-content',
				'accordion-section',
				'customize-widgets-layout__inspector',
				{
					open: isOpened,
					// Needed to keep the inspector visible while closing.
					busy: isAnimating,
				}
			) }
			onTransitionEnd={ () => {
				setIsAnimating( false );
			} }
		>
			<InspectorSectionMeta closeInspector={ close } />

			<BlockInspector />
		</div>,
		container
	);
}
