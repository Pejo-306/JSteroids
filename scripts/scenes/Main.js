import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
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
    }

    /**
     * Preload all required game assets.
     */
    preload () {
        Player.preload(this);
        AsteroidsGroup.preload(this);
    }
    
    create () {
        let player = this.gameObjects['player'] = new Player(this.game);
        let asteroidsGroup = this.gameObjects['asteroids-group'] = new AsteroidsGroup(this.game);
        let playerSpawnX = this.physics.world.bounds.centerX;
        let playerSpawnY = this.physics.world.bounds.centerY;
        
        this.spawnPlayer(playerSpawnX, playerSpawnY);
        this.spawnAsteroids(5);
        this.addPlayerAsteroidsOverlap();
        this.events.on('spawnPlayer', this.spawnPlayer, this);
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

    spawnPlayer (spawnX, spawnY) {
        this.gameObjects['player'].spawn(spawnX, spawnY);
        this.addPlayerAsteroidsOverlap();
    }

    spawnAsteroids (numOfAsteroids) {
        let playerKeepoutZone = new KeepoutZone(
            this.gameObjects['player'].sprite.body.center.x,
            this.gameObjects['player'].sprite.body.center.y,
            this.constructor.KEEPOUT_ZONE_RADIUS
        )

        this.gameObjects['asteroids-group'].spawnMultiple(
            numOfAsteroids, 
            [this.constructor.KEEPOUT_ZONE_RADIUS],
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

