/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GameObject from './GameObject.js';

/**
 * Base class for all game objects who are members of a physics group.
 *
 * This class is an extension of the base GameObject class. The only difference
 * is that the former holds a reference to the a PhysicsGroup instance.
 *
 * @abstract
 * @class GroupGameObject
 * @extends GameObject
 * @since 0.1.0
 */
class GroupGameObject extends GameObject {

    /**
     * Consturct group game object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @throws {TypeError} Cannot construct object of this abstract type.
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game, physicsGroup) {
        if (new.target === GroupGameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GroupGameObject'");
        }

        super(game);

        this.physicsGroup = physicsGroup;
    }

    /**
     * Destroy this group game object.
     *
     * The method's default implementation destroys this game object and
     * removes its reference from its associated PhysicsGroup.
     *
     * @public
     * @override
     * @method GroupGameObject#destroy
     * @since 0.1.0
     */
    destroy () {
        this.group.remove(this.sprite, true, true);
        this.physicsGroup.destroyMember(this);
    }

    /**
     * Get reference to associated PhysicsGroup object's Phaser 3 group.
     *
     * @protected
     * @method GroupGameObject#group
     * @since 0.1.0
     *
     * @return {Phaser.Physics.Arcade.Group} Phaser 3 physics group.
     */
    get group () {
        return this.physicsGroup.group;
    }

}

export default GroupGameObject;

