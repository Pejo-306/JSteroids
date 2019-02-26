import 'phaser';

class Boot extends Phaser.Scene {

    create () {
        this.game.switchScene(this.game.postSetupScene);
    }

}

export default Boot;

