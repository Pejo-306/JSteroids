/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */
import 'phaser';

import PhysicsGroup from './PhysicsGroup.js';
import Projectile from '../objects/Projectile.js';

/**
 * @classdesc
 * Projectile group to hold all Projectile game objects.
 *
 * @class ProjectilesGroup
 * @extends PhysicsGroup
 * @since 0.1.0
 */
class ProjectilesGroup extends PhysicsGroup {

    /**
     * Construct projectiles group game object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.group({
            allowGravity: false
        });
    }

    /**
     * Preload resources required by all game objects associated with this group.
     *
     * @public
     * @static
     * @override
     * @method ProjectilesGroup.preload
     * @since 0.1.0
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        Projectile.preload(scene);
    }

    /**
     * Spawn a Projectile object and associate it with this group.
     *
     * @public
     * @override
     * @method ProjectilesGroup#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {number} rotationAngle - Starting angle set to the new projectile.
     *
     * @return {ProjectilesGroup} This physics group.
     */
    spawn (x, y, rotationAngle) {
        let projectile = new Projectile(this.game, this);

        projectile.spawn(x, y, rotationAngle);
        this.addMember(projectile);
        return this;
    }

}

export default ProjectilesGroup;

