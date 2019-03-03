/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GroupGameObject from './GroupGameObject.js';

/**
 * @classdesc
 * Projectile that may be fired by the player controlled object.
 *
 * Once the player fires a projectile, it is destroyed in one of two
 * possible ways: either the latter self-destructs after some delay, or
 * collides with an asteroid. On collision both the projectile and the 
 * asteroid are destroyed.
 *
 * @class Projectile
 * @extends GropGameObject
 * @since 0.1.0
 */
class Projectile extends GroupGameObject {

    /**
     * Lifespan of spawned projectile.
     *
     * @public
     * @static
     * @readonly
     * @method Projectile.LIFESPAN
     * @since 0.1.0
     *
     * @return {number} Delay before automatic self-destruction.
     */
    static get LIFESPAN () { return 2000; }  // in ms

    /**
     * Maximum allowed velocity of projectile.
     *
     * @public
     * @static
     * @readonly
     * @method Projectile.VELOCITY
     * @since 0.1.0
     *
     * @return {number} Max velocity value.
     */
    static get VELOCITY () { return 500; }

    /**
     * Padding added to each world boundary edge.
     * 
     * @private
     * @static
     * @readonly
     * @method Projectile.WRAP_PADDING
     * @since 0.1.0
     *
     * @return {number} Wrap padding value.
     */
    static get WRAP_PADDING () { return 32; }
    
    /**
     * Construct projectile game object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {PhysicsGroup} physicsGroup - Reference to PhysicsGroup which owns this object.
     */
    constructor (game, physicsGroup) {
        super(game, physicsGroup);
    }

    /**
     * Preload resources required by projectile's game object.
     *
     * @public
     * @static
     * @override
     * @method Projectile.preload
     * @since 0.1.0
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        scene.load.image('projectile', 'assets/sprites/projectile.png');
    }

    /**
     * Spawn a Projectile instance in the game world.
     *
     * The projectile's velocity is set from the get-go. It is also setup
     * for delayed self-destruction.
     *
     * @public
     * @override
     * @method Projectile#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {number} rotationAngle - Starting angle.
     *
     * @return {Projectile} This projectile instance.
     */
    spawn (x, y, rotationAngle) {
        this.sprite = this.group.create(x, y, 'projectile');
        this.sprite.angle = rotationAngle;
        // Set player's velocity based on the given staring orientation angle.
        this.scene.physics.velocityFromRotation(
            this.sprite.rotation,
            this.constructor.VELOCITY,
            this.sprite.body.velocity
        );
        // Setup projectile for self-destruction.
        this.scene.time.addEvent({
            delay: this.constructor.LIFESPAN,
            callback: this.destroy,
            callbackScope: this
        });
        return this;
    }

    /**
     * Projectile's behavioural code that is executed on each game loop iteration.
     *
     * The projectile is kept within the game world's bounds.
     *
     * @public
     * @override
     * @method Projectile#update
     * @since 0.1.0
     */
    update () {
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
    }

    /**
     * Destroy projectile and remove instance reference from projectiles' group.
     *
     * @public
     * @override
     * @method Projectile#destroy
     * @since 0.1.0
     */
    destroy () {
        this.group.remove(this.sprite, true, true);
        this.physicsGroup.destroyMember(this);
    }

}

export default Projectile;

