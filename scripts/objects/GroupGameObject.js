import 'phaser';

import GameObject from './GameObject.js';

class GroupGameObject extends GameObject {

    constructor (game, physicsGroup) {
        if (new.target === GroupGameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GroupGameObject'");
        }

        super(game);

        this.physicsGroup = physicsGroup;
    }

    get group () {
        return this.physicsGroup.group;
    }

}

export default GroupGameObject;

