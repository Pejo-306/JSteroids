/** 
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */
import 'phaser';

import GameObjectsGroup from './GameObjectsGroup.js';
import Projectile from '../objects/Projectile.js';

/**
 * @classdesc
 * Projectile group to hold all Projectile game objects.
 *
 * @class ProjectilesGroup
 * @extends GameObjectsGroup
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha2
 */
class ProjectilesGroup extends GameObjectsGroup {

    /**
     * Construct projectiles group game object.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha2
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {string} projectileSprite - Name of projectile sprite.
     */
    constructor (game, projectileSprite) {
        super(game);

        this.group = this.scene.physics.add.group({
            allowGravity: false
        });
        this.projectileSprite = projectileSprite;
    }

    /**
     * Preload resources required by all game objects associated with this group.
     *
     * @public
     * @static
     * @override
     * @method ProjectilesGroup.preload
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
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
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha2
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {number} rotationAngle - Starting angle set to the new projectile.
     *
     * @return {ProjectilesGroup} This game objects group.
     */
    spawn (x, y, rotationAngle) {
        let projectile = new Projectile(this.game, this, this.projectileSprite);

        projectile.spawn(x, y, rotationAngle);
        this.addMember(projectile);
        return this;
    }

}

export default ProjectilesGroup;

