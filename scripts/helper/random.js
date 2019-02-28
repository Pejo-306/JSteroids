/**
 * Generate a random integer.
 *
 * @param {number} min Minimum value of interval (inclusive)
 * @param {number} max Maximum value of interval (inclusive)
 * @param {boolean} signed Can the generated integer be negative
 * @returns {number}
 */
export function generateRandomInteger(min, max, signed = true) {
    let sign = signed ? (Math.random() < 0.5 ? -1 : 1) : 1;

    return sign * (Math.floor(Math.random() * (max - min + 1)) + min); 
}

