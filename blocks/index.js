/**
 * Internal dependencies
 */
import './hooks';

// A "block" is the abstract term used to describe units of markup that,
// when composed together, form the content or layout of a page.
// The API for blocks is exposed via `wp.blocks`.
//
// Supported blocks are registered by calling `registerBlockType`. Once registered,
// the block is made available as an option to the editor interface.
//
// Blocks are inferred from the HTML source of a post through a parsing mechanism
// and then stored as objects in state, from which it is then rendered for editing.
export * from './api';
export * from './autocompleters';
export * from './colors';

export { default as editorMediaUpload } from './editor-media-upload';
export { default as AlignmentToolbar } from './alignment-toolbar';
export { default as Autocomplete } from './autocomplete';
export { blockAutocompleter, userAutocompleter } from './autocompleters';
export { default as BlockAlignmentToolbar } from './block-alignment-toolbar';
export { default as BlockControls } from './block-controls';
export { default as BlockFormatControls } from './block-format-controls';
export { default as BlockEdit } from './block-edit';
export { default as BlockIcon } from './block-icon';
export { default as ColorPalette } from './color-palette';
export { default as ContrastChecker } from './contrast-checker';
export { defaultAutocompleters } from './hooks';
export { default as ImagePlaceholder } from './image-placeholder';
export { default as InnerBlocks } from './inner-blocks';
export { default as InspectorControls } from './inspector-controls';
export { default as InspectorAdvancedControls } from './inspector-advanced-controls';
export { default as PlainText } from './plain-text';
export { default as MediaUpload } from './media-upload';
export { default as RichText } from './rich-text';
export { default as RichTextProvider } from './rich-text/provider';
export { default as UrlInput } from './url-input';
export { default as UrlInputButton } from './url-input/button';
export { default as EditorSettings, withEditorSettings } from './editor-settings';
export { default as PanelColor } from './panel-color';
export { default as withColorContext } from './with-color-context';
