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
 * in space and may shoot objects.
 *
 * @class Player
 * @since 0.1.0
 */
class Player extends GameObject {

    /**
     * Starting orientation.
     *
     * @static
     * @method Player.STARTING_ANGLE
     * @since 0.1.0
     *
     * @return {number} The starting angle.
     */
    static get STARTING_ANGLE () { return -90; }

    /**
     * Game object's drag.
     *
     * @static
     * @method Player.DRAG
     * @since 0.1.0
     *
     * @return {number} Drag value.
     */
    static get DRAG () { return 0.99; }

    /**
     * Max velocity of player's physics sprite.
     *
     * @static
     * @method Player.MAX_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Max velocity value.
     */
    static get MAX_VELOCITY () { return 200; }

    /**
     * Angular velocity which is set when rotating the player's sprite.
     *
     * @static
     * @method Player.ANGULAR_VELOCITY
     * @since 0.1.0
     *
     * @return {number} Angular velocity value.
     */
    static get ANGULAR_VELOCITY () { return 200; }
    
    /**
     * Padding added to each world boundary edge.
     *
     * @static
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
    constructor (game) {
        super(game);

        this.dead = false;
    }

    /**
     * Preload resources required by player's game object.
     *
     * @static
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
     * @method Player#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     *
     * @return {Player} This player instance.
     */
    spawn (x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.body.setAllowGravity(false);
        this.sprite.setDamping(true);
        this.sprite.setDrag(this.constructor.DRAG, this.constructor.DRAG);
        this.sprite.body.setMaxVelocity(this.constructor.MAX_VELOCITY);
        this.sprite.angle = this.constructor.STARTING_ANGLE;
        this.dead = false;
        return this;
    }

    /**
     * Player's behavioural code that is executed on each game loop iteration.
     *
     * The player may control his/her object via the cursor keys - accelerate 
     * forwards, as well as rotate in both directions.
     *
     * @method Player#update
     * @since 0.1.0
     */
    update () {
        if (!this.dead) {
            let cursors = this.scene.input.keyboard.createCursorKeys();

            if (cursors.up.isDown) {  // accelerate the player forwards
                this.scene.physics.velocityFromRotation(
                    this.sprite.rotation, 
                    this.constructor.MAX_VELOCITY,
                    this.sprite.body.acceleration
                );
            } else {  // halt the player's acceleration
                this.sprite.setAcceleration(0);
            }

            if (cursors.left.isDown) {  // rotate the player counterclockwise
                this.sprite.setAngularVelocity(-this.constructor.ANGULAR_VELOCITY);
            } else if (cursors.right.isDown) {  // rotate the player clockwise
                this.sprite.setAngularVelocity(this.constructor.ANGULAR_VELOCITY);
            } else {
                this.sprite.setAngularVelocity(0);
            }

            // Keep the player within the physics world bounds.
            this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
        }
    }

    collideWithAsteroid (player, asteroid) {
        this.death();
    }

    death () {
        // TODO: add death animation
        this.dead = true;
        this.sprite.destroy();
        this.scene.killPlayer();
    }

}

export default Player;

