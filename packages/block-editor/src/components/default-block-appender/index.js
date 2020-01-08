/**
 * External dependencies
 */
import TextareaAutosize from 'react-autosize-textarea';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { getDefaultBlockName } from '@wordpress/blocks';
import { decodeEntities } from '@wordpress/html-entities';
import { withSelect, withDispatch } from '@wordpress/data';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inserter from '../inserter';
import useBlockDropZone from '../block-drop-zone';

export function Appender( {
	onAppend,
	showPrompt,
	placeholder,
	rootClientId,
} ) {
	const ref = useRef();
	const dropZoneClassName = useBlockDropZone( {
		element: ref,
		rootClientId,
	} );

	const value = decodeEntities( placeholder ) || __( 'Start writing or type / to choose a block' );

	// The appender "button" is in-fact a text field so as to support
	// transitions by WritingFlow occurring by arrow key press. WritingFlow
	// only supports tab transitions into text fields and to the block focus
	// boundary.
	//
	// See: https://github.com/WordPress/gutenberg/issues/4829#issuecomment-374213658
	//
	// If it were ever to be made to be a proper `button` element, it is
	// important to note that `onFocus` alone would not be sufficient to
	// capture click events, notably in Firefox.
	//
	// See: https://gist.github.com/cvrebert/68659d0333a578d75372

	// The wp-block className is important for editor styles.

	return (
		<div
			ref={ ref }
			data-root-client-id={ rootClientId || '' }
			className={ classnames(
				'wp-block block-editor-default-block-appender',
				dropZoneClassName,
			) }
		>
			<TextareaAutosize
				role="button"
				aria-label={ __( 'Add block' ) }
				className="block-editor-default-block-appender__content"
				readOnly
				onFocus={ onAppend }
				value={ showPrompt ? value : '' }
			/>
			<Inserter rootClientId={ rootClientId } position="top right" isAppender />
		</div>
	);
}

export function DefaultBlockAppender( {
	isLocked,
	isVisible,
	onAppend,
	showPrompt,
	placeholder,
	rootClientId,
} ) {
	if ( isLocked || ! isVisible ) {
		return null;
	}

	return (
		<Appender
			onAppend={ onAppend }
			showPrompt={ showPrompt }
			placeholder={ placeholder }
			rootClientId={ rootClientId }
		/>
	);
}

export default compose(
	withSelect( ( select, ownProps ) => {
		const { getBlockCount, getBlockName, isBlockValid, getSettings, getTemplateLock } = select( 'core/block-editor' );

		const isEmpty = ! getBlockCount( ownProps.rootClientId );
		const isLastBlockDefault = getBlockName( ownProps.lastBlockClientId ) === getDefaultBlockName();
		const isLastBlockValid = isBlockValid( ownProps.lastBlockClientId );
		const { bodyPlaceholder } = getSettings();

		return {
			isVisible: isEmpty || ! isLastBlockDefault || ! isLastBlockValid,
			showPrompt: isEmpty,
			isLocked: !! getTemplateLock( ownProps.rootClientId ),
			placeholder: bodyPlaceholder,
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			insertDefaultBlock,
			startTyping,
		} = dispatch( 'core/block-editor' );

		return {
			onAppend() {
				const { rootClientId } = ownProps;

				insertDefaultBlock( undefined, rootClientId );
				startTyping();
			},
		};
	} ),
)( DefaultBlockAppender );
