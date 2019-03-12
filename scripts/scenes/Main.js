/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
import ProjectilesGroup from '../groups/ProjectilesGroup.js';
import ExplosionsGroup from '../groups/ExplosionsGroup.js';
import SaucersGroup from '../groups/SaucersGroup.js';
import Player from '../objects/Player.js';
import Saucer from '../objects/Saucer.js';

import KeepoutZone from '../helper/KeepoutZone.js';
import { generateRandomInteger, choose } from '../helper/random.js';

/**
 * @classdesc
 * Main scene of the game.
 *
 * This scene contains the game's gameplay. Asteroids are spawned in waves
 * in random locations apart from each other. The wave's asteroid count is
 * ever increasing. The scene never stops spawning asteroid waves.
 * The player has control over his/her game object - a spaceship which may
 * shoot projectiles. The player may destroy asteroids by shooting at them
 * with their projectiles.
 * Saucers are the player's enemies. They appear randomly every so often,
 * travelling in a random direction and continuosly spinning. Furthermore,
 * saucers periodically shoot projectiles in their forwards direction.
 *
 * @class Main
 * @extends Phaser.Scene
 * @since v1.0.0-alpha
 */
class Main extends Phaser.Scene {

    /**
     * Keepout zone radius.
     *
     * @public
     * @static
     * @readonly
     * @method Main.KEEPOUT_ZONE_RADIUS
     * @since v1.0.0-alpha
     *
     * @return {number} Radius of base keepout zones.
     */
    static get KEEPOUT_ZONE_RADIUS () { return 128; }

    /**
     * Starting player lives.
     *
     * @public
     * @static
     * @readonly
     * @method Main.PLAYER_LIVES
     * @since v1.0.0-alpha
     *
     * @return {number} Amount of player's lives.
     */
    static get PLAYER_LIVES () { return 3; }

    /**
     * Time to pass before player respawn.
     *
     * @public
     * @static
     * @readonly
     * @method Main.PLAYER_RESPAWN_DELAY
     * @since v1.0.0-alpha
     *
     * @return {number} Delay before player respawn.
     */
    static get PLAYER_RESPAWN_DELAY () { return 2000; }

    /**
     * Time to pass before respawning asteroids.
     *
     * @public
     * @static
     * @readonly
     * @method Main.PLAYER_RESPAWN_DELAY
     * @since v1.0.0-alpha
     *
     * @return {number} Delay before asteroid wave spawn.
     */
    static get ASTEROID_SPAWN_DELAY () { return 1500; } // in ms

    /**
     * Interval of time within which there is a guaranteed saucer spawn.
     *
     * @public
     * @static
     * @readonly
     * @method Main.SAUCER_SPAWN_INTERVAL
     * @since v1.0.0-alpha2
     * 
     * @return {number} Saucer spawning period.
     */
    static get SAUCER_SPAWN_INTERVAL () { return 2000; }

    /**
     * Construct main game scene.
     *
     * @constructor
     * @since v1.0.0-alpha
     */
    constructor () {
        super();

        this.gameObjects = {};
        this.playerLives = this.constructor.PLAYER_LIVES;
        this.controls = {};
        this.spawnedAsteroids = 0;
    }

    /**
     * Preload resources required by main game scene.
     *
     * @public
     * @override
     * @method Main#preload
     * @since v1.0.0-alpha
     */
    preload () {
        AsteroidsGroup.preload(this);
        ProjectilesGroup.preload(this);
        ExplosionsGroup.preload(this);
        SaucersGroup.preload(this);
        Player.preload(this);
    }
    
    /**
     * Initialize and spawn all game objects/groups. Setup this game scene.
     *
     * All utilized game objects and physics groups are initialized and
     * stored in a dictionary. It gives access to all game objects in any
     * part of the project which has a reference to this scene.
     *
     * Afterwards, game objects are spawned in the game world. Behaviour
     * between game objects/groups are described via physics colliders and 
     * overlaps.
     *
     * Some other setup is also performed here (such as initializing 
     * control objects).
     *
     * @public
     * @override
     * @method Main#create
     * @since v1.0.0-alpha
     */
    create () {
        let asteroidsGroup = this.gameObjects['asteroids-group'] = new AsteroidsGroup(this.game);
        let explosionsGroup = this.gameObjects['explosions-group'] = new ExplosionsGroup(this.game);
        let saucersProjectilesGroup = this.gameObjects['saucers-projectiles-group'] = new ProjectilesGroup(this.game, 'saucer-projectile');
        let saucersGroup = this.gameObjects['saucers-group'] = new SaucersGroup(this.game, saucersProjectilesGroup);
        let playerProjectilesGroup = this.gameObjects['player-projectiles-group'] = new ProjectilesGroup(this.game, 'player-projectile');
        let player = this.gameObjects['player'] = new Player(this.game, playerProjectilesGroup);
        let playerSpawnX = this.physics.world.bounds.centerX;
        let playerSpawnY = this.physics.world.bounds.centerY;
        
        this.spawnPlayer(playerSpawnX, playerSpawnY, false);
        this.spawnAsteroids(5);

        // Collision between the player's projectiles and asteroids
        this.physics.add.collider(
            playerProjectilesGroup.group, 
            asteroidsGroup.group,
            function (projectileSprite, asteroidSprite) { 
                this.destroyAsteroid(
                    projectileSprite, 
                    asteroidSprite, 
                    'player-projectiles-group'
                );
            },
            null,
            this
        );
        // Collision between the player's projectiles and saucers
        this.physics.add.collider(
            playerProjectilesGroup.group, 
            saucersGroup.group,
            function (projectileSprite, saucerSprite) { 
                this.destroySaucer(
                    projectileSprite, 
                    saucerSprite, 
                    'player-projectiles-group'
                );
            },
            null,
            this
        );
        // Collision between saucers' projectiles and asteroids
        this.physics.add.collider(
            saucersProjectilesGroup.group,
            asteroidsGroup.group,
            function (projectileSprite, asteroidSprite) { 
                this.destroyAsteroid(
                    projectileSprite, 
                    asteroidSprite, 
                    'saucers-projectiles-group'
                );
            },
            null,
            this
        );
        this.physics.add.collider(asteroidsGroup.group, saucersGroup.group, null, null, this);
        this.startSpawningSaucers();
        this.initializeControls();
    }

    /**
     * Execute behavioural code in each game loop.
     *
     * Each game object/group's 'update()' methods are called sequentially.
     *
     * @public
     * @override
     * @method Main#update
     * @since v1.0.0-alpha
     */
    update () {
        for (let objectName in this.gameObjects) {
            this.gameObjects[objectName].update();
        }
    }

    /**
     * Kill the player.
     *
     * If the player has any remaining lives, the latter are decremented and
     * the player is respawned after a delay. Otherwise, the game ends.
     *
     * @private
     * @method Main#killPlayer
     * @since v1.0.0-alpha
     */
    killPlayer () {
        if (this.playerLives > 0) {
            let playerSpawnX = this.physics.world.bounds.centerX;
            let playerSpawnY = this.physics.world.bounds.centerY;

            this.playerLives--;
            console.log(`Remaining player lives: ${this.playerLives}`);
            // Respawn player after delay
            this.time.addEvent({
                delay: this.constructor.PLAYER_RESPAWN_DELAY,
                callback: this.spawnPlayer,
                args: [playerSpawnX, playerSpawnY],
                callbackScope: this
            });
        } else {
            console.log("GAME OVER");
        }
    }

    /**
     * Handle a collision between a player projectile and an asteroid.
     *
     * Both the player's projectile and the asteroid are destroyed. An
     * explosion VFX is displayed afterwards.
     *
     * If the whole asteroids wave has been destroyed, a new one is spawned.
     * The newer wave comes with more asteroids than the previous one.
     *
     * @private
     * @callback Main~destroyAsteroid
     * @method Main#destroyAsteroid
     * @since v1.0.0-alpha
     *
     * @param {Phaser.GameObjects.Sprite} projectileSprite - The projectile's colliding sprite.
     * @param {Phaser.GameObjects.Sprite} asteroidSprite - The asteroid's colliding sprite.
     */
    destroyAsteroid (projectileSprite, asteroidSprite, projectilesGroupName) {
        let projectile = this.gameObjects[projectilesGroupName].memberObjects
            .get('sprite', projectileSprite);
        let asteroid = this.gameObjects['asteroids-group'].memberObjects
            .get('sprite', asteroidSprite);

        this.gameObjects['explosions-group'].spawnExplosionBetweenObjects(projectile, asteroid);
        projectile.destroy();
        asteroid.destroy();

        // Spawn a new asteroids wave
        if (this.gameObjects['asteroids-group'].memberObjects.size == 0) {
            this.spawnAsteroids(this.spawnedAsteroids * this.difficultyMultiplier);
        }
    }

    destroySaucer (projectileSprite, saucerSprite, projectilesGroupName) {
        let projectile = this.gameObjects[projectilesGroupName].memberObjects
            .get('sprite', projectileSprite);
        let saucer = this.gameObjects['saucers-group'].memberObjects
            .get('sprite', saucerSprite);

        this.gameObjects['explosions-group'].spawnExplosionBetweenObjects(projectile, saucer);
        projectile.destroy();
        saucer.destroy();
    }

    /**
     * Initialize Phaser input related objects.
     *
     * @private
     * @method Main#initializeControls
     * @since v1.0.0-alpha
     */
    initializeControls () {
        this.controls.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * Spawn player object's sprite in the game world.
     *
     * This method also configures all interactions with other game objects. 
     * In any case, the player is destroyed when colliding with them.
     *
     * @private
     * @method Main#spawnPlayer
     * @since v1.0.0-alpha
     *
     * @param {number} x - X coordinates of player spawn point.
     * @param {number} y - Y coordinates of player spawn point.
     * @param {boolean} invincibility - Give the player temporary invincibility.
     */
    spawnPlayer (x, y, invincibility = true) {
        let player = this.gameObjects['player'];
        let asteroidsGroup = this.gameObjects['asteroids-group'];
        let saucersGroup = this.gameObjects['saucers-group'];
        let saucersProjectilesGroup = this.gameObjects['saucers-projectiles-group'];

        player.spawn(x, y, invincibility);
        // Collision with asteroids
        // Result: both the player and the colliding asteroid are destroyed 
        this.physics.add.overlap(
            player.sprite, 
            asteroidsGroup.group, 
            function (playerSprite, asteroidSprite) {
                player.collideWithSprite(asteroidSprite, this.gameObjects['asteroids-group']);
            }, 
            null, 
            this
        );
        // Collision with saucers 
        // Result: both the player and the colliding saucer are destroyed 
        this.physics.add.overlap(
            player.sprite, 
            saucersGroup.group, 
            function (playerSprite, saucerSprite) {
                player.collideWithSprite(saucerSprite, this.gameObjects['saucers-group']);
            }, 
            null, 
            this
        );
        // Collision with saucers' projectiles
        // Result: the player is killed
        this.physics.add.overlap(
            player.sprite, 
            saucersProjectilesGroup.group, 
            function (playerSprite, saucerProjectileSprite) {
                player.collideWithSprite(saucerProjectileSprite, this.gameObjects['saucers-projectiles-group']);
            }, 
            null, 
            this
        );
    }

    /**
     * Spawn a wave of asteroids in the game world.
     *
     * Spawned asteroids do not overlap with each other, as well as with the
     * player game object. This functionality is implemented via keepout zones.
     * The higher the asteroid level, the smaller the latter is and therefore
     * a smaller keepout zone is created around it.
     *
     * All asteroids are spawned in a wave that is delayed by some delay.
     * 
     * @private
     * @method Main#spawnAsteroids
     * @since v1.0.0-alpha
     *
     * @param {number} numOfAsteroids - Number of asteroids to spawn.
     */
    spawnAsteroids (numOfAsteroids) {
        let player = this.gameObjects['player'];

        if (!player.dead) {
            var playerX = player.sprite.body.center.x;
            var playerY = player.sprite.body.center.y;
        } else { // player sprite has been destroyed
            // Default player's spawn point to the world's center
            var playerX = this.physics.world.bounds.centerX;
            var playerY = this.physics.world.bounds.centerY;
        }
        // Create keepout zone around player's game object
        let playerKeepoutZone = new KeepoutZone(playerX, playerY, this.constructor.KEEPOUT_ZONE_RADIUS);
        // Radii for various levels of asteroids
        let keepoutZoneRadii = [
            this.constructor.KEEPOUT_ZONE_RADIUS,
            this.constructor.KEEPOUT_ZONE_RADIUS / 2,
            this.constructor.KEEPOUT_ZONE_RADIUS / 4,
        ];
        let asteroidsGroup = this.gameObjects['asteroids-group'];

        this.spawnedAsteroids = numOfAsteroids;
        // Spawn asteroid wave after a delay
        this.time.addEvent({
            delay: this.constructor.ASTEROID_SPAWN_DELAY,
            callback: asteroidsGroup.spawnMultiple,
            args: [numOfAsteroids, keepoutZoneRadii, [playerKeepoutZone]],
            callbackScope: asteroidsGroup
        });
    }

    /**
     * Periodically spawn saucers.
     *
     * It is guaranteed that a new flying saucer will be spawned sometime 
     * within the interval of <SAUCER_SPAWN_INTERVAL>. This process repeats
     * endlessly every after <SAUCER_SPAWN_INTERVAL> time.
     *
     * @private
     * @callback Main~startSpawningSaucers
     * @method Main#startSpawningSaucers
     * @since v1.0.0-alpha2
     */
    startSpawningSaucers () {
        // Spawn a saucer sometime in the interval [0, SAUCER_SPAWN_INTERVAL]
        this.time.addEvent({
            delay: generateRandomInteger(0, this.constructor.SAUCER_SPAWN_INTERVAL, false),
            callback: this.spawnSaucer,
            callbackScope: this
        });
        // Repeat the spawning process after SAUCER_SPAWN_INTERVAL 
        this.time.addEvent({
            delay: this.constructor.SAUCER_SPAWN_INTERVAL,
            callback: this.startSpawningSaucers,
            callbackScope: this
        });
    }

    /**
     * Spawn a flying saucer in the game world.
     *
     * The saucer itself is spawned outside the world's bounds. Futhermore,
     * its level is randomly determined.
     *
     * @private
     * @callback Main~spawnSaucer
     * @method Main#spawnSaucer
     * @since v1.0.0-alpha2
     */
    spawnSaucer () {
        // Randomly choose new saucer's level
        let level = generateRandomInteger(Saucer.MIN_LEVEL, Saucer.MAX_LEVEL, false);
        // Determine spawning location, which is outside 
        // but nonetheless close to the world's border
        let horizontalOffset = generateRandomInteger(20, 50, false);
        let horizontalSide = choose([0, this.physics.world.bounds.width]);
        let spawnX = horizontalSide + horizontalOffset;
        spawnX = horizontalSide == 0 ? -spawnX : spawnX;
        let verticalOffset = generateRandomInteger(20, 50, false);
        let verticalSide = choose([0, this.physics.world.bounds.height]);
        let spawnY = verticalSide + verticalOffset;
        spawnY = verticalSide == 0 ? -spawnY : spawnY;

        this.gameObjects['saucers-group'].spawn(spawnX, spawnY, level);
    }

    /**
     * Get difficutly multiplier.
     *
     * @private
     * @method Main#difficultyMultiplier
     * @since v1.0.0-alpha
     *
     * @return {number} Difficulty multiplier.
     */
    get difficultyMultiplier () {
        return 1.5;
    }

}

export default Main;

