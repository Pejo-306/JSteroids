/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import GroupGameObject from './GroupGameObject.js';

/**
 * @classdesc
 * Explosion VFX.
 *
 * This VFX is used when either the player destroys asteroids, or is
 * destroyed by one.
 *
 * @class Explosion 
 * @extends GroupGameObject
 * @since v1.0.0-alpha
 */
class Explosion extends GroupGameObject {

    /**
     * Number of frames in explosion's spritesheet.
     *
     * @public
     * @static
     * @readonly
     * @method Explosion.SPRITESHEET_FRAMES
     * @since v1.0.0-alpha
     *
     * @return {number} Number of spritesheet frames.
     */
    static get SPRITESHEET_FRAMES() { return 12; }

    /**
     * Frame rate of explosion animation.
     *
     * @public
     * @static
     * @readonly
     * @method Explosion.FRAME_RATE
     * @since v1.0.0-alpha
     *
     * @return {number} Frame rate of explosion animation.
     */
    static get FRAME_RATE() { return 12; }

    /**
     * Construct explosion game object.
     *
     * @constructor
     * @since v1.0.0-alpha
     *
     * @param {Game} game - Reference to the Phaser game instance.
     * @param {PhysicsGroup} physicsGroup - Reference to PhysicsGroup which owns this object.
     */
    constructor (game, physicsGroup) {
        super(game, physicsGroup);
    }

    /**
     * Preload resources required by explosion's game object.
     *
     * @public
     * @static
     * @override
     * @method Explosion.preload
     * @since v1.0.0-alpha
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        scene.load.spritesheet(
            'explosion-spritesheet',
            'assets/sprites/explosion-spritesheet.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    /**
     * Spawn an Explosion instance in the game world.
     *
     * After spawning, the explosion's animation immediately stars playing.
     * On completion the newly created Explosion instance is permanently destroyed.
     *
     * @public
     * @override
     * @method Explosion#spawn
     * @since v1.0.0-alpha
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     *
     * @return {Explosion} This explosion instance.
     */
    spawn (x, y) {
        this.sprite = this.group.create(x, y, 'explosion-spritesheet');
        this.setupAnimation();
        this.sprite.on('animationcomplete', this.destroy, this);
        this.sprite.play('explosion', true);
        return this;
    }

    /**
     * Explosion's behavioural code that is executed on each game loop iteration.
     *
     * This method does nothing.
     *
     * @public
     * @override
     * @method Explosion#update
     * @since v1.0.0-alpha
     */
    update () {
        // Do nothing
    }

    /**
     * Setup explosion animation.
     *
     * @private
     * @method Explosion#setupAnimation
     * @since v1.0.0-alpha
     */
    setupAnimation () {
        this.scene.anims.create({
            key: 'explosion',
            frames: this.scene.anims.generateFrameNumbers(
                'explosion-spritesheet',
                { start: 0, end: this.constructor.SPRITESHEET_FRAMES - 1 }
            ),
            frameRate: this.constructor.FRAME_RATE
        });
    }

}

export default Explosion;

