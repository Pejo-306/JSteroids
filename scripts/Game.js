/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import Boot from './scenes/Boot.js';
import Main from './scenes/Main.js';

/**
 * @classdesc
 * Extended class of Phaser's game class.
 *
 * The intent of this subclass is to add some additional helper methods,
 * related to the game instance and scene management. Otherwise, this
 * class implements the same interface as 'Phaser.Game'.
 *
 * @class Game
 * @extends Phaser.Game
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
class Game extends Phaser.Game {

    /**
     * Construct Phaser game instance.
     *
     * References to all existing game scenes are added in the current game
     * instance. Afterwards, the game begins at the 'Boot' scene.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {object} config - Configuration options for Phaser game instance.
     */
    constructor (config) {
        super(config);
        
        this.currentSceneName = null;
        this.postSetupScene = 'Main';

        this.scene.add('Boot', Boot, false);
        this.scene.add('Main', Main, false);
        this.switchScene('Boot');
    }

    /**
     * Switch from current scene to another game scene.
     *
     * The game instance contains a reference to the current scene's name
     * which is set automatically by this method. Afterwards, the selected
     * scene is started.
     *
     * @public
     * @method Game#switchScene
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {string} name - Reference to scene.
     */
    switchScene (name) {
        this.currentSceneName = name;
        this.scene.start(name);
    }

    /**
     * Get reference to current scene.
     *
     * @public
     * @method Game#currentScene
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @return {Phaser.Scene} The currently loaded scene.
     */
    get currentScene () {
        return this.scene.keys[this.currentSceneName];
    }

}

export default Game;

