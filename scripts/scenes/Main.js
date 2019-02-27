import 'phaser';

import Player from '../objects/Player.js';

class Main extends Phaser.Scene {

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
    }
    
    create () {
        let player = this.gameObjects['player'] = new Player(this.game);
        
        player.spawn(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY);
    }

    update () {
        for (var objectName in this.gameObjects) {
            this.gameObjects[objectName].update();
        }
    }

}

export default Main;

