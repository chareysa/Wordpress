
/**
 * WordPress dependencies
 */
import { primitives } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getIconClassName } from '../icon-class';

const { Path, SVG } = primitives;

export default function EditorStrikethrough( { size = 20, className, ariaPressed, ...props } ) {
	const iconClass = getIconClassName( 'editor-strikethrough', className, ariaPressed );
	return (
		<SVG
			aria-hidden
			role="img"
			focusable="false"
			className={ iconClass }
			xmlns="http://www.w3.org/2000/svg"
			width={ size }
			height={ size }
			viewBox="0 0 20 20"
			{ ...props }
		>
			<Path d="M15.82 12.25c.26 0 .5-.02.74-.07.23-.05.48-.12.73-.2v.84c-.46.17-.99.26-1.58.26-.88 0-1.54-.26-2.01-.79-.39-.44-.62-1.04-.68-1.79h-.94c.12.21.18.48.18.79 0 .54-.18.95-.55 1.26-.38.3-.9.45-1.56.45H8v-2.5H6.59l.93 2.5H6.49l-.59-1.67H3.62L3.04 13H2l.93-2.5H2v-1h1.31l.93-2.49H5.3l.92 2.49H8V7h1.77c1 0 1.41.17 1.77.41.37.24.55.62.55 1.13 0 .35-.09.64-.27.87l-.08.09h1.29c.05-.4.15-.77.31-1.1.23-.46.55-.82.98-1.06.43-.25.93-.37 1.51-.37.61 0 1.17.12 1.69.38l-.35.81c-.2-.1-.42-.18-.64-.25s-.46-.11-.71-.11c-.55 0-.99.2-1.31.59-.23.29-.38.66-.44 1.11H17v1h-2.95c.06.5.2.9.44 1.19.3.37.75.56 1.33.56zM4.44 8.96l-.18.54H5.3l-.22-.61c-.04-.11-.09-.28-.17-.51-.07-.24-.12-.41-.14-.51-.08.33-.18.69-.33 1.09zm4.53-1.09V9.5h1.19c.28-.02.49-.09.64-.18.19-.13.28-.35.28-.66 0-.28-.1-.48-.3-.61-.2-.12-.53-.18-.97-.18h-.84zm-3.33 2.64v-.01H3.91v.01h1.73zm5.28.01l-.03-.02H8.97v1.68h1.04c.4 0 .71-.08.92-.23.21-.16.31-.4.31-.74 0-.31-.11-.54-.32-.69z" />
		</SVG>
	);
}
