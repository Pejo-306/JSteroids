import 'phaser';

import PhysicsGroup from './PhysicsGroup.js';
import Projectile from '../objects/Projectile.js';

class ProjectilesGroup extends PhysicsGroup {

    constructor (game) {
        super(game);

        this.group = this.scene.physics.add.group({
            allowGravity: false
        });
    }

    static preload (scene) {
        Projectile.preload(scene);
    }

    spawn (x, y, rotationAngle) {
        let projectile = new Projectile(this.game, this);

        projectile.spawn(x, y, rotationAngle);
        this.addMember(projectile);
    }

    update () {
        for (let projectile of this.memberObjects.entries) {
            projectile.update();
        }
    }

}

export default ProjectilesGroup;

