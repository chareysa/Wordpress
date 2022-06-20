/**
 * External dependencies
 */
import { colord, Colord } from 'colord';

/**
 * Internal dependencies
 */
import { InputWithSlider } from './input-with-slider';

interface RgbInputProps {
	color: Colord;
	onChange: ( nextColor: Colord ) => void;
	enableAlpha: boolean;
}

export const RgbInput = ( { color, onChange, enableAlpha }: RgbInputProps ) => {
	const { r, g, b, a } = color.toRgb();

	return (
		<>
			<InputWithSlider
				min={ 0 }
				max={ 255 }
				label="Red"
				abbreviation="R"
				value={ r }
				onChange={ ( nextR?: number ) =>
					onChange( colord( { r: nextR as number, g, b, a } ) )
				}
			/>
			<InputWithSlider
				min={ 0 }
				max={ 255 }
				label="Green"
				abbreviation="G"
				value={ g }
				onChange={ ( nextG?: number ) =>
					onChange( colord( { r, g: nextG as number, b, a } ) )
				}
			/>
			<InputWithSlider
				min={ 0 }
				max={ 255 }
				label="Blue"
				abbreviation="B"
				value={ b }
				onChange={ ( nextB?: number ) =>
					onChange( colord( { r, g, b: nextB as number, a } ) )
				}
			/>
			{ enableAlpha && (
				<InputWithSlider
					min={ 0 }
					max={ 100 }
					label="Alpha"
					abbreviation="A"
					value={ Math.trunc( a * 100 ) }
					onChange={ ( nextA?: number ) =>
						onChange(
							colord( {
								r,
								g,
								b,
								a: ( nextA as number ) / 100,
							} )
						)
					}
				/>
			) }
		</>
	);
};
