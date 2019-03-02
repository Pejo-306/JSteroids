import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
import ProjectilesGroup from '../groups/ProjectilesGroup.js';
import Player from '../objects/Player.js';

import KeepoutZone from '../helper/KeepoutZone.js';

class Main extends Phaser.Scene {

    static get KEEPOUT_ZONE_RADIUS () { return 128; }

    static get PLAYER_LIVES () { return 3; }

    static get PLAYER_RESPAWN_DELAY () { return 2000; }

    /**
     * Construct the main Phaser scene which contains the gameplay.
     */
    constructor () {
        super();

        this.gameObjects = {};
        this.playerLives = this.constructor.PLAYER_LIVES;
        this.controls = {};
    }

    /**
     * Preload all required game assets.
     */
    preload () {
        AsteroidsGroup.preload(this);
        ProjectilesGroup.preload(this);
        Player.preload(this);
    }
    
    create () {
        let asteroidsGroup = this.gameObjects['asteroids-group'] = new AsteroidsGroup(this.game);
        let projectilesGroup = this.gameObjects['projectiles-group'] = new ProjectilesGroup(this.game);
        let player = this.gameObjects['player'] = new Player(this.game, projectilesGroup);
        let playerSpawnX = this.physics.world.bounds.centerX;
        let playerSpawnY = this.physics.world.bounds.centerY;
        
        this.spawnPlayer(playerSpawnX, playerSpawnY);
        this.spawnAsteroids(5);
        this.addPlayerAsteroidsOverlap();
        this.events.on('spawnPlayer', this.spawnPlayer, this);
        this.initializeControls();
    }

    update () {
        for (let objectName in this.gameObjects) {
            this.gameObjects[objectName].update();
        }
    }

    killPlayer () {
        if (this.playerLives > 0) {
            let playerSpawnX = this.physics.world.bounds.centerX;
            let playerSpawnY = this.physics.world.bounds.centerY;

            this.playerLives--;
            console.log(`Remaining player lives: ${this.playerLives}`);
            setTimeout(function (scene) {
                scene.events.emit('spawnPlayer', playerSpawnX, playerSpawnY);
            }, this.constructor.PLAYER_RESPAWN_DELAY, this);
        } else {
            console.log("GAME OVER");
        }
    }

    initializeControls () {
        this.controls.cursors = this.input.keyboard.createCursorKeys();
        this.controls.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    spawnPlayer (spawnX, spawnY) {
        this.gameObjects['player'].spawn(spawnX, spawnY);
        this.addPlayerAsteroidsOverlap();
    }

    spawnAsteroids (numOfAsteroids) {
        let playerKeepoutZone = new KeepoutZone(
            this.gameObjects['player'].sprite.body.center.x,
            this.gameObjects['player'].sprite.body.center.y,
            this.constructor.KEEPOUT_ZONE_RADIUS
        );
        let keepoutZoneRadii = [
            this.constructor.KEEPOUT_ZONE_RADIUS,
            this.constructor.KEEPOUT_ZONE_RADIUS / 2,
            this.constructor.KEEPOUT_ZONE_RADIUS / 4,
        ];

        this.gameObjects['asteroids-group'].spawnMultiple(
            numOfAsteroids, 
            keepoutZoneRadii,
            [playerKeepoutZone]
        );
    }

    addPlayerAsteroidsOverlap () {
        let player = this.gameObjects['player'];
        let asteroidsGroup = this.gameObjects['asteroids-group'];

        this.physics.add.overlap(player.sprite, asteroidsGroup.group, player.collideWithAsteroid, null, player);
    }

}

export default Main;

