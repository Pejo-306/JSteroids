/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GameObject from './GameObject.js';

/**
 * Base class for all game objects who are members of a game objects group.
 *
 * This class is an extension of the base GameObject class. The only difference
 * is that the former holds a reference to the a GameObjectsGroup instance.
 *
 * @abstract
 * @class GroupGameObject
 * @extends GameObject
 * @since v1.0.0-alpha
 */
class GroupGameObject extends GameObject {

    /**
     * Consturct group game object.
     *
     * @constructor
     * @since v1.0.0-alpha
     *
     * @throws {TypeError} Cannot construct object of this abstract type.
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game, gameObjectsGroup) {
        if (new.target === GroupGameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GroupGameObject'");
        }

        super(game);

        this.gameObjectsGroup = gameObjectsGroup;
    }

    /**
     * Destroy this group game object.
     *
     * The method's default implementation destroys this game object and
     * removes its reference from its associated GameObjectsGroup.
     *
     * @public
     * @override
     * @method GroupGameObject#destroy
     * @since v1.0.0-alpha
     */
    destroy () {
        this.group.remove(this.sprite, true, true);
        this.gameObjectsGroup.destroyMember(this);
    }

    /**
     * Get reference to associated GameObjectsGroup object's Phaser 3 group.
     *
     * @protected
     * @method GroupGameObject#group
     * @since v1.0.0-alpha
     *
     * @return {Phaser.Physics.Arcade.Group} Phaser 3 physics group.
     */
    get group () {
        return this.gameObjectsGroup.group;
    }

}

export default GroupGameObject;

