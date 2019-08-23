/**
 * External dependencies
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { getColor } from '../../utils/color';

/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/components';

export default function Logo() {
	return (
		<LogoUI>
			<Link to="/">
				<h1>
					<IconUI>
						<WordPressIcon />
					</IconUI>
					<LabelUI>Components</LabelUI>
				</h1>
			</Link>
		</LogoUI>
	);
}

function WordPressIcon() {
	return (
		<SVG role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<title>WordPress icon</title>
			<Path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
		</SVG>
	);
}

export const LogoUI = styled.div`
	margin-right: 40px;

	a {
		display: block;
		padding: 10px 15px;
	}

	h1 {
		color: ${ getColor( 'Black' ) };
		font-size: 18px;
		font-weight: bold;
		margin: 0;
	}
`;

const IconUI = styled.span`
	display: inline-block;
	margin-right: 8px;
	position: relative;
	top: -3px;
	vertical-align: middle;

	svg {
		display: block;
		width: 20px;
	}
`;

const LabelUI = styled.span`
	display: inline-block;
	position: relative;
	top: 0px;
`;
