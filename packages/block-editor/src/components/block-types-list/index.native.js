/**
 * External dependencies
 */
import {
	Dimensions,
	FlatList,
	SectionList,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { BottomSheet, Gradient, InserterButton } from '@wordpress/components';
import { usePreferredColorScheme } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import styles from './style.scss';

const MIN_COL_NUM = 3;

export default function BlockTypesList( {
	name,
	sections,
	onSelect,
	listProps,
	initialNumToRender = 3,
} ) {
	const [ numberOfColumns, setNumberOfColumns ] = useState( MIN_COL_NUM );
	const [ itemWidth, setItemWidth ] = useState();
	const [ maxWidth, setMaxWidth ] = useState();

	useEffect( () => {
		const dimensionsChangeSubscription = Dimensions.addEventListener(
			'change',
			onLayout
		);
		onLayout();
		return () => {
			dimensionsChangeSubscription.remove();
		};
	}, [] );

	function calculateItemWidth() {
		const { paddingLeft: itemPaddingLeft, paddingRight: itemPaddingRight } =
			InserterButton.Styles.modalItem;
		const { width } = InserterButton.Styles.modalIconWrapper;
		return width + itemPaddingLeft + itemPaddingRight;
	}

	function onLayout() {
		const columnStyle = styles[ 'block-types-list__column' ];
		const sumLeftRightPadding =
			columnStyle.paddingLeft + columnStyle.paddingRight;

		const bottomSheetWidth = BottomSheet.getWidth();
		const containerTotalWidth = bottomSheetWidth - sumLeftRightPadding;
		const itemTotalWidth = calculateItemWidth();

		const columnsFitToWidth = Math.floor(
			containerTotalWidth / itemTotalWidth
		);

		const numColumns = Math.max( MIN_COL_NUM, columnsFitToWidth );

		setNumberOfColumns( numColumns );
		setMaxWidth( containerTotalWidth / numColumns );

		if ( columnsFitToWidth < MIN_COL_NUM ) {
			const updatedItemWidth =
				( bottomSheetWidth - 2 * sumLeftRightPadding ) / MIN_COL_NUM;
			setItemWidth( updatedItemWidth );
		}
	}

	const contentContainerStyle = StyleSheet.flatten(
		listProps.contentContainerStyle
	);

	const renderSection = ( { item } ) => {
		return (
			<TouchableWithoutFeedback accessible={ false }>
				<FlatList
					data={ item.list }
					key={ `InserterUI-${ name }-${ numberOfColumns }` } // Re-render when numberOfColumns changes.
					numColumns={ numberOfColumns }
					ItemSeparatorComponent={ () => (
						<TouchableWithoutFeedback accessible={ false }>
							<View
								style={
									styles[ 'block-types-list__row-separator' ]
								}
							/>
						</TouchableWithoutFeedback>
					) }
					scrollEnabled={ false }
					renderItem={ renderListItem }
				/>
			</TouchableWithoutFeedback>
		);
	};

	const renderListItem = ( { item } ) => {
		return (
			<InserterButton
				item={ item }
				itemWidth={ itemWidth }
				maxWidth={ maxWidth }
				onSelect={ onSelect }
			/>
		);
	};

	const colorScheme = usePreferredColorScheme();
	const sectionHeaderGradientValue =
		colorScheme === 'light'
			? 'linear-gradient(#fff 70%, rgba(255, 255, 255, 0))'
			: 'linear-gradient(#2e2e2e 70%, rgba(46, 46, 46, 0))';

	const renderSectionHeader = ( { section: { metadata } } ) => {
		if ( ! metadata?.icon ) {
			return null;
		}

		return (
			<TouchableWithoutFeedback accessible={ false }>
				<Gradient
					gradientValue={ sectionHeaderGradientValue }
					style={ styles[ 'block-types-list__section-header' ] }
				>
					{ metadata?.icon }
				</Gradient>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<SectionList
			onLayout={ onLayout }
			testID={ `InserterUI-${ name }` }
			keyboardShouldPersistTaps="always"
			sections={ sections }
			initialNumToRender={ initialNumToRender }
			renderItem={ renderSection }
			renderSectionHeader={ renderSectionHeader }
			{ ...listProps }
			contentContainerStyle={ {
				...contentContainerStyle,
				paddingBottom: Math.max(
					listProps.safeAreaBottomInset,
					contentContainerStyle.paddingBottom
				),
			} }
		/>
	);
}
