import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
import Player from '../objects/Player.js';

import KeepoutZone from '../helper/KeepoutZone.js';

class Main extends Phaser.Scene {

    static get KEEPOUT_ZONE_RADIUS () { return 128; }

    /**
     * Construct the main Phaser scene which contains the gameplay.
     */
    constructor () {
        super();

        this.gameObjects = {};
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
        
        player.spawn(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY);
        this.spawnAsteroids(5);
    }

    update () {
        for (let objectName in this.gameObjects) {
            this.gameObjects[objectName].update();
        }
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

}

export default Main;

