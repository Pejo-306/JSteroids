/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GameObject from './GameObject.js';

/**
 * @classdesc
 * Player controlled game object.
 *
 * Contains all game logic required to spawn and control the player's 
 * game object. The latter is represented by a spaceship which flies around
 * in space and may shoot at objects.
 *
 * @class Player
 * @since 0.1.0
 */
class Player extends GameObject {

    /**
     * Starting orientation.
     *
     * @public
     * @static
     * @readonly
     * @method Player.STARTING_ANGLE
     * @since 0.1.0
     *
     * @return {number} The starting angle.
     */
    static get STARTING_ANGLE () { return -90; }

    /**
     * Game object's drag.
     *
     * @public
     * @static
     * @readonly
     * @method Player.DRAG
     * @since 0.1.0
     *
     * @return {number} Drag value.
     */
    static get DRAG () { return 0.99; }

    /**
     * Max velocity of player's physics sprite.
     *
     * @public
     * @static
     * @readonly
     * @method Player.MAX_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Max velocity value.
     */
    static get MAX_VELOCITY () { return 200; }

    /**
     * Angular velocity which is set when rotating the player's sprite.
     *
     * @public
     * @static
     * @readonly
     * @method Player.ANGULAR_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Angular velocity value.
     */
    static get ANGULAR_VELOCITY () { return 200; }

    /**
     * Number of projectiles fired per second.
     *
     * @public
     * @static
     * @readonly
     * @method Player.FIRE_RATE
     * @since 0.1.0
     *
     * @return {number} Fire rate.
     */
    static get FIRE_RATE () { return 10; }

    /**
     * Time in which the player is temporary invincible.
     *
     * @public
     * @static
     * @readonly
     * @method Player.INVINCIBILITY_TIME
     * @since 0.1.0
     *
     * @return {number} Invincibility time.
     */
    static get INVINCIBILITY_TIME () { return 2000; }

    /**
     * Time in which the player's sprite is invisible when flashing.
     *
     * @public
     * @static
     * @readonly
     * @method Player.FLASH_TIME
     * @since 0.1.0
     *
     * @return {number} Time in which the player's sprite is invisible.
     */
    static get FLASH_TIME () { return 100; }
    
    /**
     * Padding added to each world boundary edge.
     * 
     * @public
     * @static
     * @readonly
     * @method Player.WRAP_PADDING
     * @since 0.1.0
     *
     * @return {number} Wrap padding value.
     */
    static get WRAP_PADDING () { return 32; }

    /**
     * Construct player's game object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game, projectilesGroup) {
        super(game);

        this.projectilesGroup = projectilesGroup;
        this.dead = false;
        this.canFire = true;
        this.invincible = false;
    }

    /**
     * Preload resources required by player's game object.
     *
     * @public
     * @static
     * @override
     * @method Player.preload
     * @since 0.1.0
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        scene.load.image('player', 'assets/sprites/player.png');
    }

    /**
     * Spawn the Player in the game world.
     *
     * This method creates the game object's physics sprite and sets all
     * appropriate physics related properties.
     *
     * @public
     * @override
     * @method Player#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {boolean} invincible - Give temporary invincibility.
     *
     * @return {Player} This player instance.
     */
    spawn (x, y, invincible = false) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.body.setAllowGravity(false);
        this.sprite.setDamping(true);
        this.sprite.setDrag(this.constructor.DRAG, this.constructor.DRAG);
        this.sprite.body.setMaxVelocity(this.constructor.MAX_VELOCITY);
        this.sprite.angle = this.constructor.STARTING_ANGLE;
        this.dead = false;
        if (this.invincible = invincible) {
            this.scene.time.addEvent({
                delay: this.constructor.INVINCIBILITY_TIME,
                callback: function () { this.invincible = false },
                callbackScope: this
            });
            this.flashSprite();
        }
        return this;
    }

    /**
     * Player's behavioural code that is executed on each game loop iteration.
     *
     * The player may control his/her object via the cursor keys - accelerate 
     * forwards, as well as rotate in both directions.
     *
     * @public
     * @override
     * @method Player#update
     * @since 0.1.0
     */
    update () {
        if (!this.dead) {
            if (this.scene.controls.cursors.up.isDown) {  // accelerate the player forwards
                this.scene.physics.velocityFromRotation(
                    this.sprite.rotation, 
                    this.constructor.MAX_VELOCITY,
                    this.sprite.body.acceleration
                );
            } else {  // halt the player's acceleration
                this.sprite.setAcceleration(0);
            }

            if (this.scene.controls.cursors.left.isDown) {  // rotate the player counterclockwise
                this.sprite.setAngularVelocity(-this.constructor.ANGULAR_VELOCITY);
            } else if (this.scene.controls.cursors.right.isDown) {  // rotate the player clockwise
                this.sprite.setAngularVelocity(this.constructor.ANGULAR_VELOCITY);
            } else {
                this.sprite.setAngularVelocity(0);
            }

            // Fire a projectile
            if (this.scene.controls.spacebar.isDown && this.canFire) {
                this.fireProjectile();
                // Prevent the player firing again until <1 / FIRE_RATE>
                // seconds have passed
                this.canFire = false;
                this.scene.time.addEvent({
                    delay: 1000 / this.constructor.FIRE_RATE,
                    callback: function () { this.canFire = true; },
                    callbackScope: this
                });
            }

            // Keep the player within the physics world bounds
            this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
        }
    }

    /**
     * Destroy player game object.
     *
     * Currently this method does nothing.
     *
     * @public
     * @override
     * @method Player#destroy
     * @since 0.1.0
     */
    destroy () {
        // Do nothing
    }

    /**
     * Fire a projectile forwards.
     *
     * @public
     * @method Player#fireProjectile
     * @since 0.1.0
     */
    fireProjectile () {
        this.projectilesGroup.spawn(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    /**
     * Handle a collision between the player and an asteroid.
     *
     * If the player is not in state of temporary invincibility, the colliding
     * asteroid is destroyed while the player is killed.
     *
     * @public
     * @callback Player~collideWithAsteroid
     * @method Player#collideWithAsteroid
     * @since 0.1.0
     *
     * @param {Phaser.GameObjects.Sprite} playerSprite - The player's colliding sprite.
     * @param {Phaser.GameObjects.Sprite} asteroidSprite - The asteroid's colliding sprite.
     */
    collideWithAsteroid (playerSprite, asteroidSprite) {
        if (!this.invincible) {
            let asteroid = this.scene.gameObjects['asteroids-group'].memberObjects
                .get('sprite', asteroidSprite);

            this.death();
            asteroid.destroy();
        }
    }

    /**
     * Player death.
     *
     * The player is marked as dead and their sprite is destroyed.
     *
     * @private
     * @method Player#death
     * @since 0.1.0
     */
    death () {
        // TODO: add death animation
        this.dead = true;
        this.sprite.destroy();
        this.scene.killPlayer();
    }

    /**
     * Disable the player's sprite.
     *
     * After some dealy time, the player's sprite is shown again.
     *
     * @private
     * @method Player#flashSprite
     * @since 0.1.0
     */
    flashSprite () {
        if (this.invincible) {
            this.sprite.setVisible(false);
            this.scene.time.addEvent({
                delay: this.constructor.FLASH_TIME,
                callback: this.showSprite,
                callbackScope: this
            });
        }
    }

    /**
     * Show the player's sprite.
     *
     * After some dealy time, the player's sprite is hidden again.
     *
     * @private
     * @method Player#showSprite
     * @since 0.1.0
     */
    showSprite () {
        this.sprite.setVisible(true);
        if (this.invincible) {
            this.scene.time.addEvent({
                delay: this.constructor.FLASH_TIME,
                callback: this.flashSprite,
                callbackScope: this
            });
        }
    }

}

export default Player;

