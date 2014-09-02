var util = require('./util');

var Dot = function (groups, c, r) {
    this.sprite = groups.dots.create(0, 0, 'dot');
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.anchor.setTo(-1.1, -1.3);
    this.sprite.visible = false;

    var pos = util.getPosition(r, c);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;

    this.visible = function (vis) {
        this.sprite.visible = vis;
    };
};
Dot.load = function (game) {
    game.load.image('dot', 'dot.png');
};

module.exports = Dot;