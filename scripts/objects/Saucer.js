/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GroupGameObject from './GroupGameObject.js';

import { generateRandomInteger } from '../helper/random.js';

/**
 * @classdesc
 * Saucers are the player's enemy.
 *
 * Saucers occur periodically to attempt to destroy the player's spaceship.
 * They roam freely in random directions, spinning continiously and 
 * firing projectiles periodically. Saucers collide with asteroids but can
 * only destroy the latter with their projectiles. On collision with the
 * player's spaceship both game objects are immediately destroyed.
 *
 * @class Saucer
 * @extends GroupGameObject
 * @since v1.0.0-alpha2
 */
class Saucer extends GroupGameObject {

    /**
     * Minimum allowed level of saucers.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MIN_LEVEL
     * @since v1.0.0-alpha2
     *
     * @return {number} Min level of saucers.
     */
    static get MIN_LEVEL () { return 1; }

    /**
     * Maximum allowed level of saucers.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MAX_LEVEL
     * @since v1.0.0-alpha2
     *
     * @return {number} Max level of saucers.
     */
    static get MAX_LEVEL () { return 2; }

    /**
     * Minimum base velocity of saucers.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MIN_BASE_VELOCITY
     * @since v1.0.0-alpha2
     *
     * @return {number} Min value of base velocity.
     */
    static get MIN_BASE_VELOCITY () { return 100; }

    /**
     * Maximum base velocity of saucers.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MAX_BASE_VELOCITY
     * @since v1.0.0-alpha2
     *
     * @return {number} Max value of base velocity.
     */
    static get MAX_BASE_VELOCITY () { return 125; }

    /**
     * Minimum base angular velocity of saucers.
     *
     * Value is used to set the constant rotation of saucer sprites.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MIN_BASE_ANGULAR_VELOCITY
     * @since v1.0.0-alpha2
     *
     * @return {number} Min value of base angular velocity.
     */
    static get MIN_BASE_ANGULAR_VELOCITY () { return 150; }

    /**
     * Maximum base angular velocity of saucers.
     *
     * Value is used to set the constant rotation of saucer sprites.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.MAX_BASE_ANGULAR_VELOCITY
     * @since v1.0.0-alpha2
     *
     * @return {number} Max value of base angular velocity.
     */
    static get MAX_BASE_ANGULAR_VELOCITY () { return 200; }

    /**
     * Number of projectiles fired per second.
     *
     * @public
     * @static
     * @readonly
     * @method Saucer.FIRE_RATE
     * @since v1.0.0-alpha2
     *
     * @return {number} Fire rate.
     */
    static get FIRE_RATE () { return 2; }

    /**
     * Padding added to each world boundary edge.
     * 
     * @private
     * @static
     * @readonly
     * @method Saucer.WRAP_PADDING
     * @since v1.0.0-alpha2
     *
     * @return {number} Wrap padding value.
     */
    static get WRAP_PADDING () { return 32; }

    /**
     * Construct saucer game object.
     *
     * The saucer's level is passed when constructing its game object. The
     * passed value must ve within the permitted range of [MIN_LEVEL, MAX_LEVEL].
     *
     * @constructor
     * @since v1.0.0-alpha2
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {PhysicsGroup} physicsGroup - Reference to PhysicsGroup which owns this object.
     * @param {number} level - This saucer's level.
     *
     * @throws {Error} Passed level must be within the permitted range.
     */
    constructor (game, physicsGroup, level) {
        super(game, physicsGroup);

        let minLevel = this.constructor.MIN_LEVEL;
        let maxLevel = this.constructor.MAX_LEVEL;

        // Assigned level must be within permitted range
        if (level > maxLevel || level < minLevel) {
            throw new Error(`Saucers can be of levels ${minLevel}-${maxLevel}.`);
        }
        this.level = level;
        this.canFire = true;
    }

    /**
     * Preload resources required by saucer's game object.
     *
     * @public
     * @static
     * @override
     * @method Saucer.preload
     * @since v1.0.0-alpha2
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        for (let i = this.MIN_LEVEL; i <= this.MAX_LEVEL; ++i) {
            let number = i.toString().padStart(2, '0');
            scene.load.image(`saucer_${number}`, `assets/sprites/saucer_${number}.png`);
        }
    }

    /**
     * Spawn a Saucer game object in the game world.
     *
     * The new saucer sets off in a random direction with a random velocity.
     * Furthermore, the saucer is set to constantly spin in one direction.
     * Both the new instance's sprite and various velocity values comply with
     * the sauce's level.
     *
     * @public
     * @override
     * @method Saucer#spawn
     * @since v1.0.0-alpha2
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     *
     * @return {Saucer} This saucer instance.
     */
    spawn (x, y) {
        let spriteAsset = `saucer_${this.level.toString().padStart(2, '0')}`;
        // Generate random velocity values
        let horizontalVelocity = this.levelMultiplier * generateRandomInteger(
            this.constructor.MIN_BASE_VELOCITY,
            this.constructor.MAX_BASE_VELOCITY
        );
        let verticalVelocity = this.levelMultiplier * generateRandomInteger(
            this.constructor.MIN_BASE_VELOCITY,
            this.constructor.MAX_BASE_VELOCITY
        );
        let angularVelocity = this.levelMultiplier * generateRandomInteger(
            this.constructor.MIN_BASE_ANGULAR_VELOCITY,
            this.constructor.MAX_BASE_ANGULAR_VELOCITY
        );

        this.sprite = this.group.create(x, y, spriteAsset);
        this.sprite.body.velocity.x = horizontalVelocity;
        this.sprite.body.velocity.y = verticalVelocity;
        this.sprite.setAngularVelocity(angularVelocity);
        return this;
    }

    /**
     * Saucer's behavioural code that is executed on each game loop iteration.
     *
     * Saucers periodically fire off projectiles in the forward direction. The
     * higher the saucer level the higher the fire rate (projectiles fired per
     * second).
     *
     * @public
     * @override
     * @method Saucer#update
     * @since v1.0.0-alpha2
     */
    update () {
        // Fire a projectile
        if (this.canFire) {
            this.fireProjectile();
            // Prevent the saucer from firing again until <1 / FIRE_RATE>
            // seconds have passed
            this.canFire = false;
            this.scene.time.addEvent({
                delay: 1000 / (this.constructor.FIRE_RATE * this.levelMultiplier),
                callback: function () { this.canFire = true; },
                callbackScope: this
            });
        }

        // Keep saucers within the physics world bounds
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
    }

    /**
     * Fire a projectile forwards.
     *
     * @private
     * @method Saucer#fireProjectile
     * @since v1.0.0-alpha2
     */
    fireProjectile () {
        this.physicsGroup.projectilesGroup.spawn(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    /**
     * Get level multiplier for calling saucer.
     *
     * @private
     * @readonly
     * @method Saucer#levelMultiplier
     * @since v1.0.0-alpha2
     *
     * @return {number} The saucer's level multiplier.
     */
    get levelMultiplier () {
        let multiplier = this.level - this.constructor.MIN_LEVEL + 1;

        return multiplier;
    }

}

export default Saucer;

