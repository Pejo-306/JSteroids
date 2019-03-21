/**
 * @author       Petar Nikolov <penikolov23@gmail.com>
 * @copyright    2019 Petar Nikolov
 * @license      {@link https://github.com/Pejo-306/JSteroids/blob/master/LICENSE|MIT License}
 */

import 'phaser';

/**
 * @classdesc
 * Keepout zone - prevents objects from interacting with this zone.
 *
 * The zone itself is a circle with a specified radius, spawned in the game
 * world at the given coordinates. The idea behind these zones is to prevent
 * other game objects from interacting with parts of the game world. How this
 * is implemented is beyond the scope of the presented class - the latter may
 * only check whether an object is inside it.
 *
 * @class KeepoutZone
 * @since v1.0.0-alpha
 * @version v1.0.0-alpha
 */
class KeepoutZone {
    
    /**
     * Consturct keepout zone.
     *
     * @constructor
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {number} x - X coordinates of zone origin.
     * @param {number} y - Y coordinates of zone origin.
     * @param {number} radius - Radius of zone's circle.
     */
    constructor (x, y, radius) {
        this.circle = new Phaser.Geom.Circle(x, y, radius);
    }

    /**
     * Check whether a point is inside this keepout zone.
     *
     * @public
     * @method KeepoutZone#contains
     * @since v1.0.0-alpha
     * @version v1.0.0-alpha
     *
     * @param {number} x - X coordinates of checked point.
     * @param {number} y - Y coordinates of checked point.
     *
     * @return {boolean} Is point within the zone's bounds.
     */
    contains (x, y) {
        return this.circle.contains(x, y);
    }

}

export default KeepoutZone;

