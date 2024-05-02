/**
 * WordPress dependencies
 */
import { ENTER } from '@wordpress/keycodes';
import { insert, remove } from '@wordpress/rich-text';
import { getBlockTransforms, findTransform } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';
import { splitValue } from '../split-value';

export default ( props ) => ( element ) => {
	function onKeyDown( event ) {
		if ( event.target.contentEditable !== 'true' ) {
			return;
		}

		if ( event.defaultPrevented ) {
			return;
		}

		if ( event.keyCode !== ENTER ) {
			return;
		}

		const {
			removeEditorOnlyFormats,
			value,
			onReplace,
			onSplit,
			onChange,
			disableLineBreaks,
			onSplitAtEnd,
			onSplitAtDoubleLineEnd,
			registry,
		} = props.current;

		event.preventDefault();

		const _value = { ...value };
		_value.formats = removeEditorOnlyFormats( value );
		const canSplit = onReplace && onSplit;

		if ( onReplace ) {
			const transforms = getBlockTransforms( 'from' ).filter(
				( { type } ) => type === 'enter'
			);
			const transformation = findTransform( transforms, ( item ) => {
				return item.regExp.test( _value.text );
			} );

			if ( transformation ) {
				onReplace( [
					transformation.transform( {
						content: _value.text,
					} ),
				] );
				registry
					.dispatch( blockEditorStore )
					.__unstableMarkAutomaticChange();
				return;
			}
		}

		const { text, start, end } = _value;

		if ( event.shiftKey ) {
			if ( ! disableLineBreaks ) {
				onChange( insert( _value, '\n' ) );
			}
		} else if ( canSplit ) {
			splitValue( {
				value: _value,
				onReplace,
				onSplit,
			} );
		} else if ( onSplitAtEnd && start === end && end === text.length ) {
			onSplitAtEnd();
		} else if (
			// For some blocks it's desirable to split at the end of the
			// block when there are two line breaks at the end of the
			// block, so triple Enter exits the block.
			onSplitAtDoubleLineEnd &&
			start === end &&
			end === text.length &&
			text.slice( -2 ) === '\n\n'
		) {
			registry.batch( () => {
				_value.start = _value.end - 2;
				onChange( remove( _value ) );
				onSplitAtDoubleLineEnd();
			} );
		} else if ( ! disableLineBreaks ) {
			onChange( insert( _value, '\n' ) );
		}
	}

	element.addEventListener( 'keydown', onKeyDown );
	return () => {
		element.removeEventListener( 'keydown', onKeyDown );
	};
};
