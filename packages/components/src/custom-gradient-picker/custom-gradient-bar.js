/**
 * External dependencies
 */

import { some } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef, useReducer } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ControlPoints from './control-points';
import { getHorizontalRelativeGradientPosition } from './utils';

const INSERT_POINT_WIDTH = 23;
const MINIMUM_DISTANCE_BETWEEN_INSERTER_AND_POINT = 10;

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
	const { background, hasGradient, markerPoints } = value;

	const gradientPickerDomRef = useRef();

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
			style={ { background } }
			onMouseLeave={ onMouseLeave }
		>
			<div className="components-custom-gradient-picker__markers-container">
				{ ( isMovingInserter || isInsertingControlPoint ) && (
					<ControlPoints.InsertPoint
						insertPosition={ gradientBarState.insertPosition }
						onChange={ onChange }
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
