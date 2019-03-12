/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GameObjectsGroup from './GameObjectsGroup.js';
import Explosion from '../objects/Explosion.js';

/**
 * @classdesc
 * Explosions group to hold all Explosion game objects.
 *
 * @class ExplosionsGroup
 * @extends GameObjectsGroup
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
class ExplosionsGroup extends GameObjectsGroup {

    /**
     * Construct explosions group game object.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.staticGroup({
            allowGravity: false
        });
    }

    /**
     * Preload resources required by all game objects associated with this group.
     *
     * @public
     * @static
     * @override
     * @method ExplosionsGroup.preload
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        Explosion.preload(scene);
    }

    /**
     * Spawn an Explosion object and associate it with this group.
     *
     * @public
     * @override
     * @method ExplosionsGroup#spawn
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     *
     * @return {ExplosionsGroup} This game objects group.
     */
    spawn (x, y) {
        let explosion = new Explosion(this.game, this);

        explosion.spawn(x, y);
        this.addMember(explosion);
        return this;
    }

    /**
     * Spawn an Explosion object in between two game objects.
     *
     * @public
     * @method ExplosionsGroup#spawnExplosionsBetweenObjects
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {GameObject} gameObject1 - First game object.
     * @param {GameObject} gameObject2 - Second game object.
     *
     * @return {ExplosionsGroup} This game objects group.
     */
    spawnExplosionBetweenObjects (gameObject1, gameObject2) {
        let explosionX = (gameObject1.sprite.x + gameObject2.sprite.x) / 2;
        let explosionY = (gameObject1.sprite.y + gameObject2.sprite.y) / 2;

        this.spawn(explosionX, explosionY);
        return this;
    }

}

export default ExplosionsGroup;

