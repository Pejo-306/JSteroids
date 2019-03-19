/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import BitmapTextButton from './BitmapTextButton.js';

/**
 * @classdesc
 * Text button for UI menu.
 *
 * This button uses a bitmap font to visualize its contents.
 *
 * @class MenuTextButton
 * @extends BitmapTextButton
 * @since v1.0.0
 * @version v1.0.0
 */
class MenuTextButton extends BitmapTextButton {

    /**
     * Construct menu text button.
     *
     * @constructor
     * @since v1.0.0
     * @version v1.0.0
     *
     * @param {Phaser.Scene} scene - The scene to which this game object belongs.
     * @param {number} x - X coordinates of game object in world.
     * @param {number} y - Y coordinates of game object in world.
     * @param {string} font - Key of the font to use from the Bitmap Font cache.
     * @param {string|array<string>} text - Contents of this button.
     * @param {number} size - Font size of bitmap text.
     * @param {align} align - The alignment of the text in a multi-line BitmapText object.
     * @param {function} callback - Callback function to call on button click.
     */
    constructor (scene, x, y, font, text, size, align, callback) {
        super(scene, x, y, font, text, size, align, callback);
    }

    /**
     * Executed actions when hovering over button.
     *
     * Does nothing as of now.
     *
     * @protected
     * @override
     * @method MenuTextButton#enterButtonHoverState
     * @since v1.0.0
     * @version v1.0.0
     */
    enterButtonHoverState () {
        // do nothing
    }

    /**
     * Executed actions when button is in idle state.
     *
     * Does nothing as of now.
     *
     * @protected
     * @override
     * @method MenuTextButton#enterButtonRestState
     * @since v1.0.0
     * @version v1.0.0
     */
    enterButtonRestState () {
        // do nothing
    }

    /**
     * Executed actions when button is pressed.
     *
     * Does nothing as of now.
     *
     * @protected
     * @abstract
     * @method MenuTextButton#enterButtonActiveState
     * @since v1.0.0
     * @version v1.0.0
     */
    enterButtonActiveState () {
        // do nothing
    }

}

export default MenuTextButton;

