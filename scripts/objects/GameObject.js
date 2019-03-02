import 'phaser';

/**
 * (abstract) Base class for all game objects.
 *
 * This abstract class mainly declares some common interface methods that
 * should be implemented by every game object. Attempting to create an instance
 * of this class or calling an interface method throws an error.
 */
class GameObject {

    /**
     * Consturct game object.
     *
     * Each game object holds a reference to the Phaser game instance.
     *
     * Since this class is abstract in nature, attempting to create an instance
     * of this base GameObject class throws an error.
     *
     * @param {Game} game Reference to the Phaser game instance
     */
    constructor (game) {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GameObject'");
        }

        this.game = game;
        this.sprite = null;
    }

    /**
     * (abstract) Preload all resources needed by the game object.
     *
     * @param {Phaser.Scene} scene The current game scene
     */
    static preload (scene) {
        throw new Error(`${this.name}: must implement abstract static method preload()`);
    }

    /**
     * (abstract) Spawn game object in the game world.
     *
     * @param {number} x X coordinates of spawn position
     * @param {number} y Y coordinates of spawn position
     */
    spawn (x, y) {
        throw new Error(`${this.constructor.name}: must implement abstract method spawn()`);
    }

    /**
     * (abstract) Game object's behavioural code. Executed on each game loop iteration.
     *
     * This is where game object controls, as well as dynamic manipulation in
     * general should go.
     */
    update () {
        throw new Error(`${this.constructor.name}: must implement abstract method update()`);
    }

    destroy () {
        throw new Error(`${this.constructor.name}: must implement abstract method destroy()`);
    }

    /**
     * Get current game scene.
     *
     * This method is intended to be used within the derived game object's
     * implementation.
     */
    get scene () {
        return this.game.currentScene;
    }

}

export default GameObject;

