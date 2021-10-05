/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useCallback,
	useRef,
	useMemo,
	createContext,
	useContext,
} from '@wordpress/element';
import { Popover, __unstableMotion as motion } from '@wordpress/components';
import { isRTL } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Inserter from '../inserter';
import { store as blockEditorStore } from '../../store';
import { __unstableUseBlockElement as useBlockElement } from '../block-list/use-block-props/use-block-refs';
import { usePopoverScroll } from './use-popover-scroll';

export const InsertionPointOpenRef = createContext();

function InsertionPointPopover( {
	__unstablePopoverSlot,
	__unstableContentRef,
} ) {
	const { selectBlock } = useDispatch( blockEditorStore );
	const openRef = useContext( InsertionPointOpenRef );
	const ref = useRef();
	const {
		orientation,
		previousClientId,
		nextClientId,
		rootClientId,
		isInserterShown,
	} = useSelect( ( select ) => {
		const {
			getBlockOrder,
			getBlockListSettings,
			getBlockInsertionPoint,
			isBlockBeingDragged,
			getPreviousBlockClientId,
			getNextBlockClientId,
		} = select( blockEditorStore );
		const insertionPoint = getBlockInsertionPoint();
		const order = getBlockOrder( insertionPoint.rootClientId );

		if ( ! order.length ) {
			return {};
		}

		let _previousClientId = order[ insertionPoint.index - 1 ];
		let _nextClientId = order[ insertionPoint.index ];

		while ( isBlockBeingDragged( _previousClientId ) ) {
			_previousClientId = getPreviousBlockClientId( _previousClientId );
		}

		while ( isBlockBeingDragged( _nextClientId ) ) {
			_nextClientId = getNextBlockClientId( _nextClientId );
		}

		return {
			previousClientId: _previousClientId,
			nextClientId: _nextClientId,
			orientation:
				getBlockListSettings( insertionPoint.rootClientId )
					?.orientation || 'vertical',
			rootClientId: insertionPoint.rootClientId,
			isInserterShown: insertionPoint?.__unstableWithInserter,
		};
	}, [] );
	const previousElement = useBlockElement( previousClientId );
	const nextElement = useBlockElement( nextClientId );
	const isVertical = orientation === 'vertical';
	const style = useMemo( () => {
		if ( ! previousElement && ! nextElement ) {
			return {};
		}

		const previousRect = previousElement
			? previousElement.getBoundingClientRect()
			: null;
		const nextRect = nextElement
			? nextElement.getBoundingClientRect()
			: null;

		if ( isVertical ) {
			return {
				width: previousElement
					? previousElement.offsetWidth
					: nextElement.offsetWidth,
				height:
					nextRect && previousRect
						? nextRect.top - previousRect.bottom
						: 0,
			};
		}

		let width = 0;
		if ( previousRect && nextRect ) {
			width = isRTL()
				? previousRect.left - nextRect.right
				: nextRect.left - previousRect.right;
		}

		return {
			width,
			height: previousElement
				? previousElement.offsetHeight
				: nextElement.offsetHeight,
		};
	}, [ previousElement, nextElement ] );

	const getAnchorRect = useCallback( () => {
		if ( ! previousElement && ! nextElement ) {
			return {};
		}

		const { ownerDocument } = previousElement || nextElement;

		const previousRect = previousElement
			? previousElement.getBoundingClientRect()
			: null;
		const nextRect = nextElement
			? nextElement.getBoundingClientRect()
			: null;

		if ( isVertical ) {
			if ( isRTL() ) {
				return {
					top: previousRect ? previousRect.bottom : nextRect.top,
					left: previousRect ? previousRect.right : nextRect.right,
					right: previousRect ? previousRect.left : nextRect.left,
					bottom: nextRect ? nextRect.top : previousRect.bottom,
					ownerDocument,
				};
			}

			return {
				top: previousRect ? previousRect.bottom : nextRect.top,
				left: previousRect ? previousRect.left : nextRect.left,
				right: previousRect ? previousRect.right : nextRect.right,
				bottom: nextRect ? nextRect.top : previousRect.bottom,
				ownerDocument,
			};
		}

		if ( isRTL() ) {
			return {
				top: previousRect ? previousRect.top : nextRect.top,
				left: previousRect ? previousRect.left : nextRect.right,
				right: nextRect ? nextRect.right : previousRect.left,
				bottom: previousRect ? previousRect.bottom : nextRect.bottom,
				ownerDocument,
			};
		}

		return {
			top: previousRect ? previousRect.top : nextRect.top,
			left: previousRect ? previousRect.right : nextRect.left,
			right: nextRect ? nextRect.left : previousRect.right,
			bottom: previousRect ? previousRect.bottom : nextRect.bottom,
			ownerDocument,
		};
	}, [ previousElement, nextElement ] );

	const popoverScrollRef = usePopoverScroll( __unstableContentRef );

	const className = classnames(
		'block-editor-block-list__insertion-point',
		'is-' + orientation
	);

	function onClick( event ) {
		if ( event.target === ref.current && nextClientId ) {
			selectBlock( nextClientId, -1 );
		}
	}

	function onFocus( event ) {
		// Only handle click on the wrapper specifically, and not an event
		// bubbled from the inserter itself.
		if ( event.target !== ref.current ) {
			openRef.current = true;
		}
	}

	// Only show the in-between inserter between blocks, so when there's a
	// previous and a next element.
	const showInsertionPointInserter =
		previousElement && nextElement && isInserterShown;

	// Define animation variants for the line element.
	const lineVariants = {
		// Initial position starts from the center and invisible.
		start: {
			...( isVertical && { height: 0 } ),
			...( ! isVertical && { width: 0 } ),
			...( isVertical && { left: '50%' } ),
			...( isVertical && { right: '50%' } ),
			...( isVertical && { y: 0 } ),
			...( ! isVertical && { top: '50%' } ),
			...( ! isVertical && { bottom: '50%' } ),
			...( ! isVertical && { x: 0 } ),
			opacity: 0,
		},
		// The line expands to fill the container. If the inserter is visible it
		// is delayed so it appears orchestrated.
		rest: {
			...( isVertical && { height: 4 } ),
			...( ! isVertical && { width: 4 } ),
			...( isVertical && { left: 0 } ),
			...( isVertical && { right: 0 } ),
			...( ! isVertical && { top: 0 } ),
			...( ! isVertical && { bottom: 0 } ),
			opacity: 1,
			...( isVertical && { y: -2 } ),
			...( ! isVertical && { x: -2 } ),
			borderRadius: '2px',
			transition: { delay: showInsertionPointInserter ? 0.4 : 0 },
		},
		hover: {
			...( isVertical && { height: 4 } ),
			...( ! isVertical && { width: 4 } ),
			...( isVertical && { left: 0 } ),
			...( isVertical && { right: 0 } ),
			...( ! isVertical && { top: 0 } ),
			...( ! isVertical && { bottom: 0 } ),
			opacity: 1,
			...( isVertical && { y: -2 } ),
			...( ! isVertical && { x: -2 } ),
			borderRadius: '2px',
			transition: { delay: 0.4 },
		},
	};

	/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
	// While ideally it would be enough to capture the
	// bubbling focus event from the Inserter, due to the
	// characteristics of click focusing of `button`s in
	// Firefox and Safari, it is not reliable.
	//
	// See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
	return (
		<Popover
			ref={ popoverScrollRef }
			noArrow
			animate={ false }
			getAnchorRect={ getAnchorRect }
			focusOnMount={ false }
			className="block-editor-block-list__insertion-point-popover"
			// Render in the old slot if needed for backward compatibility,
			// otherwise render in place (not in the the default popover slot).
			__unstableSlotName={ __unstablePopoverSlot || null }
		>
			<motion.div
				layout
				initial="start"
				animate="rest"
				whileHover="hover"
				whileTap="pressed"
				exit="start"
				ref={ ref }
				tabIndex={ -1 }
				onClick={ onClick }
				onFocus={ onFocus }
				className={ classnames( className, {
					'is-with-inserter': showInsertionPointInserter,
				} ) }
				style={ style }
			>
				<motion.div
					variants={ lineVariants }
					className="block-editor-block-list__insertion-point-indicator"
				/>
				{ showInsertionPointInserter && (
					<motion.div
						initial={ { scale: 0 } }
						animate={ { scale: 1 } }
						transition={ { delay: 0.2 } }
						className={ classnames(
							'block-editor-block-list__insertion-point-inserter'
						) }
					>
						<Inserter
							position="bottom center"
							clientId={ nextClientId }
							rootClientId={ rootClientId }
							__experimentalIsQuick
							onToggle={ ( isOpen ) => {
								openRef.current = isOpen;
							} }
							onSelectOrClose={ () => {
								openRef.current = false;
							} }
						/>
					</motion.div>
				) }
			</motion.div>
		</Popover>
	);
	/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
}

export default function InsertionPoint( {
	children,
	__unstablePopoverSlot,
	__unstableContentRef,
} ) {
	const isVisible = useSelect( ( select ) => {
		return select( blockEditorStore ).isBlockInsertionPointVisible();
	}, [] );

	return (
		<InsertionPointOpenRef.Provider value={ useRef( false ) }>
			{ isVisible && (
				<InsertionPointPopover
					__unstablePopoverSlot={ __unstablePopoverSlot }
					__unstableContentRef={ __unstableContentRef }
				/>
			) }
			{ children }
		</InsertionPointOpenRef.Provider>
	);
}
