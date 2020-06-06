/**
 * External dependencies
 */
import { flow } from 'lodash';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { PREFERENCES_DEFAULTS } from './defaults';

/**
 * Higher-order reducer creator which provides the given initial state for the
 * original reducer.
 *
 * @param {*} initialState Initial state to provide to reducer.
 *
 * @return {Function} Higher-order reducer.
 */
const createWithInitialState = ( initialState ) => ( reducer ) => {
	return ( state = initialState, action ) => reducer( state, action );
};

/**
 * Reducer returning the user preferences.
 *
 * @param {Object}  state Current state.
 *
 * @return {Object} Updated state.
 */
export const preferences = flow( [
	combineReducers,
	createWithInitialState( PREFERENCES_DEFAULTS ),
] )( {
	features( state, action ) {
		if ( action.type === 'TOGGLE_FEATURE' ) {
			return {
				...state,
				[ action.feature ]: ! state[ action.feature ],
			};
		}

		return state;
	},
} );

/**
 * Reducer returning the editing canvas device type.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function deviceType( state = 'Desktop', action ) {
	switch ( action.type ) {
		case 'SET_PREVIEW_DEVICE_TYPE':
			return action.deviceType;
	}

	return state;
}

/**
 * Reducer returning the settings.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function settings( state = {}, action ) {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS':
			return {
				...state,
				...action.settings,
			};
	}

	return state;
}

/**
 * Reducer returning the home template ID.
 *
 * @param {Object} state Current state.
 *
 * @return {Object} Updated state.
 */
export function homeTemplateId( state ) {
	return state;
}

/**
 * Reducer returning the template ID.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateId( state, action ) {
	switch ( action.type ) {
		case 'SET_TEMPLATE':
		case 'ADD_TEMPLATE':
		case 'SET_PAGE':
			return action.templateId;
	}

	return state;
}

/**
 * Reducer returning the template part ID.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templatePartId( state, action ) {
	switch ( action.type ) {
		case 'SET_TEMPLATE_PART':
			return action.templatePartId;
	}

	return state;
}

/**
 * Reducer returning the template type.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateType( state, action ) {
	switch ( action.type ) {
		case 'SET_TEMPLATE':
		case 'ADD_TEMPLATE':
		case 'SET_PAGE':
			return 'wp_template';
		case 'SET_TEMPLATE_PART':
			return 'wp_template_part';
	}

	return state;
}

/**
 * Reducer returning the list of template IDs.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateIds( state = [], action ) {
	switch ( action.type ) {
		case 'ADD_TEMPLATE':
			return [ ...state, action.templateId ];
		case 'REMOVE_TEMPLATE':
			return state.filter( ( id ) => id !== action.templateId );
	}

	return state;
}

/**
 * Reducer returning the list of template part IDs.
 *
 * @param {Object} state Current state.
 *
 * @return {Object} Updated state.
 */
export function templatePartIds( state = [] ) {
	return state;
}

/**
 * Reducer returning the page being edited.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function page( state = {}, action ) {
	switch ( action.type ) {
		case 'SET_PAGE':
			return action.page;
	}

	return state;
}

/**
 * Reducer returning the site's `show_on_front` setting.
 *
 * @param {Object} state Current state.
 *
 * @return {Object} Updated state.
 */
export function showOnFront( state ) {
	return state;
}

export default combineReducers( {
	preferences,
	deviceType,
	settings,
	homeTemplateId,
	templateId,
	templatePartId,
	templateType,
	templateIds,
	templatePartIds,
	page,
	showOnFront,
} );
