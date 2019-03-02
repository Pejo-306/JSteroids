import 'phaser';

import GroupGameObject from './GroupGameObject.js';

import { generateRandomInteger } from '../helper/random.js';

class Asteroid extends GroupGameObject {

    static get MIN_LEVEL () { return 1; }

    static get MAX_LEVEL () { return 3; }

    static get MIN_BASE_VELOCITY () { return 10; }

    static get MAX_BASE_VELOCITY () { return 100; }

    static get WRAP_PADDING () { return 32; }

    constructor (game, physicsGroup, level) {
        super(game, physicsGroup);

        let minLevel = this.constructor.MIN_LEVEL;
        let maxLevel = this.constructor.MAX_LEVEL;

        if (level > maxLevel || level < minLevel) {
            throw new Error(`Asteroids can be of levels ${minLevel}-${maxLevel}.`);
        }
        this.level = level;
    }

    static preload (scene) {
        for (let i = this.MIN_LEVEL; i <= this.MAX_LEVEL; ++i) {
            let number = i.toString().padStart(2, '0');
            scene.load.image(`asteroid_${number}`, `assets/sprites/asteroid_${number}.png`);
        }
    }

    spawn (x, y) {
        let velocityX = generateRandomInteger(
            this.constructor.MIN_BASE_VELOCITY * this.levelMultiplier, 
            this.constructor.MAX_BASE_VELOCITY * this.levelMultiplier
        );
        let velocityY = generateRandomInteger(
            this.constructor.MIN_BASE_VELOCITY * this.levelMultiplier,
            this.constructor.MAX_BASE_VELOCITY * this.levelMultiplier
        );
        let spriteAsset = `asteroid_${this.level.toString().padStart(2, '0')}`;

        this.sprite = this.group.create(x, y, spriteAsset);
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setVelocity(velocityX, velocityY);
        return this;
    }

    update () {
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
    }

    get levelMultiplier () {
        let multiplier = this.level - this.constructor.MIN_LEVEL + 1;

        return multiplier;
    }

}

export default Asteroid;

