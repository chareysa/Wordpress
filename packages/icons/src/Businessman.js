
/**
 * WordPress dependencies
 */
import { primitives } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getIconClassName } from '../icon-class';

const { Path, SVG } = primitives;

export default function Businessman( { size = 20, className, ariaPressed, ...props } ) {
	const iconClass = getIconClassName( 'businessman', className, ariaPressed );
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
			<Path d="M7.3 6l-.03-.19c-.04-.37-.05-.73-.03-1.08.02-.36.1-.71.25-1.04.14-.32.31-.61.52-.86s.49-.46.83-.6c.34-.15.72-.23 1.13-.23.69 0 1.26.2 1.71.59s.76.87.91 1.44.18 1.16.09 1.78l-.03.19c-.01.09-.05.25-.11.48-.05.24-.12.47-.2.69-.08.21-.19.45-.34.72-.14.27-.3.49-.47.69-.18.19-.4.34-.67.48-.27.13-.55.19-.86.19s-.59-.06-.87-.19c-.26-.13-.49-.29-.67-.5-.18-.2-.34-.42-.49-.66-.15-.25-.26-.49-.34-.73-.09-.25-.16-.47-.21-.67-.06-.21-.1-.37-.12-.5zm9.2 6.24c.41.7.5 1.41.5 2.14v2.49c0 .03-.12.08-.29.13-.18.04-.42.13-.97.27-.55.12-1.1.24-1.65.34s-1.19.19-1.95.27c-.75.08-1.46.12-2.13.12-.68 0-1.39-.04-2.14-.12-.75-.07-1.4-.17-1.98-.27-.58-.11-1.08-.23-1.56-.34-.49-.11-.8-.21-1.06-.29L3 16.87v-2.49c0-.75.07-1.46.46-2.15s.81-1.25 1.5-1.68C5.66 10.12 7.19 10 8 10l1.67 1.67L9 13v3l1.02 1.08L11 16v-3l-.68-1.33L11.97 10c.77 0 2.2.07 2.9.52.71.45 1.21 1.02 1.63 1.72z" />
		</SVG>
	);
}
