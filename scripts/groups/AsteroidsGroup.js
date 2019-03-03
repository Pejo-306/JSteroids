/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import PhysicsGroup from './PhysicsGroup.js';
import Asteroid from '../objects/Asteroid.js';

import KeepoutZone from '../helper/KeepoutZone.js';
import { generateRandomInteger } from '../helper/random.js';

/**
 * @classdesc
 * Asteroids group to hold all Asteroid game objects.
 *
 * @class AsteroidsGroup
 * @extends PhysicsGroup
 * @since 0.1.0
 */
class AsteroidsGroup extends PhysicsGroup {

    /**
     * Construct asteroids group game object.
     *
     * @constructor
     * @since 0.1.0
     *
     * @param {Game} game - Reference to the Phaser game instance.
     */
    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.group({
            allowGravity: false
        });
    }

    /**
     * Preload resources required by all game objects associated with this group.
     *
     * @public
     * @static
     * @override
     * @method AsteroidsGroup.preload
     * @since 0.1.0
     *
     * @param {Phaser.Scene} scene - The current game scene.
     */
    static preload (scene) {
        Asteroid.preload(scene);
    }

    /**
     * Spawn an Asteroid object and associate it with this group.
     *
     * @public
     * @override
     * @method AsteroidsGroup#spawn
     * @since 0.1.0
     *
     * @param {number} x - X coordinates of spawn position.
     * @param {number} y - Y coordinates of spawn position.
     * @param {number} level - Asteroid level of new game object.
     * @param {Phaser.Math.Vector2} velocity - Precalcuated velocity of asteroid.
     *
     * @return {AsteroidsGroup} This physics group.
     */
    spawn (x, y, level, velocity = null) {
        let asteroid = new Asteroid(this.game, this, level);

        asteroid.spawn(x, y, velocity);
        this.addMember(asteroid);
        return this;
    }

    /**
     * Spawn multiple asteroids simultaneously.
     *
     * Asteroids may not spawn near one another. This is accomplished via
     * 'keepout zones' which are in essence circles with different radii.
     * A new one is created for each new Asteroid instance. Asteroids may not 
     * spawn within the bounds of existing keepout zones.
     *
     * @public
     * @method AsteroidsGroup#spawnMultiple
     * @since 0.1.0
     *
     * @param {number} numOfAsteroids - Number of asteroids to spawn.
     * @param {array} radii - Keepout zones' radii for different asteroids levels.
     * @param {array} keepoutZones - Additional keepout zones.
     *
     * @return {AsteroidsGroup} This physics group.
     */
    spawnMultiple (numOfAsteroids, radii, keepoutZones = []) {
        for (let i = 0; i < numOfAsteroids; ++i) {
            // Generate random position
            do {
                var positionX = generateRandomInteger(0, this.scene.physics.world.bounds.width, false);
                var positionY = generateRandomInteger(0, this.scene.physics.world.bounds.height, false);
            }
            while (keepoutZones.some(function (zone) { 
                return zone.contains(positionX, positionY); 
            }));
            let level = generateRandomInteger(Asteroid.MIN_LEVEL, Asteroid.MAX_LEVEL, false);
            // Create a new keepout zone for the newly created asteroid
            keepoutZones.push(new KeepoutZone(positionX, positionY, radii[level-1]));
            this.spawn(positionX, positionY, level);
        }
        return this;
    }

    /**
     * Destroy an Asteroid member object of this group.
     *
     * In addition to destroying the specified asteroid, this method also
     * replaces the latter with two new members. Their velocities are 
     * calculated randomly. However, the new members separate from one another
     * by going in opposite directions.
     *
     * @public
     * @override
     * @method AsteroidsGroup#destroyMember
     * @since 0.1.0
     *
     * @param {Asteroid} memberObject - The member asteroid which is to be removed from this group.
     */
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

    /**
     * AsteroidsGroup's behavioural code that is executed on each game loop iteration.
     *
     * Each associated asteroid's update() method is executed sequencially.
     *
     * @public
     * @override
     * @method AsteroidsGroup#update
     * @since 0.1.0
     */
    update () {
        for (let asteroid of this.memberObjects.entries) {
            asteroid.update();
        }
    }

}

export default AsteroidsGroup;

