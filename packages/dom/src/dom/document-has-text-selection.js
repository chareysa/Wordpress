/**
 * Check whether the current document has selected text. This applies to ranges
 * of text in the document, and not selection inside <input> and <textarea>
 * elements.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection#Related_objects.
 *
 * @param {Document} doc The document to check.
 *
 * @return {boolean} True if there is selection, false if not.
 */
export default function documentHasTextSelection( doc ) {
	const selection = doc.defaultView.getSelection();
	const range = selection.rangeCount ? selection.getRangeAt( 0 ) : null;
	return range && ! range.collapsed;
}
