/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

/**
 * @classdesc
 * Group of game objects which provides a common interface to a Phaser 3 physics group.
 *
 * The essence of this class is to hold a reference to a Phaser 3 physics
 * group, as well as provide an interface through which said group could
 * be manipulated. Furthermore, this class holds not only a physics group of
 * sprites, but also a set of all members - GameObject instances associated 
 * with the current group. Again, the latter can be manipulated via the
 * provided interface.
 *
 * @abstract
 * @class GameObjectsGroup
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha2
 */
class GameObjectsGroup {

    /**
     * Construct game objects group object.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha2
     *
     * @param {Game} game - Reference to the Phaser game instance.
     *
     * @throws {TypeError} Cannot construct object of this abstract type.
     */
    constructor (game) {
        if (new.target === GameObjectsGroup) {
            throw new TypeError("Cannot construct object of abstract type 'GameObjectsGroup'");
        }

        this.game = game;
        this.group = null;
        this.memberObjects = new Phaser.Structs.Set();
    }

    /**
     * Preload resources required by members of the group.
     *
     * @public
     * @abstract
     * @static
     * @method GameObjectsGroup.preload
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
     * Spawn a member object and associate it with this group.
     *
     * @public
     * @abstract
     * @method GameObjectsGroup#spawn
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @throws {Error} Must be implemented by subclass.
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     */
    spawn (x, y) {
        throw new Error(`${this.name}: must implement abstract method spawn()`);
    }

    /**
     * GameObjectsGroup's descendant behavioural code that is executed on each game loop iteration.
     *
     * The method's default implementation calls each member's 'update()' method.
     *
     * @public
     * @method GameObjectsGroup#update
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     */
    update () {
        for (let member of this.memberObjects.entries) {
            member.update();
        }
    }

    /**
     * Associate a new game object as a member of the group.
     *
     * @public
     * @method GameObjectsGroup#addMember
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha2
     *
     * @param {GameObject} gameObject - New addition to the group's member list.
     *
     * @return {GameObjectsGroup} This game objects group.
     */
    addMember (gameObject) {
        this.memberObjects.set(gameObject);
        return this;
    }

    /**
     * Destroy a specified member of the group.
     *
     * @public
     * @method GameObjectsGroup#destroyMember
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha2
     *
     * @param {GameObject} memberObject - Member object to be removed.
     *
     * @return {GameObjectsGroup} This game objects group.
     */
    destroyMember (memberObject) {
        this.memberObjects.delete(memberObject); 
        return this;
    }

    /**
     * Get the current game scene.
     *
     * @protected
     * @method GameObjectsGroup#scene
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @return {Phaser.Scene} The currently loaded game scene.
     */
    get scene () {
        return this.game.currentScene;
    }

}

export default GameObjectsGroup;

