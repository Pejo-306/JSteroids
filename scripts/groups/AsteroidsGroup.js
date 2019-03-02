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

    spawn (x, y, level, velocity = null) {
        let asteroid = new Asteroid(this.game, this, level);

        asteroid.spawn(x, y, velocity);
        this.addMember(asteroid);
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

    destroyMember (memberObject) {
        let newAsteroidsLevel = memberObject.level + 1;
        
        if (newAsteroidsLevel <= Asteroid.MAX_LEVEL) {
            let velocity = new Phaser.Math.Vector2(
                Asteroid.generateVelocityValue(newAsteroidsLevel),
                Asteroid.generateVelocityValue(newAsteroidsLevel)
            );
            let oppositeVelocity = new Phaser.Math.Vector2(-velocity.x, -velocity.y);

            this.spawn(memberObject.sprite.x, memberObject.sprite.y, newAsteroidsLevel, velocity);
            this.spawn(memberObject.sprite.x, memberObject.sprite.y, newAsteroidsLevel, oppositeVelocity);
        }
        super.destroyMember(memberObject);
    }

    update () {
        for (let asteroid of this.memberObjects.entries) {
            asteroid.update();
        }
    }

}

export default AsteroidsGroup;

