/**
 * External dependencies
 */
import { useContextSystem } from '@wp-g2/context';
import { css, cx, ui, useResponsiveValue } from '@wp-g2/styles';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import * as styles from './flex-styles';

/**
 * @param {import('@wp-g2/create-styles').ViewOwnProps<import('./types').FlexProps, 'div'>} props
 */
export function useFlex( props ) {
	const {
		align = 'center',
		className,
		direction: directionProp = 'row',
		expanded = true,
		gap = 2,
		justify = 'space-between',
		wrap = false,
		...otherProps
	} = useContextSystem( props, 'Flex' );

	const directionAsArray = Array.isArray( directionProp )
		? directionProp
		: [ directionProp ];
	const direction = useResponsiveValue( directionAsArray );

	const isColumn =
		typeof direction === 'string' && !! direction.includes( 'column' );
	const isReverse =
		typeof direction === 'string' && direction.includes( 'reverse' );

	const classes = useMemo( () => {
		const sx = {};

		sx.Base = css( {
			[ ui.createToken( 'FlexGap' ) ]: ui.space( gap ),
			[ ui.createToken( 'FlexItemDisplay' ) ]: isColumn
				? 'block'
				: undefined,
			[ ui.createToken( 'FlexItemMarginBottom' ) ]: isColumn
				? ui.get( 'FlexGap' )
				: 0,
			[ ui.createToken( 'FlexItemMarginRight' ) ]:
				! isColumn && ! isReverse ? ui.get( 'FlexGap' ) : 0,
			[ ui.createToken( 'FlexItemMarginLeft' ) ]:
				! isColumn && isReverse ? ui.get( 'FlexGap' ) : 0,
			alignItems: isColumn ? 'normal' : align,
			flexDirection: direction,
			flexWrap: wrap ? 'wrap' : undefined,
			justifyContent: justify,
			height: isColumn && expanded ? '100%' : undefined,
			width: ! isColumn && expanded ? '100%' : undefined,
			/**
			 * Workaround to optimize DOM rendering.
			 * We'll enhance alignment with naive parent flex assumptions.
			 *
			 * Trade-off:
			 * Far less DOM less. However, UI rendering is not as reliable.
			 */
			'> * + *:not(marquee)': {
				marginTop: isColumn ? ui.space( gap ) : undefined,
				marginRight:
					! isColumn && isReverse ? ui.space( gap ) : undefined,
				marginLeft:
					! isColumn && ! isReverse ? ui.space( gap ) : undefined,
			},
			/**
			 * Improves stability of width/height rendering.
			 * https://github.com/ItsJonQ/g2/pull/149
			 */
			'> *': {
				minWidth: ! isColumn ? 0 : undefined,
				minHeight: isColumn ? 0 : undefined,
			},
		} );

		return cx( styles.Flex, sx.Base, className );
	}, [
		align,
		className,
		direction,
		expanded,
		gap,
		isColumn,
		isReverse,
		justify,
		wrap,
	] );

	return { ...otherProps, className: classes };
}
