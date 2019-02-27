import 'phaser';

import GameObject from './GameObject.js';

/**
 * Player controlled game object.
 *
 * Contains all the logic required to spawn and control the player's 
 * game object. The latter is represented by a spaceship which flies around
 * in space and may shoot objects.
 */
class Player extends GameObject {

    static get ROTATION_RATE () { return 2; }

    static get ACCELERATION_RATE () { return 60; }

    static get ACCELERATION_LIMIT () { return 30; }

    static get DRAG () { return 80; }

    /**
     * Construct player's game object.
     *
     * @param {Game} game Reference to the Phaser game instance
     */
    constructor (game) {
        super(game);

        this.sprite = null;
    }

    /**
     * Preload resources required by player's game object.
     *
     * @param {Phaser.Scene} scene The current game scene
     */
    static preload (scene) {
        scene.load.image('player', 'assets/sprites/player.png');
    }

    /**
     * Spawn the Player in the game world.
     *
     * This method creates the game object's physics sprite.
     *
     * @param {number} x X coordinates of spawn position
     * @param {number} y Y coordinates of spawn position
     */
    spawn (x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.drag.setTo(this.constructor.DRAG, this.constructor.DRAG);
    }

    /**
     * Player's behavioural code that is executed on each game loop iteration.
     *
     * The player's movement is described in this method. The player controls 
     * his/her object via the cursor keys - they may accelerate forwards, as
     * well as rotate in both directions.
     */
    update () {
        let cursors = this.scene.input.keyboard.createCursorKeys();

        if (cursors.up.isDown) {  // accelerate the player forwards
            let horizontalAcceleration = this.constructor.ACCELERATION_RATE
                * Math.cos(Phaser.Math.DegToRad(this.sprite.angle - 90));
            // The player's horizontal acceleration is capped at the acceleration's limit
            this.sprite.body.acceleration.x = Math.min(
                horizontalAcceleration,
                this.constructor.ACCELERATION_LIMIT
            );

            let verticalAcceleration = this.constructor.ACCELERATION_RATE
                * Math.sin(Phaser.Math.DegToRad(this.sprite.angle - 90));
            // The player's vertical acceleration is capped at the acceleration's limit
            this.sprite.body.acceleration.y = Math.min(
                verticalAcceleration,
                this.constructor.ACCELERATION_LIMIT
            );
        } else {  // halt the player's acceleration
            this.sprite.body.acceleration.x = 0;
            this.sprite.body.acceleration.y = 0;
        }

        if (cursors.left.isDown) {  // rotate the player counterclockwise
            this.sprite.angle -= this.constructor.ROTATION_RATE;
        } else if (cursors.right.isDown) {  // rotate the player clockwise
            this.sprite.angle += this.constructor.ROTATION_RATE;
        }
    }

}

export default Player;

