import 'phaser';

class KeepoutZone {
    
    constructor (x, y, radius) {
        this.circle = new Phaser.Geom.Circle(x, y, radius);
    }

    contains (x, y) {
        return this.circle.contains(x, y);
    }

}

export default KeepoutZone;

