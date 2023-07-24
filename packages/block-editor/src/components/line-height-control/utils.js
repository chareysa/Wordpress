export const BASE_DEFAULT_VALUE = 1.5;
/**
 * A step value of 0.01 allows for a more granular control of the line height.
 * For example, this allows for a value of 1.55, rather than rounding up to a value of 1.6.
 */
export const STEP = 0.01;
/**
 * There are varying value types within LineHeightControl:
 *
 * {undefined} Initial value. No changes from the user.
 * {string} Input value. Value consumed/outputted by the input. Empty would be ''.
 * {number} Block attribute type. Input value needs to be converted for attribute setting.
 *
 * Note: If the value is undefined, the input requires it to be an empty string ('')
 * in order to be considered "controlled" by props (rather than internal state).
 */
export const RESET_VALUE = '';

/**
 * Determines if the lineHeight attribute has been properly defined.
 *
 * @param {any} lineHeight The value to check.
 *
 * @return {boolean} Whether the lineHeight attribute is valid.
 */
export function isLineHeightDefined( lineHeight ) {
	return lineHeight !== undefined && lineHeight !== RESET_VALUE;
}
