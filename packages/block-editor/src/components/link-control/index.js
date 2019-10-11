/**
 * WordPress dependencies
 */
import {
	IconButton,
	Icon,
	ToggleControl,
} from '@wordpress/components';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { isFunction, escapeRegExp } from 'lodash';

import {
	useCallback,
	useState,
	useRef,
	Fragment,
} from '@wordpress/element';

import {
	LEFT,
	RIGHT,
	UP,
	DOWN,
	BACKSPACE,
	ENTER,
} from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import {
	URLPopover,
	URLInput,
} from '../';

const TextHighlight = ( { text = '', highlight = '' } ) => {
	if ( ! highlight.trim() ) {
		return { text };
	}

	const regex = new RegExp( `(${ escapeRegExp( highlight ) })`, 'gi' );
	const parts = text.split( regex );
	return (
		<Fragment>
			{ parts.filter( ( part ) => part ).map( ( part, i ) => (
				regex.test( part ) ? <mark key={ i }>{ part }</mark> : <span key={ i }>{ part }</span>
			) ) }
		</Fragment>
	);
};

function LinkControl( { defaultOpen = false, fetchSearchSuggestions, renderAdditionalSettings } ) {
	// State
	const [ isOpen, setIsOpen ] = useState( defaultOpen );
	const [ inputValue, setInputValue ] = useState( '' );

	// Refs
	const autocompleteRef = useRef( null );

	// Effects
	const getSearchFetcher = useCallback( ( value ) => {
		return ( /^https?:/.test( value ) ) ? handleURLSearch : fetchSearchSuggestions;
	} );

	// Handlers
	const onInputChange = ( value = '' ) => {
		setInputValue( value );
	};

	const closeLinkUI = () => {
		setInputValue( '' );
		setIsOpen( false );
	};

	const handleURLSearch = async ( value ) => {
		return [ {
			id: 1,
			title: value,
			type: 'URL',
			url: value,
		} ];
	};

	const onSubmitLinkChange = ( value ) => {
		setInputValue( value );
	};

	const stopPropagation = ( event ) => {
		event.stopPropagation();
	};

	const stopPropagationRelevantKeys = ( event ) => {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}
	};

	// Render Components
	const renderSearchResults = ( { suggestionsListProps, buildSuggestionItemProps, suggestions, selectedSuggestion, handleSuggestionClick } ) => {
		/* eslint-disable react/jsx-key */
		return (
			<div className="block-editor-link-control__search-results-wrapper">
				<div { ...suggestionsListProps } className="block-editor-link-control__search-results">
					{ suggestions.map( ( suggestion, index ) => (
						<button
							{ ...buildSuggestionItemProps( suggestion, index ) }
							onClick={ () => handleSuggestionClick( suggestion ) }
							className={ classnames( 'block-editor-link-control__search-item', {
								'is-selected': index === selectedSuggestion,
							} ) }

						>
							{ suggestion.type.toLowerCase() === 'url' && (
								<Icon className="block-editor-link-control__search-item-icon" icon="admin-site-alt3" />
							) }
							<span className="block-editor-link-control__search-item-header">
								<span className="block-editor-link-control__search-item-title">
									<TextHighlight text={ suggestion.title } highlight={ inputValue } />
								</span>
								<span className="block-editor-link-control__search-item-info">{ suggestion.info || suggestion.url || '' }</span>
							</span>
							<span className="block-editor-link-control__search-item-type">{ suggestion.type.toLowerCase() || '' }</span>
						</button>
					) ) }
				</div>
			</div>
		);
		/* eslint-enable react/jsx-key */
	};

	const LinkControlAdditionalSettings = () => (
		<div className="block-editor-link-control__settings">
			<ToggleControl
				label={ __( 'Open in New Tab' ) }
				checked={ false } />
			{ isFunction( renderAdditionalSettings ) && renderAdditionalSettings() }
		</div>
	);

	if ( ! isOpen ) {
		return null;
	}

	return (
		<URLPopover
			onClose={ closeLinkUI }
		>
			<div className="block-editor-link-control__popover-inner">
				<div className="block-editor-link-control__search">

					<form
						onSubmit={ onSubmitLinkChange }
					>
						<URLInput
							className="block-editor-link-control__search-input"
							value={ inputValue }
							onChange={ onInputChange }
							autocompleteRef={ autocompleteRef }
							onKeyDown={ stopPropagationRelevantKeys }
							onKeyPress={ stopPropagation }
							placeholder={ __( 'Search or type url' ) }
							renderSuggestions={ renderSearchResults }
							fetchLinkSuggestions={ getSearchFetcher( inputValue ) }
							handleURLSuggestions={ true }
						/>

						{ inputValue && (
							<IconButton
								type="reset"
								label={ __( 'Reset' ) }
								icon="no-alt"
								className="block-editor-link-control__search-reset"
								onClick={ () => onInputChange( undefined ) }
							/>
						) }
						{ inputValue && <LinkControlAdditionalSettings /> }
					</form>
				</div>
			</div>
		</URLPopover>
	);
}

export default LinkControl;
