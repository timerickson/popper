var config = require('./config');
var addPos = require('./addPos');
var util = require('./util');

function Popper (game, groups, c, r, color) {
    if (color === undefined) {
        color = util.getRandomColor();
    }
    this.color = color;

    if (c === undefined) {
        c = 0;
    }
    if (r === undefined) {
        r = 10;
    }

    this.sprite = groups.poppers.create(0, 0, 'poppers', this.color);
    this.sprite.anchor.setTo(-0.15, -0.15);
    this.sprite.scale.x = 0.4;
    this.sprite.scale.y = 0.4;

    this.pos = addPos(game);
    this.pos({ row: r, col: c});
    this.pop = function () {
        this.sprite.visible = false;
        groups.poppers.remove(this.sprite);
    };
}
Popper.load = function (game) {
    game.load.spritesheet('poppers', 'poppers.png', config.PopperFrameWidth, config.PopperFrameHeight);
};

module.exports = Popper;