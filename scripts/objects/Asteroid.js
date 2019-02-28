import 'phaser';

import GameObject from './GameObject.js';
import { generateRandomInteger } from '../helper/random.js';

class Asteroid extends GameObject {

    constructor (game, group) {
        super(game);

        this.group = group;
    }

    static preload (scene) {
        scene.load.image('asteroid_01', 'assets/sprites/asteroid_01.png');
        scene.load.image('asteroid_02', 'assets/sprites/asteroid_02.png');
        scene.load.image('asteroid_03', 'assets/sprites/asteroid_03.png');
    }

    spawn (x, y) {
        let asteroid = this.group.create(x, y, 'asteroid_01');
        let velocityX = generateRandomInteger (10, 100);
        let velocityY = generateRandomInteger(10, 100);

        asteroid.body.setAllowGravity(false);
        asteroid.body.setVelocity(velocityX, velocityY);
    }

    update () {

    }

}

export default Asteroid;

