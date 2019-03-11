/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GameObjectsGroup from './GameObjectsGroup.js';
import Saucer from '../objects/Saucer.js';

/**
 * @classdesc
 * Saucers group to control all saucers.
 *
 * @class SaucersGroup
 * @extends GameObjectsGroup
 * @since v1.0.0-alpha2
 */
class SaucersGroup extends GameObjectsGroup {

    /**
     * Construct saucers group game object.
     *
     * @constructor
     * @since v1.0.0-alpha2
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {GameObjectsGroup} projectilesGroup - Group whose projectiles are fired by saucers.
     */
    constructor (game, projectilesGroup) {
        super(game);

        this.projectilesGroup = projectilesGroup;
        this.group = this.scene.physics.add.group({
            allowGravity: false,
            bounceX: 1,
            bounceY: 1
        });
    }

    /**
     * Preload resources required by all game objects associated with this group.
     *
     * @public
     * @static
     * @override
     * @method SaucersGroup.preload
     * @since v1.0.0-alpha2
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        Saucer.preload(scene);
    }

    /**
     * Spawn a Saucer object and associate it with this group.
     *
     * @public
     * @override
     * @method SaucersGroup#spawn
     * @since v1.0.0-alpha2
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {number} level - Saucer level of new game object.
     *
     * @return {SaucersGroup} This game objects group.
     */
    spawn (x, y, level) {
        let saucer = new Saucer(this.game, this, level);

        saucer.spawn(x, y);
        this.addMember(saucer);
        return this;
    }

}

export default SaucersGroup;

