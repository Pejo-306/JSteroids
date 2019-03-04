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
 * @class PhysicsGroup
 * @since 0.1.0
 */
class PhysicsGroup {

    /**
     * Construct physics group object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     *
     * @throws {TypeError} Cannot construct object of this abstract type.
     */
    constructor (game) {
        if (new.target === PhysicsGroup) {
            throw new TypeError("Cannot construct object of abstract type 'PhysicsGroup'");
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
     * @method PhysicsGroup.preload
     * @since 0.1.0
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
     * @method PhysicsGroup#spawn
     * @since 0.1.0
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
     * PhysicsGroup's descendant behavioural code that is executed on each game loop iteration.
     *
     * The method's default implementation calls each member's 'update()' method.
     *
     * @public
     * @method PhysicsGroup#update
     * @since 0.1.0
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
     * @method PhysicsGroup#addMember
     * @since 0.1.0
     *
     * @param {GameObject} gameObject - New addition to the group's member list.
     */
    addMember (gameObject) {
        this.memberObjects.set(gameObject);
    }

    /**
     * Destroy a specified member of the group.
     *
     * @public
     * @method PhysicsGroup#destroyMember
     * @since 0.1.0
     *
     * @param {GameObject} memberObject - Member object to be removed.
     */
    destroyMember (memberObject) {
        this.memberObjects.delete(memberObject); 
    }

    /**
     * Get the current game scene.
     *
     * @protected
     * @method PhysicsGroup#scene
     * @since 0.1.0
     *
     * @return {Phaser.Scene} The currently loaded game scene.
     */
    get scene () {
        return this.game.currentScene;
    }
}

export default PhysicsGroup;

