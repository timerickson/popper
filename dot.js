var util = require('./util');

function Dot(groups, c, r) {
    this.sprite = groups.dots.create(0, 0, 'dot');
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.anchor.setTo(-1.1, -1.3);
    this.sprite.visible = false;

    var pos = util.getPosition(r, c);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
}
Dot.load = function (game) {
    game.load.image('dot', 'dot.png');
};

Dot.prototype.visible = function (vis) {
    this.sprite.visible = vis;
};

module.exports = Dot;