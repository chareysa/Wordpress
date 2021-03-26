/**
 * External dependencies
 */
import { escapeRegExp, find, deburr } from 'lodash';

/**
 * WordPress dependencies
 */
import { renderToString, useEffect, useState } from '@wordpress/element';
import { ENTER, ESCAPE, UP, DOWN, LEFT, RIGHT } from '@wordpress/keycodes';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import {
	create,
	slice,
	insert,
	isCollapsed,
	getTextContent,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { getAutoCompleterUI } from './autocompleter-ui';
import withSpokenMessages from '../higher-order/with-spoken-messages';

/**
 * A raw completer option.
 *
 * @typedef {*} CompleterOption
 */

/**
 * @callback FnGetOptions
 *
 * @return {(CompleterOption[]|Promise.<CompleterOption[]>)} The completer options or a promise for them.
 */

/**
 * @callback FnGetOptionKeywords
 * @param {CompleterOption} option a completer option.
 *
 * @return {string[]} list of key words to search.
 */

/**
 * @callback FnIsOptionDisabled
 * @param {CompleterOption} option a completer option.
 *
 * @return {string[]} whether or not the given option is disabled.
 */

/**
 * @callback FnGetOptionLabel
 * @param {CompleterOption} option a completer option.
 *
 * @return {(string|Array.<(string|WPElement)>)} list of react components to render.
 */

/**
 * @callback FnAllowContext
 * @param {string} before the string before the auto complete trigger and query.
 * @param {string} after  the string after the autocomplete trigger and query.
 *
 * @return {boolean} true if the completer can handle.
 */

/**
 * @typedef {Object} OptionCompletion
 * @property {'insert-at-caret'|'replace'} action the intended placement of the completion.
 * @property {OptionCompletionValue} value the completion value.
 */

/**
 * A completion value.
 *
 * @typedef {(string|WPElement|Object)} OptionCompletionValue
 */

/**
 * @callback FnGetOptionCompletion
 * @param {CompleterOption} value the value of the completer option.
 * @param {string} query the text value of the autocomplete query.
 *
 * @return {(OptionCompletion|OptionCompletionValue)} the completion for the given option. If an
 * 													   OptionCompletionValue is returned, the
 * 													   completion action defaults to `insert-at-caret`.
 */

/**
 * @typedef {Object} WPCompleter
 * @property {string} name a way to identify a completer, useful for selective overriding.
 * @property {?string} className A class to apply to the popup menu.
 * @property {string} triggerPrefix the prefix that will display the menu.
 * @property {(CompleterOption[]|FnGetOptions)} options the completer options or a function to get them.
 * @property {?FnGetOptionKeywords} getOptionKeywords get the keywords for a given option.
 * @property {?FnIsOptionDisabled} isOptionDisabled get whether or not the given option is disabled.
 * @property {FnGetOptionLabel} getOptionLabel get the label for a given option.
 * @property {?FnAllowContext} allowContext filter the context under which the autocomplete activates.
 * @property {FnGetOptionCompletion} getOptionCompletion get the completion associated with a given option.
 */

function Autocomplete( {
	children,
	isSelected,
	record,
	onChange,
	onReplace,
	completers,
	debouncedSpeak,
	contentRef,
} ) {
	const instanceId = useInstanceId( Autocomplete );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );
	const [ filteredOptions, setFilteredOptions ] = useState( [] );
	const [ filterValue, setFilterValue ] = useState( '' );
	const [ autocompleter, setAutocompleter ] = useState( null );
	const [ AutocompleterUI, setAutocompleterUI ] = useState( null );

	function insertCompletion( replacement ) {
		const end = record.start;
		const start =
			end - autocompleter.triggerPrefix.length - filterValue.length;
		const toInsert = create( { html: renderToString( replacement ) } );

		onChange( insert( record, toInsert, start, end ) );
	}

	function select( option ) {
		const { getOptionCompletion } = autocompleter || {};

		if ( option.isDisabled ) {
			return;
		}

		if ( getOptionCompletion ) {
			const completion = getOptionCompletion( option.value, filterValue );

			const { action, value } =
				undefined === completion.action ||
				undefined === completion.value
					? { action: 'insert-at-caret', value: completion }
					: completion;

			if ( 'replace' === action ) {
				onReplace( [ value ] );
			} else if ( 'insert-at-caret' === action ) {
				insertCompletion( value );
			}
		}

		// Reset autocomplete state after insertion rather than before
		// so insertion events don't cause the completion menu to redisplay.
		reset();
	}

	function reset() {
		setSelectedIndex( 0 );
		setFilteredOptions( [] );
		setFilterValue( '' );
		setAutocompleter( null );
		setAutocompleterUI( null );
	}

	function announce( options ) {
		if ( ! debouncedSpeak ) {
			return;
		}
		if ( !! options.length ) {
			debouncedSpeak(
				sprintf(
					/* translators: %d: number of results. */
					_n(
						'%d result found, use up and down arrow keys to navigate.',
						'%d results found, use up and down arrow keys to navigate.',
						options.length
					),
					options.length
				),
				'assertive'
			);
		} else {
			debouncedSpeak( __( 'No results.' ), 'assertive' );
		}
	}

	/**
	 * Load options for an autocompleter.
	 *
	 * @param {Array} options
	 */
	function onChangeOptions( options ) {
		setSelectedIndex(
			options.length === filteredOptions.length ? selectedIndex : 0
		);
		setFilteredOptions( options );
		announce( options );
	}

	function handleKeyDown( event ) {
		if ( ! autocompleter ) {
			return;
		}
		if ( filteredOptions.length === 0 ) {
			return;
		}
		switch ( event.keyCode ) {
			case UP:
				setSelectedIndex(
					( selectedIndex === 0
						? filteredOptions.length
						: selectedIndex ) - 1
				);
				break;

			case DOWN:
				setSelectedIndex(
					( selectedIndex + 1 ) % filteredOptions.length
				);
				break;

			case ESCAPE:
				setAutocompleter( null );
				setAutocompleterUI( null );
				break;

			case ENTER:
				select( filteredOptions[ selectedIndex ] );
				break;

			case LEFT:
			case RIGHT:
				reset();
				return;

			default:
				return;
		}

		// Any handled keycode should prevent original behavior. This relies on
		// the early return in the default case.
		event.preventDefault();
		event.stopPropagation();
	}

	let textContent;

	if ( isCollapsed( record ) ) {
		textContent = getTextContent( slice( record, 0 ) );
	}

	useEffect( () => {
		if ( ! textContent ) {
			if ( AutocompleterUI ) {
				reset();
			}
			return;
		}

		const text = deburr( textContent );
		const textAfterSelection = getTextContent(
			slice( record, undefined, getTextContent( record ).length )
		);
		const completer = find(
			completers,
			( { triggerPrefix, allowContext } ) => {
				const index = text.lastIndexOf( triggerPrefix );

				if ( index === -1 ) {
					return false;
				}

				if (
					allowContext &&
					! allowContext( text.slice( 0, index ), textAfterSelection )
				) {
					return false;
				}

				const textWithoutTrigger = text.slice(
					index + triggerPrefix.length
				);

				if (
					/^\s/.test( textWithoutTrigger ) ||
					/\s\s+$/.test( textWithoutTrigger )
				) {
					return false;
				}

				return /[\u0000-\uFFFF]*$/.test( textWithoutTrigger );
			}
		);

		if ( ! completer ) {
			reset();
			return;
		}

		const safeTrigger = escapeRegExp( completer.triggerPrefix );
		const match = text.match(
			new RegExp( `${ safeTrigger }([\u0000-\uFFFF]*)$` )
		);
		const query = match && match[ 1 ];

		setAutocompleter( completer );
		setAutocompleterUI( () =>
			completer !== autocompleter
				? getAutoCompleterUI( completer )
				: AutocompleterUI
		);
		setFilterValue( query );
	}, [ textContent ] );

	const { key: selectedKey = '' } = filteredOptions[ selectedIndex ] || {};
	const { className } = autocompleter || {};
	const isExpanded = !! autocompleter && filteredOptions.length > 0;
	const listBoxId = isExpanded
		? `components-autocomplete-listbox-${ instanceId }`
		: null;
	const activeId = isExpanded
		? `components-autocomplete-item-${ instanceId }-${ selectedKey }`
		: null;

	return (
		<>
			{ children( {
				isExpanded,
				listBoxId,
				activeId,
				onKeyDown: handleKeyDown,
			} ) }
			{ isSelected && AutocompleterUI && (
				<AutocompleterUI
					className={ className }
					filterValue={ filterValue }
					instanceId={ instanceId }
					listBoxId={ listBoxId }
					selectedIndex={ selectedIndex }
					onChangeOptions={ onChangeOptions }
					onSelect={ select }
					value={ record }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export default withSpokenMessages( Autocomplete );
