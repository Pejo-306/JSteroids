import 'phaser';

import PhysicsGroup from './PhysicsGroup.js';
import Saucer from '../objects/Saucer.js';

class SaucersGroup extends PhysicsGroup {

    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.group({
            allowGravity: false,
            bounceX: 1,
            bounceY: 1
        });
    }

    static preload (scene) {
        Saucer.preload(scene);
    }

    spawn (x, y, level) {
        let saucer = new Saucer(this.game, this, level);

        saucer.spawn(x, y);
        this.addMember(saucer);
        return this;
    }
}

export default SaucersGroup;

