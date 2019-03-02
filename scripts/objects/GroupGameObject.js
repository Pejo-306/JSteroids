import 'phaser';

import GameObject from './GameObject.js';

class GroupGameObject extends GameObject {

    constructor (game, group) {
        if (new.target === GroupGameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GroupGameObject'");
        }

        super(game);

        this.group = group;
    }

}

export default GroupGameObject;

