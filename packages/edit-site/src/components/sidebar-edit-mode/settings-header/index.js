/**
 * WordPress dependencies
 */
import { privateApis as componentsPrivateApis } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { SIDEBAR_BLOCK, SIDEBAR_TEMPLATE } from '../constants';
import { unlock } from '../../../lock-unlock';

const { Tabs } = unlock( componentsPrivateApis );

const SettingsHeader = () => {
	const postTypeLabel = useSelect(
		( select ) => select( editorStore ).getPostTypeLabel(),
		[]
	);

	return (
		<Tabs.TabList>
			<Tabs.Tab tabId={ SIDEBAR_TEMPLATE }>{ postTypeLabel }</Tabs.Tab>
			<Tabs.Tab tabId={ SIDEBAR_BLOCK }>{ __( 'Block' ) }</Tabs.Tab>
		</Tabs.TabList>
	);
};

export default SettingsHeader;
