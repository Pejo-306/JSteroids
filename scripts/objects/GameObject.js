/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

/**
 * @classdesc
 * Base class for all game objects.
 *
 * This abstract class declares some common interface methods that should be 
 * implemented by every game object. This includes: preloading all required
 * assets for objects of this type, spawning the object inside the game world, 
 * executing its behavioral code every game loop iteration, destroying the
 * game object and removing it from the game world.
 *
 * Attempting to create an instance of this class or calling an interface 
 * method throws an error.
 *
 * @abstract
 * @class GameObject
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
class GameObject {

    /**
     * Consturct game object.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {TypeError} Cannot construct object of this abstract type.
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game) {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GameObject'");
        }

        this.game = game;
        this.sprite = null;
    }

    /**
     * Preload all resources needed by the game object.
     *
     * @public
     * @abstract
     * @static
     * @method GameObject.preload
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {Error} Must be implemented by subclass.
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        throw new Error(`${this.name}: must implement abstract static method preload()`);
    }

    /**
     * Spawn game object in the game world.
     *
     * @public
     * @abstract
     * @method GameObject#spawn
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {Error} Must be implemented by subclass.
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     */
    spawn (x, y) {
        throw new Error(`${this.constructor.name}: must implement abstract method spawn()`);
    }

    /**
     * Game object's behavioural code. Executed on each game loop iteration.
     *
     * This is where game object controls, as well as dynamic manipulation in
     * general should go.
     *
     * @public
     * @abstract
     * @method GameObject#update
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {Error} Must be implemented by subclass.
     */
    update () {
        throw new Error(`${this.constructor.name}: must implement abstract method update()`);
    }

    /**
     * Destroy this game object and all of its associated assets.
     *
     * @public
     * @abstract
     * @method GameObject#destroy
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {Error} Must be implemented by subclass.
     */
    destroy () {
        throw new Error(`${this.constructor.name}: must implement abstract method destroy()`);
    }

    /**
     * Get current game scene.
     *
     * @protected
     * @method GameObject#scene
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @return {Phaser.Scene} The currently loaded game scene.
     */
    get scene () {
        return this.game.currentScene;
    }

}

export default GameObject;

