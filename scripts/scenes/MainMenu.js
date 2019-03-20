/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import AsteroidsGroup from '../groups/AsteroidsGroup.js';
import MenuTextButton from '../ui/MenuTextButton.js';

/**
 * @classdesc
 * Main menu of the game. Title screen.
 * 
 * This scene welcomes the player whenever they lauch the game. It is kept
 * minimalistic, containing only the title, some descriptive text and a
 * single button to launch the game itself. This way, the title screen of
 * JSteroids pays homage to the original opening scene of the classical
 * Asteroids game.
 *
 * @class MainMenu
 * @extends Phaser.Scene
 * @since v1.0.0
 * @version v1.0.0
 */
class MainMenu extends Phaser.Scene {

    /**
     * Title text size.
     *
     * @public
     * @static
     * @readonly
     * @method MainMenu.TITLE_SIZE
     * @since v1.0.0
     * @version v1.0.0
     *
     * @return {number} Title's bitmap text size.
     */
    static get TITLE_SIZE () { return 144; }

    /**
     * Copyright text size.
     *
     * @public
     * @static
     * @readonly
     * @method MainMenu.COPYRIGHT_TEXT_SIZE
     * @since v1.0.0
     * @version v1.0.0
     *
     * @return {number} Size of copyright's bitmap text.
     */
    static get COPYRIGHT_TEXT_SIZE () { return 24; }

    /**
     * Version text size.
     *
     * @public
     * @static
     * @readonly
     * @method MainMenu.VERSION_TEXT_SIZE
     * @since v1.0.0
     * @version v1.0.0
     *
     * @return {number} Size of version's bitmap text.
     */
    static get VERSION_TEXT_SIZE () { return 20; }

    /**
     * Size of buttons' bitmap text.
     *
     * @public
     * @static
     * @readonly
     * @method MainMenu.BUTTON_SIZE
     * @since v1.0.0
     * @version v1.0.0
     *
     * @return {number} Size of bitmap text.
     */
    static get BUTTON_SIZE () { return 48; }

    /**
     * Initialize main menu scene.
     *
     * @public
     * @override
     * @method MainMenu#init
     * @since v1.0.0
     * @version v1.0.0
     *
     * @param {object} data - Parameters passed from previous scene.
     */
    init (data) {
        this.gameObjects = {};
        this.uiObjects = {};
    }

    /**
     * Preload resources required by the main menu.
     *
     * @public
     * @override
     * @method MainMenu#preload
     * @since v1.0.0
     * @version v1.0.0
     */
    preload () {
        AsteroidsGroup.preload(this);
    }

    /**
     * Setup this menu's UI elements.
     *
     * Furthermore, a couple of asteroids are spawned to roam freely on the
     * title screen.
     *
     * @public
     * @override
     * @method MainMenu#create
     * @since v1.0.0
     * @version v1.0.0
     */
    create () {
        let asteroidsGroup = this.gameObjects['asteroids-group'] = new AsteroidsGroup(this.game);

        this.spawnAsteroids(25);
        this.setupUI();
    }

    /**
     * Execute behavioural code in each game loop.
     *
     * Each game object/group's 'update()' methods are called sequentially.
     *
     * @public
     * @override
     * @method MainMenu#update
     * @since v1.0.0
     * @version v1.0.0
     */
    update () {
        for (let objectName in this.gameObjects) {
            this.gameObjects[objectName].update();
        }
    }

    /**
     * Spawn a wave of asteroids in the game world.
     *
     * Spawned asteroids do not overlap with each other. This functionality 
     * is implemented via keepout zones. The higher the asteroid level, 
     * the smaller the latter is and therefore a smaller keepout zone is 
     * created around it.
     *
     * All asteroids are spawned in a wave that is delayed by some delay.
     * 
     * @private
     * @method MainMenu#spawnAsteroids
     * @since v1.0.0
     * @version v1.0.0
     *
     * @param {number} numOfAsteroids - Number of asteroids to spawn.
     */
    spawnAsteroids (numOfAsteroids) {
        // Radii for various levels of asteroids
        let keepoutZoneRadii = [
            this.constructor.KEEPOUT_ZONE_RADIUS,
            this.constructor.KEEPOUT_ZONE_RADIUS / 2,
            this.constructor.KEEPOUT_ZONE_RADIUS / 4,
        ];
        let asteroidsGroup = this.gameObjects['asteroids-group'];

        this.spawnedAsteroids = numOfAsteroids;
        // Spawn a wave of asteroids
        asteroidsGroup.spawnMultiple(numOfAsteroids, keepoutZoneRadii, []);
    }

    /**
     * Setup main menu's UI elements.
     *
     * The menu itself consists of the game's title, as well as some descriptive
     * texts. Their is also one button which starts the game.
     *
     * @private
     * @method MainMenu#setupUI
     * @since v1.0.0
     * @version v1.0.0
     */
    setupUI () {
        let asteroidsTitle = this.uiObjects['asteroids-title'] = this.add.bitmapText(
            this.physics.world.bounds.centerX, 
            this.physics.world.bounds.centerY - this.physics.world.bounds.height / 4,
            'hyperspace-bold',
            'JSTEROIDS',
            this.constructor.TITLE_SIZE, 0
        );
        let copyrightText = this.uiObjects['copyright-text'] = this.add.bitmapText(
            this.physics.world.bounds.centerX, 
            this.physics.world.bounds.height - this.physics.world.bounds.height / 16,
            'hyperspace',
            '2019 Petar Nikolov',
            this.constructor.COPYRIGHT_TEXT_SIZE, 0
        );
        let versionText = this.uiObjects['version-text'] = this.add.bitmapText(
            this.physics.world.bounds.width - this.physics.world.bounds.width / 16, 
            this.physics.world.bounds.height - this.physics.world.bounds.height / 16,
            'hyperspace-bold',
            'v1.0.0',
            this.constructor.VERSION_TEXT_SIZE, 0
        );
        let startGameButton = this.uiObjects['start-game-button'] = new MenuTextButton(
            this, 
            this.physics.world.bounds.centerX, 
            this.physics.world.bounds.centerY + this.physics.world.bounds.height / 8,
            'hyperspace',
            'START GAME',
            this.constructor.BUTTON_SIZE, 0,
            () => { this.game.switchScene('Main'); }
        );

        // Center all bitmap texts
        asteroidsTitle.setOrigin(0.5, 0.5);
        copyrightText.setOrigin(0.5, 0.5);
        versionText.setOrigin(0.5, 0.5);
        startGameButton.setOrigin(0.5, 0.5);
    }

}

export default MainMenu;

