import 'phaser';

import PhysicsGroup from './PhysicsGroup.js';
import Asteroid from '../objects/Asteroid.js';

import KeepoutZone from '../helper/KeepoutZone.js';
import { generateRandomInteger } from '../helper/random.js';

class AsteroidsGroup extends PhysicsGroup {

    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.group();
    }

    static preload (scene) {
        Asteroid.preload(scene);
    }

    spawn (x, y, level) {
        let asteroid = new Asteroid(this.game, this.group, level);

        asteroid.spawn(x, y);
        this.gameObjects.add(asteroid);
    }

    spawnMultiple (numOfAsteroids, radii, keepoutZones = []) {
        let positionX;
        let positionY;

        for (let i = 0; i < numOfAsteroids; ++i) {
            do {
                positionX = generateRandomInteger(0, this.scene.physics.world.bounds.width, false);
                positionY = generateRandomInteger(0, this.scene.physics.world.bounds.height, false);
            }
            while (keepoutZones.some(function (zone) { 
                return zone.contains(positionX, positionY); 
            }));
            let level = generateRandomInteger(Asteroid.MIN_LEVEL, Asteroid.MAX_LEVEL, false);
            keepoutZones.push(new KeepoutZone(positionX, positionY, radii[level-1]));
            this.spawn(positionX, positionY, level);
        }
    }

    update () {
        for (let asteroid of this.gameObjects) {
            asteroid.update();
        }
    }

}

export default AsteroidsGroup;

