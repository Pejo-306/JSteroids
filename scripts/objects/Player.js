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

    static get STARTING_ANGLE () { return -90; }

    static get DRAG () { return 50; }

    static get MAX_VELOCITY () { return 200; }

    static get ANGULAR_VELOCITY () { return 200; }

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
        this.sprite.setDrag(this.constructor.DRAG);
        this.sprite.body.setMaxVelocity(this.constructor.MAX_VELOCITY);
        this.sprite.angle = this.constructor.STARTING_ANGLE;
    }

    /**
     * Player's behavioural code that is executed on each game loop iteration.
     *
     * The player may control his/her object via the cursor keys - accelerate 
     * forwards, as well as rotate in both directions.
     */
    update () {
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
    }

}

export default Player;

