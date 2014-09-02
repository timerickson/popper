var Dot = require('./dot');
var util = require('./util');

var Slot = function (groups, c, r) {
    this.popper = null;

    this.sprite = groups.slots.create(0, 0, 'square');
    this.sprite.anchor.setTo(-0.03, -0.03);
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;

    if (r < 10) {
        this.dot = new Dot(groups, c, r);
        this.dot.sprite.bringToTop();
    }

    var pos = util.getPosition(r, c);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
};
Slot.load = function (game) {
    game.load.image('square', 'square.png');
};

module.exports = Slot;