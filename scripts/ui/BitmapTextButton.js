/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

/**
 * @classdesc
 * A text button which utilizes a btimap font for visualization.
 *
 * This abstract class is in essence an interactive bitmap text. When clicked
 * a user defined callback is called. The button has several button states
 * which are left to be implemented by a subclass.
 *
 * @abstract
 * @class BitmapTextButton
 * @extends Phaser.GameObjects.BitmapText
 * @since v1.0.0
 * @version v1.0.0
 */
class BitmapTextButton extends Phaser.GameObjects.BitmapText {

    /**
     * Construct bitmap text button.
     *
     * The text object's origin is automatically centered.
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
        super(scene, x, y, font, text, size, align);

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => { 
                this.enterButtonHoverState();
                callback();
            });
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);  // add button to passed scene
    }

    /**
     * Executed actions when hovering over button.
     *
     * @protected
     * @abstract
     * @method BitmapTextButton#enterButtonHoverState
     * @since v1.0.0
     * @version v1.0.0
     *
     * @throws {Error} Must be implemented by subclass.
     */
    enterButtonHoverState () {
        throw new Error(`${this.constructor.name}: must implement abstract method enterButtonHoverState()`);
    }

    /**
     * Executed actions when button is in idle state.
     *
     * @protected
     * @abstract
     * @method BitmapTextButton#enterButtonRestState
     * @since v1.0.0
     * @version v1.0.0
     *
     * @throws {Error} Must be implemented by subclass.
     */
    enterButtonRestState () {
        throw new Error(`${this.constructor.name}: must implement abstract method enterButtonRestState()`);
    }

    /**
     * Executed actions when button is pressed.
     *
     * @protected
     * @abstract
     * @method BitmapTextButton#enterButtonActiveState
     * @since v1.0.0
     * @version v1.0.0
     *
     * @throws {Error} Must be implemented by subclass.
     */
    enterButtonActiveState () {
        throw new Error(`${this.constructor.name}: must implement abstract method enterButtonActiveState()`);
    }

}

export default BitmapTextButton;

