import 'phaser';

class GameObject {

    constructor (game) {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct object of abstract type 'GameObject'");
        }

        this.game = game;
    }

    static preload (scene) {

    }

    update () {

    }

}

export default GameObject;

