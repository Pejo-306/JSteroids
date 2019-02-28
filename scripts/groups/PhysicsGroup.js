import 'phaser';

class PhysicsGroup {

    constructor (game) {
        if (new.target === PhysicsGroup) {
            throw new TypeError("Cannot construct object of abstract type 'PhysicsGroup'");
        }

        this.game = game;
        this.spriteGroup = null;
        this.gameObjects = new Set();
    }

    static preload (scene) {
        throw new Error(`${this.name}: must implement abstract static method preload()`);
    }

    spawn (x, y) {
        throw new Error(`${this.name}: must implement abstract method spawn()`);
    }

    update () {
        throw new Error(`${this.constructor.name}: must implement abstract method update()`);
    }

    get group () {
        return this.spriteGroup;
    }

    set group (spriteGroup) {
        this.spriteGroup = spriteGroup;
    }

    get scene () {
        return this.game.currentScene;
    }
}

export default PhysicsGroup;

