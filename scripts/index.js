/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

import Game from './Game.js';

/**
 * Configuration options for Phaser Game object.
 *
 * Refer to Phaser's documentation for more details.
 *
 * @var {object} config
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

/**
 * Phaser Game instance.
 *
 * @global
 * @var {Game} game
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
export var game = new Game(config);

