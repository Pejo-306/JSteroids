/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
import ProjectilesGroup from '../groups/ProjectilesGroup.js';
import ExplosionsGroup from '../groups/ExplosionsGroup.js';
import Player from '../objects/Player.js';

import KeepoutZone from '../helper/KeepoutZone.js';

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
        let projectilesGroup = this.gameObjects['projectiles-group'] = new ProjectilesGroup(this.game);
        let explosionsGroup = this.gameObjects['explosions-group'] = new ExplosionsGroup(this.game);
        let player = this.gameObjects['player'] = new Player(this.game, projectilesGroup);
        let playerSpawnX = this.physics.world.bounds.centerX;
        let playerSpawnY = this.physics.world.bounds.centerY;
        
        this.spawnPlayer(playerSpawnX, playerSpawnY, false);
        this.spawnAsteroids(5);
        this.addPlayerAsteroidsOverlap();
        this.physics.add.collider(
            projectilesGroup.group, 
            asteroidsGroup.group,
            this.destroyAsteroid,
            null,
            this
        );
        this.events.on('spawnPlayer', this.spawnPlayer, this);
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
                callback: function () {
                    this.events.emit('spawnPlayer', playerSpawnX, playerSpawnY);
                },
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
    destroyAsteroid (projectileSprite, asteroidSprite) {
        let projectile = this.gameObjects['projectiles-group'].memberObjects
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
     * @private
     * @method Main#spawnPlayer
     * @since v1.0.0-alpha
     *
     * @param {number} x - X coordinates of player spawn point.
     * @param {number} y - Y coordinates of player spawn point.
     * @param {boolean} invincibility - Give the player temporary invincibility.
     */
    spawnPlayer (x, y, invincibility = true) {
        this.gameObjects['player'].spawn(x, y, invincibility);
        this.addPlayerAsteroidsOverlap();
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
        // Create keepout zone around player's game object
        let playerKeepoutZone = new KeepoutZone(
            this.gameObjects['player'].sprite.body.center.x,
            this.gameObjects['player'].sprite.body.center.y,
            this.constructor.KEEPOUT_ZONE_RADIUS
        );
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
     * Add physics overlap between the player's sprite and all asteroids' sprites.
     *
     * @private
     * @method Main#addPlayerAsteroidsOverlap
     * @since v1.0.0-alpha
     */
    addPlayerAsteroidsOverlap () {
        let player = this.gameObjects['player'];
        let asteroidsGroup = this.gameObjects['asteroids-group'];

        this.physics.add.overlap(player.sprite, asteroidsGroup.group, player.collideWithAsteroid, null, player);
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

