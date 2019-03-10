/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

/**
 * Generate a random integer inside of a specified range.
 *
 * @function generateRandomInteger
 * @since v1.0.0-alpha
 *
 * @param {number} min - Minimum value of interval (inclusive).
 * @param {number} max - Maximum value of interval (inclusive).
 * @param {boolean} signed - Can the generated integer be negative.
 *
 * @returns {number} The new randomly generated value.
 */
export function generateRandomInteger(min, max, signed = true) {
    let sign = signed ? (Math.random() < 0.5 ? -1 : 1) : 1;

    return sign * (Math.floor(Math.random() * (max - min + 1)) + min); 
}

export function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);

    return choices[index];
}

