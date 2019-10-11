/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { BodyUI } from './styles/card.styles';
import { useCardContext } from './context';

export const defaultProps = {
	isShady: false,
	size: 'md',
};

export function Body( props ) {
	const { className, isShady, ...additionalProps } = props;
	const mergedProps = { ...defaultProps, ...useCardContext(), ...props };
	const { size } = mergedProps;

	const classes = classnames(
		'components-card-body',
		isShady && 'is-shady',
		size && `is-size-${ size }`,
		className
	);

	return <BodyUI { ...additionalProps } className={ classes } />;
}

export default Body;
