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

    spawn (x, y) {
        let asteroid = new Asteroid(this.game, this.group);

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
            keepoutZones.push(new KeepoutZone(positionX, positionY, radii[0]));
            this.spawn(positionX, positionY);
        }
    }

    update () {
        for (let asteroid of this.gameObjects) {
            asteroid.update();
        }
    }

}

export default AsteroidsGroup;

