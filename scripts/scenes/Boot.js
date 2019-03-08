/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

/**
 * @classdesc
 * Boot up the game.
 *
 * As of now, this scene does nothing.
 *
 * @class Boot
 * @extends Phaser.Scene
 * @since 0.1.0
 */
class Boot extends Phaser.Scene {

    /**
     * Setup the game instance for play.
     *
     * As of now, this method does nothing. It switches to the post setup
     * scene immediately.
     *
     * @public
     * @override
     * @method Boot#create
     * @since 0.1.0
     */
    create () {
        this.game.switchScene(this.game.postSetupScene);
    }

}

export default Boot;

