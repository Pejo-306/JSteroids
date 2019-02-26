import 'phaser';

import Boot from './scenes/Boot.js';
import Main from './scenes/Main.js';

class Game extends Phaser.Game {

    constructor (config) {
        super(config);
        
        this.currentSceneName = null;
        this.postSetupScene = 'Main';

        this.scene.add('Boot', Boot, false);
        this.scene.add('Main', Main, false);
        this.switchScene('Boot');
    }

    switchScene (name) {
        this.currentSceneName = name;
        this.scene.start(name);
    }

    get currentScene () {
        return this.scene.keys[this.currentSceneName];
    }

}

export default Game;

