/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Dashicon from '../dashicon';
import BaseControl from '../base-control';
import Button from '../button';
import Dropdown from '../dropdown';
import RangeControl from '../range-control';
import { NavigableMenu } from '../navigable-container';

function FontSizePicker( {
	fallbackFontSize,
	fontSizes = [],
	disableCustomFontSizes = false,
	onChange,
	value,
	withSlider,
} ) {
	// Try to find the current font size in the set of preset font sizes.
	const currentFont = fontSizes.find( ( font ) => font.slug === value.slug );

	// If the current font size is not one of the pre-defined sizes, we assume
	// the custom option has been selected.
	const isCustomFontSize = ! ( currentFont || value === undefined );

	const onChangeCustomValue = ( event ) => {
		const newValue = event.target.value;

		// If the custom value is empty, use that. Otherwise, cast it to a Number.
		onChange( newValue === '' ? '' : Number( newValue ) );
	};

	const onResetFontSize = () => {
		onChange( undefined );
	};

	return (
		<BaseControl label={ __( 'Font Size' ) }>
			<div className="components-font-size-picker__buttons">
				<Dropdown
					className="components-font-size-picker__dropdown"
					contentClassName="components-font-size-picker__dropdown-content"
					position="bottom"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							className="components-font-size-picker__selector"
							isLarge
							onClick={ onToggle }
							aria-expanded={ isOpen }
							aria-label={ __( 'Custom font size' ) }
						>
							{ ( currentFont && currentFont.name ) || ( ! value && __( 'Normal' ) ) || _x( 'Custom', 'font size name' ) }
						</Button>
					) }
					renderContent={ () => (
						<NavigableMenu>
							{ map( fontSizes, ( font ) => (
								<Button
									key={ font.slug }
									onClick={ () => onChange( font.slug === 'normal' ? undefined : font ) }
									className={ 'is-font-' + font.slug }
									role="menuitem"
								>
									{ font.slug === value.slug && <Dashicon icon="saved" /> }
									<span className="components-font-size-picker__dropdown-text-size" style={ { fontSize: font.size } }>
										{ font.name }
									</span>
								</Button>
							) ) }
							{ ( ! disableCustomFontSizes || isCustomFontSize ) &&
								<Button
									key={ 'custom' }
									onClick={ () => onChange( '' ) }
									className={ 'is-font-custom' }
									role="menuitem"
								>
									{ isCustomFontSize && <Dashicon icon="saved" /> }
									<span className="components-font-size-picker__dropdown-text-size">
										{ __( 'Custom' ) }
									</span>
								</Button>
							}
						</NavigableMenu>
					) }
				/>
				{ ( ! withSlider && isCustomFontSize ) &&
					<input
						className="components-range-control__number"
						type="number"
						onChange={ onChangeCustomValue }
						aria-label={ __( 'Custom font size' ) }
						value={ value.size || '' }
					/>
				}
				<Button
					className="components-color-palette__clear"
					type="button"
					disabled={ value.slug === 'normal' }
					onClick={ onResetFontSize }
					isSmall
					isDefault
					aria-label={ __( 'Reset font size' ) }
				>
					{ __( 'Reset' ) }
				</Button>
			</div>
			{ ( withSlider && isCustomFontSize ) &&
				<RangeControl
					className="components-font-size-picker__custom-input"
					label={ __( 'Custom Size' ) }
					value={ value.size || '' }
					initialPosition={ fallbackFontSize }
					onChange={ onChangeCustomValue }
					min={ 12 }
					max={ 100 }
					beforeIcon="editor-textcolor"
					afterIcon="editor-textcolor"
				/>
			}
		</BaseControl>
	);
}

export default withInstanceId( FontSizePicker );
