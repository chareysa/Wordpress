/**
 * External dependencies
 */
import { View, Text } from 'react-native';

/**
 * WordPress dependencies
 */
import { Icon, withTheme, useStyle } from '@wordpress/components';
import { coreBlocks } from '@wordpress/block-library';
import { normalizeIconObject } from '@wordpress/blocks';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import styles from './style.scss';

export class UnsupportedBlockEdit extends Component {
	render() {
		const { originalName } = this.props.attributes;
		const theme = this.props.theme;
		const blockType = coreBlocks[ originalName ];

		const title = blockType ? blockType.settings.title : __( 'Unsupported' );
		const titleStyle = useStyle( styles.unsupportedBlockMessage, styles.unsupportedBlockMessageDark, theme );

		const icon = blockType ? normalizeIconObject( blockType.settings.icon ) : 'admin-plugins';
		const iconStyle = useStyle( styles.unsupportedBlockIcon, styles.unsupportedBlockIconDark, theme );
		const iconClassName = 'unsupported-icon' + '-' + theme;
		return (
			<View style={ useStyle( styles.unsupportedBlock, styles.unsupportedBlockDark, theme ) }>
				<Icon className={ iconClassName } icon={ icon && icon.src ? icon.src : icon } color={ iconStyle.color } />
				<Text style={ titleStyle }>{ title }</Text>
			</View>
		);
	}
}

export default withTheme( UnsupportedBlockEdit );
