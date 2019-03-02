import 'phaser';

import GroupGameObject from './GroupGameObject.js';

class Projectile extends GroupGameObject {

    static get LIFESPAN () { return 2000; }  // in ms

    static get MAX_VELOCITY () { return 500; }

    static get WRAP_PADDING () { return 32; }
    
    constructor (game, physicsGroup) {
        super(game, physicsGroup);
    }

    static preload (scene) {
        scene.load.image('projectile', 'assets/sprites/projectile.png');
    }

    spawn (x, y, rotationAngle) {
        this.sprite = this.group.create(x, y, 'projectile');
        this.sprite.angle = rotationAngle;
        return this;
    }

    update () {
        this.scene.physics.velocityFromRotation(
            this.sprite.rotation,
            this.constructor.MAX_VELOCITY,
            this.sprite.body.velocity
        );
        this.scene.physics.world.wrap(this.sprite, this.constructor.WRAP_PADDING);
        this.scene.time.addEvent({
            delay: this.constructor.LIFESPAN,
            callback: this.destroy,
            callbackScope: this
        });
    }

    destroy () {
        this.group.remove(this.sprite, true, true);
        this.physicsGroup.destroyMember(this);
    }

}

export default Projectile;

