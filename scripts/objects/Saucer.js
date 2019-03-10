import 'phaser';

import GroupGameObject from './GroupGameObject.js';

import { generateRandomInteger } from '../helper/random.js';

class Saucer extends GroupGameObject {

    static get MIN_LEVEL () { return 1; }

    static get MAX_LEVEL () { return 2; }

    static get MIN_BASE_VELOCITY () { return 100; }

    static get MAX_BASE_VELOCITY () { return 125; }

    static get MIN_BASE_ANGULAR_VELOCITY () { return 150; }

    static get MAX_BASE_ANGULAR_VELOCITY () { return 200; }

    static get FIRE_RATE () { return 2; }

    static get WRAP_PADDING () { return 32; }

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

    static preload (scene) {
        for (let i = this.MIN_LEVEL; i <= this.MAX_LEVEL; ++i) {
            let number = i.toString().padStart(2, '0');
            scene.load.image(`saucer_${number}`, `assets/sprites/saucer_${number}.png`);
        }
    }

    spawn (x, y) {
        let spriteAsset = `saucer_${this.level.toString().padStart(2, '0')}`;
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

    fireProjectile () {
        this.physicsGroup.projectilesGroup.spawn(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    get levelMultiplier () {
        let multiplier = this.level - this.constructor.MIN_LEVEL + 1;

        return multiplier;
    }

}

export default Saucer;

