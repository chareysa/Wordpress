/**
 * External dependencies
 */

import { some } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef, useReducer, useState } from '@wordpress/element';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Button from '../button';
import ColorPicker from '../color-picker';
import Dropdown from '../dropdown';

import ControlPoints from './control-points';
import {
	getHorizontalRelativeGradientPosition,
	getMarkerPoints,
	getLinearGradientRepresentationOfARadial,
} from './utils';

const INSERT_POINT_WIDTH = 23;
const MINIMUM_DISTANCE_BETWEEN_INSERTER_AND_POINT = 10;
const COLOR_POPOVER_PROPS = {
	className: 'components-custom-gradient-picker__color-picker-popover',
	position: 'top',
};

function InsertPoint( {
	onChange,
	onOpenInserter,
	onCloseInserter,
	insertPosition,
} ) {
	const [ alreadyInsertedPoint, setAlreadyInsertedPoint ] = useState( false );
	return (
		<Dropdown
			className="components-custom-gradient-picker__inserter"
			onClose={ () => {
				onCloseInserter();
			} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					aria-expanded={ isOpen }
					aria-haspopup="true"
					onClick={ () => {
						if ( isOpen ) {
							onCloseInserter();
						} else {
							setAlreadyInsertedPoint( false );
							onOpenInserter();
						}
						onToggle();
					} }
					className="components-custom-gradient-picker__insert-point"
					icon={ plus }
					style={ {
						left:
							insertPosition !== null
								? `${ insertPosition }%`
								: undefined,
					} }
				/>
			) }
			renderContent={ () => (
				<ColorPicker
					onChangeComplete={ ( { rgb } ) => {
						onChange( {
							type: alreadyInsertedPoint
								? 'UPDATE_COLOR_BY_POSITION'
								: 'ADD_BY_POSITION',
							insertPosition,
							rgb,
						} );
					} }
				/>
			) }
			popoverProps={ COLOR_POPOVER_PROPS }
		/>
	);
}

function customGradientBarReducer( state, action ) {
	switch ( action.type ) {
		case 'MOVE_INSERTER':
			if ( state.id === 'IDLE' || state.id === 'MOVING_INSERTER' ) {
				return {
					id: 'MOVING_INSERTER',
					insertPosition: action.insertPosition,
				};
			}
			break;
		case 'STOP_INSERTER_MOVE':
			if ( state.id === 'MOVING_INSERTER' ) {
				return {
					id: 'IDLE',
				};
			}
			break;
		case 'OPEN_INSERTER':
			if ( state.id === 'MOVING_INSERTER' ) {
				return {
					id: 'INSERTING_CONTROL_POINT',
					insertPosition: state.insertPosition,
				};
			}
			break;
		case 'CLOSE_INSERTER':
			if ( state.id === 'INSERTING_CONTROL_POINT' ) {
				return {
					id: 'IDLE',
				};
			}
			break;
		case 'START_CONTROL_CHANGE':
			if ( state.id === 'IDLE' ) {
				return {
					id: 'MOVING_CONTROL_POINT',
				};
			}
			break;
		case 'STOP_CONTROL_CHANGE':
			if ( state.id === 'MOVING_CONTROL_POINT' ) {
				return {
					id: 'IDLE',
				};
			}
			break;
	}
	return state;
}
const customGradientBarReducerInitialState = { id: 'IDLE' };

export default function CustomGradientBar( { value, onChange } ) {
	const { gradientAST, gradientValue, hasGradient } = value;

	const gradientPickerDomRef = useRef();
	const markerPoints = getMarkerPoints( gradientAST );

	const [ gradientBarState, gradientBarStateDispatch ] = useReducer(
		customGradientBarReducer,
		customGradientBarReducerInitialState
	);
	const onMouseEnterAndMove = ( event ) => {
		const insertPosition = getHorizontalRelativeGradientPosition(
			event.clientX,
			gradientPickerDomRef.current,
			INSERT_POINT_WIDTH
		);

		// If the insert point is close to an existing control point don't show it.
		if (
			some( markerPoints, ( { positionValue } ) => {
				return (
					Math.abs( insertPosition - positionValue ) <
					MINIMUM_DISTANCE_BETWEEN_INSERTER_AND_POINT
				);
			} )
		) {
			if ( gradientBarState.id === 'MOVING_INSERTER' ) {
				gradientBarStateDispatch( { type: 'STOP_INSERTER_MOVE' } );
			}
			return;
		}

		gradientBarStateDispatch( { type: 'MOVE_INSERTER', insertPosition } );
	};

	const onMouseLeave = () => {
		gradientBarStateDispatch( { type: 'STOP_INSERTER_MOVE' } );
	};

	const isMovingInserter = gradientBarState.id === 'MOVING_INSERTER';
	const isInsertingControlPoint =
		gradientBarState.id === 'INSERTING_CONTROL_POINT';

	return (
		<div
			ref={ gradientPickerDomRef }
			className={ classnames(
				'components-custom-gradient-picker__gradient-bar',
				{ 'has-gradient': hasGradient }
			) }
			onMouseEnter={ onMouseEnterAndMove }
			onMouseMove={ onMouseEnterAndMove }
			// On radial gradients the bar should display a linear gradient.
			// On radial gradients the bar represents a slice of the gradient from the center until the outside.
			style={ {
				background:
					gradientAST.type === 'radial-gradient'
						? getLinearGradientRepresentationOfARadial(
								gradientAST
						  )
						: gradientValue,
			} }
			onMouseLeave={ onMouseLeave }
		>
			<div className="components-custom-gradient-picker__markers-container">
				{ ( isMovingInserter || isInsertingControlPoint ) && (
					<InsertPoint
						insertPosition={ gradientBarState.insertPosition }
						onChange={ onChange }
						gradientAST={ gradientAST }
						onOpenInserter={ () => {
							gradientBarStateDispatch( {
								type: 'OPEN_INSERTER',
							} );
						} }
						onCloseInserter={ () => {
							gradientBarStateDispatch( {
								type: 'CLOSE_INSERTER',
							} );
						} }
					/>
				) }
				<ControlPoints
					gradientPickerDomRef={ gradientPickerDomRef }
					ignoreMarkerPosition={
						isInsertingControlPoint
							? gradientBarState.insertPosition
							: undefined
					}
					markerPoints={ markerPoints }
					onChange={ onChange }
					gradientAST={ gradientAST }
					onStartControlPointChange={ () => {
						gradientBarStateDispatch( {
							type: 'START_CONTROL_CHANGE',
						} );
					} }
					onStopControlPointChange={ () => {
						gradientBarStateDispatch( {
							type: 'STOP_CONTROL_CHANGE',
						} );
					} }
				/>
			</div>
		</div>
	);
}
