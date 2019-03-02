import 'phaser';

import GroupGameObject from './GroupGameObject.js';
import { generateRandomInteger } from '../helper/random.js';

class Asteroid extends GroupGameObject {

    static get WRAP_PADDING () { return 32; }

    constructor (game, group) {
        super(game, group);
    }

    static preload (scene) {
        scene.load.image('asteroid_01', 'assets/sprites/asteroid_01.png');
        scene.load.image('asteroid_02', 'assets/sprites/asteroid_02.png');
        scene.load.image('asteroid_03', 'assets/sprites/asteroid_03.png');
    }

    spawn (x, y) {
        let velocityX = generateRandomInteger (10, 100);
        let velocityY = generateRandomInteger(10, 100);

        this.sprite = this.group.create(x, y, 'asteroid_01');
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setVelocity(velocityX, velocityY);
        return this;
    }

    update () {
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
    }

}

export default Asteroid;

