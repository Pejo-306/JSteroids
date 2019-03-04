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
 * The main representative of the game - the Asteroid object.
 *
 * Asteroids come in several levels. Every next level asteroid is smaller
 * in size but moves faster through the game world.
 *
 * Asteroids are meant to be destroyed by the player via their projectiles.
 *
 * @class Asteroid
 * @extends GroupGameObject
 * @since 0.1.0
 */
class Asteroid extends GroupGameObject {

    /**
     * Minimum allowed level of asteroids.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MIN_LEVEL
     * @since 0.1.0
     *
     * @return {number} Min level of asteroids.
     */
    static get MIN_LEVEL () { return 1; }

    /**
     * Maximum allowed level of asteroids.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MAX_LEVEL
     * @since 0.1.0
     *
     * @return {number} Max level of asteroids.
     */
    static get MAX_LEVEL () { return 3; }

    /**
     * Minimum base velocity of asteroids.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MIN_BASE_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Min value of base velocity.
     */
    static get MIN_BASE_VELOCITY () { return 10; }

    /**
     * Maximum base velocity of asteroids.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MAX_BASE_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Max value of base velocity.
     */
    static get MAX_BASE_VELOCITY () { return 100; }

    /**
     * Minimum base angular velocity of asteroids.
     *
     * Value is used to set the constant rotation of asteroid sprite.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MIN_BASE_ANGULAR_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Min value of base angular velocity.
     */
    static get MIN_BASE_ANGULAR_VELOCITY () { return 50; }

    /**
     * Maximum base angular velocity of asteroids.
     *
     * Value is used to set the constant rotation of asteroid sprite.
     *
     * @public
     * @static
     * @readonly
     * @method Asteroid.MAX_BASE_ANGULAR_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Max value of base angular velocity.
     */
    static get MAX_BASE_ANGULAR_VELOCITY () { return 100; }

    /**
     * Padding added to each world boundary edge.
     * 
     * @private
     * @static
     * @readonly
     * @method Asteroid.WRAP_PADDING
     * @since 0.1.0
     *
     * @return {number} Wrap padding value.
     */
    static get WRAP_PADDING () { return 32; }

    /**
     * Construct asteroid game object.
     *
     * The asteroid's level is passed when constructing its game object. The
     * passed value must ve within the permitted range of [MIN_LEVEL, MAX_LEVEL].
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {PhysicsGroup} physicsGroup - Reference to PhysicsGroup which owns this object.
     * @param {number} level - This asteroid's level.
     *
     * @throws {Error} Passed level must be within the permitted range.
     */
    constructor (game, physicsGroup, level) {
        super(game, physicsGroup);

        let minLevel = this.constructor.MIN_LEVEL;
        let maxLevel = this.constructor.MAX_LEVEL;

        // Assigned level must be within permitted range
        if (level > maxLevel || level < minLevel) {
            throw new Error(`Asteroids can be of levels ${minLevel}-${maxLevel}.`);
        }
        this.level = level;
    }

    /**
     * Preload resources required by asteroid's game object.
     *
     * @public
     * @static
     * @override
     * @method Asteroid.preload
     * @since 0.1.0
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        for (let i = this.MIN_LEVEL; i <= this.MAX_LEVEL; ++i) {
            let number = i.toString().padStart(2, '0');
            scene.load.image(`asteroid_${number}`, `assets/sprites/asteroid_${number}.png`);
        }
    }

    /**
     * Generate a random velocity value.
     *
     * The generated values by this method are to be set to asteroids' velocities.
     *
     * @public
     * @static
     * @method Asteroid.generateVelocityValue
     * @since 0.1.0
     *
     * @param {number} multiplier - Level multiplier of asteroid.
     *
     * @return {number} The newly generated velocity value.
     */
    static generateVelocityValue (multiplier) {
        let velocityValue = generateRandomInteger(
            this.MIN_BASE_VELOCITY * multiplier, 
            this.MAX_BASE_VELOCITY * multiplier
        );

        return velocityValue;
    }

    /**
     * Spawn an Asteroid instance in the game world.
     *
     * The new asteroid's sprite and velocity comply with the asteroid's level.
     * The new game object's sprite is given a constant rotational force. The
     * latter is described via the sprite's angular velocity which is set to
     * a randomly generated value.
     *
     * @public
     * @override
     * @method Asteroid#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {Phaser.Math.Vector2} velocity - Precalcuated velocity of asteroid.
     *
     * @return {Asteroid} This asteroid instance.
     */
    spawn (x, y, velocity = null) {
        let spriteAsset = `asteroid_${this.level.toString().padStart(2, '0')}`;
        let angularVelocity = this.levelMultiplier * generateRandomInteger(
            this.constructor.MIN_BASE_ANGULAR_VELOCITY,
            this.constructor.MAX_BASE_ANGULAR_VELOCITY
        );

        if (velocity == null) {  // randomly calculate velocity on the spot
            velocity = new Phaser.Math.Vector2();
            velocity.x = this.generateVelocityValue();
            velocity.y = this.generateVelocityValue(); 
        }
        this.sprite = this.group.create(x, y, spriteAsset);
        this.sprite.body.velocity = velocity;
        this.sprite.setAngularVelocity(angularVelocity);
        return this;
    }

    /**
     * Asteroid's behavioural code that is executed on each game loop iteration.
     *
     * Asteroids are kept within the game world's bounds.
     *
     * @public
     * @override
     * @method Asteroid#update
     * @since 0.1.0
     */
    update () {
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
    }

    /**
     * Generate a random velocity value for this asteroid.
     *
     * This method is a mirror of its static counterpart. The latter is
     * automatically passed the calling asteroid's level multiplier.
     *
     * @see Asteroid.generateVelocityValue
     *
     * @private
     * @method Asteroid#generateVelocityValue
     * @since 0.1.0
     *
     * @return {number} The newly generated velocity value.
     */
    generateVelocityValue () {
        return this.constructor.generateVelocityValue(this.levelMultiplier);
    }

    /**
     * Get level multiplier for calling asteroid.
     *
     * @private
     * @readonly
     * @method Asteroid#levelMultiplier
     * @since 0.1.0
     *
     * @return {number} The asteroid's level multiplier.
     */
    get levelMultiplier () {
        let multiplier = this.level - this.constructor.MIN_LEVEL + 1;

        return multiplier;
    }

}

export default Asteroid;

